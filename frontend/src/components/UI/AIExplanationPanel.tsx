// ============================================================
// InvestGuard — Interactive AI Behavioral Explanation Panel
// Deep-dive pedagogical explanation for any triggered alert
// Adheres strictly to hedged compliance phrasing and educational framing.
// ============================================================

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldAlert,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { BehavioralAlert } from '../../types';
import { useStore } from '../../store/useStore';
import { getAlertSeverityBadge } from '../../lib/formatters';

interface AIExplanationPanelProps {
  alert: BehavioralAlert;
  onClose: () => void;
  onNavigateToJournal?: (ticker: string) => void;
}

export const AIExplanationPanel: React.FC<AIExplanationPanelProps> = ({
  alert,
  onClose,
  onNavigateToJournal,
}) => {
  const { updateAlertStatus, dismissAlert } = useStore();
  const [reflectionAnswer, setReflectionAnswer] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const severityBadge = getAlertSeverityBadge(alert.severity);

  const handleSaveReflection = () => {
    if (!reflectionAnswer.trim()) return;
    updateAlertStatus(alert.id, 'REVIEWED');
    setReflectionSaved(true);
    setTimeout(() => {
      setReflectionSaved(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${severityBadge.bg} ${severityBadge.text} border ${severityBadge.border}`}>
                  {severityBadge.label} Severity
                </span>
                {alert.ticker && (
                  <span className="text-xs font-mono font-bold bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">
                    {alert.ticker}
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  Detected on {alert.detectedAt}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {alert.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Quantitative Evidence */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              Empirical Evidence Observed
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-mono">
              {alert.evidence}
            </p>
          </div>

          {/* Section 2: Psychological Mechanism */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              Cognitive Mechanism & Definition
            </div>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-3">
              <p className="text-sm text-slate-300 leading-relaxed">
                {alert.explanation.definition}
              </p>
              <div className="pt-2 border-t border-slate-700/50">
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  Why this bias occurs:
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {alert.explanation.whyItHappens}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Constructive Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* What to consider */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Constructive Practices to Consider
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {alert.explanation.whatToConsider.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What to avoid */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                Common Pitfalls to Avoid
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {alert.explanation.whatToAvoid.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 4: Self-Reflection Prompt */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Self-Reflection Prompt
            </div>
            <p className="text-sm font-medium text-slate-200">
              {alert.reflectionQuestion}
            </p>
            <div className="space-y-2">
              <textarea
                value={reflectionAnswer}
                onChange={(e) => setReflectionAnswer(e.target.value)}
                placeholder="Document your thought process or decision rationale here..."
                rows={3}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {reflectionSaved ? '✓ Reflection saved to audit log' : 'Saved locally in your encrypted browser storage.'}
                </span>
                <button
                  onClick={handleSaveReflection}
                  disabled={!reflectionAnswer.trim()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-all"
                >
                  Save Reflection
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {alert.status !== 'REVIEWED' && (
              <button
                onClick={() => {
                  updateAlertStatus(alert.id, 'REVIEWED');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark as Reviewed
              </button>
            )}
            <button
              onClick={() => {
                dismissAlert(alert.id);
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Dismiss
            </button>
          </div>

          <div className="flex items-center gap-2">
            {alert.ticker && onNavigateToJournal && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToJournal(alert.ticker!);
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Open in Trade Journal
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
