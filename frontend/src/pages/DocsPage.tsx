import React from 'react';
import { FileText, Cpu, Activity, Shield, Sparkles, CheckCircle2, Layers } from 'lucide-react';

export const DocsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto text-slate-300 text-xs leading-relaxed">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-800/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-purple-300">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">InvestGuard · Project Report & Architecture</h1>
            <p className="text-xs text-purple-300 font-medium">Hefty Hacks 2026 · Finance × Trading Track Submission</p>
          </div>
        </div>
      </div>

      {/* Section 1: Product Concept */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" />
          1. Product Concept & Problem Statement
        </h2>
        <p>
          Retail investors frequently suffer avoidable portfolio degradation due to recurring behavioral antipatterns—such as FOMO buying, panic selling, overtrading, single-stock over-concentration, loss aversion, and market timing.
        </p>
        <p>
          <strong>InvestGuard</strong> provides an explainable behavioral analysis platform that converts portfolio allocations, transaction logs, and live market data into evidence-backed smart alerts with guided self-reflection prompts.
        </p>
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-purple-300 font-medium">
          🛡️ <strong>Non-Advisory Mandate:</strong> InvestGuard never tells users which stock to buy or sell, does not guarantee returns, and does not diagnose psychological conditions.
        </div>
      </div>

      {/* Section 2: Technical Innovation */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          2. Technical Architecture & Hybrid Pipeline
        </h2>
        <p>
          The application implements a multi-layer analysis pipeline:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs my-2">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-white block font-bold">Layer 1: Deterministic Rule Engine</strong>
            <p className="text-slate-400">Evaluates 6 mathematical behavioral antipattern detectors (FOMO, Panic Sell, Overtrading, Concentration &gt;30%, Loss Aversion, Market Timing).</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-white block font-bold">Layer 2: ML Isolation Forest</strong>
            <p className="text-slate-400">Numerical anomaly model trained on 10 quantitative features (trades/week, holding periods, concentration, price change sensitivity).</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-white block font-bold">Layer 3: AI Explanation Layer</strong>
            <p className="text-slate-400">Generates concise, neutral, non-advisory explanations and guided reflection questions based on factual evidence.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-white block font-bold">Layer 4: Market Data & Fallback</strong>
            <p className="text-slate-400">MarketDataService and NewsService with clean realistic mock data fallback ensuring zero downtime during hackathon presentations.</p>
          </div>
        </div>
      </div>

      {/* Section 3: REST API & Tech Stack */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          3. Tech Stack & Backend REST APIs
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] mb-3">
          <span className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">FastAPI (Python)</span>
          <span className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">SQLAlchemy / SQLite</span>
          <span className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">scikit-learn (IsolationForest)</span>
          <span className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">React + TypeScript</span>
        </div>
        <p>Implemented API Endpoints:</p>
        <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-purple-300">
          <li>GET /api/portfolio</li>
          <li>GET /api/holdings</li>
          <li>GET /api/transactions & POST /api/transactions</li>
          <li>GET /api/behavior-analysis & POST /api/behavior-analysis/run</li>
          <li>GET /api/alerts & PATCH /api/alerts/{`{id}`}</li>
          <li>GET /api/journal & POST /api/journal</li>
          <li>GET /api/planner & POST /api/planner</li>
          <li>GET /api/market/{`{symbol}`} & GET /api/news/{`{symbol}`}</li>
        </ul>
      </div>

      {/* Section 4: Live Demo Instructions */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          4. Hackathon Judge Live Demo Walkthrough
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-slate-300">
          <li>Click <strong>TRY DEMO MODE</strong> to load pre-populated portfolio and transaction logs.</li>
          <li>Inspect <strong>Portfolio Holdings</strong> to observe the 41.2% single-asset concentration in NVDA.</li>
          <li>Open <strong>Transactions</strong> to view the cluster of 8 trades in 5 days.</li>
          <li>Click <strong>Run Behavioral Analysis</strong> to execute the Rule Engine + Isolation Forest ML pipeline.</li>
          <li>Open <strong>Smart Alerts</strong> to review generated evidence and AI neutral explanations.</li>
          <li>Navigate to <strong>Investment Journal</strong> to compare original investment thesis vs actual trade execution.</li>
        </ol>
      </div>
    </div>
  );
};
