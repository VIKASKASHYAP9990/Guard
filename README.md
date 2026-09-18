# 🛡️ InvestGuard
### *AI/ML-Powered Behavioral Investment Analysis Platform*

> **"Understand your investment behavior before it becomes a habit."**

[![Hackathon](https://img.shields.io/badge/Hackathon-Hefty_Hacks_2026-7C3AED?style=for-the-badge)](https://heftyhacks.dev)
[![Track](https://img.shields.io/badge/Track-Finance_%C3%97_Trading-059669?style=for-the-badge)](https://heftyhacks.dev)
[![Python](https://img.shields.io/badge/Backend-FastAPI_%7C_Python_3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://fastapi.tiangolo.com)
[![ML](https://img.shields.io/badge/ML-Isolation_Forest-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![Frontend](https://img.shields.io/badge/Frontend-React_%7C_TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)

---

## 📌 Overview

**InvestGuard** is a behavioral investment-analysis platform that helps retail investors identify potentially risky patterns in their investment activity.

It analyzes portfolio allocations, transaction history, and market price movements, then generates **explainable behavioral alerts** — powered by a deterministic Rule Engine, a **scikit-learn Isolation Forest ML model**, and an **AI Explanation Layer**.

> 🛡️ **Core Principle**: InvestGuard does NOT provide buy/sell recommendations. It is a non-advisory educational behavioral mirror.

---

## 🎯 Detected Behavioral Antipatterns

| Pattern | Detection Logic |
|---|---|
| **FOMO-like Buying** | Purchase shortly after price surge >5% |
| **Panic Selling** | Sale shortly after price drop >5% |
| **Overtrading** | Trade velocity > 2× historical weekly baseline |
| **Concentration Alert** | Single holding >30% portfolio allocation |
| **Loss Aversion** | Deteriorating position held past thesis reconsider date |
| **Market Timing** | Repeated short-term round-trip trades |

---

## 🏗️ Tech Stack

### Backend
- **FastAPI** (Python 3.11+)
- **SQLAlchemy** with **SQLite** (local) / **PostgreSQL** (production)
- **scikit-learn** — Isolation Forest anomaly detection
- **python-dotenv** — secrets management

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** — utility-first styling
- **Recharts** — portfolio visualizations
- **Lucide React** — icons
- **Vite** — build tooling

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/VIKASKASHYAP9990/InvestGuard.git
cd InvestGuard
```

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Start FastAPI server (includes auto-seeded demo data)
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server (proxies /api to :8000)
npm run dev

# OR build for production (served by FastAPI at http://localhost:8000/)
npm run build
```

### 4. Access Application
| URL | Description |
|---|---|
| `http://localhost:8000/` | **Full application** (after `npm run build`) |
| `http://localhost:3000/` | Frontend dev server |
| `http://localhost:8000/docs` | FastAPI Interactive API Docs (Swagger UI) |

---

## 🔑 Environment Variables

Copy `.env.example` → `.env` and fill in your API keys:

```env
DATABASE_URL=sqlite:///./investguard.db
MARKET_DATA_API_KEY=           # Optional — falls back to realistic mock data
MARKET_DATA_BASE_URL=          # Optional
NEWS_API_KEY=                   # Optional — news section hidden if unavailable
AI_API_KEY=                     # Optional — falls back to template AI explanations
```

> **Demo Mode works with zero API keys configured.**

---

## 🎭 Demo Mode

InvestGuard auto-seeds a comprehensive demo dataset on first startup, demonstrating:

- ✅ Normal investing behavior (baseline)
- ✅ FOMO-like purchase (NVDA after +7.3% rally)
- ✅ Overtrading cluster (8 trades in 5 days)
- ✅ Concentration alert (NVDA at 41.2% of portfolio)
- ✅ Panic-selling pattern (TATAMOTORS after -5.9%)
- ✅ Market-timing round-trips (GOOGL, TSLA)

**Click "Run Behavioral Analysis"** to trigger the full pipeline:
```
Transactions → Rule Engine → Isolation Forest ML → AI Explanation → Smart Alerts
```

**Click "↻ Reset Demo"** to restore original demo state.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/portfolio` | Portfolio summary, holdings, sector exposure |
| GET | `/api/holdings` | All current holdings with metrics |
| GET | `/api/transactions` | Transaction history |
| POST | `/api/transactions` | Add trade (triggers auto-analysis pipeline) |
| DELETE | `/api/transactions/{id}` | Delete transaction |
| GET | `/api/behavior-analysis` | Current behavioral analysis results |
| POST | `/api/behavior-analysis/run` | Execute full Rule+ML+AI pipeline |
| GET | `/api/alerts` | All behavioral smart alerts |
| PATCH | `/api/alerts/{id}` | Update alert status |
| GET | `/api/journal` | Investment journal entries |
| POST | `/api/journal` | Add journal entry |
| GET | `/api/planner` | Investment planner data |
| POST | `/api/planner` | Save planner configuration |
| GET | `/api/market/{symbol}` | Live market quote (or mock fallback) |
| GET | `/api/news/{symbol}` | Recent company news (or mock fallback) |
| POST | `/api/ai/explain` | AI behavioral explanation |
| POST | `/api/demo/reset` | Reset demo dataset |

---

## 🧠 ML Model — Isolation Forest

The Isolation Forest model is trained on **10 quantitative behavioral features**:

| Feature | Description |
|---|---|
| `trades_per_day` | Average daily trade frequency |
| `trades_per_week` | Current week trade count |
| `average_holding_period` | Average days positions are held |
| `buy_after_price_change` | Avg % price change before buying |
| `sell_after_price_change` | Avg % price change before selling |
| `average_position_size` | Mean position capital size |
| `portfolio_concentration` | Max single holding % |
| `sector_concentration` | Max single sector % |
| `buy_sell_frequency` | Buy-to-total-trade ratio |
| `short_term_trade_ratio` | Fraction of trades held <14 days |

> **Important**: ML output never says "You made a bad investment." It states: *"Your recent activity differs significantly from your historical transaction pattern."*

---

## 🏆 Hackathon Demo Walkthrough

1. Open `http://localhost:8000/` → Landing Page
2. Click **TRY DEMO** → Dashboard loads with pre-populated data
3. Navigate to **Portfolio** → Observe 41.2% NVDA concentration alert
4. Navigate to **Transactions** → View 8 trades in 5 days cluster
5. Click **Run Behavioral Analysis** → Rule Engine + Isolation Forest executes
6. Navigate to **Smart Alerts** → View 3+ generated alerts with evidence
7. Open an alert → Read AI neutral explanation + reflection question
8. Navigate to **Investment Journal** → Compare "Original Thesis vs Actual Action"
9. Navigate to **Investment Planner** → Calculate systematic contribution totals

---

## 📂 Project Structure

```
InvestGuard/
├── backend/
│   ├── main.py              # FastAPI app + REST endpoints
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── database.py          # Database connection (SQLite/PostgreSQL)
│   ├── seed.py              # Demo data seeder
│   ├── engine/
│   │   ├── rule_engine.py   # Deterministic behavioral detection
│   │   └── ml_engine.py     # Isolation Forest anomaly detection
│   └── services/
│       ├── market_data.py   # MarketDataService + mock fallback
│       ├── news_service.py  # NewsService + mock fallback
│       └── ai_service.py    # AI Explanation Layer
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # Main React application
│   │   ├── main.tsx         # React entrypoint
│   │   ├── index.css        # Global CSS + animations
│   │   ├── types/           # TypeScript interfaces
│   │   ├── services/
│   │   │   └── api.ts       # API client + offline fallback
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Toast.tsx
│   │   └── pages/
│   │       ├── LandingPage.tsx
│   │       ├── Dashboard.tsx
│   │       ├── PortfolioPage.tsx
│   │       ├── TransactionsPage.tsx
│   │       ├── BehaviorAnalysisPage.tsx
│   │       ├── AlertsPage.tsx
│   │       ├── JournalPage.tsx
│   │       ├── PlannerPage.tsx
│   │       ├── LearnPage.tsx
│   │       └── DocsPage.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚠️ Disclaimer

InvestGuard is an educational behavioral analysis platform built for hackathon demonstration purposes.

- Does **NOT** provide financial, investment, or trading advice
- Does **NOT** guarantee investment returns
- Does **NOT** diagnose psychological conditions
- Uses language like *"Possible FOMO-like pattern detected"* — never definitive claims

---

*Built for Hefty Hacks 2026 · Finance × Trading Track*
