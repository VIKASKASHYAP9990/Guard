// ============================================================
// InvestGuard — Header Bar Component
// Top navigation bar with live Behavioral Score badge,
// manual re-analysis trigger, search, and profile status.
// ============================================================

import React from 'react';
import {
  Menu,
  Activity,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  User,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { getHealthScoreColor } from '../lib/formatters';

interface HeaderProps {
  onToggleSidebar: () => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  currentPage,
}) => {
  const {
    user,
    report,
    isAnalyzing,
    runAnalysis,
    isDemoMode,
    activeScenario,
    transactions,
  } = useStore();

  const getPageTitle = (page: string): { title: string; subtitle: string } => {
    switch (page) {
      case 'dashboard':
        return {
          title: 'Executive Behavioral Dashboard',
          subtitle: 'Holistic behavioral health overview and trading habits analysis',
        };
      case 'behavior':
        return {
          title: 'Behavioral Pattern Engine',
          subtitle: 'Rule-based pattern detection across 6 emotional bias categories',
        };
      case 'alerts':
        return {
          title: 'Behavioral Alerts & Reflections',
          subtitle: 'Evidence-based behavioral signals with interactive AI explanations',
        };
      case 'portfolio':
        return {
          title: 'Portfolio & Holdings Breakdown',
          subtitle: 'Real-time asset allocations and position-level risk metrics',
        };
      case 'transactions':
        return {
          title: 'Transaction History & Trade Log',
          subtitle: 'Manage buy/sell executions and analyze chronological patterns',
        };
      case 'journal':
        return {
          title: 'Pre-Trade Journal & Thesis Tracker',
          subtitle: 'Document rationales before trading to contrast with actual outcomes',
        };
      case 'planner':
        return {
          title: 'Investment Goal Planner',
          subtitle: 'Calculate compounding trajectories and project behavioral goals',
        };
      case 'learn':
        return {
          title: 'Behavioral Finance Academy',
          subtitle: 'Master investor psychology and cognitive biases in market cycles',
        };
      case 'settings':
        return {
          title: 'Detection Sensitivity & Settings',
          subtitle: 'Customize threshold parameters for all 6 behavioral detectors',
        };
      default:
        return {
          title: 'InvestGuard Analytics',
          subtitle: 'Behavioral intelligence for mindful investors',
        };
    }
  };

  const pageInfo = getPageTitle(currentPage);
  const healthColor = getHealthScoreColor(report.behavioralScore);

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between">
      {/* Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm lg:text-base font-bold text-white tracking-tight flex items-center gap-2">
            {pageInfo.title}
            {isDemoMode && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-2.5 h-2.5" />
                Demo: {activeScenario}
              </span>
            )}
          </h1>
          <p className="hidden md:block text-xs text-slate-400 truncate max-w-md">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Actions & Health Score Pill */}
      <div className="flex items-center gap-3">
        {/* Behavioral Score Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 shadow-inner">
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Health Score
            </span>
            <span className={`text-xs font-bold ${healthColor.text}`}>
              {report.behavioralScore}/100 • {healthColor.label}
            </span>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${healthColor.bg} border ${healthColor.border} animate-pulse`}
          />
        </div>

        {/* Re-analyze Engine Button */}
        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all text-xs font-semibold disabled:opacity-50"
          title="Re-run all 6 behavioral pattern detectors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">
            {isAnalyzing ? 'Analyzing...' : 'Re-Evaluate'}
          </span>
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 font-semibold text-xs">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
