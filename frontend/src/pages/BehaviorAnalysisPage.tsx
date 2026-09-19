// ============================================================
// InvestGuard — Behavioral Pattern Analysis Engine Page
// Deep dive into the 6 deterministic emotional bias detectors,
// empirical evidence trails, and cognitive bias definitions.
// ============================================================

import React, { useState } from 'react';
import {
  Activity,
  Brain,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sliders,
  Filter,
  Flame,
  ArrowDownRight,
  PieChart,
  Repeat,
  Hourglass,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PatternType, BehavioralAlert } from '../types';
import {
  PATTERN_DISPLAY_NAMES,
  PATTERN_SHORT_NAMES,
  PATTERN_EXPLANATIONS,
  REFLECTION_QUESTIONS,
} from '../content/copy';
import { getAlertSeverityBadge } from '../lib/formatters';
import { AIExplanationPanel } from '../components/UI/AIExplanationPanel';

interface BehaviorAnalysisPageProps {
  onNavigate: (page: string) => void;
}

export const BehaviorAnalysisPage: React.FC<BehaviorAnalysisPageProps> = ({ onNavigate }) => {
  const { report, alerts, detectionConfig, isAnalyzing, runAnalysis } = useStore();
  const [selectedPattern, setSelectedPattern] = useState<PatternType | 'ALL'>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<BehavioralAlert | null>(null);

  const patternIcons: Record<PatternType, React.ElementType> = {
    FOMO_BUYING: Flame,
    OVERTRADING: Repeat,
    CONCENTRATION: PieChart,
    PANIC_SELLING: ArrowDownRight,
    LOSS_AVERSION: Hourglass,
    MARKET_TIMING: Activity,
  };

  const patternThresholds: Record<PatternType, string> = {
    FOMO_BUYING: `Buy after ≥ ${detectionConfig.fomoPriceSurgeThreshold}% price gain in ${detectionConfig.fomoLookbackDays} days`,
    OVERTRADING: `≥ ${detectionConfig.overtradingTradeCountThreshold} trades executed within a ${detectionConfig.overtradingWindowDays}-day window`,
    CONCENTRATION: `Single holding exceeds ${detectionConfig.concentrationThreshold}% of total portfolio value`,
    PANIC_SELLING: `Sell after ≥ ${detectionConfig.panicDropThreshold}% price drop in ${detectionConfig.panicLookbackDays} days`,
    LOSS_AVERSION: `Unrealized loss ≥ ${detectionConfig.lossAversionDrawdownThreshold}% held for ≥ ${detectionConfig.lossAversionDaysHeldThreshold} days`,
    MARKET_TIMING: `Buy/Sell turnaround in the same ticker within ${detectionConfig.marketTimingWindowDays} days`,
  };

  const allPatterns: PatternType[] = [
    'FOMO_BUYING',
    'OVERTRADING',
    'CONCENTRATION',
    'PANIC_SELLING',
    'LOSS_AVERSION',
    'MARKET_TIMING',
  ];

  const filteredPatterns = selectedPattern === 'ALL'
    ? allPatterns
    : allPatterns.filter(p => p === selectedPattern);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Engine Overview Header */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 flex-shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Deterministic Behavioral Detection Engine
                </h2>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Real-Time Engine Active
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
                InvestGuard evaluates your transactions and portfolio allocations against 6 empirical behavioral finance benchmarks. Every observation provides exact evidence and cognitive psychology definitions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('settings')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              Adjust Thresholds
            </button>
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <Activity className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Evaluating...' : 'Re-Run Analysis'}
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 flex-shrink-0">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            onClick={() => setSelectedPattern('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedPattern === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All 6 Patterns
          </button>
          {allPatterns.map(p => {
            const count = alerts.filter(a => a.patternType === p && a.status !== 'DISMISSED').length;
            return (
              <button
                key={p}
                onClick={() => setSelectedPattern(p)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedPattern === p
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{PATTERN_SHORT_NAMES[p]}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedPattern === p ? 'bg-indigo-800 text-white' : 'bg-rose-500/20 text-rose-300'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pattern Detector Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredPatterns.map(pattern => {
          const Icon = patternIcons[pattern];
          const patternAlerts = alerts.filter(a => a.patternType === pattern && a.status !== 'DISMISSED');
          const indicator = report.indicators.find(i => i.pattern === pattern);
          const explanation = PATTERN_EXPLANATIONS[pattern];
          const question = REFLECTION_QUESTIONS[pattern];
          const thresholdDesc = patternThresholds[pattern];

          const level = indicator?.level || 'LOW';
          const levelBadgeColor =
            level === 'HIGH'
              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              : level === 'MODERATE'
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : level === 'LOW'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700';

          return (
            <div
              key={pattern}
              className="p-6 rounded-2xl glass-card space-y-5 border border-slate-800/80 hover:border-slate-700/80 transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {PATTERN_DISPLAY_NAMES[pattern]}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${levelBadgeColor}`}>
                        {level} Indicator
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      Rule benchmark: {thresholdDesc}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">
                    {patternAlerts.length} Active Signal(s)
                  </span>
                </div>
              </div>

              {/* Psychology Explanation & Mechanism */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <span className="font-bold text-slate-300 block">Definition</span>
                  <p className="text-slate-400 leading-relaxed">{explanation.definition}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <span className="font-bold text-slate-300 block">Psychological Mechanism</span>
                  <p className="text-slate-400 leading-relaxed">{explanation.whyItHappens}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <span className="font-bold text-slate-300 block">Behavioral Risk</span>
                  <p className="text-slate-400 leading-relaxed">{explanation.whatThisMeans}</p>
                </div>
              </div>

              {/* Triggered Evidence Alerts */}
              {patternAlerts.length > 0 ? (
                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                    Triggered Observations & Evidence
                  </span>
                  <div className="space-y-2">
                    {patternAlerts.map(alert => {
                      const sev = getAlertSeverityBadge(alert.severity);
                      return (
                        <div
                          key={alert.id}
                          className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1 max-w-2xl">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>
                                {sev.label}
                              </span>
                              {alert.ticker && (
                                <span className="font-mono font-bold text-xs bg-slate-800 text-indigo-300 px-1.5 py-0.2 rounded border border-slate-700">
                                  {alert.ticker}
                                </span>
                              )}
                              <span className="text-xs text-slate-400">
                                {alert.detectedAt}
                              </span>
                            </div>
                            <p className="text-xs font-mono text-slate-200 leading-relaxed">
                              {alert.evidence}
                            </p>
                          </div>

                          <button
                            onClick={() => setSelectedAlert(alert)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 self-start sm:self-center transition-all"
                          >
                            <Brain className="w-3.5 h-3.5 text-purple-400" />
                            AI Explanation
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center gap-2.5 text-xs text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>No active signals detected for this pattern under current threshold parameters.</span>
                </div>
              )}

              {/* Reflection Prompt */}
              <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-start gap-2.5 text-xs">
                <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-indigo-300">Self-Reflection Question: </strong>
                  <span className="text-slate-300">{question}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Explanation Modal */}
      {selectedAlert && (
        <AIExplanationPanel
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onNavigateToJournal={() => {
            setSelectedAlert(null);
            onNavigate('journal');
          }}
        />
      )}
    </div>
  );
};
