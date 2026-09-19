// ============================================================
// InvestGuard — API Adapter / Backend Bridge
// In demo/standalone mode, serves data directly from local storage & engine.
// Can connect to FastAPI backend when running locally.
// ============================================================

import {
  Holding,
  Transaction,
  BehavioralAlert,
  JournalEntry,
  PlannerGoal,
  BehaviorReport,
} from '../types';
import { loadFromStorage, saveToStorage } from './storage';
import { runBehavioralAnalysis, recalculateHoldings } from '../engine/analyzer';

const API_BASE = '/api';

export async function fetchHoldings(): Promise<Holding[]> {
  try {
    const res = await fetch(`${API_BASE}/holdings`);
    if (res.ok) return await res.json();
  } catch (e) {
    // offline fallback
  }
  const state = loadFromStorage();
  return state.holdings;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const res = await fetch(`${API_BASE}/transactions`);
    if (res.ok) return await res.json();
  } catch (e) {
    // offline fallback
  }
  const state = loadFromStorage();
  return state.transactions;
}

export async function fetchAlerts(): Promise<BehavioralAlert[]> {
  try {
    const res = await fetch(`${API_BASE}/alerts`);
    if (res.ok) return await res.json();
  } catch (e) {
    // offline fallback
  }
  const state = loadFromStorage();
  return state.alerts;
}

export async function analyzePortfolio(): Promise<BehaviorReport> {
  try {
    const res = await fetch(`${API_BASE}/analyze`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (e) {
    // offline fallback
  }
  const state = loadFromStorage();
  const holdings = recalculateHoldings(state.transactions);
  return runBehavioralAnalysis(holdings, state.transactions, state.detectionConfig);
}
