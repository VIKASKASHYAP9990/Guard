import datetime
from sqlalchemy.orm import Session
from backend.models import User, Holding, Transaction, Alert, BehaviorAnalysis, JournalEntry, PlannerData

def seed_demo_data(db: Session) -> User:
    # Clear existing demo records
    db.query(Alert).delete()
    db.query(BehaviorAnalysis).delete()
    db.query(JournalEntry).delete()
    db.query(PlannerData).delete()
    db.query(Transaction).delete()
    db.query(Holding).delete()
    db.query(User).delete()
    db.commit()

    # Create Primary User
    user = User(name="InvestGuard Demo", email="demo@investguard.io")
    db.add(user)
    db.commit()
    db.refresh(user)

    now = datetime.datetime.utcnow()

    # 1. Seed Holdings (One high concentration asset: NVDA at ~42% of portfolio)
    holdings = [
        Holding(user_id=user.id, symbol="NVDA", company="NVIDIA Corporation", quantity=400, average_buy_price=98.50, current_price=128.40, sector="Semiconductors"), # Value: ~51,360 (41.2%)
        Holding(user_id=user.id, symbol="AAPL", company="Apple Inc.", quantity=120, average_buy_price=210.00, current_price=224.50, sector="Technology"),           # Value: ~26,940 (21.6%)
        Holding(user_id=user.id, symbol="MSFT", company="Microsoft Corp.", quantity=45, average_buy_price=430.00, current_price=448.20, sector="Technology"),           # Value: ~20,169 (16.2%)
        Holding(user_id=user.id, symbol="AMZN", company="Amazon.com Inc.", quantity=70, average_buy_price=175.00, current_price=186.30, sector="Consumer Discretionary"), # Value: ~13,041 (10.5%)
        Holding(user_id=user.id, symbol="TSLA", company="Tesla, Inc.", quantity=50, average_buy_price=275.00, current_price=248.80, sector="Automotive")              # Value: ~12,440 (10.0%)
    ]
    db.add_all(holdings)
    db.commit()

    # 2. Seed Transactions (Demonstrating Overtrading, FOMO, Panic Selling, Market Timing)
    transactions = [
        # Normal baseline buys (1-2 weeks ago)
        Transaction(user_id=user.id, symbol="AAPL", company="Apple Inc.", type="BUY", quantity=20, price=215.00, date=now - datetime.timedelta(days=25), reason="Long-term accumulation", expected_holding_period="1+ years"),
        Transaction(user_id=user.id, symbol="MSFT", company="Microsoft Corp.", type="BUY", quantity=10, price=435.00, date=now - datetime.timedelta(days=20), reason="Quarterly DCA strategy", expected_holding_period="1+ years"),

        # FOMO Buy (bought NVDA right after +7.3% surge)
        Transaction(user_id=user.id, symbol="NVDA", company="NVIDIA Corporation", type="BUY", quantity=150, price=128.40, date=now - datetime.timedelta(days=2), reason="Rallied 8% today, momentum looks explosive", expected_holding_period="6 months"),

        # Panic Sell (sold TATAMOTORS right after -5.9% drop)
        Transaction(user_id=user.id, symbol="TATAMOTORS", company="Tata Motors Ltd.", type="SELL", quantity=100, price=985.40, date=now - datetime.timedelta(days=1), reason="Stock fell steeply this morning, cutting losses", expected_holding_period="Sold after 3 days"),

        # Overtrading cluster (8 trades in 5 days)
        Transaction(user_id=user.id, symbol="TSLA", company="Tesla, Inc.", type="BUY", quantity=25, price=260.00, date=now - datetime.timedelta(days=6), reason="Short swing setup", expected_holding_period="7 days"),
        Transaction(user_id=user.id, symbol="TSLA", company="Tesla, Inc.", type="SELL", quantity=25, price=248.80, date=now - datetime.timedelta(days=4), reason="Price reversed down", expected_holding_period="3 days"),
        Transaction(user_id=user.id, symbol="AMZN", company="Amazon.com Inc.", type="BUY", quantity=30, price=182.00, date=now - datetime.timedelta(days=4), reason="Market bounce play", expected_holding_period="14 days"),
        Transaction(user_id=user.id, symbol="AMZN", company="Amazon.com Inc.", type="SELL", quantity=15, price=186.30, date=now - datetime.timedelta(days=3), reason="Quick gain lock", expected_holding_period="1 day"),
        Transaction(user_id=user.id, symbol="GOOGL", company="Alphabet Inc.", type="BUY", quantity=40, price=176.50, date=now - datetime.timedelta(days=3), reason="Earnings preview trade", expected_holding_period="30 days"),
        Transaction(user_id=user.id, symbol="GOOGL", company="Alphabet Inc.", type="SELL", quantity=40, price=178.90, date=now - datetime.timedelta(days=2), reason="Exited early before news", expected_holding_period="1 day"),
        Transaction(user_id=user.id, symbol="AAPL", company="Apple Inc.", type="BUY", quantity=15, price=224.50, date=now - datetime.timedelta(days=1), reason="Felt like adding more size", expected_holding_period="Unknown"),
    ]
    db.add_all(transactions)
    db.commit()

    # 3. Seed Behavioral Alerts
    alerts = [
        Alert(
            user_id=user.id,
            pattern_type="Concentration",
            title="Concentration Alert",
            description="High allocation concentration in NVDA.",
            evidence="41.2% of your portfolio is currently allocated to NVDA (NVIDIA Corporation).",
            reflection_question="Does this single-holding allocation match your intended portfolio strategy?",
            severity="High",
            status="Unread",
            created_at=now - datetime.timedelta(hours=5)
        ),
        Alert(
            user_id=user.id,
            pattern_type="Overtrading",
            title="Potential Overtrading Pattern",
            description="Unusually high trading frequency detected over the past 7 days.",
            evidence="You made 8 transactions during the last 5 days compared with your recent average of 1.8 trades/week.",
            reflection_question="Was each transaction part of a predefined strategy?",
            severity="High",
            status="Unread",
            created_at=now - datetime.timedelta(hours=3)
        ),
        Alert(
            user_id=user.id,
            pattern_type="FOMO-like Buying",
            title="Possible FOMO-like Buying Pattern",
            description="Purchase executed immediately following a steep single-day price gain.",
            evidence="The purchase of NVDA occurred shortly after a significant single-day price increase of +7.3%.",
            reflection_question="Was this purchase part of your original investment strategy?",
            severity="Moderate",
            status="Unread",
            created_at=now - datetime.timedelta(hours=1)
        )
    ]
    db.add_all(alerts)
    db.commit()

    # 4. Seed Journal Entries (Thesis vs Action comparison)
    journals = [
        JournalEntry(
            user_id=user.id,
            symbol="TATAMOTORS",
            thesis="Long-term fundamental thesis based on EV production expansion and commercial vehicle demand.",
            holding_period="2-3 Years",
            reconsider_condition="Reconsider if quarterly EV gross margins drop below 12% for 2 consecutive quarters.",
            reflection="Sold entire position after 3 days following a 5.9% morning price pullback. Original thesis was untouched.",
            created_at=now - datetime.timedelta(days=1)
        ),
        JournalEntry(
            user_id=user.id,
            symbol="NVDA",
            thesis="AI accelerator hardware dominance and software moat.",
            holding_period="1+ Years",
            reconsider_condition="Reconsider if hyperscaler capex budgets shrink by >20%.",
            reflection="Added position aggressively after stock broke out to new highs.",
            created_at=now - datetime.timedelta(days=2)
        )
    ]
    db.add_all(journals)
    db.commit()

    # 5. Seed Planner Data
    planner = PlannerData(
        user_id=user.id,
        monthly_income=125000.0,
        monthly_expenses=75000.0,
        existing_savings=350000.0,
        desired_contribution=25000.0,
        horizon_years=5,
        created_at=now
    )
    db.add(planner)
    db.commit()

    return user
