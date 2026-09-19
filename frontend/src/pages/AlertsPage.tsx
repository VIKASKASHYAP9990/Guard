// ============================================================
// InvestGuard — Behavioral Alerts Center
// Manage, review, and self-reflect on empirical behavioral signals.
// ============================================================

import React, { useState } from 'react';
import {
  AlertTriangle,
  Filter,
  CheckCircle2,
  Trash2,
  Brain,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Eye,
  Sliders,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { AlertSeverity, AlertStatus, BehavioralAlert, PatternType } from '../types';
import { PATTERN_SHORT_NAMES } from '../content/copy';
import { getAlertSeverityBadge } from '../lib/formatters';
import { AIExplanationPanel } from '../components/UI/AIExplanationPanel';

interface AlertsPageProps {
  onNavigate: (page: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ onNavigate }) => {
  const { alerts, updateAlertStatus, dismissAlert } = useStore();
  const [selectedAlert, setSelectedAlert] = useState<BehavioralAlert | null>(null);
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'ALL'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'ALL'>('ALL');
  const [patternFilter, setPatternFilter] = useState<PatternType | 'ALL'>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    if (patternFilter !== 'ALL' && a.patternType !== patternFilter) return false;
    return true;
  });

  const newCount = alerts.filter(a => a.status === 'NEW').length;
  const reviewedCount = alerts.filter(a => a.status === 'REVIEWED').length;
  const dismissedCount = alerts.filter(a => a.status === 'DISMISSED').length;

  const handleMarkAllReviewed = () => {
    alerts.forEach(a => {
      if (a.status === 'NEW') {
        updateAlertStatus(a.id, 'REVIEWED');
      }
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter and Actions Bar */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Behavioral Alerts & Reflections
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                {alerts.length} Total Generated
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Review flagged behavioral patterns, examine the supporting data, and document your decision theses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {newCount > 0 && (
              <button
                onClick={handleMarkAllReviewed}
                className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark All ({newCount}) as Reviewed
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Status Filter
            </label>
            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              {(['ALL', 'NEW', 'REVIEWED', 'DISMISSED'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                    statusFilter === st
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st === 'NEW' ? `New (${newCount})` : st === 'REVIEWED' ? 'Reviewed' : 'Dismissed'}
                </button>
              ))}
            </div>
          </div>

          {/* Severity Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Severity
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="w-full text-xs bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="ALL">All Severities</option>
              <option value="HIGH">High Severity</option>
              <option value="MODERATE">Moderate Severity</option>
              <option value="LOW">Low Severity</option>
            </select>
          </div>

          {/* Pattern Type Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Bias Pattern
            </label>
            <select
              value={patternFilter}
              onChange={(e) => setPatternFilter(e.target.value as any)}
              className="w-full text-xs bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="ALL">All 6 Patterns</option>
              {Object.entries(PATTERN_SHORT_NAMES).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      {filteredAlerts.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl space-y-3">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No Matching Alerts</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No behavioral alerts match your active filter criteria. Clear filters or change demo scenarios to view more.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAlerts.map(alert => {
            const sev = getAlertSeverityBadge(alert.severity);
            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl glass-card transition-all space-y-4 border ${
                  alert.status === 'DISMISSED'
                    ? 'opacity-60 border-slate-800/50'
                    : alert.status === 'NEW'
                    ? 'border-indigo-500/30 shadow-lg shadow-indigo-950/20'
                    : 'border-slate-800/80'
                }`}
              >
                {/* Header line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>
                      {sev.label}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {alert.title}
                    </span>
                    {alert.ticker && (
                      <span className="text-xs font-mono font-bold bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">
                        {alert.ticker}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      • {alert.detectedAt}
                    </span>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                    alert.status === 'NEW'
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      : alert.status === 'REVIEWED'
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {alert.status}
                  </span>
                </div>

                {/* Evidence Content */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="text-[11px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Observed Metric Evidence
                  </div>
                  <p className="text-xs text-slate-200 font-mono leading-relaxed">
                    {alert.evidence}
                  </p>
                </div>

                {/* Reflection Question */}
                <div className="text-xs text-slate-300 italic flex items-start gap-2">
                  <span className="text-indigo-400 font-bold not-italic">Self-Check:</span>
                  <span>"{alert.reflectionQuestion}"</span>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => setSelectedAlert(alert)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Brain className="w-3.5 h-3.5 text-purple-400" />
                    Open AI Behavioral Explanation
                  </button>

                  <div className="flex items-center gap-2">
                    {alert.status !== 'REVIEWED' && (
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'REVIEWED')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Mark Reviewed
                      </button>
                    )}

                    {alert.status !== 'DISMISSED' && (
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-all"
                      >
                        Dismiss
                      </button>
                    )}

                    {alert.ticker && (
                      <button
                        onClick={() => onNavigate('journal')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        Log Journal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Explanation Modal */}
      {selectedAlert && (
        <AIExplanationPanel
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onNavigateToJournal={(ticker) => {
            setSelectedAlert(null);
            onNavigate('journal');
          }}
        />
      )}
    </div>
  );
};
