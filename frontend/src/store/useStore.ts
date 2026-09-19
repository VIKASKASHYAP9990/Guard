// ============================================================
// InvestGuard — Global Zustand Application Store
// Manages reactive state across all 10 pages and coordinates
// real-time behavioral analysis upon any data change.
// ============================================================

import { create } from 'zustand';
import {
  StorageState,
  Transaction,
  Holding,
  BehavioralAlert,
  JournalEntry,
  PlannerGoal,
  DetectionConfig,
  UserProfile,
  BehaviorReport,
  ScenarioType,
  AlertStatus,
  ThemeMode,
} from '../types';
import {
  loadFromStorage,
  saveToStorage,
  createDefaultState,
  clearStorage,
} from '../services/storage';
import { runBehavioralAnalysis, recalculateHoldings } from '../engine/analyzer';
import { generateId } from '../lib/formatters';
import { getScenarioTransactions, INITIAL_JOURNALS, INITIAL_GOALS } from '../lib/mockData';

interface AppStore extends StorageState {
  // Computed & UI state
  report: BehaviorReport;
  isAnalyzing: boolean;
  selectedAlertForAI: BehavioralAlert | null;

  // Actions
  login: (email: string, name: string) => void;
  logout: () => void;
  enterDemoMode: (scenario?: ScenarioType) => void;
  exitDemoMode: () => void;
  setScenario: (scenario: ScenarioType) => void;
  
  // Transaction actions
  addTransaction: (data: Omit<Transaction, 'id' | 'amount'>) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Alert actions
  updateAlertStatus: (id: string, status: AlertStatus) => void;
  dismissAlert: (id: string) => void;
  setSelectedAlertForAI: (alert: BehavioralAlert | null) => void;

  // Journal actions
  addJournalEntry: (data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJournalEntry: (id: string, data: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;

  // Goal actions
  addGoal: (data: Omit<PlannerGoal, 'id'>) => void;
  updateGoal: (id: string, data: Partial<PlannerGoal>) => void;
  deleteGoal: (id: string) => void;

  // Config & Theme
  updateDetectionConfig: (config: Partial<DetectionConfig>) => void;
  setTheme: (theme: ThemeMode) => void;
  
  // System actions
  runAnalysis: () => void;
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
}

// Initial state loaded from storage
const loadedState = loadFromStorage();
const initialHoldings = recalculateHoldings(loadedState.transactions);
const initialReport = runBehavioralAnalysis(initialHoldings, loadedState.transactions, loadedState.detectionConfig);

export const useStore = create<AppStore>((set, get) => ({
  ...loadedState,
  holdings: initialHoldings,
  report: initialReport,
  isAnalyzing: false,
  selectedAlertForAI: null,

  login: (email: string, name: string) => {
    const user: UserProfile = {
      id: generateId('usr'),
      name,
      email,
      riskTolerance: 'MODERATE',
      theme: get().theme,
      createdAt: new Date().toISOString(),
    };
    set({ user, isAuthenticated: true });
    const { user: u, isAuthenticated, isDemoMode, activeScenario, transactions, holdings, alerts, journalEntries, goals, detectionConfig, theme, lastAnalyzedAt } = get();
    saveToStorage({ user: u, isAuthenticated, isDemoMode, activeScenario, transactions, holdings, alerts, journalEntries, goals, detectionConfig, theme, lastAnalyzedAt });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, isDemoMode: false });
    const { user, isAuthenticated, isDemoMode, activeScenario, transactions, holdings, alerts, journalEntries, goals, detectionConfig, theme, lastAnalyzedAt } = get();
    saveToStorage({ user, isAuthenticated, isDemoMode, activeScenario, transactions, holdings, alerts, journalEntries, goals, detectionConfig, theme, lastAnalyzedAt });
  },

  enterDemoMode: (scenario: ScenarioType = 'DEFAULT') => {
    const transactions = getScenarioTransactions(scenario);
    const holdings = recalculateHoldings(transactions);
    const report = runBehavioralAnalysis(holdings, transactions, get().detectionConfig);

    set({
      isDemoMode: true,
      isAuthenticated: true,
      activeScenario: scenario,
      transactions,
      holdings,
      alerts: report.alerts,
      report,
      journalEntries: INITIAL_JOURNALS,
      goals: INITIAL_GOALS,
      lastAnalyzedAt: new Date().toISOString(),
    });

    const current = get();
    saveToStorage({
      user: current.user,
      isAuthenticated: current.isAuthenticated,
      isDemoMode: true,
      activeScenario: scenario,
      transactions,
      holdings,
      alerts: report.alerts,
      journalEntries: INITIAL_JOURNALS,
      goals: INITIAL_GOALS,
      detectionConfig: current.detectionConfig,
      theme: current.theme,
      lastAnalyzedAt: new Date().toISOString(),
    });
  },

  exitDemoMode: () => {
    const freshState = createDefaultState(false, 'DEFAULT');
    set({
      ...freshState,
      report: runBehavioralAnalysis([], [], freshState.detectionConfig),
      selectedAlertForAI: null,
    });
    saveToStorage(freshState);
  },

  setScenario: (scenario: ScenarioType) => {
    const transactions = getScenarioTransactions(scenario);
    const holdings = recalculateHoldings(transactions);
    const report = runBehavioralAnalysis(holdings, transactions, get().detectionConfig);

    set({
      activeScenario: scenario,
      transactions,
      holdings,
      alerts: report.alerts,
      report,
      lastAnalyzedAt: new Date().toISOString(),
    });

    const current = get();
    saveToStorage({
      user: current.user,
      isAuthenticated: current.isAuthenticated,
      isDemoMode: current.isDemoMode,
      activeScenario: scenario,
      transactions,
      holdings,
      alerts: report.alerts,
      journalEntries: current.journalEntries,
      goals: current.goals,
      detectionConfig: current.detectionConfig,
      theme: current.theme,
      lastAnalyzedAt: new Date().toISOString(),
    });
  },

  addTransaction: (data) => {
    const amount = data.quantity * data.price;
    const newTx: Transaction = {
      ...data,
      id: generateId('tx'),
      amount,
    };

    const transactions = [newTx, ...get().transactions];
    const holdings = recalculateHoldings(transactions);
    const report = runBehavioralAnalysis(holdings, transactions, get().detectionConfig);

    set({
      transactions,
      holdings,
      alerts: report.alerts,
      report,
      lastAnalyzedAt: new Date().toISOString(),
    });

    const current = get();
    saveToStorage({
      user: current.user,
      isAuthenticated: current.isAuthenticated,
      isDemoMode: current.isDemoMode,
      activeScenario: current.activeScenario,
      transactions,
      holdings,
      alerts: report.alerts,
      journalEntries: current.journalEntries,
      goals: current.goals,
      detectionConfig: current.detectionConfig,
      theme: current.theme,
      lastAnalyzedAt: new Date().toISOString(),
    });
  },

  updateTransaction: (id, data) => {
    const transactions = get().transactions.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...data };
        updated.amount = updated.quantity * updated.price;
        return updated;
      }
      return t;
    });

    const holdings = recalculateHoldings(transactions);
    const report = runBehavioralAnalysis(holdings, transactions, get().detectionConfig);

    set({
      transactions,
      holdings,
      alerts: report.alerts,
      report,
      lastAnalyzedAt: new Date().toISOString(),
    });

    const current = get();
    saveToStorage({
      user: current.user,
      isAuthenticated: current.isAuthenticated,
      isDemoMode: current.isDemoMode,
      activeScenario: current.activeScenario,
      transactions,
      holdings,
      alerts: report.alerts,
      journalEntries: current.journalEntries,
      goals: current.goals,
      detectionConfig: current.detectionConfig,
      theme: current.theme,
      lastAnalyzedAt: new Date().toISOString(),
    });
  },

  deleteTransaction: (id) => {
    const transactions = get().transactions.filter(t => t.id !== id);
    const holdings = recalculateHoldings(transactions);
    const report = runBehavioralAnalysis(holdings, transactions, get().detectionConfig);

    set({
      transactions,
      holdings,
      alerts: report.alerts,
      report,
      lastAnalyzedAt: new Date().toISOString(),
    });

    const current = get();
    saveToStorage({
      user: current.user,
      isAuthenticated: current.isAuthenticated,
      isDemoMode: current.isDemoMode,
      activeScenario: current.activeScenario,
      transactions,
      holdings,
      alerts: report.alerts,
      journalEntries: current.journalEntries,
      goals: current.goals,
      detectionConfig: current.detectionConfig,
      theme: current.theme,
      lastAnalyzedAt: new Date().toISOString(),
    });
  },

  updateAlertStatus: (id, status) => {
    const alerts = get().alerts.map(a => (a.id === id ? { ...a, status } : a));
    const report = { ...get().report, alerts };
    set({ alerts, report });

    const current = get();
    saveToStorage({
      user: current.user,
      isAuthenticated: current.isAuthenticated,
      isDemoMode: current.isDemoMode,
      activeScenario: current.activeScenario,
      transactions: current.transactions,
      holdings: current.holdings,
      alerts,
      journalEntries: current.journalEntries,
      goals: current.goals,
      detectionConfig: current.detectionConfig,
      theme: current.theme,
      lastAnalyzedAt: current.lastAnalyzedAt,
    });
  },

  dismissAlert: (id) => {
    get().updateAlertStatus(id, 'DISMISSED');
  },

  setSelectedAlertForAI: (alert) => {
    set({ selectedAlertForAI: alert });
  },

  addJournalEntry: (data) => {
    const now = new Date().toISOString();
    const newEntry: JournalEntry = {
      ...data,
      id: generateId('jrnl'),
      createdAt: now,
      updatedAt: now,
    };

    const journalEntries = [newEntry, ...get().journalEntries];
    set({ journalEntries });

    const current = get();
    saveToStorage({
      user: current.user,
      isAuthenticated: current.isAuthenticated,
      isDemoMode: current.isDemoMode,
      activeScenario: current.activeScenario,
      transactions: current.transactions,
      holdings: current.holdings,
      alerts: current.alerts,
      journalEntries,
      goals: current.goals,
      detectionConfig: current.detectionConfig,
      theme: current.theme,
      lastAnalyzedAt: current.lastAnalyzedAt,
    });
  },

  updateJournalEntry: (id, data) => {
    const journalEntries = get().journalEntries.map(j => {
      if (j.id === id) {
        return { ...j, ...data, updatedAt: new Date().toISOString() };
      }
      return j;
    });

    set({ journalEntries });

    const current = get();
    saveToStorage({
      user: current.user,
      isAuthenticated: current.isAuthenticated,
      isDemoMode: current.isDemoMode,
      activeScenario: current.activeScenario,
      transactions: current.transactions,
      holdings: current.holdings,
      alerts: current.alerts,
      journalEntries,
      goals: current.goals,
      detectionConfig: current.detectionConfig,
      theme: current.theme,
      lastAnalyzedAt: current.lastAnalyzedAt,
    });
  },

  deleteJournalEntry: (id) => {
    const journalEntries = get().journalEntries.filter(j => j.id !== id);
    set({ journalEntries });

    const current = get();
    saveToStorage({
      user: current.user,
      isAuthenticated: current.isAuthenticated,
      isDemoMode: current.isDemoMode,
      activeScenario: current.activeScenario,
      transactions: current.transactions,
      holdings: current.holdings,
      alerts: current.alerts,
      journalEntries,
      goals: current.goals,
      detectionConfig: current.detectionConfig,
      theme: current.theme,
      lastAnalyzedAt: current.lastAnalyzedAt,
    });
  },

  addGoal: (data) => {
    const newGoal: PlannerGoal = {
      ...data,
      id: generateId('goal'),
    };
    const goals = [...get().goals, newGoal];
    set({ goals });

    const current = get();
    saveToStorage({
      user: current.user,
      isAuthenticated: current.isAuthenticated,
      isDemoMode: current.isDemoMode,
      activeScenario: current.activeScenario,
      transactions: current.transactions,
      holdings: current.holdings,
      alerts: current.alerts,
      journalEntries: current.journalEntries,
      goals,
      detectionConfig: current.detectionConfig,
      theme: current.theme,
      lastAnalyzedAt: current.lastAnalyzedAt,
    });
  },

  updateGoal: (id, data) => {
    const goals = get().goals.map(g => (g.id === id ? { ...g, ...data } : g));
    set({ goals });

    const current = get();
    saveToStorage({
      user: current.user,
      isAuthenticated: current.isAuthenticated,
      isDemoMode: current.isDemoMode,
      activeScenario: current.activeScenario,
      transactions: current.transactions,
      holdings: current.holdings,
      alerts: current.alerts,
      journalEntries: current.journalEntries,
      goals,
      detectionConfig: current.detectionConfig,
      theme: current.theme,
      lastAnalyzedAt: current.lastAnalyzedAt,
    });
  },

  deleteGoal: (id) => {
    const goals = get().goals.filter(g => g.id !== id);
    set({ goals });

    const current = get();
    saveToStorage({
      user: current.user,
      isAuthenticated: current.isAuthenticated,
      isDemoMode: current.isDemoMode,
      activeScenario: current.activeScenario,
      transactions: current.transactions,
      holdings: current.holdings,
      alerts: current.alerts,
      journalEntries: current.journalEntries,
      goals,
      detectionConfig: current.detectionConfig,
      theme: current.theme,
      lastAnalyzedAt: current.lastAnalyzedAt,
    });
  },

  updateDetectionConfig: (config) => {
    const detectionConfig = { ...get().detectionConfig, ...config };
    const report = runBehavioralAnalysis(get().holdings, get().transactions, detectionConfig);

    set({ detectionConfig, alerts: report.alerts, report });

    const current = get();
    saveToStorage({
      user: current.user,
      isAuthenticated: current.isAuthenticated,
      isDemoMode: current.isDemoMode,
      activeScenario: current.activeScenario,
      transactions: current.transactions,
      holdings: current.holdings,
      alerts: report.alerts,
      journalEntries: current.journalEntries,
      goals: current.goals,
      detectionConfig,
      theme: current.theme,
      lastAnalyzedAt: current.lastAnalyzedAt,
    });
  },

  setTheme: (theme) => {
    set({ theme });
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const current = get();
    saveToStorage({
      user: current.user,
      isAuthenticated: current.isAuthenticated,
      isDemoMode: current.isDemoMode,
      activeScenario: current.activeScenario,
      transactions: current.transactions,
      holdings: current.holdings,
      alerts: current.alerts,
      journalEntries: current.journalEntries,
      goals: current.goals,
      detectionConfig: current.detectionConfig,
      theme,
      lastAnalyzedAt: current.lastAnalyzedAt,
    });
  },

  runAnalysis: () => {
    set({ isAnalyzing: true });
    setTimeout(() => {
      const holdings = recalculateHoldings(get().transactions);
      const report = runBehavioralAnalysis(holdings, get().transactions, get().detectionConfig);
      set({
        holdings,
        alerts: report.alerts,
        report,
        isAnalyzing: false,
        lastAnalyzedAt: new Date().toISOString(),
      });

      const current = get();
      saveToStorage({
        user: current.user,
        isAuthenticated: current.isAuthenticated,
        isDemoMode: current.isDemoMode,
        activeScenario: current.activeScenario,
        transactions: current.transactions,
        holdings,
        alerts: report.alerts,
        journalEntries: current.journalEntries,
        goals: current.goals,
        detectionConfig: current.detectionConfig,
        theme: current.theme,
        lastAnalyzedAt: new Date().toISOString(),
      });
    }, 400);
  },

  resetToDefaults: () => {
    clearStorage();
    const fresh = createDefaultState(true, 'DEFAULT');
    const holdings = recalculateHoldings(fresh.transactions);
    const report = runBehavioralAnalysis(holdings, fresh.transactions, fresh.detectionConfig);

    set({
      ...fresh,
      holdings,
      report,
      selectedAlertForAI: null,
      isAnalyzing: false,
    });
    saveToStorage(fresh);
  },

  exportDataJSON: () => {
    const current = get();
    const dataToExport = {
      user: current.user,
      transactions: current.transactions,
      journalEntries: current.journalEntries,
      goals: current.goals,
      detectionConfig: current.detectionConfig,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(dataToExport, null, 2);
  },

  importDataJSON: (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.transactions || !Array.isArray(parsed.transactions)) {
        return false;
      }
      const transactions: Transaction[] = parsed.transactions;
      const holdings = recalculateHoldings(transactions);
      const detectionConfig = parsed.detectionConfig || get().detectionConfig;
      const report = runBehavioralAnalysis(holdings, transactions, detectionConfig);

      set({
        transactions,
        holdings,
        journalEntries: parsed.journalEntries || [],
        goals: parsed.goals || [],
        detectionConfig,
        alerts: report.alerts,
        report,
        lastAnalyzedAt: new Date().toISOString(),
      });

      const current = get();
      saveToStorage({
        user: current.user,
        isAuthenticated: current.isAuthenticated,
        isDemoMode: current.isDemoMode,
        activeScenario: current.activeScenario,
        transactions,
        holdings,
        alerts: report.alerts,
        journalEntries: current.journalEntries,
        goals: current.goals,
        detectionConfig,
        theme: current.theme,
        lastAnalyzedAt: new Date().toISOString(),
      });
      return true;
    } catch (e) {
      console.error('Failed to import JSON data', e);
      return false;
    }
  },
}));
