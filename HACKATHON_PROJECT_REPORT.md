# InvestGuard – AI/ML Based Behavioral Investment Analysis Platform
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

#### The Gap in Existing Tools:
Existing financial technology products prioritize:
- **Price tracking & alerts:** Notifying users when a stock hits a price level.
- **Portfolio balances:** Displaying net worth and daily P&L.
- **News aggregators:** Streaming sensationalized headlines.

None of these tools provide automated, evidence-backed feedback on the investor's *own decision-making patterns*. InvestGuard solves this specific void.

---

### 5. OBJECTIVES

The primary objective of the InvestGuard platform is to improve retail investor self-awareness through data-driven behavioral analysis. Specific technical and functional goals include:

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
- **Limitations:**
  - Display raw transactional history without context or behavioral tagging.
  - Encourage high trading velocity through gamified user interfaces.
  - Lack mechanisms to cross-reference trades with historical price movements at the moment of execution.
  - Provide no structured space for investment thesis logging or post-mortem reflection.

#### 6.2 Proposed System (InvestGuard)
InvestGuard introduces a dedicated behavioral analysis pipeline running alongside standard portfolio management:

```
[ Market Data API ] ──┐
                      ├──► [ Transaction Data ] ──► [ Rule Engine ] ──┐
[ User Trades ] ──────┘                                                │
                                                                       ▼
[ Smart Alerts ] ◄── [ AI Explanation ] ◄── [ Isolation Forest ML ] ◄──┘
       │
       ▼
[ Investor Reflection & Journaling ]
```

---

### 7. PROPOSED SYSTEM ARCHITECTURE & COMPONENTS

The proposed system functions through five integrated layers:

1. **Data Ingestion Layer:** Ingests user trades, holdings, and live/historical stock price data via `MarketDataService`.
2. **Deterministic Behavioral Rule Engine:** Applies algorithmic checks across trade execution timestamps and price movement windows.
3. **Machine Learning Anomaly Engine:** Extracts numerical feature vectors per user and executes Isolation Forest scoring to flag statistically rare trading patterns.
4. **AI Explanation & Reflection Layer:** Formulates contextual prompts sent to an LLM API, producing neutral, clear explanations and guided self-reflection questions.
5. **User Experience Layer (React + Tailwind):** Displays interactive portfolio breakdown charts, alerts dashboard, thesis comparison journal, and contribution planner.

---

### 8. CORE FEATURES

#### 8.1 Dashboard
- **Portfolio Summary:** Total portfolio value, overall profit/loss, daily P&L change percentage.
- **Holdings Table & Allocation Chart:** Donut chart visualization of portfolio weightings.
- **Behavioral Health Badge:** Summary of open vs. reviewed behavioral alerts.
- **Recent Activity Feed:** Combined timeline of recent trades and corresponding behavioral flags.

#### 8.2 Portfolio Analysis
- Detailed breakdown per holding: Symbol, Company Name, Shares Held, Average Purchase Price, Current Market Price, Total Value, Unrealized Gain/Loss, Portfolio Share (%).
- **Concentration Threshold Monitor:** Highlights holdings occupying >30% of total portfolio value.
- **Sector Exposure Breakdown:** Categorizes holdings into sectors (Tech, Finance, Healthcare, Energy, etc.) to expose sectoral over-concentration.

#### 8.3 Transaction Management
- Comprehensive transaction recording: Buy/Sell type, Ticker Symbol, Shares, Price per Share, Timestamp, Execution Reason tag, and Target Holding Period.
- Filterable history view with automated behavioral tagging indicators.

#### 8.4 Behavioral Analysis Engine
Automated analysis covering the 6 core behavioral patterns detailed in Section 14.

#### 8.5 Smart Alerts
- **Evidence-Based Reporting:** Every alert contains the pattern type, severity level (Low, Medium, High), timestamp, exact quantitative evidence, AI explanation, and a reflection question.
- **Interactive Review:** Users can mark alerts as "Reviewed", "Acknowledged", or add reflective notes.

#### 8.6 Investment Journal
- **Pre-Trade Log:** Captures Investment Thesis, Reason for Buying, Target Holding Horizon, and Reconsideration Conditions.
- **Post-Trade Review:** Allows logging liquidation details and compares **Original Thesis vs. Actual Action Taken** (e.g., *"Thesis: 3-Year Growth Hold | Action: Sold after 5 days due to 4% dip"*).

#### 8.7 Investment Planner
- Financial planning calculator taking user income, essential expenses, and target monthly investment amounts.
- Generates 12-month, 36-month, and 60-month cumulative contribution projections without promising market yields.

#### 8.8 Learning & Reflection Section
- Educational content modules explaining key cognitive biases (Loss Aversion, Recency Bias, Confirmation Bias, Herding Behavior) in accessible language.

---

### 9. SYSTEM ARCHITECTURE

```
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
```

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

#### 11.1 Market Data Service Abstraction (`MarketDataService`)
To protect against provider lock-in and rate limits, InvestGuard utilizes a provider-agnostic interface:

```python
class MarketDataService:
    async def get_current_price(self, symbol: str) -> float: ...
    async def get_price_history(self, symbol: str, start_date: datetime, end_date: datetime) -> List[PriceBar]: ...
    async def get_price_change_pct(self, symbol: str, window_days: int) -> float: ...
```

#### 11.2 API Security
All API keys (`MARKET_DATA_API_KEY`, `AI_API_KEY`, `DATABASE_URL`) are isolated in server-side `.env` environment variables and strictly proxied through the FastAPI backend.

---

### 12. ARTIFICIAL INTELLIGENCE & EXPLAINABILITY LAYER

The AI Explanation Layer acts as an empathetic, neutral translator. When a behavioral pattern or ML anomaly is flagged, the backend compiles a structured JSON context payload:

```json
{
  "pattern": "FOMO_BUYING",
  "ticker": "AAPL",
  "trade_date": "2026-09-18",
  "trade_price": 235.50,
  "price_change_7d": "+14.2%",
  "user_baseline_trade_freq": "2 trades/week",
  "recent_trade_freq": "7 trades/week"
}
```

This context is formatted into a strict system prompt instructing the LLM to:
1. Explain the detected pattern using plain, neutral English.
2. Cite the exact quantitative evidence.
3. Formulate a self-reflection question.
4. **STRICT CONSTRAINT:** Provide zero financial advice, price predictions, or buy/sell recommendations.

---

### 13. MACHINE LEARNING: ISOLATION FOREST ANOMALY DETECTION

#### 13.1 Why Isolation Forest?
Traditional classification models require labeled training data (e.g., "Good Trade" vs "Bad Trade"), which does not exist for subjective human behavior. **Isolation Forest** is an unsupervised algorithm that detects anomalies by isolating instances in feature space through random partitioning trees. Because anomalous data points require fewer splits to isolate, they receive significantly shorter path lengths in the isolation trees.

#### 13.2 Mathematical Anomaly Score
The anomaly score $s(x, n)$ for a feature vector $x$ over a dataset of size $n$ is defined as:

$$s(x, n) = 2^{-\frac{E(h(x))}{c(n)}}$$

Where:
- $h(x)$ is the path length of observation $x$ in a tree.
- $E(h(x))$ is the average path length across an ensemble of isolation trees.
- $c(n)$ is the average path length of unsuccessful searches in a Binary Search Tree (BST) built over $n$ nodes:

$$c(n) = 2 \ln(n - 1) + 0.5772156649 \text{ (Euler's constant)} - \frac{2(n - 1)}{n}$$

*Score Interpretation:*
- $s \approx 1.0$: Definite anomaly (unusual trading behavior).
- $s < 0.5$: Normal baseline behavior.

#### 13.3 Extracted Behavioral Feature Vector ($X_i$)
For each user, feature vectors are computed across rolling 7-day, 30-day, and 90-day windows:

$$\mathbf{X_i} = \left[ x_{\text{freq\_7d}}, x_{\text{freq\_30d}}, x_{\text{hold\_avg}}, x_{\text{buy\_after\_gain}}, x_{\text{sell\_after\_loss}}, x_{\text{max\_conc}}, x_{\text{entropy\_sector}}, x_{\text{short\_term\_ratio}} \right]$$

---

### 14. BEHAVIOR DETECTION LOGIC

| Behavioral Pattern | Algorithmic Detection Rule | Concrete Example |
| :--- | :--- | :--- |
| **FOMO-Like Buying** | Purchase trade executed when asset price 5-day gain $> +8\%$ relative to 30-day SMA. | Stock rises $+14\%$ over 4 days; user executes BUY order near peak. |
| **Panic-Selling Pattern** | Sale trade executed when asset price 3-day decline $> -7\%$ relative to purchase price. | Stock drops $-10\%$ in 2 days; user executes full liquidation (SELL). |
| **Overtrading** | User 7-day transaction frequency $> 3.0 \times$ historical 60-day baseline average. | Baseline: 2 trades/week. Recent: 9 trades in 5 days. |
| **Portfolio Concentration**| Single position market value $> 30.0\%$ of total portfolio net value. | Holding XYZ accounts for $42\%$ of total portfolio allocation. |
| **Loss-Aversion Pattern** | Position drawdown $> -25\%$ held for $>60$ days with broken thesis tag. | Asset down $-35\%$, thesis marked "Invalid", position remains unhedged. |
| **Market Timing** | High-frequency buy-sell cycles of same ticker within a rolling 72-hour window. | User buys AAPL, sells 18h later, re-buys 12h later. |

---

### 15. DATABASE DESIGN & SCHEMA

InvestGuard utilizes a relational schema optimized for transaction ledger auditability and behavioral pattern querying.

```
┌───────────────────┐       1:N       ┌───────────────────┐
│       USERS       ├────────────────►│     HOLDINGS      │
└─────────┬─────────┘                 └───────────────────┘
          │ 1:N                                 │ 1:N
          ▼                                     ▼
┌───────────────────┐       1:1       ┌───────────────────┐
│   TRANSACTIONS    ├────────────────►│  JOURNAL_ENTRIES  │
└─────────┬─────────┘                 └───────────────────┘
          │ 1:N
          ▼
┌───────────────────┐
│  BEHAVIOR_ALERTS  │
└───────────────────┘
```

#### Core Database Tables Schema

```sql
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
```

---

### 16. API ENDPOINTS DOCUMENTATION

| Method | Endpoint | Description | Query/Body Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/portfolio` | Returns net worth, daily change, cash balance | `user_id` |
| `GET` | `/api/holdings` | Returns list of holdings with concentration % | `user_id` |
| `GET` | `/api/transactions` | Returns historical transaction log | `user_id, symbol, limit` |
| `POST` | `/api/transactions` | Log a new BUY/SELL transaction | `TransactionCreate` schema |
| `DELETE`| `/api/transactions/{id}` | Remove a transaction entry | `transaction_id` |
| `GET` | `/api/behavior-analysis`| Get latest behavior analysis report | `user_id` |
| `POST` | `/api/behavior-analysis/run`| Trigger ML + Rule Engine detection run | `user_id` |
| `GET` | `/api/alerts` | Fetch list of generated smart alerts | `status, severity` |
| `PATCH` | `/api/alerts/{id}` | Mark alert as REVIEWED or DISMISSED | `status, notes` |
| `GET` | `/api/journal` | Retrieve investment journal records | `user_id` |
| `POST` | `/api/journal` | Add new investment thesis log | `JournalCreate` schema |
| `GET` | `/api/planner` | Get contribution planner data | `user_id` |
| `POST` | `/api/planner` | Update income/expense & target contribution | `PlannerSchema` |
| `GET` | `/api/market/{symbol}`| Fetch market quote & OHLCV history | `symbol` |
| `GET` | `/api/news/{symbol}` | Fetch market news headlines | `symbol` |
| `POST` | `/api/ai/explain` | Generate LLM explanation for an alert | `alert_id` |

---

### 17. USER WORKFLOW

```
1. User Access & Login ──► 2. View Portfolio Dashboard (Holdings & Allocation)
                                      │
3. Execute / Import Trade ────────────┴────────► 4. Automated Analysis Injected
                                                     ├─ Deterministic Rule Engine
                                                     └─ Isolation Forest Anomaly Scoring
                                                              │
6. User Reflection Prompt ◄── 5. Smart Alert Generated ◄──────┘
            │
            ▼
7. Update Investment Journal (Thesis vs. Action Post-Mortem)
```

---

### 18. DEMO MODE IMPLEMENTATION

For hackathon presentation and evaluation, InvestGuard incorporates a self-contained **Demo Engine**:
- **Dataset:** Contains 45 fictional trades spanning 6 distinct investor behavior profiles (e.g., *"The Impulsive Rally Chaser"*, *"The Panic Seller"*).
- **Zero Configuration:** Runs seamlessly without requiring active third-party API credentials.
- **Interactive Trigger:** Single-click execution of the full ML detection pipeline live during demonstration.

---

### 19. PRIVACY AND SECURITY

- **No Credential Harvesting:** InvestGuard operates without storing brokerage account passwords or financial institution API keys.
- **Backend API Proxying:** All market data and LLM secrets reside strictly in backend server environment variables.
- **Minimal Personal Data:** Stores only numerical transaction logs, preventing exposure of sensitive identity attributes.

---

### 20. LIMITATIONS

1. **Behavioral Attribution:** Patterns indicate statistical tendencies, not definitive psychological diagnoses of user intent.
2. **ML Cold-Start:** Isolation Forest accuracy improves with transaction log volume; new accounts rely primarily on deterministic rule checks.
3. **Market Volatility Spikes:** Extreme macro-market events may trigger false-positive panic flags across multiple users simultaneously.
4. **Non-Advisory Scope:** Does not issue buy, sell, or asset allocation recommendations.

---

### 21. FUTURE SCOPE

- **Direct Brokerage OAuth Sync:** Integration with SnapTrade, Plaid, and Zerodha Kite APIs for automated transaction fetching.
- **Mobile Native Applications:** iOS and Android clients built with React Native for instant push alerts.
- **Advanced NLP Thesis Extraction:** AI parsing of voice-recorded pre-trade thesis notes.
- **Multi-Asset Support:** Expanding analysis coverage to options trading, crypto assets, and fixed-income portfolios.

---

### 22. ADVANTAGES OF INVESTGUARD

1. **Behavioral Focus:** Addresses root-cause emotional decision-making rather than market noise.
2. **Transparent Explainability:** Combines deterministic rules with clear LLM explanations rather than black-box AI scores.
3. **Thesis Discipline:** Enforces accountability by tracking original trade thesis against actual execution actions.
4. **Ethical Non-Advisory Design:** Promotes independent investor learning without financial advice conflicts.

---

### 23. SYSTEM TESTING & VERIFICATION

| Test Case ID | Feature / Component | Input Vector | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-BEH-01` | FOMO Detection | BUY trade executed after +12% 3-day rally | FOMO-like Alert generated with rally evidence | **PASS** |
| `TC-BEH-02` | Panic Sell Detection | SELL trade executed after -9% 2-day drop | Panic-Sell Alert generated with drop evidence | **PASS** |
| `TC-BEH-03` | Overtrading Signal | 8 trades logged within 5 days | Overtrading Anomaly tagged by Isolation Forest | **PASS** |
| `TC-BEH-04` | Concentration Alert | Single stock allocation = 42% | High Concentration Alert triggered (>30%) | **PASS** |
| `TC-ML-01` | Isolation Forest Model | Vector of 15 normal trades | Anomaly score $s < 0.45$ (Normal) | **PASS** |
| `TC-ML-02` | Isolation Forest Model | Outlier trade velocity vector | Anomaly score $s = 0.82$ (Anomaly flagged) | **PASS** |
| `TC-AI-01` | LLM Explanation | Alert ID for Overtrading | Generates neutral explanation & reflection q | **PASS** |
| `TC-API-01` | Market API Fallback | Market Data API connection refused | Graceful fallback to cached mock price data | **PASS** |

---

### 24. EXPECTED PROTOTYPE RESULTS

The fully assembled InvestGuard prototype delivers:
- Interactive dashboard rendering live portfolio allocation donuts and historical P&L curves.
- Automated generation of evidence-backed smart alerts within $<500\text{ms}$ of transaction entry.
- Real-time Isolation Forest anomaly detection pipeline running on FastAPI backend.
- Full Investment Journal interface enabling thesis vs. action post-mortems.

---

### 25. HACKATHON VALUE (FINANCE × TRADING TRACK)

InvestGuard aligns directly with the **Finance × Trading** theme of Hefty Hacks 2026. Rather than building another generic stock charting dashboard, InvestGuard introduces a novel synthesis of **Behavioral Finance**, **Machine Learning Anomaly Detection**, and **Explainable AI**. By addressing the human side of trading discipline, InvestGuard creates high-value impact for individual retail investors.

---

### 26. CONCLUSION

InvestGuard demonstrates how machine learning and generative AI can be harmoniously combined to improve retail financial awareness. By transforming transaction histories into actionable behavioral insights, InvestGuard empowers investors to identify cognitive biases, adhere to pre-defined investment theses, and cultivate lifelong financial discipline.

---

### 27. REFERENCES

1. Kahneman, D., & Tversky, A. (1979). *Prospect Theory: An Analysis of Decision under Risk*. Econometrica, 47(2), 263-291.
2. Liu, F. T., Ting, K. M., & Zhou, Z. H. (2008). *Isolation Forest*. IEEE International Conference on Data Mining (ICDM), 413-422.
3. Barber, B. M., & Odean, T. (2000). *Trading Is Hazardous to Your Wealth: The Common Stock Investment Performance of Individual Investors*. The Journal of Finance, 55(2), 773-806.
4. FastAPI Documentation: https://fastapi.tiangolo.com/
5. scikit-learn Isolation Forest Documentation: https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html
