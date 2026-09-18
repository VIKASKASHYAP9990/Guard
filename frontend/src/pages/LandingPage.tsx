import React from 'react';
import { Shield, Sparkles, Activity, AlertTriangle, PieChart, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: string) => void;
  onResetDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onResetDemo }) => {
  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100 flex flex-col justify-between">
      {/* Top Banner */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-900/50">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Invest<span className="text-purple-400">Guard</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            EXPLORE DASHBOARD
          </button>
          <button
            onClick={() => { onResetDemo(); onNavigate('dashboard'); }}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40 transition"
          >
            TRY DEMO
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 text-center flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Hefty Hacks 2026 · Finance × Trading Track</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
          Understand your investment behavior <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400">before it becomes a habit.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed">
          Analyze portfolio and transaction patterns, discover explainable behavioral signals, and review your investment decisions with greater awareness.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => { onResetDemo(); onNavigate('dashboard'); }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-purple-900/50 flex items-center justify-center gap-2 transition group"
          >
            <span>TRY DEMO MODE</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700/80 transition"
          >
            EXPLORE DASHBOARD
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center mb-4 text-purple-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Deterministic Rule Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects 6 distinct behavioral antipatterns including FOMO-like buying, panic selling, overtrading, concentration risk, loss aversion, and market timing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center mb-4 text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">ML Isolation Forest</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Numerical anomaly engine evaluating 10 quantitative features to isolate trade frequency spikes and baseline deviations without stock price prediction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center mb-4 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Explanation Layer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Translates complex trade logs into evidence-backed neutral explanations and guided reflection prompts. Zero buy/sell recommendations or emotional judgment.
            </p>
          </div>
        </div>

        {/* Product Principles Disclaimer */}
        <div className="mt-12 p-4 rounded-xl bg-slate-950/60 border border-slate-800 max-w-3xl text-left flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200">InvestGuard Core Principle:</strong> Non-advisory educational platform. InvestGuard never tells investors what to buy or sell, does not guarantee returns, and does not diagnose psychological conditions.
          </div>
        </div>
      </main>
    </div>
  );
};
