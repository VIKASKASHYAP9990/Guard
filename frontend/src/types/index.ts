// ============================================================
// InvestGuard — Unified TypeScript Type Definitions
// Complete domain types for behavioral investment analysis platform
// ============================================================

export type TradeType = 'BUY' | 'SELL';
export type AlertSeverity = 'LOW' | 'MODERATE' | 'HIGH';
export type AlertStatus = 'NEW' | 'REVIEWED' | 'DISMISSED';
export type IndicatorLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'INSUFFICIENT_DATA';
export type ThemeMode = 'light' | 'dark' | 'system';
export type ScenarioType =
  | 'DEFAULT'
  | 'FOMO_SURGE'
  | 'OVERTRADING_STORM'
  | 'TECH_CONCENTRATION'
  | 'PANIC_DUMP'
  | 'LOSS_AVERSION_TRAP'
  | 'MARKET_TIMING_CHURN';

export type PatternType =
  | 'FOMO_BUYING'
  | 'OVERTRADING'
  | 'CONCENTRATION'
  | 'PANIC_SELLING'
  | 'LOSS_AVERSION'
  | 'MARKET_TIMING';

export type HoldingPeriod =
  | 'LESS_THAN_1_MONTH'
  | '1_TO_6_MONTHS'
  | '6_TO_12_MONTHS'
  | '1_TO_3_YEARS'
  | '3_PLUS_YEARS';

export type InvestingReason =
  | 'Long-term growth'
  | 'Valuation'
  | 'Dividend'
  | 'Short-term opportunity'
  | 'Portfolio allocation'
  | 'Other';

export interface PricePoint {
  date: string;
  close: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export interface FictionalTicker {
  ticker: string;
  name: string;
  sector: string;
  initialPrice: number;
  volatility: number;
  description: string;
}

export interface Transaction {
  id: string;
  ticker: string;
  name: string;
  type: TradeType;
  quantity: number;
  price: number;
  amount: number;
  date: string;
  notes?: string;
  sector?: string;
  reason?: string;
  intendedHoldingPeriod?: string;
}

export interface Holding {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  currentValue: number;
  investedValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  allocationPercent: number;
  sector: string;
  priceChange24h?: number;
  priceChange24hPercent?: number;
}

export interface BehavioralExplanation {
  definition: string;
  whyItHappens: string;
  whatEvidenceShows: string;
  whatThisMeans: string;
  whatToConsider: string[];
  whatToAvoid: string[];
}

export interface BehavioralAlert {
  id: string;
  patternType: PatternType;
  title: string;
  severity: AlertSeverity;
  detectedAt: string;
  ticker?: string;
  description: string;
  evidence: string;
  explanation: BehavioralExplanation;
  reflectionQuestion: string;
  status: AlertStatus;
  metrics?: Record<string, any>;
}

export interface BehavioralIndicator {
  pattern: PatternType;
  name: string;
  level: IndicatorLevel;
  score: number;
  description: string;
  alertCount: number;
}

export interface BehaviorReport {
  behavioralScore: number;
  riskScore: number;
  diversificationScore: number;
  alerts: BehavioralAlert[];
  indicators: BehavioralIndicator[];
  summary: string;
  evaluatedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  ticker: string;
  action: TradeType;
  thesis: string;
  reason: InvestingReason;
  intendedHoldingPeriod: HoldingPeriod;
  emotionalState?: string;
  actualHoldingPeriodDays?: number;
  outcomePnl?: number;
  outcomeNotes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PlannerGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  expectedReturnRate: number;
  category: string;
  notes?: string;
}

export interface DetectionConfig {
  fomoPriceSurgeThreshold: number;
  fomoLookbackDays: number;
  overtradingTradeCountThreshold: number;
  overtradingWindowDays: number;
  concentrationThreshold: number;
  panicDropThreshold: number;
  panicLookbackDays: number;
  lossAversionDrawdownThreshold: number;
  lossAversionDaysHeldThreshold: number;
  marketTimingWindowDays: number;
  riskTolerance: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  riskTolerance: 'LOW' | 'MODERATE' | 'HIGH';
  theme: ThemeMode;
  createdAt: string;
}

export interface StorageState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  activeScenario: ScenarioType;
  transactions: Transaction[];
  holdings: Holding[];
  alerts: BehavioralAlert[];
  journalEntries: JournalEntry[];
  goals: PlannerGoal[];
  detectionConfig: DetectionConfig;
  theme: ThemeMode;
  lastAnalyzedAt: string | null;
}
