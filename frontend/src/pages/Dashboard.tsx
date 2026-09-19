// ============================================================
// InvestGuard — Executive Behavioral Dashboard
// Holistic overview of behavioral health, active alerts,
// portfolio allocation, and quick scenario triggers.
// ============================================================

import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  PieChart,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  RefreshCw,
  Brain,
  HelpCircle,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Sliders,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatINR, formatPercent, getHealthScoreColor, getAlertSeverityBadge } from '../lib/formatters';
import { AIExplanationPanel } from '../components/UI/AIExplanationPanel';
import { BehavioralAlert } from '../types';
import { SCENARIOS } from '../lib/mockData';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const {
    holdings,
    transactions,
    report,
    alerts,
    isDemoMode,
    activeScenario,
    setScenario,
    runAnalysis,
    isAnalyzing,
    updateAlertStatus,
  } = useStore();

  const [selectedAlert, setSelectedAlert] = useState<BehavioralAlert | null>(null);

  // Portfolio aggregates
  const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalInvestedValue = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalUnrealizedPnl = totalPortfolioValue - totalInvestedValue;
  const totalPnlPercent = totalInvestedValue > 0 ? (totalUnrealizedPnl / totalInvestedValue) * 100 : 0;

  const healthColor = getHealthScoreColor(report.behavioralScore);
  const activeAlerts = alerts.filter(a => a.status !== 'DISMISSED');
  const recentAlerts = activeAlerts.slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Demo Scenario Switcher */}
      {isDemoMode && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Interactive Demo Mode
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active Simulation
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Switch scenario presets to see the pure-function behavioral engine evaluate different biases instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setScenario(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeScenario === s.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Behavioral Health Score */}
        <div className="p-5 rounded-2xl glass-card flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Behavioral Health
            </span>
            <div className={`p-2 rounded-xl ${healthColor.bg} border ${healthColor.border}`}>
              <Brain className={`w-4 h-4 ${healthColor.text}`} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold tracking-tight ${healthColor.text}`}>
                {report.behavioralScore}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 100</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Rating: <strong className={healthColor.text}>{healthColor.label}</strong>
            </p>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                report.behavioralScore >= 75 ? 'bg-emerald-500' : report.behavioralScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${report.behavioralScore}%` }}
            />
          </div>
        </div>

        {/* 2. Total Portfolio Value */}
        <div className="p-5 rounded-2xl glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Portfolio Value
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {formatINR(totalPortfolioValue)}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              {totalUnrealizedPnl >= 0 ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +{formatINR(totalUnrealizedPnl)} ({formatPercent(totalPnlPercent)})
                </span>
              ) : (
                <span className="text-xs font-semibold text-rose-400 flex items-center">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {formatINR(totalUnrealizedPnl)} ({formatPercent(totalPnlPercent)})
                </span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Across {holdings.length} simulated positions
          </p>
        </div>

        {/* 3. Active Behavioral Alerts */}
        <div className="p-5 rounded-2xl glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Observed Signals
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {activeAlerts.length}
            </span>
            <p className="text-xs text-slate-300 mt-1">
              {activeAlerts.filter(a => a.severity === 'HIGH').length} High • {activeAlerts.filter(a => a.severity === 'MODERATE').length} Moderate
            </p>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-3 group"
          >
            Review all alerts <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 4. Diversification Score */}
        <div className="p-5 rounded-2xl glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Diversification Index
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-purple-400 tracking-tight">
                {report.diversificationScore}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 100</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {report.diversificationScore >= 70 ? 'Well Balanced' : 'Moderate Concentration'}
            </p>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${report.diversificationScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: 6 Behavioral Indicators & Recent Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 6 Behavioral Indicators Matrix */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Behavioral Bias Indicator Matrix
                </h3>
                <p className="text-xs text-slate-400">
                  Continuous rule-based evaluation across 6 emotional pattern vectors
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('behavior')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
            >
              Deep Dive <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {report.indicators.map((ind) => {
              const levelColor =
                ind.level === 'HIGH'
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : ind.level === 'MODERATE'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : ind.level === 'LOW'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700';

              return (
                <div
                  key={ind.pattern}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-200">
                      {ind.name}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${levelColor}`}>
                      {ind.level}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {ind.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                    <span className="text-slate-400 font-medium">
                      {ind.alertCount} signal(s) triggered
                    </span>
                    <button
                      onClick={() => onNavigate('behavior')}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 text-[11px]"
                    >
                      Details & Rules
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Recent Behavioral Observations */}
        <div className="p-6 rounded-2xl glass-card space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Recent Observations
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {activeAlerts.length} Total
              </span>
            </div>

            {recentAlerts.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800/60 space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-300">
                  No Active Behavioral Alerts
                </p>
                <p className="text-[11px] text-slate-400">
                  Your trading data aligns with established disciplined benchmarks.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAlerts.map((alert) => {
                  const sev = getAlertSeverityBadge(alert.severity);
                  return (
                    <div
                      key={alert.id}
                      className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2.5 hover:border-indigo-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>
                            {sev.label}
                          </span>
                          <h4 className="text-xs font-bold text-white pt-1">
                            {alert.title}
                          </h4>
                        </div>
                        {alert.ticker && (
                          <span className="text-[10px] font-mono font-bold bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded border border-slate-700">
                            {alert.ticker}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed font-mono line-clamp-2">
                        {alert.evidence}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">
                          {alert.detectedAt}
                        </span>
                        <button
                          onClick={() => setSelectedAlert(alert)}
                          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <Brain className="w-3 h-3 text-purple-400" />
                          View AI Explanation
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <button
              onClick={() => onNavigate('alerts')}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all text-center"
            >
              Open Full Alert Center
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Holdings Snapshot & Quick Trade Action */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Top Portfolio Positions
            </h3>
            <p className="text-xs text-slate-400">
              Monitored for concentration risks and holding period drift
            </p>
          </div>

          <button
            onClick={() => onNavigate('portfolio')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
          >
            View All Holdings ({holdings.length}) <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="pb-3 pl-2">Asset / Ticker</th>
                <th className="pb-3 text-right">Quantity</th>
                <th className="pb-3 text-right">Current Price</th>
                <th className="pb-3 text-right">Market Value</th>
                <th className="pb-3 text-right">Allocation</th>
                <th className="pb-3 text-right pr-2">Unrealized P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {holdings.slice(0, 5).map((h) => (
                <tr key={h.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {h.ticker}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-200">{h.name}</div>
                        <div className="text-[10px] text-slate-400">{h.sector}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right font-mono text-slate-300">{h.quantity}</td>
                  <td className="py-3 text-right font-mono text-slate-300">{formatINR(h.currentPrice)}</td>
                  <td className="py-3 text-right font-mono font-bold text-white">{formatINR(h.currentValue)}</td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <span className="font-mono text-slate-300">{h.allocationPercent.toFixed(1)}%</span>
                      {h.allocationPercent >= 25 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Concentrated
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-right pr-2 font-mono font-semibold">
                    <span className={h.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {h.unrealizedPnl >= 0 ? '+' : ''}{formatINR(h.unrealizedPnl)} ({formatPercent(h.unrealizedPnlPercent)})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
