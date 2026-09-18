// InvestGuard Web Application Script — Interactive App + Untruncated Docs Viewer

const seed = {
  holdings: [
    { symbol: 'NVDA', company: 'NVIDIA Corp.', qty: 18, avg: 742.5, current: 880.2, sector: 'Technology' },
    { symbol: 'AAPL', company: 'Apple Inc.', qty: 24, avg: 168.4, current: 181.7, sector: 'Technology' },
    { symbol: 'MSFT', company: 'Microsoft', qty: 12, avg: 352.2, current: 398.6, sector: 'Technology' },
    { symbol: 'HDFCBANK', company: 'HDFC Bank', qty: 35, avg: 1472, current: 1588.3, sector: 'Financials' },
    { symbol: 'RELIANCE', company: 'Reliance Industries', qty: 22, avg: 2440, current: 2685.5, sector: 'Energy' },
    { symbol: 'INFY', company: 'Infosys Ltd.', qty: 16, avg: 1442, current: 1521.8, sector: 'Technology' },
    { symbol: 'TATAMOTORS', company: 'Tata Motors', qty: 42, avg: 911, current: 868.6, sector: 'Consumer' },
    { symbol: 'GOLDBEES', company: 'Gold ETF', qty: 28, avg: 52.2, current: 58.1, sector: 'Commodities' }
  ],
  transactions: [
    { id: 1, symbol: 'NVDA', company: 'NVIDIA Corp.', type: 'BUY', qty: 8, price: 852.4, date: '2026-09-18', reason: 'Momentum / news', holding: 'Short term' },
    { id: 2, symbol: 'NVDA', company: 'NVIDIA Corp.', type: 'BUY', qty: 5, price: 838.1, date: '2026-09-17', reason: 'FOMO-like entry', holding: 'Short term' },
    { id: 3, symbol: 'TATAMOTORS', company: 'Tata Motors', type: 'SELL', qty: 12, price: 879.3, date: '2026-09-16', reason: 'Price dropped', holding: 'Long term' },
    { id: 4, symbol: 'AAPL', company: 'Apple Inc.', type: 'BUY', qty: 8, price: 179.2, date: '2026-09-15', reason: 'Original thesis', holding: 'Long term' },
    { id: 5, symbol: 'HDFCBANK', company: 'HDFC Bank', type: 'BUY', qty: 10, price: 1579.4, date: '2026-09-14', reason: 'Portfolio balance', holding: 'Long term' },
    { id: 6, symbol: 'NVDA', company: 'NVIDIA Corp.', type: 'SELL', qty: 3, price: 861.2, date: '2026-09-13', reason: 'Short-term trade', holding: 'Short term' },
    { id: 7, symbol: 'RELIANCE', company: 'Reliance Industries', type: 'BUY', qty: 7, price: 2632.5, date: '2026-09-12', reason: 'Price dip', holding: 'Long term' },
    { id: 8, symbol: 'MSFT', company: 'Microsoft', type: 'BUY', qty: 4, price: 390.2, date: '2026-09-11', reason: 'Original thesis', holding: 'Long term' },
    { id: 9, symbol: 'NVDA', company: 'NVIDIA Corp.', type: 'BUY', qty: 2, price: 811.6, date: '2026-09-10', reason: 'Momentum', holding: 'Short term' },
    { id: 10, symbol: 'TATAMOTORS', company: 'Tata Motors', type: 'SELL', qty: 8, price: 894.5, date: '2026-09-09', reason: 'Reduce risk', holding: 'Long term' }
  ],
  alerts: [
    { id: 1, pattern: 'Overtrading', title: 'Potential overtrading pattern', severity: 'High', date: 'Today, 09:42', icon: '↯', desc: 'Your recent trade velocity is significantly above your historical weekly baseline.', evidence: 'You executed 8 transactions in 10 days (baseline: 2 trades/week). Isolation Forest Anomaly Score: 0.82', reflection: 'Were these transactions part of your planned strategy or influenced by market noise?', status: 'open' },
    { id: 2, pattern: 'FOMO-like buying', title: 'Possible FOMO-like buying pattern', severity: 'Moderate', date: 'Yesterday, 16:18', icon: '↗', desc: 'A purchase occurred shortly after a sharp positive price movement.', evidence: 'NVDA rose 9.8% in the prior 24 hours; your buy order followed 2 hours later.', reflection: 'Was this purchase part of your original investment plan?', status: 'open' },
    { id: 3, pattern: 'Concentration', title: 'Concentration alert', severity: 'Moderate', date: 'Sep 16, 11:03', icon: '◒', desc: 'One holding currently occupies a large share of your portfolio value.', evidence: 'NVDA represents 34.8% of your total portfolio (threshold: 30%).', reflection: 'Does this concentration align with your desired risk profile?', status: 'open' }
  ],
  journal: {
    symbol: 'NVDA',
    thesis: 'Long-term investment based on AI hardware fundamentals and semiconductor market expansion.',
    holding: '3–5 years',
    reconsider: 'If competitive moat deteriorates or fundamental growth decelerates.',
    actual: 'Executed 2 buys following price surges and liquidated partial position within 7 days.',
    changed: 'Not yet reflected'
  },
  planner: { income: 85000, expenses: 52000, savings: 210000, contribution: 12000, horizon: 5 }
};

const deepClone = obj => JSON.parse(JSON.stringify(obj));
let state = JSON.parse(localStorage.getItem('investguard-state') || 'null') || deepClone(seed);
let currentRoute = 'dashboard';
let activeDocSubtab = 'report'; // 'report' or 'readme'

const root = document.getElementById('page-wrap');
const money = n => '₹' + Math.round(n).toLocaleString('en-IN');
const holdingValue = h => h.qty * h.current;
const portfolioTotal = () => state.holdings.reduce((sum, h) => sum + holdingValue(h), 0);
const save = () => localStorage.setItem('investguard-state', JSON.stringify(state));
const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));

function showToast(message, tone = 'success') {
  const node = document.createElement('div');
  node.className = 'toast';
  node.innerHTML = `<strong>${tone === 'success' ? 'Done' : 'Note'}</strong>${esc(message)}`;
  document.getElementById('toast-root').appendChild(node);
  setTimeout(() => node.remove(), 3200);
}

function setRoute(route) {
  currentRoute = route;
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.route === route));
  const names = {
    landing: 'Home',
    dashboard: 'Overview',
    portfolio: 'Portfolio',
    transactions: 'Transactions',
    analysis: 'Behavior Analysis',
    alerts: 'Smart Alerts',
    journal: 'Investment Journal',
    planner: 'Investment Planner',
    learn: 'Learn',
    docs: 'Docs & Project Report'
  };
  document.getElementById('breadcrumb-current').textContent = names[route] || 'Overview';
  document.getElementById('sidebar').classList.remove('open');
  render();
}

function header(eyebrow, title, sub, button = '') {
  return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${sub}</p></div>${button}</div>`;
}

function metric(label, value, meta, cls = 'positive', info = 'ⓘ') {
  return `<div class="card metric-card"><div class="label">${label}<span class="info">${info}</span></div><div class="metric-value">${value}</div><div class="metric-meta ${cls}">${meta}</div></div>`;
}

function lineChart() {
  return `<svg class="line-chart" viewBox="0 0 700 210" preserveAspectRatio="none" aria-label="Portfolio value chart"><defs><linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#b5f04b" stop-opacity=".23"/><stop offset="1" stop-color="#b5f04b" stop-opacity="0"/></linearGradient></defs><path class="grid" d="M0 25H700 M0 75H700 M0 125H700 M0 175H700"/><path class="fill" d="M0 160 C65 155,70 145,120 148 S180 125,215 133 S280 102,320 115 S365 88,410 102 S466 72,505 80 S550 51,590 60 S655 28,700 34 V210 H0Z"/><path class="line" d="M0 160 C65 155,70 145,120 148 S180 125,215 133 S280 102,320 115 S365 88,410 102 S466 72,505 80 S550 51,590 60 S655 28,700 34"/><circle class="point" cx="505" cy="80" r="4"/><circle class="point" cx="700" cy="34" r="4"/><text x="0" y="205" fill="#71869a" font-size="10">SEP 01</text><text x="220" y="205" fill="#71869a" font-size="10">SEP 07</text><text x="430" y="205" fill="#71869a" font-size="10">SEP 14</text><text x="650" y="205" fill="#71869a" font-size="10">TODAY</text></svg>`;
}

function allocList() {
  const total = portfolioTotal();
  const colors = ['#b5f04b', '#55d9d2', '#a88cff', '#ffad5b', '#557188'];
  return `<div class="alloc-list">${state.holdings.slice(0, 5).map((h, i) => `<div class="alloc-row"><span style="--c:${colors[i]}">${h.symbol}</span><strong>${Math.round(holdingValue(h) / total * 100)}%</strong></div>`).join('')}</div>`;
}

function behaviorOverview() {
  const items = [
    ['FOMO-like Buying', 'Moderate', 62, 'moderate'],
    ['Panic Selling', 'Low', 24, 'low'],
    ['Overtrading', 'High', 88, 'high'],
    ['Concentration', 'Moderate', 68, 'moderate'],
    ['Loss Aversion', 'Moderate', 55, 'moderate'],
    ['Market Timing', 'High', 81, 'high']
  ];
  return `<div class="behavior-list">${items.map(i => `<div class="behavior-item"><div class="behavior-top"><span class="behavior-name">${i[0]}</span><span class="severity ${i[3]}">${i[1]}</span></div><div class="behavior-bar"><span style="--bar-color:${i[3] === 'high' ? '#ff7d87' : i[3] === 'moderate' ? '#ffad5b' : '#55d9d2'};width:${i[2]}%"></span></div></div>`).join('')}</div>`;
}

function txRows(items = state.transactions.slice(0, 5)) {
  return `<div class="tx-list">${items.map(t => `<div class="tx-row"><div class="coin">${t.symbol.slice(0, 3)}</div><div class="tx-main"><strong>${t.symbol}</strong><small>${t.reason} · ${t.date.slice(5).replace('-', '/')}</small></div><div class="tx-amount ${t.type === 'BUY' ? 'positive' : 'negative'}">${t.type === 'BUY' ? '+' : '−'}${money(t.qty * t.price)}<small>${t.type} · ${t.qty} units</small></div></div>`).join('')}</div>`;
}

// VIEW 1: DASHBOARD
function dashboard() {
  const total = portfolioTotal();
  return `${header('Good morning, Alex', 'Your behavior, in focus.', 'A clearer view of what your investment activity is telling you.', '<button class="btn btn-primary" data-action="run-analysis">◌ Run behavioral analysis</button>')}
  <div class="insight-strip">
    <div class="insight-icon">✦</div>
    <p><strong>Hefty Hacks 2026 Live Demo:</strong> Both <code>HACKATHON_PROJECT_REPORT.md</code> and <code>README.md</code> are integrated in full below.</p>
    <button class="btn btn-small btn-ghost" data-route="docs">Open Docs & Report ↗</button>
  </div>
  <div class="metric-grid">
    ${metric('Portfolio value', money(total), '+6.8% · ₹7,920 this month', 'positive')}
    ${metric("Today's change", '+₹1,250', '+1.02% vs. yesterday', 'positive')}
    ${metric('Holdings', state.holdings.length, 'Across 5 sectors', 'neutral')}
    ${metric('Behavioral alerts', state.alerts.filter(a => a.status === 'open').length, '3 need your review', 'negative', '!')}
  </div>
  <div class="dashboard-grid">
    <div class="card chart-card">
      <div class="card-header"><div><h3>Portfolio value</h3><p>30-day snapshot · INR</p></div><select class="select"><option>Last 30 days</option><option>Last 90 days</option></select></div>
      ${lineChart()}
      <div class="chart-legend"><span><i class="legend-dot" style="background:var(--lime)"></i>Portfolio value</span><span>₹1,24,500 today</span></div>
    </div>
    <div class="card chart-card">
      <div class="card-header"><div><h3>Allocation</h3><p>By current value</p></div><button class="icon-btn" data-route="portfolio">↗</button></div>
      <div class="allocation-body"><div class="donut"><div class="donut-center">${Math.round(portfolioTotal() / 1000)}k<small>total</small></div></div>${allocList()}</div>
    </div>
  </div>
  <div class="bottom-grid">
    <div class="card section-card">
      <div class="card-header"><div><h3>Behavioral overview</h3><p>Indicators are signals to reflect on, not diagnoses.</p></div><button class="btn btn-small" data-route="analysis">See analysis →</button></div>
      ${behaviorOverview()}
    </div>
    <div class="card section-card">
      <div class="card-header"><div><h3>Recent transactions</h3><p>Latest activity in your account</p></div><button class="icon-btn" data-route="transactions">↗</button></div>
      ${txRows()}
    </div>
  </div>`;
}

// VIEW 2: PORTFOLIO
function portfolio() {
  const total = portfolioTotal();
  return `${header('Workspace / portfolio', 'Portfolio overview', 'See how your current allocation is distributed across holdings and sectors.', '<button class="btn btn-primary" data-action="open-add-transaction">＋ Add transaction</button>')}
  <div class="two-col">
    <div class="card table-card">
      <div class="table-toolbar">
        <div><h3 style="margin:0;font:600 15px 'Space Grotesk'">Holdings <span class="subtle">${state.holdings.length} positions</span></h3></div>
        <div class="toolbar-left"><input class="search" id="holding-search" placeholder="⌕  Search holdings" /><select class="select" id="sector-filter"><option>All sectors</option><option>Technology</option><option>Financials</option><option>Energy</option><option>Consumer</option><option>Commodities</option></select></div>
      </div>
      <div class="table-wrap"><table><thead><tr><th>Holding</th><th>Qty</th><th>Avg. buy</th><th>Current</th><th>Value</th><th>Gain / loss</th><th>Portfolio</th></tr></thead><tbody id="holdings-body">${holdingRows(state.holdings, total)}</tbody></table></div>
    </div>
    <div class="card allocation-big">
      <div class="card-header"><div><h3>Sector exposure</h3><p>Current market value</p></div><span class="pill">5 sectors</span></div>
      ${sectorBars()}
    </div>
  </div>`;
}

function holdingRows(items, total) {
  return items.map(h => {
    const gain = (h.current - h.avg) * h.qty;
    const share = Math.round(holdingValue(h) / total * 100);
    return `<tr data-sector="${h.sector}"><td><div class="symbol-cell"><div class="coin">${h.symbol.slice(0, 3)}</div><div><strong>${h.symbol}</strong><div class="subtle">${h.company}</div></div></div></td><td>${h.qty}</td><td>${money(h.avg)}</td><td>${money(h.current)}</td><td>${money(holdingValue(h))}</td><td class="${gain >= 0 ? 'positive' : 'negative'}">${gain >= 0 ? '+' : ''}${money(gain)}</td><td>${share}% ${share > 30 ? '⚠️' : ''}</td></tr>`;
  }).join('');
}

function sectorBars() {
  const sectors = {};
  state.holdings.forEach(h => sectors[h.sector] = (sectors[h.sector] || 0) + holdingValue(h));
  const total = portfolioTotal();
  const colors = ['#b5f04b', '#55d9d2', '#a88cff', '#ffad5b', '#557188'];
  return `<div class="sector-bars">${Object.entries(sectors).map(([name, val], i) => `<div class="sector-row"><span>${name}</span><div class="sector-track"><span style="--c:${colors[i]};--w:${Math.round(val / total * 100)}%;background:${colors[i]}"></span></div><strong>${Math.round(val / total * 100)}%</strong></div>`).join('')}</div>`;
}

// VIEW 3: TRANSACTIONS
function transactions() {
  return `${header('Workspace / activity', 'Transactions', 'Every entry is part of the pattern. Add context as you go.', '<button class="btn btn-primary" data-action="open-add-transaction">＋ Add transaction</button>')}
  <div class="card table-card">
    <div class="table-toolbar">
      <div><h3 style="margin:0;font:600 15px 'Space Grotesk'">Activity log <span class="subtle">${state.transactions.length} transactions</span></h3></div>
      <div class="toolbar-left"><input class="search" id="tx-search" placeholder="⌕  Search activity" /><select class="select" id="tx-filter"><option>All activity</option><option>BUY</option><option>SELL</option></select></div>
    </div>
    <div class="table-wrap"><table><thead><tr><th>Transaction</th><th>Type</th><th>Quantity</th><th>Price</th><th>Total value</th><th>Date</th><th>Reason</th><th>Horizon</th></tr></thead><tbody id="tx-body">${transactionRows(state.transactions)}</tbody></table></div>
  </div>`;
}

function transactionRows(items) {
  return items.map(t => `<tr><td><div class="symbol-cell"><div class="coin">${t.symbol.slice(0, 3)}</div><div><strong>${t.symbol}</strong><div class="subtle">${t.company}</div></div></div></td><td><span class="pill ${t.type.toLowerCase()}">${t.type}</span></td><td>${t.qty}</td><td>${money(t.price)}</td><td>${money(t.qty * t.price)}</td><td>${t.date}</td><td>${t.reason}</td><td>${t.holding}</td></tr>`).join('') || `<tr><td colspan="8"><div class="empty-state">No transactions match this filter.</div></td></tr>`;
}

// VIEW 4: BEHAVIOR ANALYSIS
function analysis() {
  const cards = [
    ['FOMO-like Buying', 'Moderate', '↗', 'Possible FOMO-like buying pattern.', 'The purchase occurred shortly after a 9.8% positive price increase.', 'Was this purchase part of your original investment strategy?'],
    ['Panic-selling Pattern', 'Low', '↘', 'No strong panic-selling signal detected.', 'One sale followed a short-term decline, but trade velocity is within limits.', 'Did the underlying reason for owning the investment change?'],
    ['Overtrading', 'High', '↯', 'Potential overtrading pattern detected.', 'You executed 8 transactions in 10 days (baseline: 2 trades/week). Isolation Forest anomaly score: 0.82', 'Was each transaction part of a predefined strategy?'],
    ['Concentration', 'Moderate', '◒', 'Concentration threshold alert.', 'NVDA currently represents 34.8% of your total portfolio value (threshold: 30%).', 'Does this allocation match your intended portfolio strategy?'],
    ['Loss-aversion Pattern', 'Moderate', '◐', 'Possible loss-aversion pattern.', 'Tata Motors is below average buy price while your recorded thesis has not been refreshed.', 'Are you holding because it still fits your plan, or to break even?'],
    ['Market-timing Behavior', 'High', '⌁', 'Potential market-timing pattern.', 'Several recent transactions occurred within 48h of short-term volatility.', 'Are these trades part of a predefined strategy?']
  ];
  return `${header('Behavior Engine', 'Behavior Analysis', 'Rule-based signals and Isolation Forest ML anomaly scoring.', '<button class="btn btn-primary" data-action="run-analysis">◌ Run Pipeline</button>')}
  <div class="insight-strip">
    <div class="insight-icon">◎</div>
    <p><strong>Hybrid Detection Pipeline:</strong> Deterministic rules provide transparent thresholds; Isolation Forest ML evaluates statistical velocity anomalies ($s = 0.82$).</p>
  </div>
  <div class="analysis-grid">${cards.map(c => `<article class="card analysis-card"><div class="analysis-icon">${c[2]}</div><h3>${c[0]}</h3><div class="analysis-status ${c[1].toLowerCase()}" style="color:${c[1] === 'High' ? 'var(--red)' : c[1] === 'Moderate' ? 'var(--orange)' : 'var(--cyan)'}">${c[1]} signal</div><blockquote>“${c[3]}”</blockquote><span class="evidence-label">Evidence</span><p>${c[4]}</p><span class="evidence-label">Reflection</span><p class="reflection">${c[5]}</p></article>`).join('')}</div>`;
}

// VIEW 5: SMART ALERTS
function alerts() {
  return `${header('Workspace / alerts', 'Smart Alerts', 'A calm inbox for the patterns worth pausing on.', '<button class="btn btn-ghost" data-action="run-analysis">↻ Refresh alerts</button>')}
  <div class="alert-list">${state.alerts.map(a => `<article class="card alert-card ${a.status === 'reviewed' ? 'status-reviewed' : ''}"><div class="alert-icon">${a.icon}</div><div class="alert-copy"><h3>${a.title}</h3><div class="alert-meta"><span class="severity ${a.severity.toLowerCase()}">${a.severity}</span> · ${a.pattern} · ${a.date}${a.status === 'reviewed' ? ' · Reviewed ✓' : ''}</div><p>${a.desc}</p><div class="alert-evidence"><strong>Evidence:</strong> ${a.evidence}</div><p style="margin-top:11px;color:#d9e4ed"><strong>Reflect:</strong> <em>${a.reflection}</em></p></div><div class="alert-actions">${a.status === 'open' ? `<button class="btn btn-small btn-primary" data-action="review-alert" data-id="${a.id}">Mark reviewed</button>` : `<button class="btn btn-small" disabled>Reviewed ✓</button>`}</div></article>`).join('')}</div>`;
}

// VIEW 6: INVESTMENT JOURNAL
function journal() {
  const j = state.journal;
  return `${header('Plan & reflect', 'Investment Journal', 'Keep your original reasoning close to the actions that followed.', '<button class="btn btn-primary" data-action="save-journal">Save reflection</button>')}
  <div class="journal-grid">
    <div class="card journal-card">
      <div class="card-header"><div><h3>Investment entry</h3><p>Start with the plan, before the outcome.</p></div><span class="pill">Private</span></div>
      <label class="form-label">Holding</label><select class="form-select" id="journal-symbol"><option>${j.symbol} · NVIDIA Corp.</option><option>AAPL · Apple Inc.</option><option>TATAMOTORS · Tata Motors</option></select>
      <label class="form-label">Why am I investing?</label><textarea class="form-area" id="journal-thesis">${esc(j.thesis)}</textarea>
      <label class="form-label">Expected holding period</label><input class="form-field" id="journal-holding" value="${esc(j.holding)}"/>
      <label class="form-label">What would make me reconsider?</label><textarea class="form-area" id="journal-reconsider">${esc(j.reconsider)}</textarea>
    </div>
    <div class="card journal-card">
      <div class="card-header"><div><h3>Plan vs. action</h3><p>Notice the gap without judging it.</p></div><span class="pill">Reflection</span></div>
      <div class="thesis-compare"><div class="thesis-box"><h4>ORIGINAL THESIS</h4><p>${esc(j.thesis)}</p></div><div class="thesis-box"><h4>ACTUAL ACTION</h4><p>${esc(j.actual)}</p></div></div>
      <label class="form-label">Did your original investment thesis change?</label><select class="form-select" id="journal-changed"><option>${esc(j.changed)}</option><option>Yes — I updated my reasoning</option><option>No — the action matched my plan</option><option>I'm still reflecting</option></select>
      <label class="form-label">Afterward — what happened?</label><textarea class="form-area" id="journal-actual">${esc(j.actual)}</textarea>
      <button class="btn btn-primary" data-action="save-journal">Save reflection</button>
    </div>
  </div>`;
}

// VIEW 7: PLANNER
function planner() {
  const p = state.planner;
  return `${header('Plan & reflect', 'Investment Planner', 'Plan contributions using simple arithmetic — no assumed returns.', '<span class="pill">Non-Advisory Calculator</span>')}
  <div class="planner-grid">
    <div class="card planner-card">
      <div class="card-header"><div><h3>Your inputs</h3><p>Use monthly numbers in INR.</p></div></div>
      <label class="form-label">Monthly income</label><input type="number" class="form-field" id="plan-income" value="${p.income}"/>
      <label class="form-label">Monthly expenses</label><input type="number" class="form-field" id="plan-expenses" value="${p.expenses}"/>
      <label class="form-label">Existing savings</label><input type="number" class="form-field" id="plan-savings" value="${p.savings}"/>
      <label class="form-label">Desired monthly contribution</label><input type="number" class="form-field" id="plan-contribution" value="${p.contribution}"/>
      <label class="form-label">Investment horizon</label><select class="form-select" id="plan-horizon"><option value="1">1 year</option><option value="3">3 years</option><option value="5" selected>5 years</option></select>
      <button class="btn btn-primary" data-action="calculate-plan">Calculate contribution plan</button>
    </div>
    <div class="card planner-card">
      <div class="card-header"><div><h3>Contribution view</h3><p>Based on your desired monthly contribution.</p></div><span class="pill">Educational</span></div>
      <div class="insight-strip"><div class="insight-icon">⌁</div><p><strong>Available after expenses: ${money(p.income - p.expenses)}</strong><br/>Your planned contribution is ${Math.round(p.contribution / (p.income - p.expenses) * 100)}% of that amount.</p></div>
      <div class="planner-result">
        <div class="contrib-card"><small>1 year</small><strong>${money(p.contribution * 12)}</strong></div>
        <div class="contrib-card"><small>3 years</small><strong>${money(p.contribution * 36)}</strong></div>
        <div class="contrib-card"><small>5 years</small><strong>${money(p.contribution * 60)}</strong></div>
      </div>
      <p class="subtle" style="margin-top:21px;line-height:1.7">These are contribution totals only. InvestGuard does not assume or promise investment returns.</p>
    </div>
  </div>`;
}

// VIEW 8: LEARN
function learn() {
  const lessons = [
    ['↗', 'FOMO Buying', 'When a price move makes an investment feel urgent.', 'A stock jumps 10% and you buy quickly, even though it was not in your plan.', 'What would you do differently with a 24-hour pause?'],
    ['↘', 'Panic Selling', 'Selling soon after a sharp decline without checking the original thesis.', 'A short-term dip causes you to exit a long-term position.', 'Did the reason you owned it actually change?'],
    ['↯', 'Overtrading', 'Trading more frequently than your own usual pattern.', 'Eight trades in a week when your baseline is two.', 'Was every transaction part of a defined strategy?'],
    ['◒', 'Concentration', 'A large share of portfolio value sits in one holding or sector.', 'One stock grows to 42% of the portfolio.', 'Does this allocation match your intended plan?'],
    ['◐', 'Loss Aversion', 'Holding mainly to avoid realizing a loss, even as the thesis changes.', 'A declining position stays open after its original reasons fade.', 'What evidence would make you reconsider?'],
    ['⌁', 'Market Timing', 'Repeatedly trading around short-term price movements.', 'Buying after rises and selling after dips in a repeating cycle.', 'Could a predefined rule make this clearer?']
  ];
  return `${header('Learn', 'Build a calmer investing practice.', 'Short, practical lessons for recognizing cognitive biases.')}<div class="learn-grid">${lessons.map(l => `<article class="card lesson"><div class="lesson-icon">${l[0]}</div><h3>${l[1]}</h3><p><strong style="color:#d9e5ed">${l[2]}</strong><br/><br/>${l[3]}</p><a href="#" data-action="lesson-toast">Reflect on this →</a></article>`).join('')}</div>`;
}

// FULL UNTRUNCATED MARKDOWN PARSER
function parseMarkdown(md) {
  if (!md) return '';
  let html = md;
  
  // Protect code blocks
  const codeBlocks = [];
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
    codeBlocks.push(code);
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
  
  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Tables
  html = html.replace(/^\|(.*)\|$/gim, (match) => {
    const cells = match.split('|').filter(c => c.trim().length > 0);
    if (cells.some(c => c.includes('---'))) return '';
    return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
  });
  html = html.replace(/(<tr>[\s\S]*?<\/tr>)/g, '<table class="markdown-table">$1</table>');

  // Restore Code Blocks
  html = html.replace(/___CODE_BLOCK_(\d+)___/g, (_, index) => {
    return `<pre><code>${esc(codeBlocks[index])}</code></pre>`;
  });

  // Paragraphs
  html = html.split('\n\n').map(p => {
    if (p.trim().startsWith('<h') || p.trim().startsWith('<pre') || p.trim().startsWith('<blockquote') || p.trim().startsWith('<table')) {
      return p;
    }
    return `<p>${p.trim()}</p>`;
  }).join('');

  return html;
}

// VIEW 9: INTEGRATED DOCUMENTATION & HACKATHON REPORT VIEWER
function docsView() {
  const docs = window.INVESTGUARD_DOCS || {};
  const currentDocMd = activeDocSubtab === 'report' ? docs.report : docs.readme;
  const renderedHtml = parseMarkdown(currentDocMd);

  return `<div class="docs-header">
    <div class="eyebrow">Hefty Hacks 2026 Submission</div>
    <h1>InvestGuard Documentation & Project Report</h1>
    <p>Read the complete technical report, architecture diagrams, ML formulations, and GitHub README.</p>
  </div>
  
  <div class="docs-tabs">
    <button class="doc-tab report-tab ${activeDocSubtab === 'report' ? 'active' : ''}" data-doc="report">🏆 Hackathon Project Report (27 Sections)</button>
    <button class="doc-tab ${activeDocSubtab === 'readme' ? 'active' : ''}" data-doc="readme">📘 GitHub README.md</button>
  </div>
  
  <div class="card doc-viewer-card">
    <div class="markdown-body" id="doc-content">
      ${renderedHtml}
    </div>
  </div>`;
}

function render() {
  const views = {
    landing: dashboard,
    dashboard,
    portfolio,
    transactions,
    analysis,
    alerts,
    journal,
    planner,
    learn,
    docs: docsView
  };
  root.innerHTML = (views[currentRoute] || dashboard)();
  bindEvents();
  updateCounts();
}

function updateCounts() {
  document.querySelectorAll('.alert-count').forEach(e => e.textContent = state.alerts.filter(a => a.status === 'open').length);
  document.querySelectorAll('.tx-count').forEach(e => e.textContent = state.transactions.length);
}

function bindEvents() {
  document.querySelectorAll('[data-route]').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    setRoute(el.dataset.route);
  }));

  document.querySelectorAll('[data-doc]').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    activeDocSubtab = el.dataset.doc;
    render();
  }));

  document.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    const a = el.dataset.action;
    if (a === 'open-sidebar') document.getElementById('sidebar').classList.add('open');
    if (a === 'close-sidebar') document.getElementById('sidebar').classList.remove('open');
    if (a === 'run-analysis') {
      showToast('Behavioral analysis complete — Isolation Forest score: 0.82.');
      setRoute('analysis');
    }
    if (a === 'reset-demo') {
      state = deepClone(seed);
      save();
      setRoute('dashboard');
      showToast('Demo data reset to initial state.');
    }
    if (a === 'open-add-transaction') openTransactionModal();
    if (a === 'review-alert') {
      const alert = state.alerts.find(x => x.id == el.dataset.id);
      if (alert) {
        alert.status = 'reviewed';
        save();
        render();
        showToast('Alert marked as reviewed.');
      }
    }
    if (a === 'save-journal') saveJournal();
    if (a === 'calculate-plan') calculatePlan();
    if (a === 'lesson-toast') showToast('Reflection prompt saved.');
  }));

  const hs = document.getElementById('holding-search');
  if (hs) hs.addEventListener('input', filterHoldings);
  const sf = document.getElementById('sector-filter');
  if (sf) sf.addEventListener('change', filterHoldings);
  const ts = document.getElementById('tx-search');
  if (ts) ts.addEventListener('input', filterTransactions);
  const tf = document.getElementById('tx-filter');
  if (tf) tf.addEventListener('change', filterTransactions);
}

function filterHoldings() {
  const q = (document.getElementById('holding-search')?.value || '').toLowerCase();
  const sector = document.getElementById('sector-filter')?.value || 'All sectors';
  const items = state.holdings.filter(h => (h.symbol + h.company).toLowerCase().includes(q) && (sector === 'All sectors' || h.sector === sector));
  document.getElementById('holdings-body').innerHTML = holdingRows(items, portfolioTotal());
}

function filterTransactions() {
  const q = (document.getElementById('tx-search')?.value || '').toLowerCase();
  const type = document.getElementById('tx-filter')?.value || 'All activity';
  const items = state.transactions.filter(t => (t.symbol + t.company + t.reason).toLowerCase().includes(q) && (type === 'All activity' || t.type === type));
  document.getElementById('tx-body').innerHTML = transactionRows(items);
}

function openTransactionModal() {
  const m = document.getElementById('modal');
  document.getElementById('modal-backdrop').hidden = false;
  m.innerHTML = `<div class="modal-header"><h2>Add Transaction</h2><button class="modal-close" data-action="close-modal">×</button></div>
  <p class="subtle" style="margin:-8px 0 18px">Adding trade context helps the behavior engine detect underlying patterns.</p>
  <div class="form-grid">
    <div><label class="form-label">Symbol</label><input class="form-field" id="new-symbol" placeholder="e.g. AAPL"/></div>
    <div><label class="form-label">Company</label><input class="form-field" id="new-company" placeholder="Company Name"/></div>
    <div><label class="form-label">Action</label><select class="form-select" id="new-type"><option>BUY</option><option>SELL</option></select></div>
    <div><label class="form-label">Quantity</label><input type="number" class="form-field" id="new-qty" value="1" min="1"/></div>
    <div><label class="form-label">Price (₹)</label><input type="number" class="form-field" id="new-price" placeholder="0" min="0"/></div>
    <div><label class="form-label">Date</label><input type="date" class="form-field" id="new-date" value="2026-09-19"/></div>
    <div class="full"><label class="form-label">Reason / Context</label><input class="form-field" id="new-reason" placeholder="Why are you making this trade?"/></div>
  </div>
  <div class="modal-actions">
    <button class="btn" data-action="close-modal">Cancel</button>
    <button class="btn btn-primary" data-action="save-transaction">Save Transaction</button>
  </div>`;
  
  m.querySelectorAll('[data-action="close-modal"]').forEach(b => b.addEventListener('click', closeModal));
  m.querySelector('[data-action="save-transaction"]').addEventListener('click', saveTransaction);
}

function closeModal() {
  document.getElementById('modal-backdrop').hidden = true;
}

function saveTransaction() {
  const symbol = document.getElementById('new-symbol').value.trim().toUpperCase();
  const company = document.getElementById('new-company').value.trim() || symbol;
  const qty = Number(document.getElementById('new-qty').value);
  const price = Number(document.getElementById('new-price').value);

  if (!symbol || !qty || !price) {
    showToast('Please specify symbol, quantity, and price.', 'note');
    return;
  }

  state.transactions.unshift({
    id: Date.now(),
    symbol,
    company,
    type: document.getElementById('new-type').value,
    qty,
    price,
    date: document.getElementById('new-date').value,
    reason: document.getElementById('new-reason').value || 'Recorded trade',
    holding: 'Short term'
  });

  save();
  closeModal();
  setRoute('transactions');
  showToast('Transaction saved — Isolation Forest pipeline updated.');
}

function saveJournal() {
  state.journal = {
    symbol: document.getElementById('journal-symbol')?.value.split(' ')[0] || state.journal.symbol,
    thesis: document.getElementById('journal-thesis')?.value || state.journal.thesis,
    holding: document.getElementById('journal-holding')?.value || state.journal.holding,
    reconsider: document.getElementById('journal-reconsider')?.value || state.journal.reconsider,
    actual: document.getElementById('journal-actual')?.value || state.journal.actual,
    changed: document.getElementById('journal-changed')?.value || state.journal.changed
  };
  save();
  render();
  showToast('Investment journal reflection saved.');
}

function calculatePlan() {
  const income = Number(document.getElementById('plan-income').value);
  const expenses = Number(document.getElementById('plan-expenses').value);
  const contribution = Number(document.getElementById('plan-contribution').value);
  state.planner = {
    income,
    expenses,
    savings: Number(document.getElementById('plan-savings').value),
    contribution,
    horizon: Number(document.getElementById('plan-horizon').value)
  };
  save();
  render();
  showToast('Contribution plan recalculated.');
}

document.getElementById('modal-backdrop').addEventListener('click', e => {
  if (e.target.id === 'modal-backdrop') closeModal();
});

// INITIAL RENDER
render();
