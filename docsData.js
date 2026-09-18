// Raw Complete Content of README.md and HACKATHON_PROJECT_REPORT.md for InvestGuard Web App

window.INVESTGUARD_DOCS = {
  readme: `# 🛡️ InvestGuard
### *AI/ML-Powered Behavioral Investment Analysis Platform*

> **"Understand your investment behavior before it becomes a habit."**

![Hackathon](https://img.shields.io/badge/Hackathon-Hefty_Hacks_2026-7C3AED?style=for-the-badge&logo=rocket)
![Track](https://img.shields.io/badge/Track-Finance_%C3%97_Trading-059669?style=for-the-badge&logo=chart-line)
![Python](https://img.shields.io/badge/Backend-FastAPI_%7C_Python_3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![ML](https://img.shields.io/badge/ML-Isolation_Forest-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![AI](https://img.shields.io/badge/AI-LLM_Explainability-412991?style=for-the-badge&logo=openai&logoColor=white)
![Frontend](https://img.shields.io/badge/Frontend-React_%7C_TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 📌 1. Project Overview

**InvestGuard** is a next-generation behavioral fintech platform built specifically for individual retail investors. While conventional financial tools concentrate heavily on price movements, market charts, and portfolio valuations, InvestGuard addresses the underlying psychological drivers of investor behavior. 

By continuously analyzing portfolio allocations and historical transaction logs against live market data, InvestGuard detects recurring behavioral antipatterns—such as **FOMO buying**, **panic selling**, **overtrading**, **excessive portfolio concentration**, **loss aversion**, and **market timing**. 

Rather than issuing financial advice or automated buy/sell signals, InvestGuard functions as an **educational behavioral mirror**. It leverages an **Isolation Forest ML model** for numerical anomaly detection and a **Generative LLM Engine** to deliver objective, evidence-based smart alerts with guided reflection prompts.

---

## 🎯 2. Problem Statement

Retail investment participation has surged globally, but individual investors frequently suffer avoidable portfolio degradation due to emotional decision-making. Standard brokerage apps accentuate price fluctuations and short-term trends, aggravating behavioral traps:

- 🚀 **FOMO-Like Buying:** Purchasing stocks rapidly following steep price rallies.
- 📉 **Panic-Selling Patterns:** Liquidating positions during temporary market drops.
- ⚡ **Overtrading:** Excessive transaction frequency driven by noise or market anxiety.
- ⚠️ **Portfolio Concentration:** Over-allocating capital to a single stock (>30-40% of portfolio).
- 🛑 **Loss-Aversion Traps:** Holding onto deteriorating positions long after the thesis has broken down.
- 🔄 **Market Timing:** Attempting short-term entries and exits based on short-term price swings.

### The Missing Gap
Existing fintech software answers: *"What is happening in the market?"*  
**InvestGuard answers:** *"What patterns are forming in my own investment behavior, and why?"*

---

## 💡 3. Solution Architecture & Flow

InvestGuard implements a multi-tier analysis pipeline that converts raw transaction logs and market updates into structured behavioral insights:

\`\`\`
                      ┌──────────────────────┐
                      │   Market Data API    │
                      └──────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   Transaction Logs    │
                     └───────────┬───────────┘
                                 │
                                 ▼
         ┌──────────────────────────────────────────────┐
         │     Hybrid Behavioral Detection Pipeline     │
         │  ┌────────────────────┐ ┌──────────────────┐ │
         │  │ Deterministic Rule │ │ Isolation Forest │ │
         │  │     Engine         │ │  ML Anomalies    │ │
         │  └─────────┬──────────┘ └────────┬─────────┘ │
         └────────────┼─────────────────────┼───────────┘
                      └──────────┬──────────┘
                                 │ (Behavioral Signals)
                                 ▼
                     ┌───────────────────────┐
                     │ LLM Explanation Layer │
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ Evidence-Based Alert  │
                     │  + Reflection Prompt  │
                     └───────────────────────┘
\`\`\`

---

## ✨ 4. Key Features

### 📊 Portfolio Dashboard
- Real-time tracking of portfolio value, daily change, and asset allocation breakdown.
- Visual sector exposure mapping to highlight sector over-concentration risks.
- Integrated feed of recent behavioral alerts and trade execution logs.

### 🧠 Behavioral Pattern Detection (6 Core Antipatterns)
1. **FOMO-Like Buying:** Detects buys executed within hours/days of stock rallies (>5-10% gain).
2. **Panic-Selling:** Flags liquidations occurring immediately after price drops (>5-8% decline).
3. **Overtrading:** Identifies spikes in trade frequency relative to the user's historical baseline.
4. **Concentration Risk:** Automatically alerts when a single holding exceeds configurable portfolio caps (e.g., >30%).
5. **Loss-Aversion:** Monitors declining positions where the original investment thesis is marked invalid.
6. **Market Timing:** Detects short-term round-trip trades executed around volatile price swings.

### 🚨 Smart Evidence Alerts & Guided Reflection
Each alert presents structured factual evidence alongside an AI-generated explanation:
> **Alert:** ⚠️ *Potential Overtrading Pattern Detected*  
> **Evidence:** 8 transactions executed in the last 7 days (baseline: 2.1 trades/week).  
> **AI Explanation:** Your transaction velocity has quadrupled over your historical weekly baseline.  
> **Reflection Prompt:** *Were these transactions part of your planned strategy or influenced by short-term market noise?*

### 📝 Investment Journal (Thesis vs. Action)
- Log entry motivation, thesis statement, target holding horizon, and invalidation criteria prior to trading.
- Side-by-side comparison of **Original Investment Thesis vs. Actual Action Taken**.

### 💰 Investment Contribution Planner
- Non-advisory financial calculator evaluating income, fixed expenses, and monthly target contributions.
- Projections for 1-year, 3-year, and 5-year disciplined contribution totals (no guaranteed returns promised).

---

## 🛠️ 5. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS | Responsive, glassmorphism UI dashboard |
| **Data Visualization** | Recharts / Chart.js | Portfolio breakdown, transaction timeline, market trends |
| **Backend API** | Python 3.11+, FastAPI, Uvicorn | High-performance async REST API framework |
| **Database** | PostgreSQL, SQLAlchemy | Transaction histories, holdings, journal entries, alert logs |
| **Machine Learning** | scikit-learn, Isolation Forest | Unsupervised anomaly detection on behavioral features |
| **AI Explanation Layer**| OpenAI / LLM Provider API | Natural language explanation & reflection generation |
| **Market Data Service** | Alpha Vantage / Finnhub / Twelve Data | Live & historical stock quotes, OHLCV data |
| **Demo Engine** | Built-in Mock Data Generator | Pre-configured realistic demo scenarios for hackathons |

---

## 🧮 6. Machine Learning & Behavioral Pipeline

InvestGuard utilizes **Isolation Forest** (an unsupervised ensemble tree algorithm) to identify multi-dimensional outliers in investor transaction patterns without requiring pre-labeled training datasets.

### Feature Extraction Vector ($X_i$)
For each user $i$, the engine extracts numerical features across rolling windows (7d, 30d, 90d):
1. \`trades_per_day\`: Transaction frequency.
2. \`trades_per_week\`: Rolling 7-day trade count.
3. \`avg_holding_period_days\`: Mean duration positions are held.
4. \`buy_after_price_gain_ratio\`: Percentage of buy trades following >5% price gains.
5. \`sell_after_price_drop_ratio\`: Percentage of sell trades following >5% price drops.
6. \`avg_position_size_pct\`: Average position allocation relative to total portfolio.
7. \`max_single_stock_concentration\`: Percentage allocation of the largest position.
8. \`sector_concentration_entropy\`: Entropy index of sector distribution.
9. \`short_term_trade_ratio\`: Fraction of trades closed within 7 days.

---

## 🔌 7. REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| \`GET\` | \`/api/portfolio\` | Summary of portfolio value, gain/loss, and allocation |
| \`GET\` | \`/api/holdings\` | Detailed list of current user holdings |
| \`GET\` | \`/api/transactions\` | Query historical transaction records |
| \`POST\` | \`/api/transactions\` | Add a new trade transaction record |
| \`DELETE\` | \`/api/transactions/{id}\` | Remove a transaction record |
| \`GET\` | \`/api/behavior-analysis\` | Get latest behavioral analysis output |
| \`POST\` | \`/api/behavior-analysis/run\` | Trigger isolation forest ML + rule analysis run |
| \`GET\` | \`/api/alerts\` | List generated smart behavioral alerts |
| \`PATCH\` | \`/api/alerts/{id}\` | Update alert status (Reviewed / Dismissed) |
| \`GET\` | \`/api/journal\` | Retrieve investment journal entries |
| \`POST\` | \`/api/journal\` | Create new investment thesis / post-mortem log |
| \`GET\` | \`/api/planner\` | Retrieve contribution planner configurations |
| \`POST\` | \`/api/planner\` | Save planner income/expense targets |
| \`GET\` | \`/api/market/{symbol}\` | Fetch market quotes via MarketDataService |
| \`POST\` | \`/api/ai/explain\` | Generate LLM explanation for a detected anomaly |

---

## 📁 8. Project Structure

\`\`\`
investguard/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Dashboard, Charts, Alerts, Journal, Navbar
│   │   ├── pages/            # DashboardView, BehavioralView, JournalView, PlannerView
│   │   ├── services/         # API client & MarketData client
│   │   ├── types/            # TypeScript schemas & interfaces
│   │   ├── App.tsx           # App root & navigation
│   │   └── main.tsx
│   ├── package.json
│   └── tailwind.config.js
├── backend/
│   ├── app/
│   │   ├── api/              # FastAPI route handlers
│   │   ├── core/             # Config, DB connection, Security settings
│   │   ├── models/           # SQLAlchemy DB Models
│   │   ├── schemas/          # Pydantic data validation schemas
│   │   ├── services/         # Behavior Engine, ML Isolation Forest, LLM Service
│   │   ├── data/             # Demo fallback datasets
│   │   └── main.py           # FastAPI entrypoint
│   ├── requirements.txt
│   └── .env.example
├── HACKATHON_PROJECT_REPORT.md
├── README.md
└── LICENSE
\`\`\`

---

## ⚡ 9. Local Installation & Setup

### Prerequisites
- Node.js v18+ & npm
- Python 3.11+
- PostgreSQL (Optional; sqlite fallback available for quick local dev)

### 1️⃣ Repository Clone
\`\`\`bash
git clone https://github.com/investguard/investguard.git
cd investguard
\`\`\`

### 2️⃣ Backend Setup
\`\`\`bash
cd backend
python -m venv venv

# Windows
venv\\Scripts\\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
\`\`\`
*Backend server will start at \`http://localhost:8000\` (Docs available at \`http://localhost:8000/docs\`).*

### 3️⃣ Frontend Setup
\`\`\`bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
\`\`\`
*Frontend interface will launch at \`http://localhost:5173\`.*

---

## 🔐 10. Environment Variables (\`.env.example\`)

\`\`\`env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/investguard_db

# Market Data Provider (Alpha Vantage / Finnhub / Twelve Data)
MARKET_DATA_API_KEY=your_market_data_key_here
MARKET_DATA_BASE_URL=https://finnhub.io/api/v1

# AI & LLM Explanation Layer
AI_API_KEY=your_llm_api_key_here
AI_MODEL_NAME=gemini-1.5-flash

# Application Mode
DEMO_MODE=true
\`\`\`

---

## 🎮 11. Hackathon Demo Mode

InvestGuard includes a single-click **Demo Mode** built specifically for judges and evaluators. Demo Mode pre-loads a rich fictional dataset simulating 6 realistic behavioral antipatterns across 45 transactions:

1. Click **"Load Demo Scenario"** on the upper navigation bar.
2. Select a pre-packaged profile (e.g., *"Emotional Trader - FOMO & Panic Cycles"*).
3. Navigate to **Behavioral Analysis** to view live Isolation Forest anomaly scoring.
4. Click any **Smart Alert** to view raw transaction evidence alongside LLM-generated reflection questions.
5. Explore the **Investment Journal** to compare original thesis notes with panic sales.

---

## 🧪 12. Testing Matrix

| Test Case ID | Test Input | Expected Result | Result |
| :--- | :--- | :--- | :--- |
| \`TC-01\` | Add trade with positive quantity | Transaction logged, portfolio metrics recalculated | ✅ PASS |
| \`TC-02\` | Add trade with negative/zero qty | API returns \`422 Unprocessable Entity\` validation error | ✅ PASS |
| \`TC-03\` | Holding concentration > 35% | Concentration Alert generated automatically | ✅ PASS |
| \`TC-04\` | 8 trades executed in 5 days | Overtrading anomaly signal triggered by Isolation Forest | ✅ PASS |
| \`TC-05\` | Buy trade 2h after +12% price gain | FOMO-like behavioral indicator tagged | ✅ PASS |
| \`TC-06\` | Sell trade 1h after -9% drop | Panic-selling behavioral indicator tagged | ✅ PASS |
| \`TC-07\` | AI API network failure | App falls back to deterministic template explanation | ✅ PASS |
| \`TC-08\` | Market API rate limit hit | System falls back seamlessly to cached/demo prices | ✅ PASS |
| \`TC-09\` | Empty portfolio initialization | Dashboard displays clean zero-state without error | ✅ PASS |

---

## 🛡️ 13. Privacy & Security

- 🔒 **Zero Brokerage Credentials:** InvestGuard operates strictly on user-entered transaction logs or read-only CSV exports; no sensitive login passwords or banking tokens are required.
- 🔑 **Backend API Proxy:** All external market data and LLM API keys remain protected in backend environment variables and are never exposed to client-side bundles.
- 📂 **Local/Private Data Control:** Data remains strictly owned by the user.

---

## 🚀 14. Future Scope & Roadmap

- 🔌 **Direct Brokerage Import:** Read-only OAuth integrations with Plaid, Snaptrade, and Indian broker APIs (Zerodha Kite, Groww).
- 📈 **Real-time Streaming Signals:** WebSockets integration for real-time order-book dynamic behavioral warnings.
- 📱 **Native Mobile Application:** React Native mobile interface with instant push notifications for behavioral triggers.
- 🧠 **Adaptive Personal Baselines:** Continuous online learning models adapting anomaly thresholds as an investor matures.

---

## 🏆 15. Hackathon Submission Details

- **Event:** Hefty Hacks 2026
- **Track:** Finance × Trading
- **Project Name:** InvestGuard
- **Tagline:** *"Understand your investment behavior before it becomes a habit."*
- **Team Members:** Vikas & Team InvestGuard

---

## ⚖️ 16. Disclaimer

> **Disclaimer:** *InvestGuard is an educational behavioral technology platform created for hackathon demonstration. Behavioral indicators and smart alerts are derived strictly from statistical patterns in portfolio allocation and transaction history and do not assess psychological health or user emotion. InvestGuard does NOT provide investment advice, financial recommendations, or guaranteed market returns.*

---

<p align="center">Made with ❤️ for Hefty Hacks 2026</p>`,

  report: `# InvestGuard – AI/ML Based Behavioral Investment Analysis Platform
## Hackathon Project Report | Hefty Hacks 2026

---

### 1. COVER PAGE

**Project Title:**  
InvestGuard – AI/ML Based Behavioral Investment Analysis Platform

**Tagline:**  
*“Understand your investment behavior before it becomes a habit.”*

**Hackathon:**  
Hefty Hacks 2026

**Theme / Track:**  
Finance × Trading

**Team Name / Members:**  
Team InvestGuard  
- Vikas (Lead Architect & Developer)  
- Team Member 2 (ML & Behavioral Data Engineer)  
- Team Member 3 (Frontend & UX Designer)  
- Team Member 4 (Domain Research & QA)  

**Institute / College:**  
Department of Computer Science & Engineering / Information Technology  

**Course / Degree:**  
B.Tech in Computer Science and Engineering  

**Date:**  
September 19, 2026  

---

### 2. ABSTRACT

In recent years, retail participation in stock markets has experienced unprecedented growth, driven by zero-commission trading platforms and accessible mobile applications. However, despite easy access to market data, a vast majority of individual retail investors suffer consistent financial losses or underperform market benchmarks. Financial literature confirms that these sub-optimal outcomes are rarely caused by a lack of financial news or charting tools, but rather by recurring emotional and cognitive biases—such as **FOMO-like buying**, **panic selling**, **overtrading**, **excessive concentration risk**, **loss aversion**, and **short-term market timing**.

**InvestGuard** is an innovative, educational fintech platform engineered to help retail investors identify, reflect upon, and correct risky behavioral patterns in their trading history before they become ingrained habits. InvestGuard integrates real-time and historical market price feeds with a dual-layer decision engine: a **Deterministic Rule-Based Engine** for transparent threshold detection and an **Isolation Forest Machine Learning Model** for unsupervised behavioral anomaly detection. Detected antipattern signals are processed by an **AI Explanation Layer (LLM)**, which translates complex numerical anomaly scores into plain-language, evidence-backed smart alerts paired with guided self-reflection prompts. 

Furthermore, the platform incorporates a structured **Investment Journal** (comparing pre-trade thesis against post-trade actions) and an **Investment Contribution Planner**. Crucially, InvestGuard is strictly educational and non-advisory: it never issues buy/sell recommendations or price target predictions. This report details the architecture, behavioral algorithms, ML pipeline, database design, API integrations, and experimental evaluation of InvestGuard.

---

### 3. INTRODUCTION

The democratization of stock trading through smartphone applications has empowered millions of individuals to manage personal portfolios independently. However, market accessibility has far outpaced financial literacy and emotional discipline. Retail investors routinely fall into cognitive traps triggered by market volatility, media noise, and short-term price momentum.

While traditional brokerage apps focus on displaying asset prices, real-time charts, order books, and ticker news, they remain neutral to—or inadvertently amplify—detrimental trading behavior. For instance, instant order execution features encourage impulse trading during market rallies, while frequent push notifications regarding sharp market dips often induce panic selling.

Technology plays a vital role not just in enabling transactions, but in fostering long-term financial discipline and behavioral awareness. **InvestGuard** is developed as a behavioral analysis platform designed to serve as an "educational mirror" for retail investors. By systematically reviewing an investor's transaction logs and allocation histories against historical price trends, InvestGuard surfaces actionable insights regarding personal behavioral tendencies. By bridging machine learning anomaly detection with explainable generative AI, InvestGuard empowers retail traders to cultivate disciplined, thesis-driven investment strategies.

---

### 4. PROBLEM STATEMENT

The central problem addressed by InvestGuard is formulated as follows:

> *“Retail investors can sometimes make poor investment decisions because of recurring behavioral patterns such as FOMO-like buying, panic-selling patterns, overtrading, excessive portfolio concentration, loss-aversion patterns, and market-timing behavior.”*

#### Detailed Problem Breakdown:
1. **FOMO-Like Buying (Fear Of Missing Out):** Investors frequently purchase assets after steep price increases (rallies), purchasing near local peaks due to excitement and social proof.
2. **Panic-Selling Patterns:** Investors liquidate positions immediately following sharp, short-term price drops, locking in losses rather than evaluating asset fundamentals.
3. **Overtrading Velocity:** High transaction frequencies driven by emotional reactions to intraday volatility lead to excessive trading costs, tax inefficiencies, and poor decision quality.
4. **Excessive Concentration Risk:** Over-allocating portfolio capital to a single asset (>30-50%) exposes the investor to severe single-stock drawdown risk.
5. **Loss-Aversion Traps ("Holding Losers"):** Investors hold onto severely depreciating assets with broken fundamentals to avoid realizing a loss, while selling winning assets prematurely.
6. **Market-Timing Attempts:** Short-term entries and exits driven by attempts to predict momentary market swings, which consistently underperform passive holding strategies.

---

### 5. OBJECTIVES

1. **Transaction History Ingestion & Parsing:** Parse trade logs (buy/sell, quantity, execution price, timestamp, position size).
2. **Behavioral Indicator Detection:** Implement algorithms to detect 6 primary behavioral antipatterns.
3. **Unsupervised Anomaly Scoring:** Deploy an **Isolation Forest** machine learning model to spot statistical deviations from an investor’s baseline behavior.
4. **Portfolio Concentration Analytics:** Compute real-time weightings and sector concentration metrics.
5. **Explainable Smart Alerts:** Generate human-readable alerts backed by concrete data evidence and reflection prompts using LLM integration.
6. **Thesis-Driven Investment Journal:** Provide a journal framework to capture pre-trade investment thesis and evaluate post-trade actions.
7. **Disciplined Contribution Planning:** Offer a financial planning module focused on monthly contribution targets rather than speculative returns.
8. **Strict Non-Advisory Compliance:** Ensure the platform remains strictly educational without providing financial advice or stock tips.

---

### 6. EXISTING SYSTEM vs. PROPOSED SYSTEM

#### 6.1 Existing Systems (Traditional Portfolio Trackers & Brokerage Apps)
Traditional tools focus almost exclusively on market data presentation and trade execution:
- Display raw transactional history without context or behavioral tagging.
- Encourage high trading velocity through gamified user interfaces.
- Lack mechanisms to cross-reference trades with historical price movements at the moment of execution.
- Provide no structured space for investment thesis logging or post-mortem reflection.

#### 6.2 Proposed System (InvestGuard)
InvestGuard introduces a dedicated behavioral analysis pipeline running alongside standard portfolio management:

\`\`\`
[ Market Data API ] ──┐
                      ├──► [ Transaction Data ] ──► [ Rule Engine ] ──┐
[ User Trades ] ──────┘                                                │
                                                                       ▼
[ Smart Alerts ] ◄── [ AI Explanation ] ◄── [ Isolation Forest ML ] ◄──┘
       │
       ▼
[ Investor Reflection & Journaling ]
\`\`\`

---

### 7. PROPOSED SYSTEM ARCHITECTURE & COMPONENTS

1. **Data Ingestion Layer:** Ingests user trades, holdings, and live/historical stock price data via \`MarketDataService\`.
2. **Deterministic Behavioral Rule Engine:** Applies algorithmic checks across trade execution timestamps and price movement windows.
3. **Machine Learning Anomaly Engine:** Extracts numerical feature vectors per user and executes Isolation Forest scoring to flag statistically rare trading patterns.
4. **AI Explanation & Reflection Layer:** Formulates contextual prompts sent to an LLM API, producing neutral, clear explanations and guided self-reflection questions.
5. **User Experience Layer (React + Tailwind):** Displays interactive portfolio breakdown charts, alerts dashboard, thesis comparison journal, and contribution planner.

---

### 8. CORE FEATURES

- **8.1 Dashboard:** Total portfolio value, daily P&L, holdings count, allocation chart, recent behavioral alerts.
- **8.2 Portfolio Analysis:** Concentration threshold detector (>30% single asset cap), sector exposure breakdown.
- **8.3 Transaction Management:** Complete trade log with symbol, type, qty, price, reason tag, and holding horizon.
- **8.4 Behavioral Analysis:** Automated detection of 6 core behavioral antipatterns.
- **8.5 Smart Alerts:** Evidence-based notifications paired with AI explanation & reflection questions.
- **8.6 Investment Journal:** Thesis vs. Action comparison matrix for trade post-mortems.
- **8.7 Investment Planner:** Non-advisory contribution planning calculator.
- **8.8 Learning Module:** Educational primers on key cognitive biases in retail investing.

---

### 9. SYSTEM ARCHITECTURE

\`\`\`
┌────────────────────────────────────────────────────────────────────────┐
│                          REACT FRONTEND                                │
│   (TypeScript + Tailwind CSS + Recharts + Axios State Management)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST / JSON
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          FASTAPI BACKEND                               │
│  ┌───────────────────────┐ ┌───────────────────┐ ┌──────────────────┐  │
│  │ Portfolio/Trade Router│ │ Behavior Router   │ │ Journal Router   │  │
│  └───────────┬───────────┘ └─────────┬─────────┘ └────────┬─────────┘  │
└──────────────┼───────────────────────┼────────────────────┼────────────┘
               │                       │                    │
               ▼                       ▼                    ▼
┌─────────────────────────┐ ┌────────────────────┐ ┌───────────────────┐
│ PostgreSQL Database     │ │ Market Data        │ │ Machine Learning  │
│ (SQLAlchemy ORM)        │ │ Service Adapter    │ │ Anomaly Engine    │
│ - Users, Holdings       │ │ (Finnhub / Alpha)  │ │ (IsolationForest) │
│ - Transactions, Alerts  │ └────────────────────┘ └─────────┬─────────┘
│ - Journal Entries       │                                  │
└─────────────────────────┘                                  ▼
                                                   ┌───────────────────┐
                                                   │ LLM Explanation   │
                                                   │ Layer (AI API)    │
                                                   └───────────────────┘
\`\`\`

---

### 10. TECHNOLOGY STACK

| Technology | Purpose | Justification |
| :--- | :--- | :--- |
| **React 18** | Frontend Framework | Component-based UI architecture enabling high-performance, reactive UI updates. |
| **TypeScript** | Type Safety | Eliminates runtime type errors across complex financial data structures. |
| **Tailwind CSS** | UI Styling | Utility-first CSS providing modern, responsive glassmorphism aesthetic. |
| **Recharts** | Data Visualization | Highly customizable SVG-based chart library for portfolio and market plotting. |
| **Python 3.11+** | Backend Language | Native ecosystem support for data processing, scikit-learn ML, and async web tools. |
| **FastAPI** | REST API Framework | Extremely fast ASGI framework with automatic OpenAPI documentation and Pydantic validation. |
| **PostgreSQL** | Relational Database | ACID-compliant robust database for storing transactions, holdings, and user histories. |
| **scikit-learn** | Machine Learning | Industry-standard Python library providing the Isolation Forest implementation. |
| **Isolation Forest**| Anomaly Algorithm | Efficient unsupervised algorithm optimal for low-density outlier detection in tabular data. |
| **LLM Provider API**| Generative AI | Translates structured detection records into empathetic, neutral reflection explanations. |
| **Market Data API**| Financial Price Data| Provides historical daily/intraday OHLCV price series for trade cross-referencing. |

---

### 11. API INTEGRATION & DATA ABSTRACTION

All market data, news feeds, and LLM explanation keys are protected behind backend environment variables (\`MARKET_DATA_API_KEY\`, \`AI_API_KEY\`, \`DATABASE_URL\`) and never exposed to client-side bundles.

---

### 12. ARTIFICIAL INTELLIGENCE & EXPLAINABILITY LAYER

The AI Explanation Layer converts technical detection JSON payloads into empathetic, neutral explanations citing concrete numerical evidence alongside self-reflection questions, with a strict constraint to never issue financial advice or stock tips.

---

### 13. MACHINE LEARNING: ISOLATION FOREST ANOMALY DETECTION

#### Anomaly Score Formula:
$$s(x, n) = 2^{-\\frac{E(h(x))}{c(n)}}$$

Where $h(x)$ is the path length of observation $x$ in an isolation tree, and $c(n)$ is the average path length of unsuccessful searches in a Binary Search Tree (BST) over $n$ nodes.

#### Feature Vector ($X_i$):
$$\\mathbf{X_i} = \\left[ x_{\\text{freq\\_7d}}, x_{\\text{freq\\_30d}}, x_{\\text{hold\\_avg}}, x_{\\text{buy\\_after\\_gain}}, x_{\\text{sell\\_after\\_loss}}, x_{\\text{max\\_conc}}, x_{\\text{entropy\\_sector}}, x_{\\text{short\\_term\\_ratio}} \\right]$$

---

### 14. BEHAVIOR DETECTION LOGIC

| Behavioral Pattern | Algorithmic Detection Rule | Concrete Example |
| :--- | :--- | :--- |
| **FOMO-Like Buying** | Purchase trade executed when asset price 5-day gain $> +8\%$ relative to 30-day SMA. | Stock rises $+14\%$ over 4 days; user executes BUY order near peak. |
| **Panic-Selling Pattern** | Sale trade executed when asset price 3-day decline $> -7\%$ relative to purchase price. | Stock drops $-10\%$ in 2 days; user executes full liquidation (SELL). |
| **Overtrading** | User 7-day transaction frequency $> 3.0 \\times$ historical 60-day baseline average. | Baseline: 2 trades/week. Recent: 9 trades in 5 days. |
| **Portfolio Concentration**| Single position market value $> 30.0\%$ of total portfolio net value. | Holding XYZ accounts for $42\%$ of total portfolio allocation. |
| **Loss-Aversion Pattern** | Position drawdown $> -25\%$ held for $>60$ days with broken thesis tag. | Asset down $-35\\%$, thesis marked "Invalid", position remains unhedged. |
| **Market Timing** | High-frequency buy-sell cycles of same ticker within a rolling 72-hour window. | User buys AAPL, sells 18h later, re-buys 12h later. |

---

### 15. DATABASE DESIGN & SCHEMA

\`\`\`sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE holdings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    company_name VARCHAR(255),
    sector VARCHAR(100),
    quantity NUMERIC(15, 4) NOT NULL,
    avg_buy_price NUMERIC(15, 2) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    transaction_type VARCHAR(10) CHECK (transaction_type IN ('BUY', 'SELL')),
    quantity NUMERIC(15, 4) NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    execution_reason VARCHAR(255),
    target_horizon_days INT
);

CREATE TABLE behavior_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    pattern_type VARCHAR(50) NOT NULL,
    severity VARCHAR(15) CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
    evidence_json JSONB NOT NULL,
    ai_explanation TEXT,
    reflection_question TEXT,
    status VARCHAR(20) DEFAULT 'UNREVIEWED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    initial_thesis TEXT NOT NULL,
    reconsideration_criteria TEXT,
    post_action_notes TEXT,
    thesis_matched BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

---

### 16. API ENDPOINTS DOCUMENTATION

| Method | Endpoint | Description | Query/Body Params |
| :--- | :--- | :--- | :--- |
| \`GET\` | \`/api/portfolio\` | Returns net worth, daily change, cash balance | \`user_id\` |
| \`GET\` | \`/api/holdings\` | Returns list of holdings with concentration % | \`user_id\` |
| \`GET\` | \`/api/transactions\` | Returns historical transaction log | \`user_id, symbol, limit\` |
| \`POST\` | \`/api/transactions\` | Log a new BUY/SELL transaction | \`TransactionCreate\` schema |
| \`DELETE\`| \`/api/transactions/{id}\` | Remove a transaction entry | \`transaction_id\` |
| \`GET\` | \`/api/behavior-analysis\`| Get latest behavior analysis report | \`user_id\` |
| \`POST\` | \`/api/behavior-analysis/run\`| Trigger ML + Rule Engine detection run | \`user_id\` |
| \`GET\` | \`/api/alerts\` | Fetch list of generated smart alerts | \`status, severity\` |
| \`PATCH\` | \`/api/alerts/{id}\` | Mark alert as REVIEWED or DISMISSED | \`status, notes\` |
| \`GET\` | \`/api/journal\` | Retrieve investment journal records | \`user_id\` |
| \`POST\` | \`/api/journal\` | Add new investment thesis log | \`JournalCreate\` schema |
| \`GET\` | \`/api/planner\` | Get contribution planner data | \`user_id\` |
| \`POST\` | \`/api/planner\` | Update income/expense & target contribution | \`PlannerSchema\` |
| \`GET\` | \`/api/market/{symbol}\`| Fetch market quote & OHLCV history | \`symbol\` |
| \`GET\` | \`/api/news/{symbol}\` | Fetch market news headlines | \`symbol\` |
| \`POST\` | \`/api/ai/explain\` | Generate LLM explanation for an alert | \`alert_id\` |

---

### 17. USER WORKFLOW

User Access & Login ──► View Portfolio ──► Log Transaction ──► Behavioral Detection (Rule + ML) ──► Smart Alert & Reflection ──► Investment Journal Review.

---

### 18. DEMO MODE IMPLEMENTATION

Single-click demo mode featuring 45 realistic trades across 6 behavioral profiles. Runs without external API key dependencies for seamless hackathon judging.

---

### 19. PRIVACY AND SECURITY

- Zero brokerage password collection.
- All secrets proxied in backend env.
- User data remains private.

---

### 20. LIMITATIONS

- Indicators show statistical probability, not emotional diagnosis.
- Cold-start accounts require trade history for ML baseline calibration.

---

### 21. FUTURE SCOPE

- Direct broker OAuth sync (Zerodha Kite, SnapTrade).
- Native iOS & Android apps with push alerts.
- Advanced NLP voice thesis notes.

---

### 22. ADVANTAGES

- Focuses on investor behavior rather than stock price noise.
- Transparent, evidence-based alerts with explainable AI.
- Promotes long-term thesis discipline.

---

### 23. SYSTEM TESTING MATRIX

All 8 primary test cases (\`TC-BEH-01\` to \`TC-API-01\`) PASSED cleanly.

---

### 24. EXPECTED PROTOTYPE RESULTS

Delivers interactive dashboard, automated alerts in $<500\\text{ms}$, Isolation Forest ML scoring, and Investment Journal post-mortems.

---

### 25. HACKATHON VALUE (FINANCE × TRADING TRACK)

Fits Hefty Hacks 2026 by combining Behavioral Finance, Machine Learning Anomaly Detection, and Generative Explainable AI for retail trading.

---

### 26. CONCLUSION

InvestGuard demonstrates how AI and machine learning empower retail investors to cultivate long-term financial self-awareness and trade discipline.

---

### 27. REFERENCES

1. Kahneman, D., & Tversky, A. (1979). *Prospect Theory*. Econometrica, 47(2), 263-291.
2. Liu, F. T., et al. (2008). *Isolation Forest*. IEEE ICDM, 413-422.
3. Barber, B. M., & Odean, T. (2000). *Trading Is Hazardous to Your Wealth*. Journal of Finance, 55(2), 773-806.
`
};
