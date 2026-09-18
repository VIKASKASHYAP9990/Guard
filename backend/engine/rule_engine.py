import datetime
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from backend.models import Holding, Transaction, JournalEntry, Alert, BehaviorAnalysis
from backend.services.market_data import MarketDataService

class RuleEngine:
    @staticmethod
    def analyze_user_behavior(db: Session, user_id: int) -> Dict[str, Any]:
        holdings = db.query(Holding).filter(Holding.user_id == user_id).all()
        transactions = db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.date.desc()).all()
        journal_entries = db.query(JournalEntry).filter(JournalEntry.user_id == user_id).all()

        detected_alerts = []
        behavior_summary = []

        total_portfolio_val = sum(h.quantity * h.current_price for h in holdings)

        # 1. CONCENTRATION DETECTOR
        if total_portfolio_val > 0:
            for h in holdings:
                val = h.quantity * h.current_price
                pct = (val / total_portfolio_val) * 100.0
                if pct >= 30.0:
                    severity = "High" if pct >= 45.0 else "Moderate"
                    alert_dict = {
                        "pattern_type": "Concentration",
                        "title": "Concentration Alert",
                        "description": f"Excessive capital allocation in a single position ({h.symbol}).",
                        "evidence": f"{pct:.1f}% of your portfolio is currently allocated to one holding ({h.symbol}).",
                        "reflection_question": "Does this allocation match your intended portfolio strategy?",
                        "severity": severity
                    }
                    detected_alerts.append(alert_dict)

        # 2. OVERTRADING DETECTOR
        now = datetime.datetime.utcnow()
        last_7_days = now - datetime.timedelta(days=7)
        recent_txs = [t for t in transactions if t.date >= last_7_days]
        tx_count_7d = len(recent_txs)
        
        # Historical baseline: total txs / weeks active
        total_txs = len(transactions)
        if total_txs > 0:
            oldest_tx = transactions[-1].date
            days_active = max((now - oldest_tx).days, 7)
            avg_weekly_tx = max((total_txs / (days_active / 7.0)), 1.0)
        else:
            avg_weekly_tx = 2.0

        if tx_count_7d >= 5 and tx_count_7d >= (avg_weekly_tx * 2.0):
            severity = "High" if tx_count_7d >= 8 else "Moderate"
            alert_dict = {
                "pattern_type": "Overtrading",
                "title": "Potential Overtrading Pattern",
                "description": "Unusually high transaction frequency compared to historical baseline.",
                "evidence": f"You made {tx_count_7d} transactions during the last 7 days compared with your recent average of {avg_weekly_tx:.1f} trades/week.",
                "reflection_question": "Was each transaction part of a predefined strategy?",
                "severity": severity
            }
            detected_alerts.append(alert_dict)

        # 3. FOMO-LIKE BUYING DETECTOR
        buy_txs = [t for t in recent_txs if t.type.upper() == "BUY"]
        for t in buy_txs:
            quote = MarketDataService.get_full_quote(t.symbol)
            price_change_pct = quote.get("change_percent", 0.0)
            if price_change_pct >= 5.0:
                alert_dict = {
                    "pattern_type": "FOMO-like Buying",
                    "title": "Possible FOMO-like Buying Pattern",
                    "description": f"Purchase of {t.symbol} executed following a rapid price gain.",
                    "evidence": f"The purchase of {t.symbol} occurred shortly after a significant price increase of +{price_change_pct:.1f}%.",
                    "reflection_question": "Was this purchase part of your original investment strategy?",
                    "severity": "Moderate" if price_change_pct < 10.0 else "High"
                }
                detected_alerts.append(alert_dict)
                break  # limit 1 FOMO alert per analysis run

        # 4. PANIC-SELLING PATTERN DETECTOR
        sell_txs = [t for t in recent_txs if t.type.upper() == "SELL"]
        for t in sell_txs:
            quote = MarketDataService.get_full_quote(t.symbol)
            price_change_pct = quote.get("change_percent", 0.0)
            if price_change_pct <= -5.0:
                alert_dict = {
                    "pattern_type": "Panic Selling",
                    "title": "Possible Short-Term Reaction Pattern",
                    "description": f"Sale of {t.symbol} executed following a market decline.",
                    "evidence": f"The position in {t.symbol} was sold shortly after a significant decline of {price_change_pct:.1f}%.",
                    "reflection_question": "Did the underlying reason for owning the investment change?",
                    "severity": "Moderate" if price_change_pct > -10.0 else "High"
                }
                detected_alerts.append(alert_dict)
                break

        # 5. LOSS-AVERSION PATTERN DETECTOR
        for h in holdings:
            gain_pct = ((h.current_price - h.average_buy_price) / h.average_buy_price) * 100.0 if h.average_buy_price > 0 else 0
            if gain_pct <= -10.0:
                # Check if journal entry notes a changed thesis or reconsider condition
                j_entry = next((j for j in journal_entries if j.symbol.upper() == h.symbol.upper()), None)
                reconsider_triggered = bool(j_entry and j_entry.reflection and len(j_entry.reflection) > 5)
                
                alert_dict = {
                    "pattern_type": "Loss Aversion",
                    "title": "Possible Loss-Aversion Pattern",
                    "description": f"Holding deteriorating position in {h.symbol} despite significant drawdown.",
                    "evidence": f"The position in {h.symbol} has declined by {abs(gain_pct):.1f}% while position holding continues.",
                    "reflection_question": "Are you holding because the investment still fits your plan, or because you want to return to your original purchase price?",
                    "severity": "High" if gain_pct <= -20.0 else "Moderate"
                }
                detected_alerts.append(alert_dict)
                break

        # 6. MARKET-TIMING PATTERN DETECTOR
        # Check if user bought & sold the same symbol within 7 days
        symbol_tx_map: Dict[str, List[Transaction]] = {}
        for t in transactions[:15]:
            symbol_tx_map.setdefault(t.symbol, []).append(t)

        for sym, tx_list in symbol_tx_map.items():
            if len(tx_list) >= 2:
                types = set(t.type.upper() for t in tx_list)
                if "BUY" in types and "SELL" in types:
                    alert_dict = {
                        "pattern_type": "Market Timing",
                        "title": "Potential Market-Timing Pattern",
                        "description": f"Repeated short-term entries and exits detected for {sym}.",
                        "evidence": f"Several recent transactions in {sym} occurred within a short timeframe following short-term price movements.",
                        "reflection_question": "Are these trades part of a predefined strategy?",
                        "severity": "Moderate"
                    }
                    detected_alerts.append(alert_dict)
                    break

        return {
            "alerts": detected_alerts,
            "total_portfolio_val": total_portfolio_val,
            "recent_tx_count": tx_count_7d
        }
