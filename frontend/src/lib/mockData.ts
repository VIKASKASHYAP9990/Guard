// ============================================================
// InvestGuard — Seeded Price Generator & Demo Scenarios
// Deterministic pseudo-random price generator (mulberry32)
// generates 180 days of daily close prices for 12 fictional tickers.
// Provides 7 scripted scenarios to trigger the 6 behavioral patterns.
// ============================================================

import {
  FictionalTicker,
  PricePoint,
  Transaction,
  Holding,
  JournalEntry,
  PlannerGoal,
  UserProfile,
  DetectionConfig,
  ScenarioType,
} from '../types';

// ============================================================
// 12 Fictional Indian Market Tickers
// ============================================================

export const FICTIONAL_TICKERS: FictionalTicker[] = [
  {
    ticker: 'INDO_TECH',
    name: 'IndoTech Solutions Ltd',
    sector: 'Information Technology',
    initialPrice: 1450,
    volatility: 0.022,
    description: 'Enterprise cloud services and AI infrastructure provider.',
  },
  {
    ticker: 'BHARAT_POWER',
    name: 'Bharat Green Power Corp',
    sector: 'Renewable Energy',
    initialPrice: 320,
    volatility: 0.028,
    description: 'Solar utility developer and transmission operator.',
  },
  {
    ticker: 'MUMBAI_FIN',
    name: 'Mumbai Financial Services',
    sector: 'Banking & Financials',
    initialPrice: 890,
    volatility: 0.018,
    description: 'Retail and MSME credit financing institution.',
  },
  {
    ticker: 'DECCAN_AUTO',
    name: 'Deccan Mobility Motors',
    sector: 'Automotive',
    initialPrice: 640,
    volatility: 0.025,
    description: 'Electric commercial vehicle and two-wheeler manufacturer.',
  },
  {
    ticker: 'GEL_PHARMA',
    name: 'Global Equities LifeSciences',
    sector: 'Healthcare & Pharma',
    initialPrice: 1120,
    volatility: 0.019,
    description: 'Active pharmaceutical ingredients and biosimilars research.',
  },
  {
    ticker: 'VAYU_AIR',
    name: 'Vayu Express Logistics',
    sector: 'Transportation',
    initialPrice: 280,
    volatility: 0.032,
    description: 'Express multimodal freight and air cargo logistics.',
  },
  {
    ticker: 'HIND_RETAIL',
    name: 'Hindustan Consumer Brands',
    sector: 'Consumer Goods',
    initialPrice: 2150,
    volatility: 0.014,
    description: 'Packaged foods, personal hygiene and household FMCG.',
  },
  {
    ticker: 'ZEN_ENERGY',
    name: 'Zenith Clean Energy Ltd',
    sector: 'Renewable Energy',
    initialPrice: 175,
    volatility: 0.035,
    description: 'Wind turbine engineering and grid battery storage.',
  },
  {
    ticker: 'KRISHNA_AGRO',
    name: 'Krishna Agri-Nutrition',
    sector: 'Agriculture & Chemicals',
    initialPrice: 530,
    volatility: 0.021,
    description: 'Bio-fertilizers, seeds, and smart irrigation equipment.',
  },
  {
    ticker: 'SURYA_INFRA',
    name: 'Surya Infrastructure EPC',
    sector: 'Infrastructure',
    initialPrice: 410,
    volatility: 0.026,
    description: 'Highways, metro rail tunnels, and port infrastructure.',
  },
  {
    ticker: 'KAVERI_CEMENT',
    name: 'Kaveri Cement Industries',
    sector: 'Materials',
    initialPrice: 780,
    volatility: 0.020,
    description: 'Sustainable low-carbon concrete and building materials.',
  },
  {
    ticker: 'DELTA_DIGITAL',
    name: 'Delta Digital Payments',
    sector: 'Fintech',
    initialPrice: 960,
    volatility: 0.030,
    description: 'UPI merchant acquiring and payment gateway software.',
  },
];

// ============================================================
// Deterministic Mulberry32 PRNG
// ============================================================

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate 180 trading days ending at today
const NUM_DAYS = 180;
const priceHistoryCache: Record<string, PricePoint[]> = {};

function initPriceData() {
  const today = new Date('2026-03-15'); // Fixed reference anchor for deterministic reproducible demo

  FICTIONAL_TICKERS.forEach((tickerObj, index) => {
    const rng = mulberry32(1000 + index * 37);
    const history: PricePoint[] = [];
    let current = tickerObj.initialPrice;

    for (let d = NUM_DAYS; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      const dateStr = date.toISOString().split('T')[0];

      // Daily drift + noise
      const drift = 0.0004; // slight upward long-term equity drift
      const shock = (rng() - 0.49) * 2 * tickerObj.volatility;
      current = Math.max(10, current * (1 + drift + shock));

      history.push({
        date: dateStr,
        close: Math.round(current * 100) / 100,
        open: Math.round(current * 0.995 * 100) / 100,
        high: Math.round(current * 1.015 * 100) / 100,
        low: Math.round(current * 0.985 * 100) / 100,
        volume: Math.floor(rng() * 500000 + 100000),
      });
    }

    priceHistoryCache[tickerObj.ticker] = history;
  });
}

initPriceData();

export function getPriceHistory(ticker: string): PricePoint[] {
  return priceHistoryCache[ticker] || [];
}

export function getLatestPrice(ticker: string): number {
  const history = priceHistoryCache[ticker];
  if (!history || history.length === 0) {
    const stock = FICTIONAL_TICKERS.find((t) => t.ticker === ticker);
    return stock?.initialPrice || 100;
  }
  return history[history.length - 1].close;
}

// ============================================================
// Initial User Profile & Config
// ============================================================

export const INITIAL_PROFILE: UserProfile = {
  id: 'usr_demo_01',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  riskTolerance: 'MODERATE',
  theme: 'dark',
  createdAt: '2025-09-01T00:00:00Z',
};

export const DEFAULT_CONFIG: DetectionConfig = {
  fomoPriceSurgeThreshold: 8,
  fomoLookbackDays: 5,
  overtradingTradeCountThreshold: 5,
  overtradingWindowDays: 3,
  concentrationThreshold: 25,
  panicDropThreshold: 7,
  panicLookbackDays: 3,
  lossAversionDrawdownThreshold: 15,
  lossAversionDaysHeldThreshold: 45,
  marketTimingWindowDays: 7,
  riskTolerance: 'MODERATE',
};

// ============================================================
// 7 Demo Scenarios (Scripted to demonstrate the 6 detectors)
// ============================================================

export interface ScenarioMeta {
  id: ScenarioType;
  name: string;
  description: string;
  primaryBias: string;
}

export const SCENARIOS: ScenarioMeta[] = [
  {
    id: 'DEFAULT',
    name: 'Multi-Pattern Portfolio',
    description: 'Realistic portfolio showcasing multiple mild behavioral observations.',
    primaryBias: 'Mixed Behavioral Signals',
  },
  {
    id: 'FOMO_SURGE',
    name: 'FOMO Buying Surge',
    description: 'Buys executed immediately following rapid multi-day price rallies in IndoTech & Zen Energy.',
    primaryBias: 'FOMO Buying',
  },
  {
    id: 'OVERTRADING_STORM',
    name: 'Hyperactive Overtrading',
    description: '9 aggressive trades executed across a 48-hour volatility spike.',
    primaryBias: 'Overtrading',
  },
  {
    id: 'TECH_CONCENTRATION',
    name: 'Tech Concentration Risk',
    description: 'Over 48% of total portfolio capital allocated into IndoTech Solutions.',
    primaryBias: 'Concentration Alert',
  },
  {
    id: 'PANIC_DUMP',
    name: 'Panic Selling Bottoms',
    description: 'Liquidations executed at the bottom of steep temporary corrections.',
    primaryBias: 'Panic Selling',
  },
  {
    id: 'LOSS_AVERSION_TRAP',
    name: 'Loss Aversion / Drawdown',
    description: 'Holding deep 28% unrealized losses for 60+ days refusing to realize.',
    primaryBias: 'Loss Aversion',
  },
  {
    id: 'MARKET_TIMING_CHURN',
    name: 'Market Timing Reversals',
    description: 'Rapid buy-then-sell roundtrips within 2 to 4 days trying to catch tops.',
    primaryBias: 'Market Timing',
  },
];

// Scripted scenario transactions
export function getScenarioTransactions(scenario: ScenarioType): Transaction[] {
  switch (scenario) {
    case 'FOMO_SURGE':
      return [
        {
          id: 'tx_fomo_01',
          ticker: 'INDO_TECH',
          name: 'IndoTech Solutions Ltd',
          sector: 'Information Technology',
          type: 'BUY',
          quantity: 35,
          price: 1620,
          amount: 56700,
          date: '2026-03-08',
          notes: 'Bought after 12% rally in 4 days.',
          reason: 'Short-term opportunity',
          intendedHoldingPeriod: '1_TO_6_MONTHS',
        },
        {
          id: 'tx_fomo_02',
          ticker: 'ZEN_ENERGY',
          name: 'Zenith Clean Energy Ltd',
          sector: 'Renewable Energy',
          type: 'BUY',
          quantity: 200,
          price: 210,
          amount: 42000,
          date: '2026-03-10',
          notes: 'Bought on momentum breakout green candle.',
          reason: 'Short-term opportunity',
          intendedHoldingPeriod: 'LESS_THAN_1_MONTH',
        },
        {
          id: 'tx_fomo_03',
          ticker: 'HIND_RETAIL',
          name: 'Hindustan Consumer Brands',
          sector: 'Consumer Goods',
          type: 'BUY',
          quantity: 20,
          price: 2150,
          amount: 43000,
          date: '2026-01-15',
          reason: 'Long-term growth',
          intendedHoldingPeriod: '3_PLUS_YEARS',
        },
      ];

    case 'OVERTRADING_STORM':
      return [
        {
          id: 'tx_ot_1',
          ticker: 'INDO_TECH',
          name: 'IndoTech Solutions Ltd',
          sector: 'Information Technology',
          type: 'BUY',
          quantity: 20,
          price: 1450,
          amount: 29000,
          date: '2026-03-10',
          reason: 'Short-term opportunity',
        },
        {
          id: 'tx_ot_2',
          ticker: 'INDO_TECH',
          name: 'IndoTech Solutions Ltd',
          sector: 'Information Technology',
          type: 'SELL',
          quantity: 10,
          price: 1470,
          amount: 14700,
          date: '2026-03-10',
          reason: 'Short-term opportunity',
        },
        {
          id: 'tx_ot_3',
          ticker: 'MUMBAI_FIN',
          name: 'Mumbai Financial Services',
          sector: 'Banking & Financials',
          type: 'BUY',
          quantity: 40,
          price: 890,
          amount: 35600,
          date: '2026-03-11',
          reason: 'Short-term opportunity',
        },
        {
          id: 'tx_ot_4',
          ticker: 'BHARAT_POWER',
          name: 'Bharat Green Power Corp',
          sector: 'Renewable Energy',
          type: 'BUY',
          quantity: 100,
          price: 320,
          amount: 32000,
          date: '2026-03-11',
          reason: 'Short-term opportunity',
        },
        {
          id: 'tx_ot_5',
          ticker: 'DECCAN_AUTO',
          name: 'Deccan Mobility Motors',
          sector: 'Automotive',
          type: 'BUY',
          quantity: 50,
          price: 640,
          amount: 32000,
          date: '2026-03-12',
          reason: 'Short-term opportunity',
        },
        {
          id: 'tx_ot_6',
          ticker: 'GEL_PHARMA',
          name: 'Global Equities LifeSciences',
          sector: 'Healthcare & Pharma',
          type: 'SELL',
          quantity: 15,
          price: 1120,
          amount: 16800,
          date: '2026-03-12',
          reason: 'Short-term opportunity',
        },
        {
          id: 'tx_ot_7',
          ticker: 'VAYU_AIR',
          name: 'Vayu Express Logistics',
          sector: 'Transportation',
          type: 'BUY',
          quantity: 80,
          price: 280,
          amount: 22400,
          date: '2026-03-12',
          reason: 'Short-term opportunity',
        },
      ];

    case 'TECH_CONCENTRATION':
      return [
        {
          id: 'tx_conc_01',
          ticker: 'INDO_TECH',
          name: 'IndoTech Solutions Ltd',
          sector: 'Information Technology',
          type: 'BUY',
          quantity: 150,
          price: 1420,
          amount: 213000,
          date: '2026-01-10',
          reason: 'Long-term growth',
          intendedHoldingPeriod: '3_PLUS_YEARS',
        },
        {
          id: 'tx_conc_02',
          ticker: 'MUMBAI_FIN',
          name: 'Mumbai Financial Services',
          sector: 'Banking & Financials',
          type: 'BUY',
          quantity: 30,
          price: 880,
          amount: 26400,
          date: '2026-01-20',
          reason: 'Portfolio allocation',
        },
        {
          id: 'tx_conc_03',
          ticker: 'HIND_RETAIL',
          name: 'Hindustan Consumer Brands',
          sector: 'Consumer Goods',
          type: 'BUY',
          quantity: 15,
          price: 2100,
          amount: 31500,
          date: '2026-02-01',
          reason: 'Long-term growth',
        },
      ];

    case 'PANIC_DUMP':
      return [
        {
          id: 'tx_panic_01',
          ticker: 'VAYU_AIR',
          name: 'Vayu Express Logistics',
          sector: 'Transportation',
          type: 'BUY',
          quantity: 120,
          price: 310,
          amount: 37200,
          date: '2026-02-05',
          reason: 'Long-term growth',
        },
        {
          id: 'tx_panic_02',
          ticker: 'VAYU_AIR',
          name: 'Vayu Express Logistics',
          sector: 'Transportation',
          type: 'SELL',
          quantity: 120,
          price: 260,
          amount: 31200,
          date: '2026-03-09',
          notes: 'Sold following rapid 14% drop in stock.',
          reason: 'Short-term opportunity',
        },
        {
          id: 'tx_panic_03',
          ticker: 'MUMBAI_FIN',
          name: 'Mumbai Financial Services',
          sector: 'Banking & Financials',
          type: 'BUY',
          quantity: 40,
          price: 890,
          amount: 35600,
          date: '2026-01-10',
          reason: 'Long-term growth',
        },
      ];

    case 'LOSS_AVERSION_TRAP':
      return [
        {
          id: 'tx_la_01',
          ticker: 'DELTA_DIGITAL',
          name: 'Delta Digital Payments',
          sector: 'Fintech',
          type: 'BUY',
          quantity: 80,
          price: 1350,
          amount: 108000,
          date: '2025-11-15',
          reason: 'Long-term growth',
          intendedHoldingPeriod: '1_TO_3_YEARS',
        },
        {
          id: 'tx_la_02',
          ticker: 'HIND_RETAIL',
          name: 'Hindustan Consumer Brands',
          sector: 'Consumer Goods',
          type: 'BUY',
          quantity: 25,
          price: 2150,
          amount: 53750,
          date: '2026-01-05',
          reason: 'Long-term growth',
        },
        {
          id: 'tx_la_03',
          ticker: 'MUMBAI_FIN',
          name: 'Mumbai Financial Services',
          sector: 'Banking & Financials',
          type: 'BUY',
          quantity: 40,
          price: 880,
          amount: 35200,
          date: '2026-01-10',
          reason: 'Long-term growth',
        },
      ];

    case 'MARKET_TIMING_CHURN':
      return [
        {
          id: 'tx_mt_01',
          ticker: 'DECCAN_AUTO',
          name: 'Deccan Mobility Motors',
          sector: 'Automotive',
          type: 'BUY',
          quantity: 50,
          price: 620,
          amount: 31000,
          date: '2026-03-01',
          reason: 'Short-term opportunity',
        },
        {
          id: 'tx_mt_02',
          ticker: 'DECCAN_AUTO',
          name: 'Deccan Mobility Motors',
          sector: 'Automotive',
          type: 'SELL',
          quantity: 50,
          price: 645,
          amount: 32250,
          date: '2026-03-04',
          reason: 'Short-term opportunity',
        },
        {
          id: 'tx_mt_03',
          ticker: 'DECCAN_AUTO',
          name: 'Deccan Mobility Motors',
          sector: 'Automotive',
          type: 'BUY',
          quantity: 50,
          price: 635,
          amount: 31750,
          date: '2026-03-07',
          reason: 'Short-term opportunity',
        },
        {
          id: 'tx_mt_04',
          ticker: 'HIND_RETAIL',
          name: 'Hindustan Consumer Brands',
          sector: 'Consumer Goods',
          type: 'BUY',
          quantity: 20,
          price: 2100,
          amount: 42000,
          date: '2026-01-15',
          reason: 'Long-term growth',
        },
      ];

    case 'DEFAULT':
    default:
      return [
        {
          id: 'tx_def_01',
          ticker: 'INDO_TECH',
          name: 'IndoTech Solutions Ltd',
          sector: 'Information Technology',
          type: 'BUY',
          quantity: 40,
          price: 1380,
          amount: 55200,
          date: '2026-01-10',
          reason: 'Long-term growth',
          intendedHoldingPeriod: '3_PLUS_YEARS',
        },
        {
          id: 'tx_def_02',
          ticker: 'BHARAT_POWER',
          name: 'Bharat Green Power Corp',
          sector: 'Renewable Energy',
          type: 'BUY',
          quantity: 120,
          price: 310,
          amount: 37200,
          date: '2026-01-20',
          reason: 'Long-term growth',
          intendedHoldingPeriod: '1_TO_3_YEARS',
        },
        {
          id: 'tx_def_03',
          ticker: 'MUMBAI_FIN',
          name: 'Mumbai Financial Services',
          sector: 'Banking & Financials',
          type: 'BUY',
          quantity: 50,
          price: 880,
          amount: 44000,
          date: '2026-02-01',
          reason: 'Portfolio allocation',
          intendedHoldingPeriod: '1_TO_3_YEARS',
        },
        {
          id: 'tx_def_04',
          ticker: 'HIND_RETAIL',
          name: 'Hindustan Consumer Brands',
          sector: 'Consumer Goods',
          type: 'BUY',
          quantity: 25,
          price: 2120,
          amount: 53000,
          date: '2026-02-15',
          reason: 'Long-term growth',
          intendedHoldingPeriod: '3_PLUS_YEARS',
        },
        {
          id: 'tx_def_05',
          ticker: 'GEL_PHARMA',
          name: 'Global Equities LifeSciences',
          sector: 'Healthcare & Pharma',
          type: 'BUY',
          quantity: 30,
          price: 1100,
          amount: 33000,
          date: '2026-02-25',
          reason: 'Valuation',
          intendedHoldingPeriod: '1_TO_3_YEARS',
        },
        {
          id: 'tx_def_06',
          ticker: 'INDO_TECH',
          name: 'IndoTech Solutions Ltd',
          sector: 'Information Technology',
          type: 'BUY',
          quantity: 20,
          price: 1610,
          amount: 32200,
          date: '2026-03-08',
          notes: 'Added on momentum continuation.',
          reason: 'Short-term opportunity',
          intendedHoldingPeriod: '1_TO_6_MONTHS',
        },
      ];
  }
}

export const INITIAL_TRANSACTIONS: Transaction[] = getScenarioTransactions('DEFAULT');

export const INITIAL_HOLDINGS: Holding[] = [];

export const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: 'jrnl_01',
    ticker: 'INDO_TECH',
    action: 'BUY',
    date: '2026-01-10',
    thesis: 'Initiating position based on 22% cloud ARR growth and strong margin expansion. Expect to hold through multi-year AI enterprise upgrade cycle.',
    reason: 'Long-term growth',
    intendedHoldingPeriod: '3_PLUS_YEARS',
    emotionalState: 'Calm & Analytical',
    tags: ['Cloud', 'Enterprise Tech', 'Core Compounding'],
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'jrnl_02',
    ticker: 'BHARAT_POWER',
    action: 'BUY',
    date: '2026-01-20',
    thesis: 'Capitalizing on national renewable transmission mandate. Steady regulated returns and dividend yield.',
    reason: 'Dividend',
    intendedHoldingPeriod: '1_TO_3_YEARS',
    emotionalState: 'Calm & Analytical',
    tags: ['Utilities', 'Green Energy', 'Dividend'],
    createdAt: '2026-01-20T11:30:00Z',
    updatedAt: '2026-01-20T11:30:00Z',
  },
  {
    id: 'jrnl_03',
    ticker: 'HIND_RETAIL',
    action: 'BUY',
    date: '2026-02-15',
    thesis: 'Defensive consumer staples allocation to insulate portfolio against mid-cycle macroeconomic volatility.',
    reason: 'Portfolio allocation',
    intendedHoldingPeriod: '3_PLUS_YEARS',
    emotionalState: 'Calm & Analytical',
    tags: ['FMCG', 'Defensive', 'Allocation'],
    createdAt: '2026-02-15T09:45:00Z',
    updatedAt: '2026-02-15T09:45:00Z',
  },
];

export const INITIAL_GOALS: PlannerGoal[] = [
  {
    id: 'goal_01',
    title: 'Financial Independence & Early Retirement Corpus',
    targetAmount: 15000000,
    currentAmount: 2200000,
    targetDate: '2035-12-31',
    monthlyContribution: 45000,
    expectedReturnRate: 12,
    category: 'Retirement',
    notes: 'Long-term core compounding portfolio funded via monthly SIP.',
  },
  {
    id: 'goal_02',
    title: 'Emergency Liquid Capital Buffer',
    targetAmount: 600000,
    currentAmount: 520000,
    targetDate: '2026-06-30',
    monthlyContribution: 15000,
    expectedReturnRate: 7,
    category: 'Emergency Fund',
    notes: '6 months of living expenses in ultra-safe instruments.',
  },
];
