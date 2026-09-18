import React from 'react';
import { Shield, Sparkles, Cpu, Menu } from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onRunAnalysis,
  isAnalyzing,
  onOpenMobileMenu,
}) => {
  const routeTitles: Record<string, string> = {
    landing: 'Home',
    dashboard: 'Overview',
    portfolio: 'Portfolio Holdings',
    transactions: 'Transaction History',
    analysis: 'Behavior Analysis Pipeline',
    alerts: 'Smart Alerts Center',
    journal: 'Investment Journal',
    planner: 'Investment Planner',
    learn: 'Behavioral Education',
    docs: 'Hackathon Report & Architecture'
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-[#07111f]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden text-slate-400 hover:text-white p-1 rounded-md"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="font-semibold text-purple-400">InvestGuard</span>
          <span>/</span>
          <strong className="text-slate-100 font-medium">{routeTitles[currentRoute] || 'Overview'}</strong>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <Cpu className="w-3.5 h-3.5" />
          <span>Isolation Forest ML Active</span>
        </div>

        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-lg shadow-lg shadow-purple-900/30 transition-all duration-200"
        >
          <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing...' : 'Run Behavioral Analysis'}</span>
        </button>

        <button
          onClick={() => onNavigate('docs')}
          className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition"
        >
          <Shield className="w-3.5 h-3.5 text-purple-400" />
          <span>Report & Docs</span>
        </button>
      </div>
    </header>
  );
};
