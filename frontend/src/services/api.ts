import { PortfolioSummary, Holding, Transaction, Alert, JournalEntry, PlannerData, BehaviorAnalysisResult, MarketQuote } from '../types';

const API_BASE = '/api';

export async function fetchPortfolio(): Promise<PortfolioSummary> {
  try {
    const res = await fetch(`${API_BASE}/portfolio`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API connection offline, using fallback client data', e);
  }
  return {
    portfolio_value: 124500,
    todays_change: 1250,
    todays_change_percent: 1.02,
    total_gain_loss: 18450,
    total_gain_loss_percent: 17.4,
    holdings_count: 5,
    alerts_count: 3,
    transactions_count: 11,
    holdings: [
      { id: 1, user_id: 1, symbol: 'NVDA', company: 'NVIDIA Corporation', quantity: 400, average_buy_price: 98.5, current_price: 128.4, current_value: 51360, gain_loss: 11960, gain_loss_percent: 30.35, portfolio_percent: 41.25, sector: 'Semiconductors' },
      { id: 2, user_id: 1, symbol: 'AAPL', company: 'Apple Inc.', quantity: 120, average_buy_price: 210, current_price: 224.5, current_value: 26940, gain_loss: 1740, gain_loss_percent: 6.9, portfolio_percent: 21.64, sector: 'Technology' },
      { id: 3, user_id: 1, symbol: 'MSFT', company: 'Microsoft Corp.', quantity: 45, average_buy_price: 430, current_price: 448.2, current_value: 20169, gain_loss: 819, gain_loss_percent: 4.23, portfolio_percent: 16.2, sector: 'Technology' },
      { id: 4, user_id: 1, symbol: 'AMZN', company: 'Amazon.com Inc.', quantity: 70, average_buy_price: 175, current_price: 186.3, current_value: 13041, gain_loss: 791, gain_loss_percent: 6.46, portfolio_percent: 10.47, sector: 'Consumer Discretionary' },
      { id: 5, user_id: 1, symbol: 'TSLA', company: 'Tesla, Inc.', quantity: 50, average_buy_price: 275, current_price: 248.8, current_value: 12440, gain_loss: -1310, gain_loss_percent: -9.53, portfolio_percent: 9.99, sector: 'Automotive' },
    ],
    sector_breakdown: [
      { sector: 'Semiconductors', value: 51360, percentage: 41.25 },
      { sector: 'Technology', value: 47109, percentage: 37.84 },
      { sector: 'Consumer Discretionary', value: 13041, percentage: 10.47 },
      { sector: 'Automotive', value: 12440, percentage: 9.99 }
    ]
  };
}

export async function fetchHoldings(): Promise<Holding[]> {
  try {
    const res = await fetch(`${API_BASE}/holdings`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API offline', e);
  }
  const summary = await fetchPortfolio();
  return summary.holdings;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const res = await fetch(`${API_BASE}/transactions`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API offline', e);
  }
  return [
    { id: 1, user_id: 1, symbol: 'AAPL', company: 'Apple Inc.', type: 'BUY', quantity: 15, price: 224.5, date: new Date(Date.now() - 86400000).toISOString(), reason: 'Felt like adding size', expected_holding_period: 'Unknown', total_amount: 3367.5 },
    { id: 2, user_id: 1, symbol: 'GOOGL', company: 'Alphabet Inc.', type: 'SELL', quantity: 40, price: 178.9, date: new Date(Date.now() - 172800000).toISOString(), reason: 'Exited early before news', expected_holding_period: '1 day', total_amount: 7156 },
    { id: 3, user_id: 1, symbol: 'NVDA', company: 'NVIDIA Corporation', type: 'BUY', quantity: 150, price: 128.4, date: new Date(Date.now() - 172800000).toISOString(), reason: 'Rallied 8% today, momentum looks explosive', expected_holding_period: '6 months', total_amount: 19260 },
    { id: 4, user_id: 1, symbol: 'TATAMOTORS', company: 'Tata Motors Ltd.', type: 'SELL', quantity: 100, price: 985.4, date: new Date(Date.now() - 259200000).toISOString(), reason: 'Stock fell steeply this morning, cutting losses', expected_holding_period: 'Sold after 3 days', total_amount: 98540 }
  ];
}

export async function addTransaction(tx: Omit<Transaction, 'id' | 'user_id' | 'total_amount' | 'date'> & { date?: string }): Promise<Transaction> {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tx)
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to add transaction');
}

export async function deleteTransaction(id: number): Promise<void> {
  await fetch(`${API_BASE}/transactions/${id}`, { method: 'DELETE' });
}

export async function fetchBehaviorAnalysis(): Promise<BehaviorAnalysisResult> {
  try {
    const res = await fetch(`${API_BASE}/behavior-analysis`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API offline', e);
  }
  return {
    ml_analysis: {
      is_anomaly: true,
      anomaly_score: -0.6466,
      explanation: 'Your recent activity differs significantly from your historical transaction pattern.',
      features: { trades_per_week: 8, portfolio_concentration: 41.2, buy_after_price_change: 7.3, short_term_trade_ratio: 0.65 },
      anomalous_features: [
        'Weekly trade frequency (8 trades/week vs baseline 1.5)',
        'Single holding concentration (41.2% vs baseline <20%)',
        'Purchasing after steep price movement (+7.3% gain)'
      ]
    },
    rule_analysis: {
      alerts: [
        { pattern_type: 'Concentration', title: 'Concentration Alert', description: 'Single asset > 30%', evidence: '41.2% of portfolio allocated to NVDA', reflection_question: 'Does this single-holding allocation match your intended strategy?', severity: 'High' },
        { pattern_type: 'Overtrading', title: 'Potential Overtrading Pattern', description: 'High trade velocity', evidence: '8 transactions in 5 days vs baseline 1.8 trades/week', reflection_question: 'Was each transaction part of a predefined strategy?', severity: 'High' }
      ],
      total_portfolio_val: 124500,
      recent_tx_count: 8
    },
    behavioral_matrix: {
      'FOMO-like Buying': 'Moderate',
      'Panic Selling': 'Low',
      'Overtrading': 'High',
      'Concentration': 'High',
      'Loss Aversion': 'Moderate',
      'Market Timing': 'High'
    },
    active_patterns_count: 3
  };
}

export async function runBehaviorAnalysis(): Promise<any> {
  const res = await fetch(`${API_BASE}/behavior-analysis/run`, { method: 'POST' });
  if (res.ok) return await res.json();
  throw new Error('Failed to run behavioral analysis');
}

export async function fetchAlerts(status?: string): Promise<Alert[]> {
  try {
    const url = status ? `${API_BASE}/alerts?status_filter=${status}` : `${API_BASE}/alerts`;
    const res = await fetch(url);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API offline', e);
  }
  return [
    {
      id: 1, user_id: 1, pattern_type: 'Concentration', title: 'Concentration Alert',
      description: 'Single asset represents over 30% of total portfolio valuation.',
      evidence: '41.2% of your portfolio is currently allocated to NVDA (NVIDIA Corporation).',
      reflection_question: 'Does this single-holding allocation match your intended portfolio strategy?',
      severity: 'High', status: 'Unread', created_at: new Date(Date.now() - 18000000).toISOString()
    },
    {
      id: 2, user_id: 1, pattern_type: 'Overtrading', title: 'Potential Overtrading Pattern',
      description: 'Unusually high transaction velocity compared to historical baseline.',
      evidence: 'You made 8 transactions during the last 5 days compared with your recent average of 1.8 trades/week.',
      reflection_question: 'Was each transaction part of a predefined strategy?',
      severity: 'High', status: 'Unread', created_at: new Date(Date.now() - 10800000).toISOString()
    },
    {
      id: 3, user_id: 1, pattern_type: 'FOMO-like Buying', title: 'Possible FOMO-like Buying Pattern',
      description: 'Purchase executed immediately following a steep single-day price gain.',
      evidence: 'The purchase of NVDA occurred shortly after a significant price increase of +7.3%.',
      reflection_question: 'Was this purchase part of your original investment strategy?',
      severity: 'Moderate', status: 'Unread', created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ];
}

export async function updateAlertStatus(id: number, status: 'Unread' | 'Reviewed' | 'Dismissed'): Promise<Alert> {
  const res = await fetch(`${API_BASE}/alerts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to update alert');
}

export async function fetchJournal(): Promise<JournalEntry[]> {
  try {
    const res = await fetch(`${API_BASE}/journal`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API offline', e);
  }
  return [
    {
      id: 1, user_id: 1, symbol: 'TATAMOTORS',
      thesis: 'Long-term fundamental thesis based on EV production expansion and commercial vehicle demand.',
      holding_period: '2-3 Years',
      reconsider_condition: 'Reconsider if EV gross margins drop below 12%.',
      reflection: 'Sold entire position after 3 days following a 5.9% morning price pullback. Original thesis was untouched.',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];
}

export async function addJournal(entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at'>): Promise<JournalEntry> {
  const res = await fetch(`${API_BASE}/journal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to add journal entry');
}

export async function fetchPlanner(): Promise<PlannerData> {
  try {
    const res = await fetch(`${API_BASE}/planner`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API offline', e);
  }
  return {
    id: 1, user_id: 1, monthly_income: 125000, monthly_expenses: 75000, existing_savings: 350000,
    desired_contribution: 25000, horizon_years: 5, available_monthly: 50000,
    total_1yr: 300000, total_3yr: 900000, total_5yr: 1500000, created_at: new Date().toISOString()
  };
}

export async function savePlanner(data: { monthly_income: number; monthly_expenses: number; existing_savings: number; desired_contribution: number; horizon_years: number }): Promise<PlannerData> {
  const res = await fetch(`${API_BASE}/planner`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (res.ok) return await res.json();
  throw new Error('Failed to save planner data');
}

export async function resetDemo(): Promise<void> {
  await fetch(`${API_BASE}/demo/reset`, { method: 'POST' });
}
