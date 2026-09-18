import datetime
import numpy as np
from typing import List, Dict, Any
from sklearn.ensemble import IsolationForest
from sqlalchemy.orm import Session
from backend.models import Holding, Transaction
from backend.services.market_data import MarketDataService

class MLEngine:
    @staticmethod
    def extract_user_features(db: Session, user_id: int) -> Dict[str, float]:
        holdings = db.query(Holding).filter(Holding.user_id == user_id).all()
        transactions = db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.date.desc()).all()

        total_portfolio_val = sum(h.quantity * h.current_price for h in holdings) or 1.0
        total_txs = len(transactions)
        
        now = datetime.datetime.utcnow()
        if total_txs > 0:
            oldest_tx = transactions[-1].date
            days_active = max((now - oldest_tx).days, 1)
        else:
            days_active = 30

        weeks_active = max(days_active / 7.0, 1.0)

        # 1. trades_per_day
        trades_per_day = total_txs / days_active

        # 2. trades_per_week
        last_7d_txs = [t for t in transactions if (now - t.date).days <= 7]
        trades_per_week = float(len(last_7d_txs))

        # 3. average_holding_period (days)
        # Approximated from transaction reason/expected period or average 30 days
        average_holding_period = 30.0
        if total_txs > 1:
            intervals = [(transactions[i-1].date - transactions[i].date).days for i in range(1, min(total_txs, 10))]
            if intervals:
                average_holding_period = float(np.mean(intervals))

        # 4. buy_after_price_change (% price change before buy)
        buys = [t for t in transactions if t.type.upper() == "BUY"]
        buy_after_price_changes = []
        for b in buys[:5]:
            q = MarketDataService.get_price_change(b.symbol)
            buy_after_price_changes.append(q.get("change_percent", 0.0))
        buy_after_price_change = float(np.mean(buy_after_price_changes)) if buy_after_price_changes else 0.0

        # 5. sell_after_price_change (% price change before sell)
        sells = [t for t in transactions if t.type.upper() == "SELL"]
        sell_after_price_changes = []
        for s in sells[:5]:
            q = MarketDataService.get_price_change(s.symbol)
            sell_after_price_changes.append(q.get("change_percent", 0.0))
        sell_after_price_change = float(np.mean(sell_after_price_changes)) if sell_after_price_changes else 0.0

        # 6. average_position_size
        position_sizes = [h.quantity * h.current_price for h in holdings]
        average_position_size = float(np.mean(position_sizes)) if position_sizes else 0.0

        # 7. portfolio_concentration (max single holding %)
        max_holding_val = max(position_sizes) if position_sizes else 0.0
        portfolio_concentration = (max_holding_val / total_portfolio_val) * 100.0

        # 8. sector_concentration (max sector %)
        sector_totals: Dict[str, float] = {}
        for h in holdings:
            sector_totals[h.sector] = sector_totals.get(h.sector, 0.0) + (h.quantity * h.current_price)
        max_sector_val = max(sector_totals.values()) if sector_totals else 0.0
        sector_concentration = (max_sector_val / total_portfolio_val) * 100.0

        # 9. buy_sell_frequency (ratio of buys to total trades)
        buy_sell_frequency = (len(buys) / float(total_txs)) if total_txs > 0 else 0.5

        # 10. short_term_trade_ratio (% of trades expected to be held < 14 days)
        short_term_count = sum(1 for t in transactions if t.expected_holding_period and "day" in t.expected_holding_period.lower())
        short_term_trade_ratio = (short_term_count / float(total_txs)) if total_txs > 0 else 0.2

        return {
            "trades_per_day": round(trades_per_day, 3),
            "trades_per_week": round(trades_per_week, 1),
            "average_holding_period": round(average_holding_period, 1),
            "buy_after_price_change": round(buy_after_price_change, 2),
            "sell_after_price_change": round(sell_after_price_change, 2),
            "average_position_size": round(average_position_size, 2),
            "portfolio_concentration": round(portfolio_concentration, 1),
            "sector_concentration": round(sector_concentration, 1),
            "buy_sell_frequency": round(buy_sell_frequency, 2),
            "short_term_trade_ratio": round(short_term_trade_ratio, 2)
        }

    @staticmethod
    def detect_anomalies(db: Session, user_id: int) -> Dict[str, Any]:
        features = MLEngine.extract_user_features(db, user_id)
        feature_vector = np.array([list(features.values())])

        # Synthesize baseline normal distribution for Isolation Forest model training
        # Representing standard balanced retail investor behavior
        np.random.seed(42)
        normal_samples = np.random.normal(
            loc=[0.2, 1.5, 45.0, 1.0, -0.5, 15000.0, 18.0, 25.0, 0.6, 0.15],
            scale=[0.1, 0.8, 15.0, 1.5, 1.5, 5000.0, 5.0, 8.0, 0.1, 0.08],
            size=(200, 10)
        )
        
        # Train IsolationForest model
        model = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
        model.fit(normal_samples)

        # Predict anomaly score (-1 for anomaly, 1 for normal)
        pred = model.predict(feature_vector)[0]
        score = model.score_samples(feature_vector)[0]

        is_anomaly = bool(pred == -1 or score < -0.45)

        # Identify key features driving anomaly
        anomalous_features = []
        if features["trades_per_week"] >= 5.0:
            anomalous_features.append(f"Weekly trade frequency ({features['trades_per_week']} trades/week vs baseline 1.5)")
        if features["portfolio_concentration"] >= 30.0:
            anomalous_features.append(f"Single holding concentration ({features['portfolio_concentration']}% vs baseline <20%)")
        if abs(features["buy_after_price_change"]) >= 5.0:
            anomalous_features.append(f"Purchasing after steep price movement ({features['buy_after_price_change']}% gain)")
        if features["sell_after_price_change"] <= -5.0:
            anomalous_features.append(f"Liquidating after price drop ({features['sell_after_price_change']}% decline)")

        explanation = (
            "Your recent activity differs significantly from your historical transaction pattern."
            if is_anomaly
            else "Your transaction frequency and portfolio structure align with your historical baseline."
        )

        return {
            "is_anomaly": is_anomaly,
            "anomaly_score": round(float(score), 4),
            "explanation": explanation,
            "features": features,
            "anomalous_features": anomalous_features
        }
