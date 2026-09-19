// ============================================================
// InvestGuard — High-Converting Landing Page
// Showcase behavioral analytics platform value proposition,
// 6 cognitive bias detectors, and one-click demo launch.
// ============================================================

import React from 'react';
import {
  ShieldCheck,
  Brain,
  Activity,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  PieChart,
  Repeat,
  Flame,
  Hourglass,
  ArrowDownRight,
  Sliders,
  BookOpen,
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const { enterDemoMode } = useStore();

  const handleLaunchDemo = () => {
    enterDemoMode('DEFAULT');
    onEnterApp();
  };

  const biases = [
    { name: 'FOMO Buying', icon: Flame, color: 'text-amber-400', desc: 'Identifies purchases made after steep momentum run-ups.' },
    { name: 'Overtrading', icon: Repeat, color: 'text-purple-400', desc: 'Flags hyperactive trade clustering and transaction friction.' },
    { name: 'Concentration Risk', icon: PieChart, color: 'text-blue-400', desc: 'Warns when single positions exceed prudent portfolio limits.' },
    { name: 'Panic Selling', icon: ArrowDownRight, color: 'text-rose-400', desc: 'Detects emotional exits during temporary market dips.' },
    { name: 'Loss Aversion', icon: Hourglass, color: 'text-emerald-400', desc: 'Surfaces positions held through prolonged deep drawdowns.' },
    { name: 'Market Timing', icon: Activity, color: 'text-cyan-400', desc: 'Flags rapid buy-sell reversals that destroy compound gains.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Nav */}
      <header className="h-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-tight">InvestGuard</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Behavioral Investment Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLaunchDemo}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all group"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Launch Live Interactive Demo</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 lg:py-24 space-y-20 flex-1">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span>Hefty Hacks 2026 • Finance × Trading Track</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Understand your investment behavior{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              before it becomes a habit.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            InvestGuard evaluates your real trading executions against 6 transparent cognitive bias detectors. Uncover evidence-based behavioral patterns with zero stock recommendations.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleLaunchDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/40 flex items-center justify-center gap-2.5 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Explore Interactive Demo (Pre-Loaded)</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              100% Client-Side Private
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              SEBI Compliant Framing
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              Deterministic Rule Engine
            </span>
          </div>
        </div>

        {/* 6 Bias Features Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">
              6 Built-In Behavioral Bias Detectors
            </h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Transparent, mathematical benchmarks evaluate your trading history to promote disciplined decision-making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {biases.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.name}
                  className="p-6 rounded-2xl glass-card space-y-3 border border-slate-800/80 hover:border-indigo-500/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${b.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-white">{b.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Value Prop Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Ready to analyze your investing discipline?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No account creation or API credentials needed. Launch the fully simulated platform with 7 pre-scripted market scenarios immediately.
            </p>
          </div>

          <button
            onClick={handleLaunchDemo}
            className="px-6 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all shadow-xl flex-shrink-0 flex items-center gap-2"
          >
            <span>Start Simulation Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Compliance Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-6 text-center text-xs text-slate-400 space-y-2">
        <p className="max-w-4xl mx-auto text-[11px] leading-relaxed text-slate-400">
          <strong>Compliance Disclaimer:</strong> InvestGuard is a behavioral-analytics simulation tool for educational and research purposes. It does not provide financial, trading, or investment advice. All simulated assets are fictional entities.
        </p>
        <p className="text-[10px] text-slate-400">
          InvestGuard MVP • Built for Hefty Hacks 2026
        </p>
      </footer>
    </div>
  );
};
