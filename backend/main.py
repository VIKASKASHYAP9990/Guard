import datetime
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.database import engine, Base, get_db
from backend.models import User, Holding, Transaction, Alert, BehaviorAnalysis, JournalEntry, PlannerData
from backend import schemas
from backend.services.market_data import MarketDataService
from backend.services.news_service import NewsService
from backend.engine.rule_engine import RuleEngine
from backend.engine.ml_engine import MLEngine
from backend.services.ai_service import AIService
from backend.seed import seed_demo_data

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="InvestGuard API",
    description="Behavioral Investment-Analysis Platform API for Hefty Hacks 2026",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_current_user(db: Session = Depends(get_db)) -> User:
    user = db.query(User).first()
    if not user:
        user = seed_demo_data(db)
    return user

@app.on_event("startup")
def startup_event():
    db = next(get_db())
    if not db.query(User).first():
        seed_demo_data(db)

@app.get("/")
def read_root():
    return {
        "app": "InvestGuard Behavioral Analysis Platform API",
        "status": "online",
        "hackathon": "Hefty Hacks 2026 Finance × Trading Track",
        "docs": "/docs"
    }

# 1. PORTFOLIO ENDPOINTS
@app.get("/api/portfolio")
def get_portfolio_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    holdings = db.query(Holding).filter(Holding.user_id == current_user.id).all()
    
    total_value = 0.0
    total_cost = 0.0
    
    holdings_data = []
    sector_exposure: Dict[str, float] = {}

    for h in holdings:
        val = h.quantity * h.current_price
        cost = h.quantity * h.average_buy_price
        total_value += val
        total_cost += cost
        sector_exposure[h.sector] = sector_exposure.get(h.sector, 0.0) + val

    total_gain_loss = total_value - total_cost
    total_gain_loss_pct = (total_gain_loss / total_cost * 100.0) if total_cost > 0 else 0.0

    # Calculate holding metrics
    for h in holdings:
        val = h.quantity * h.current_price
        gl = val - (h.quantity * h.average_buy_price)
        gl_pct = (gl / (h.quantity * h.average_buy_price) * 100.0) if h.average_buy_price > 0 else 0.0
        pct = (val / total_value * 100.0) if total_value > 0 else 0.0
        
        holdings_data.append({
            "id": h.id,
            "symbol": h.symbol,
            "company": h.company,
            "quantity": h.quantity,
            "average_buy_price": h.average_buy_price,
            "current_price": h.current_price,
            "current_value": round(val, 2),
            "gain_loss": round(gl, 2),
            "gain_loss_percent": round(gl_pct, 2),
            "portfolio_percent": round(pct, 2),
            "sector": h.sector
        })

    alerts_count = db.query(Alert).filter(Alert.user_id == current_user.id, Alert.status == "Unread").count()
    tx_count = db.query(Transaction).filter(Transaction.user_id == current_user.id).count()

    # Calculate Sector Exposure percentages
    sector_breakdown = [
        {
            "sector": sec,
            "value": round(val, 2),
            "percentage": round((val / total_value * 100.0), 2) if total_value > 0 else 0.0
        }
        for sec, val in sector_exposure.items()
    ]

    return {
        "portfolio_value": round(total_value, 2),
        "todays_change": round(total_value * 0.0102, 2),  # ~+1.02% daily change
        "todays_change_percent": 1.02,
        "total_gain_loss": round(total_gain_loss, 2),
        "total_gain_loss_percent": round(total_gain_loss_pct, 2),
        "holdings_count": len(holdings),
        "alerts_count": alerts_count,
        "transactions_count": tx_count,
        "holdings": holdings_data,
        "sector_breakdown": sector_breakdown
    }

# 2. HOLDINGS ENDPOINTS
@app.get("/api/holdings", response_model=List[schemas.HoldingResponse])
def get_holdings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    holdings = db.query(Holding).filter(Holding.user_id == current_user.id).all()
    total_value = sum(h.quantity * h.current_price for h in holdings) or 1.0

    result = []
    for h in holdings:
        val = h.quantity * h.current_price
        gl = val - (h.quantity * h.average_buy_price)
        gl_pct = (gl / (h.quantity * h.average_buy_price) * 100.0) if h.average_buy_price > 0 else 0.0
        pct = (val / total_value * 100.0)

        result.append(schemas.HoldingResponse(
            id=h.id,
            user_id=h.user_id,
            symbol=h.symbol,
            company=h.company,
            quantity=h.quantity,
            average_buy_price=h.average_buy_price,
            current_price=h.current_price,
            current_value=round(val, 2),
            gain_loss=round(gl, 2),
            gain_loss_percent=round(gl_pct, 2),
            portfolio_percent=round(pct, 2),
            sector=h.sector
        ))
    return result

# 3. TRANSACTIONS ENDPOINTS
@app.get("/api/transactions", response_model=List[schemas.TransactionResponse])
def get_transactions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    txs = db.query(Transaction).filter(Transaction.user_id == current_user.id).order_by(Transaction.date.desc()).all()
    result = []
    for t in txs:
        result.append(schemas.TransactionResponse(
            id=t.id,
            user_id=t.user_id,
            symbol=t.symbol,
            company=t.company,
            type=t.type,
            quantity=t.quantity,
            price=t.price,
            date=t.date,
            reason=t.reason,
            expected_holding_period=t.expected_holding_period,
            total_amount=round(t.quantity * t.price, 2)
        ))
    return result

@app.post("/api/transactions", response_model=schemas.TransactionResponse)
def add_transaction(tx_in: schemas.TransactionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tx_date = tx_in.date or datetime.datetime.utcnow()
    
    # Create transaction
    tx = Transaction(
        user_id=current_user.id,
        symbol=tx_in.symbol.upper(),
        company=tx_in.company,
        type=tx_in.type.upper(),
        quantity=tx_in.quantity,
        price=tx_in.price,
        date=tx_date,
        reason=tx_in.reason,
        expected_holding_period=tx_in.expected_holding_period
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)

    # Automatically recalculate holding
    holding = db.query(Holding).filter(Holding.user_id == current_user.id, Holding.symbol == tx.symbol).first()
    if tx.type.upper() == "BUY":
        if holding:
            new_qty = holding.quantity + tx.quantity
            new_avg = ((holding.quantity * holding.average_buy_price) + (tx.quantity * tx.price)) / new_qty
            holding.quantity = new_qty
            holding.average_buy_price = new_avg
            holding.current_price = tx.price
        else:
            quote = MarketDataService.get_full_quote(tx.symbol)
            holding = Holding(
                user_id=current_user.id,
                symbol=tx.symbol,
                company=tx.company,
                quantity=tx.quantity,
                average_buy_price=tx.price,
                current_price=tx.price,
                sector=quote.get("sector", "General")
            )
            db.add(holding)
    elif tx.type.upper() == "SELL":
        if holding:
            if tx.quantity >= holding.quantity:
                db.delete(holding)
            else:
                holding.quantity -= tx.quantity
    db.commit()

    # Automatically trigger Behavioral Analysis Pipeline after adding transaction!
    RuleEngine.analyze_user_behavior(db, current_user.id)

    return schemas.TransactionResponse(
        id=tx.id,
        user_id=tx.user_id,
        symbol=tx.symbol,
        company=tx.company,
        type=tx.type,
        quantity=tx.quantity,
        price=tx.price,
        date=tx.date,
        reason=tx.reason,
        expected_holding_period=tx.expected_holding_period,
        total_amount=round(tx.quantity * tx.price, 2)
    )

@app.delete("/api/transactions/{id}")
def delete_transaction(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tx = db.query(Transaction).filter(Transaction.id == id, Transaction.user_id == current_user.id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(tx)
    db.commit()
    return {"message": "Transaction deleted", "id": id}

# 4. BEHAVIOR ANALYSIS & ALERTS ENDPOINTS
@app.get("/api/behavior-analysis")
def get_behavior_analysis(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ml_result = MLEngine.detect_anomalies(db, current_user.id)
    rule_result = RuleEngine.analyze_user_behavior(db, current_user.id)
    
    # Behavioral Risk Matrix scores
    scores = {
        "FOMO-like Buying": "Moderate",
        "Panic Selling": "Low",
        "Overtrading": "High",
        "Concentration": "High" if any(a["pattern_type"] == "Concentration" for a in rule_result["alerts"]) else "Moderate",
        "Loss Aversion": "Moderate",
        "Market Timing": "High"
    }

    return {
        "ml_analysis": ml_result,
        "rule_analysis": rule_result,
        "behavioral_matrix": scores,
        "active_patterns_count": len(rule_result["alerts"])
    }

@app.post("/api/behavior-analysis/run")
def run_behavior_analysis(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rule_res = RuleEngine.analyze_user_behavior(db, current_user.id)
    ml_res = MLEngine.detect_anomalies(db, current_user.id)

    # Persist detected alerts to database
    created_alerts = []
    for alert_data in rule_res["alerts"]:
        # Avoid duplicate unread alerts for same pattern
        existing = db.query(Alert).filter(
            Alert.user_id == current_user.id,
            Alert.pattern_type == alert_data["pattern_type"],
            Alert.status == "Unread"
        ).first()

        if not existing:
            # Generate AI explanation
            ai_exp = AIService.generate_explanation(
                pattern_type=alert_data["pattern_type"],
                evidence=alert_data["evidence"],
                ml_result=ml_res
            )

            alert_obj = Alert(
                user_id=current_user.id,
                pattern_type=alert_data["pattern_type"],
                title=alert_data["title"],
                description=ai_exp["explanation"],
                evidence=alert_data["evidence"],
                reflection_question=ai_exp["reflection_question"],
                severity=alert_data["severity"],
                status="Unread",
                created_at=datetime.datetime.utcnow()
            )
            db.add(alert_obj)
            created_alerts.append(alert_obj)

    db.commit()

    return {
        "status": "success",
        "alerts_generated": len(created_alerts),
        "ml_anomaly_detected": ml_res["is_anomaly"],
        "anomaly_score": ml_res["anomaly_score"],
        "explanation": ml_res["explanation"]
    }

@app.get("/api/alerts", response_model=List[schemas.AlertResponse])
def get_alerts(status_filter: Optional[str] = Query(None), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Alert).filter(Alert.user_id == current_user.id)
    if status_filter:
        query = query.filter(Alert.status == status_filter)
    alerts = query.order_by(Alert.created_at.desc()).all()
    return alerts

@app.patch("/api/alerts/{id}", response_model=schemas.AlertResponse)
def update_alert(id: int, alert_in: schemas.AlertUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    alert = db.query(Alert).filter(Alert.id == id, Alert.user_id == current_user.id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = alert_in.status
    db.commit()
    db.refresh(alert)
    return alert

# 5. INVESTMENT JOURNAL ENDPOINTS
@app.get("/api/journal", response_model=List[schemas.JournalResponse])
def get_journal(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entries = db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id).order_by(JournalEntry.created_at.desc()).all()
    return entries

@app.post("/api/journal", response_model=schemas.JournalResponse)
def create_journal(entry_in: schemas.JournalCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry = JournalEntry(
        user_id=current_user.id,
        symbol=entry_in.symbol.upper(),
        thesis=entry_in.thesis,
        holding_period=entry_in.holding_period,
        reconsider_condition=entry_in.reconsider_condition,
        reflection=entry_in.reflection,
        created_at=datetime.datetime.utcnow()
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

# 6. INVESTMENT PLANNER ENDPOINTS
@app.get("/api/planner", response_model=schemas.PlannerResponse)
def get_planner(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    planner = db.query(PlannerData).filter(PlannerData.user_id == current_user.id).order_by(PlannerData.created_at.desc()).first()
    if not planner:
        planner = PlannerData(
            user_id=current_user.id,
            monthly_income=120000.0,
            monthly_expenses=70000.0,
            existing_savings=300000.0,
            desired_contribution=20000.0,
            horizon_years=5
        )
        db.add(planner)
        db.commit()
        db.refresh(planner)

    available = planner.monthly_income - planner.monthly_expenses
    
    return schemas.PlannerResponse(
        id=planner.id,
        user_id=planner.user_id,
        monthly_income=planner.monthly_income,
        monthly_expenses=planner.monthly_expenses,
        existing_savings=planner.existing_savings,
        desired_contribution=planner.desired_contribution,
        horizon_years=planner.horizon_years,
        available_monthly=available,
        total_1yr=planner.desired_contribution * 12,
        total_3yr=planner.desired_contribution * 36,
        total_5yr=planner.desired_contribution * 60,
        created_at=planner.created_at
    )

@app.post("/api/planner", response_model=schemas.PlannerResponse)
def save_planner(planner_in: schemas.PlannerCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    planner = PlannerData(
        user_id=current_user.id,
        monthly_income=planner_in.monthly_income,
        monthly_expenses=planner_in.monthly_expenses,
        existing_savings=planner_in.existing_savings,
        desired_contribution=planner_in.desired_contribution,
        horizon_years=planner_in.horizon_years,
        created_at=datetime.datetime.utcnow()
    )
    db.add(planner)
    db.commit()
    db.refresh(planner)

    available = planner.monthly_income - planner.monthly_expenses
    return schemas.PlannerResponse(
        id=planner.id,
        user_id=planner.user_id,
        monthly_income=planner.monthly_income,
        monthly_expenses=planner.monthly_expenses,
        existing_savings=planner.existing_savings,
        desired_contribution=planner.desired_contribution,
        horizon_years=planner.horizon_years,
        available_monthly=available,
        total_1yr=planner.desired_contribution * 12,
        total_3yr=planner.desired_contribution * 36,
        total_5yr=planner.desired_contribution * 60,
        created_at=planner.created_at
    )

# 7. MARKET DATA & NEWS ENDPOINTS
@app.get("/api/market/{symbol}")
def get_market_symbol(symbol: str):
    return MarketDataService.get_full_quote(symbol)

@app.get("/api/news/{symbol}")
def get_news_symbol(symbol: str):
    return NewsService.get_company_news(symbol)

# 8. AI EXPLAIN ENDPOINT
@app.post("/api/ai/explain", response_model=schemas.AIExplainResponse)
def ai_explain(req: schemas.AIExplainRequest):
    result = AIService.generate_explanation(
        pattern_type=req.pattern_type,
        evidence=req.evidence
    )
    return schemas.AIExplainResponse(
        explanation=result["explanation"],
        reflection_question=result["reflection_question"]
    )

# 9. DEMO RESET ENDPOINT
@app.post("/api/demo/reset")
def reset_demo(db: Session = Depends(get_db)):
    user = seed_demo_data(db)
    return {"message": "Demo data reset successfully", "user_id": user.id}

# 10. FRONTEND SPA STATIC MOUNTING & FALLBACK
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

