export interface Holding {
  id: number;
  user_id: number;
  symbol: string;
  company: string;
  quantity: number;
  average_buy_price: number;
  current_price: number;
  current_value: number;
  gain_loss: number;
  gain_loss_percent: number;
  portfolio_percent: number;
  sector: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  symbol: string;
  company: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  date: string;
  reason?: string;
  expected_holding_period?: string;
  total_amount: number;
}

export interface Alert {
  id: number;
  user_id: number;
  pattern_type: string;
  title: string;
  description: string;
  evidence: string;
  reflection_question: string;
  severity: 'Low' | 'Moderate' | 'High';
  status: 'Unread' | 'Reviewed' | 'Dismissed';
  created_at: string;
}

export interface JournalEntry {
  id: number;
  user_id: number;
  symbol: string;
  thesis: string;
  holding_period: string;
  reconsider_condition: string;
  reflection?: string;
  created_at: string;
}

export interface PlannerData {
  id: number;
  user_id: number;
  monthly_income: number;
  monthly_expenses: number;
  existing_savings: number;
  desired_contribution: number;
  horizon_years: number;
  available_monthly: number;
  total_1yr: number;
  total_3yr: number;
  total_5yr: number;
  created_at: string;
}

export interface PortfolioSummary {
  portfolio_value: number;
  todays_change: number;
  todays_change_percent: number;
  total_gain_loss: number;
  total_gain_loss_percent: number;
  holdings_count: number;
  alerts_count: number;
  transactions_count: number;
  holdings: Holding[];
  sector_breakdown: { sector: string; value: number; percentage: number }[];
}

export interface BehaviorAnalysisResult {
  ml_analysis: {
    is_anomaly: boolean;
    anomaly_score: number;
    explanation: string;
    features: Record<string, number>;
    anomalous_features: string[];
  };
  rule_analysis: {
    alerts: Array<{
      pattern_type: string;
      title: string;
      description: string;
      evidence: string;
      reflection_question: string;
      severity: 'Low' | 'Moderate' | 'High';
    }>;
    total_portfolio_val: number;
    recent_tx_count: number;
  };
  behavioral_matrix: Record<string, string>;
  active_patterns_count: number;
}

export interface MarketQuote {
  symbol: string;
  company: string;
  current_price: number;
  change: number;
  change_percent: number;
  volume: number;
  high_52w: number;
  low_52w: number;
  sector: string;
}
