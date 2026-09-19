// ============================================================
// InvestGuard — Formatting Utilities
// Currency, percentages, date helpers, severity colors & ID generation
// ============================================================

import { AlertSeverity } from '../types';

/**
 * Format a number into Indian Rupee (INR) with standard Indian digit grouping: ₹1,00,000
 */
export function formatINR(value: number | undefined | null, decimals: number = 0): string {
  if (value === undefined || value === null || isNaN(value)) return '₹0';

  const isNegative = value < 0;
  const absValue = Math.abs(value);

  // Format using Indian locale
  const formatted = absValue.toLocaleString('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

/**
 * Format percentage with explicit + / - sign
 */
export function formatPercent(value: number | undefined | null, decimals: number = 1): string {
  if (value === undefined || value === null || isNaN(value)) return '0.0%';
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(decimals)}%`;
}

export function formatPct(value: number | undefined | null, decimals: number = 1): string {
  return formatPercent(value, decimals);
}

/**
 * Generate a unique ID with optional prefix
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

/**
 * Get visual styling tokens for Behavioral Health Score (0-100)
 */
export function getHealthScoreColor(score: number): {
  text: string;
  bg: string;
  border: string;
  label: string;
} {
  if (score >= 80) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/15',
      border: 'border-emerald-500/30',
      label: 'Optimal Discipline',
    };
  }
  if (score >= 60) {
    return {
      text: 'text-blue-400',
      bg: 'bg-blue-500/15',
      border: 'border-blue-500/30',
      label: 'Good Discipline',
    };
  }
  if (score >= 40) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/30',
      label: 'Moderate Bias Drift',
    };
  }
  return {
    text: 'text-rose-400',
    bg: 'bg-rose-500/15',
    border: 'border-rose-500/30',
    label: 'High Emotional Bias',
  };
}

/**
 * Get visual styling badge tokens for alert severities
 */
export function getAlertSeverityBadge(severity: AlertSeverity): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  switch (severity) {
    case 'HIGH':
      return {
        bg: 'bg-rose-500/15',
        text: 'text-rose-300',
        border: 'border-rose-500/30',
        label: 'High',
      };
    case 'MODERATE':
      return {
        bg: 'bg-amber-500/15',
        text: 'text-amber-300',
        border: 'border-amber-500/30',
        label: 'Moderate',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-blue-500/15',
        text: 'text-blue-300',
        border: 'border-blue-500/30',
        label: 'Low',
      };
  }
}
