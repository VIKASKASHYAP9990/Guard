// ============================================================
// InvestGuard — Zod-Validated LocalStorage Service
// Provides type-safe persistence and demo scenario loaders
// ============================================================

import { z } from 'zod';
import {
  StorageState,
  Transaction,
  Holding,
  BehavioralAlert,
  JournalEntry,
  PlannerGoal,
  DetectionConfig,
  UserProfile,
  ScenarioType,
} from '../types';
import {
  INITIAL_PROFILE,
  DEFAULT_CONFIG,
  INITIAL_TRANSACTIONS,
  INITIAL_HOLDINGS,
  INITIAL_JOURNALS,
  INITIAL_GOALS,
  SCENARIOS,
  getScenarioTransactions,
} from '../lib/mockData';
import { runBehavioralAnalysis, recalculateHoldings } from '../engine/analyzer';

const STORAGE_KEY = 'investguard_state_v1';

// Zod schemas for runtime validation
const TransactionSchema = z.object({
  id: z.string(),
  ticker: z.string(),
  name: z.string(),
  type: z.enum(['BUY', 'SELL']),
  quantity: z.number(),
  price: z.number(),
  amount: z.number(),
  date: z.string(),
  notes: z.string().optional(),
  sector: z.string().optional(),
  reason: z.string().optional(),
  intendedHoldingPeriod: z.string().optional(),
});

const HoldingSchema = z.object({
  id: z.string(),
  ticker: z.string(),
  name: z.string(),
  quantity: z.number(),
  avgBuyPrice: z.number(),
  currentPrice: z.number(),
  currentValue: z.number(),
  investedValue: z.number(),
  unrealizedPnl: z.number(),
  unrealizedPnlPercent: z.number(),
  allocationPercent: z.number(),
  sector: z.string(),
  priceChange24h: z.number().optional(),
  priceChange24hPercent: z.number().optional(),
});

const AlertSchema = z.object({
  id: z.string(),
  patternType: z.enum([
    'FOMO_BUYING',
    'OVERTRADING',
    'CONCENTRATION',
    'PANIC_SELLING',
    'LOSS_AVERSION',
    'MARKET_TIMING',
  ]),
  title: z.string(),
  severity: z.enum(['LOW', 'MODERATE', 'HIGH']),
  detectedAt: z.string(),
  ticker: z.string().optional(),
  description: z.string(),
  evidence: z.string(),
  explanation: z.object({
    definition: z.string(),
    whyItHappens: z.string(),
    whatEvidenceShows: z.string(),
    whatThisMeans: z.string(),
    whatToConsider: z.array(z.string()),
    whatToAvoid: z.array(z.string()),
  }),
  reflectionQuestion: z.string(),
  status: z.enum(['NEW', 'REVIEWED', 'DISMISSED']),
  metrics: z.record(z.string(), z.any()).optional(),
});

const JournalSchema = z.object({
  id: z.string(),
  date: z.string(),
  ticker: z.string(),
  action: z.enum(['BUY', 'SELL']),
  thesis: z.string(),
  reason: z.enum([
    'Long-term growth',
    'Valuation',
    'Dividend',
    'Short-term opportunity',
    'Portfolio allocation',
    'Other',
  ]),
  intendedHoldingPeriod: z.enum([
    'LESS_THAN_1_MONTH',
    '1_TO_6_MONTHS',
    '6_TO_12_MONTHS',
    '1_TO_3_YEARS',
    '3_PLUS_YEARS',
  ]),
  emotionalState: z.string().optional(),
  actualHoldingPeriodDays: z.number().optional(),
  outcomePnl: z.number().optional(),
  outcomeNotes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const GoalSchema = z.object({
  id: z.string(),
  title: z.string(),
  targetAmount: z.number(),
  currentAmount: z.number(),
  targetDate: z.string(),
  monthlyContribution: z.number(),
  expectedReturnRate: z.number(),
  category: z.string(),
  notes: z.string().optional(),
});

const ConfigSchema = z.object({
  fomoPriceSurgeThreshold: z.number(),
  fomoLookbackDays: z.number(),
  overtradingTradeCountThreshold: z.number(),
  overtradingWindowDays: z.number(),
  concentrationThreshold: z.number(),
  panicDropThreshold: z.number(),
  panicLookbackDays: z.number(),
  lossAversionDrawdownThreshold: z.number(),
  lossAversionDaysHeldThreshold: z.number(),
  marketTimingWindowDays: z.number(),
  riskTolerance: z.enum(['LOW', 'MODERATE', 'HIGH']),
});

const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  riskTolerance: z.enum(['LOW', 'MODERATE', 'HIGH']),
  theme: z.enum(['light', 'dark', 'system']),
  createdAt: z.string(),
});

const StorageStateSchema = z.object({
  user: ProfileSchema.nullable(),
  isAuthenticated: z.boolean(),
  isDemoMode: z.boolean(),
  activeScenario: z.string(),
  transactions: z.array(TransactionSchema),
  holdings: z.array(HoldingSchema),
  alerts: z.array(AlertSchema),
  journalEntries: z.array(JournalSchema),
  goals: z.array(GoalSchema),
  detectionConfig: ConfigSchema,
  theme: z.enum(['light', 'dark', 'system']),
  lastAnalyzedAt: z.string().nullable(),
});

/**
 * Generate initial clean default state
 */
export function createDefaultState(isDemo: boolean = true, scenarioId: ScenarioType = 'DEFAULT'): StorageState {
  const transactions = isDemo ? getScenarioTransactions(scenarioId) : [];
  const holdings = isDemo ? recalculateHoldings(transactions) : [];
  const report = isDemo ? runBehavioralAnalysis(holdings, transactions, DEFAULT_CONFIG) : null;

  return {
    user: INITIAL_PROFILE,
    isAuthenticated: true,
    isDemoMode: isDemo,
    activeScenario: scenarioId,
    transactions,
    holdings,
    alerts: report ? report.alerts : [],
    journalEntries: isDemo ? INITIAL_JOURNALS : [],
    goals: isDemo ? INITIAL_GOALS : [],
    detectionConfig: DEFAULT_CONFIG,
    theme: 'dark',
    lastAnalyzedAt: new Date().toISOString(),
  };
}

/**
 * Load state from localStorage with schema fallback
 */
export function loadFromStorage(): StorageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defState = createDefaultState(true, 'DEFAULT');
      saveToStorage(defState);
      return defState;
    }

    const parsed = JSON.parse(raw);
    const result = StorageStateSchema.safeParse(parsed);
    if (result.success) {
      return result.data as StorageState;
    } else {
      console.warn('InvestGuard: Storage validation failed, restoring defaults', result.error);
      const defState = createDefaultState(true, 'DEFAULT');
      saveToStorage(defState);
      return defState;
    }
  } catch (err) {
    console.error('InvestGuard: Error reading localStorage', err);
    return createDefaultState(true, 'DEFAULT');
  }
}

/**
 * Save state to localStorage
 */
export function saveToStorage(state: StorageState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('InvestGuard: Failed to write to localStorage', err);
  }
}

/**
 * Clear all storage and reset
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('InvestGuard: Failed to clear storage', err);
  }
}
