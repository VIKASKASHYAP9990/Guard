// ============================================================
// InvestGuard — Pre-Trade Journal & Thesis Tracker
// Prevents hindsight bias by capturing decision theses before execution
// and comparing planned holding periods against actual outcomes.
// ============================================================

import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Brain,
  Calendar,
  Clock,
  TrendingUp,
  Tag,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { JournalEntry, TradeType, InvestingReason, HoldingPeriod } from '../types';
import { formatINR } from '../lib/formatters';
import { FICTIONAL_TICKERS } from '../lib/mockData';

interface JournalPageProps {
  onNavigate: (page: string) => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({ onNavigate }) => {
  const { journalEntries, addJournalEntry, deleteJournalEntry } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    ticker: FICTIONAL_TICKERS[0].ticker,
    action: 'BUY' as TradeType,
    date: new Date().toISOString().split('T')[0],
    thesis: '',
    reason: 'Long-term growth' as InvestingReason,
    intendedHoldingPeriod: '6_TO_12_MONTHS' as HoldingPeriod,
    emotionalState: 'Calm & Analytical',
    outcomeNotes: '',
    outcomePnl: 0,
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJournalEntry({
      ticker: formData.ticker,
      action: formData.action,
      date: formData.date,
      thesis: formData.thesis,
      reason: formData.reason,
      intendedHoldingPeriod: formData.intendedHoldingPeriod,
      emotionalState: formData.emotionalState,
      outcomeNotes: formData.outcomeNotes || undefined,
      outcomePnl: Number(formData.outcomePnl) || undefined,
      tags: [formData.reason, formData.intendedHoldingPeriod],
    });
    setIsModalOpen(false);
    setFormData({
      ticker: FICTIONAL_TICKERS[0].ticker,
      action: 'BUY',
      date: new Date().toISOString().split('T')[0],
      thesis: '',
      reason: 'Long-term growth',
      intendedHoldingPeriod: '6_TO_12_MONTHS',
      emotionalState: 'Calm & Analytical',
      outcomeNotes: '',
      outcomePnl: 0,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Pre-Trade Decision Journal & Audit Log
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  {journalEntries.length} Theses Logged
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Document your logic, planned timeline, and emotional posture <em>before</em> making a trade. Reviewing written theses reduces hindsight bias and emotional drift.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Log Pre-Trade Thesis
          </button>
        </div>
      </div>

      {/* Journal Entries List */}
      {journalEntries.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl space-y-3">
          <BookOpen className="w-12 h-12 text-indigo-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No Journal Entries Recorded Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Log your investment rationale prior to executing trades to track thesis drift and discipline over time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {journalEntries.map(entry => {
            const isBuy = entry.action === 'BUY';
            return (
              <div
                key={entry.id}
                className="p-6 rounded-2xl glass-card space-y-4 border border-slate-800/80 hover:border-slate-700/80 transition-all"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border ${
                      isBuy
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}>
                      {entry.action}
                    </span>
                    <span className="font-mono font-bold text-sm bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">
                      {entry.ticker}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {entry.date}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {entry.reason}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {entry.emotionalState && (
                      <span className="text-[11px] text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-800/40">
                        Mental State: {entry.emotionalState}
                      </span>
                    )}
                    <button
                      onClick={() => deleteJournalEntry(entry.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Journal Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pre-Trade Thesis Body */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    <Brain className="w-3.5 h-3.5" />
                    Pre-Trade Investment Thesis
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {entry.thesis}
                  </p>
                </div>

                {/* Intended Horizon & Outcome Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      Planned Horizon:
                    </span>
                    <span className="font-semibold text-slate-200">
                      {entry.intendedHoldingPeriod.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Post-Trade Reflection:</span>
                    <span className="text-slate-300 font-medium">
                      {entry.outcomeNotes || 'Position currently active under initial thesis'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Journal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log Pre-Trade Decision Thesis</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Ticker and Action */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Stock Ticker</label>
                  <select
                    value={formData.ticker}
                    onChange={(e) => setFormData(p => ({ ...p, ticker: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    {FICTIONAL_TICKERS.map(t => (
                      <option key={t.ticker} value={t.ticker}>
                        {t.ticker} — {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Action Type</label>
                  <select
                    value={formData.action}
                    onChange={(e) => setFormData(p => ({ ...p, action: e.target.value as TradeType }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                </div>
              </div>

              {/* Thesis input */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">
                  Pre-Trade Thesis & Rationale (What makes this decision sound?)
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.thesis}
                  onChange={(e) => setFormData(p => ({ ...p, thesis: e.target.value }))}
                  placeholder="E.g., Initiating position based on 3-year revenue CAGR and operating leverage. Willing to hold through 15% drawdown..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Rationale and Horizon */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Core Rationale</label>
                  <select
                    value={formData.reason}
                    onChange={(e) => setFormData(p => ({ ...p, reason: e.target.value as InvestingReason }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Long-term growth">Long-term growth</option>
                    <option value="Valuation">Valuation</option>
                    <option value="Dividend">Dividend</option>
                    <option value="Short-term opportunity">Short-term opportunity</option>
                    <option value="Portfolio allocation">Portfolio allocation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Planned Holding Period</label>
                  <select
                    value={formData.intendedHoldingPeriod}
                    onChange={(e) => setFormData(p => ({ ...p, intendedHoldingPeriod: e.target.value as HoldingPeriod }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="LESS_THAN_1_MONTH">&lt; 1 Month</option>
                    <option value="1_TO_6_MONTHS">1 to 6 Months</option>
                    <option value="6_TO_12_MONTHS">6 to 12 Months</option>
                    <option value="1_TO_3_YEARS">1 to 3 Years</option>
                    <option value="3_PLUS_YEARS">3+ Years</option>
                  </select>
                </div>
              </div>

              {/* Emotional State */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Mental / Emotional State</label>
                <select
                  value={formData.emotionalState}
                  onChange={(e) => setFormData(p => ({ ...p, emotionalState: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Calm & Analytical">Calm & Analytical (High conviction, clear plan)</option>
                  <option value="Anxious / Fear of Missing Out">Anxious / Fear of Missing Out (FOMO)</option>
                  <option value="Frustrated / Rebound Trading">Frustrated / Rebound Trading</option>
                  <option value="Confident / Routine SIP">Confident / Routine Periodic Allocation</option>
                </select>
              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save Pre-Trade Thesis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
