import React from 'react';
import { BehaviorAnalysisResult, Transaction } from '../types';
import { Activity, ShieldAlert, Cpu, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BehaviorAnalysisPageProps {
  analysis: BehaviorAnalysisResult | null;
  transactions: Transaction[];
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
}

export const BehaviorAnalysisPage: React.FC<BehaviorAnalysisPageProps> = ({
  analysis,
  transactions,
  onRunAnalysis,
  isAnalyzing,
}) => {
  const patterns = [
    {
      id: 'FOMO-like Buying',
      title: '1. FOMO-Like Buying',
      rule: 'Detects purchases executed shortly after significant positive market price increases (>5-10%).',
      status: 'Moderate Risk',
      evidence: 'Purchase of NVDA occurred shortly after a significant price rally (+7.3%).',
      explanation: 'Your transaction data indicates buying activity following positive price momentum. The system cannot establish why the trade occurred.',
      reflection: 'Was this purchase part of your original investment strategy or a reaction to recent momentum?',
      txs: transactions.filter((t) => t.symbol === 'NVDA' && t.type === 'BUY')
    },
    {
      id: 'Panic Selling',
      title: '2. Panic-Selling Pattern',
      rule: 'Detects position liquidations executed shortly after steep market price declines (>5-8%).',
      status: 'Low Risk',
      evidence: 'Position in TATAMOTORS was sold shortly after a single-day morning drop of -5.9%.',
      explanation: 'The transaction log shows a sell order following negative price movement. Transaction data alone cannot determine your rationale.',
      reflection: 'Did the underlying fundamental reason for owning the investment change prior to selling?',
      txs: transactions.filter((t) => t.symbol === 'TATAMOTORS' && t.type === 'SELL')
    },
    {
      id: 'Overtrading',
      title: '3. Overtrading',
      rule: 'Analyzes weekly trade velocity against your historical baseline trade frequency.',
      status: 'High Risk',
      evidence: '8 transactions executed during the last 5 days compared with your baseline average of 1.8 trades/week.',
      explanation: 'Your transaction velocity has quadrupled over your historical weekly baseline, representing high trading activity.',
      reflection: 'Was each transaction part of a predefined, structured strategy?',
      txs: transactions.slice(0, 5)
    },
    {
      id: 'Concentration',
      title: '4. Concentration Alert',
      rule: 'Calculates (Holding Value / Total Portfolio Value) * 100 with default cap threshold of 30%.',
      status: 'High Risk',
      evidence: '41.2% of your portfolio is currently allocated to one holding (NVDA).',
      explanation: 'A single asset currently represents over 30% of your total portfolio valuation, increasing individual stock risk.',
      reflection: 'Does this single-holding allocation match your intended portfolio strategy?',
      txs: transactions.filter((t) => t.symbol === 'NVDA')
    },
    {
      id: 'Loss Aversion',
      title: '5. Loss-Aversion Pattern',
      rule: 'Monitors declining positions held past thesis reconsider timelines to avoid realizing loss.',
      status: 'Moderate Risk',
      evidence: 'Position in TSLA has declined by -9.5% while holding continues.',
      explanation: 'Transaction records show continued holding despite negative performance past your initial reconsider window.',
      reflection: 'Are you holding because the asset fits your plan today, or because you want to return to your original purchase price?',
      txs: transactions.filter((t) => t.symbol === 'TSLA')
    },
    {
      id: 'Market Timing',
      title: '6. Market-Timing Behavior',
      rule: 'Detects repeated short-term buy and sell transactions reacting to short-term price swings.',
      status: 'High Risk',
      evidence: 'Multiple short-term entry and exit orders recorded for GOOGL and TSLA within 7 days.',
      explanation: 'Short-term trading activity introduces transaction costs and volatility exposure.',
      reflection: 'Are these short-term trades part of a systematic plan, or responses to market noise?',
      txs: transactions.filter((t) => ['GOOGL', 'TSLA'].includes(t.symbol))
    }
  ];

  const timelineData = [
    { period: 'W1', trades: 2, fomo: 0, overtrade: 0 },
    { period: 'W2', trades: 1, fomo: 0, overtrade: 0 },
    { period: 'W3', trades: 3, fomo: 1, overtrade: 0 },
    { period: 'W4 (Current)', trades: 8, fomo: 1, overtrade: 1 }
  ];

  return (
    <div className="space-y-6">
      {/* ML Pipeline Architecture Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-800/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-700/50 text-purple-300 text-xs font-semibold mb-2">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              Hybrid ML + Rule Engine Active
            </div>
            <h2 className="text-xl font-bold text-white">Behavioral Detection & ML Anomaly Pipeline</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Combines explainable deterministic rules with an <strong>Isolation Forest ML model</strong> trained on 10 quantitative transaction features.
            </p>
          </div>
          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-purple-900/50 flex items-center gap-2 shrink-0"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Running Pipeline...' : 'Run Pipeline Analysis'}</span>
          </button>
        </div>

        {/* Feature Weights Matrix */}
        {analysis?.ml_analysis && (
          <div className="mt-6 pt-4 border-t border-purple-800/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Isolation Forest Score</span>
              <strong className="text-purple-300 text-sm">{analysis.ml_analysis.anomaly_score}</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Trades / Week</span>
              <strong className="text-white text-sm">{analysis.ml_analysis.features?.trades_per_week || 8}</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Max Portfolio Conc.</span>
              <strong className="text-amber-300 text-sm">{analysis.ml_analysis.features?.portfolio_concentration || 41.2}%</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Short-Term Trade Ratio</span>
              <strong className="text-rose-300 text-sm">{(analysis.ml_analysis.features?.short_term_trade_ratio || 0.65) * 100}%</strong>
            </div>
          </div>
        )}
      </div>

      {/* Behavioral Timeline Chart */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-1">Behavioral Velocity Timeline</h3>
        <p className="text-xs text-slate-400 mb-4">Weekly transaction volume spikes & detected antipattern frequency</p>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timelineData}>
              <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0d1b2e', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="trades" name="Total Trades" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="overtrade" name="Overtrading Signal" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6 Antipattern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patterns.map((p) => (
          <div key={p.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-white">{p.title}</h3>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${p.status.includes('High') ? 'bg-rose-950 text-rose-300 border-rose-800' : p.status.includes('Moderate') ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-emerald-950 text-emerald-300 border-emerald-800'}`}>
                  {p.status}
                </span>
              </div>

              <div className="text-xs text-slate-400 italic mb-3">
                <strong className="text-slate-300 font-semibold not-italic">Rule Logic: </strong>
                {p.rule}
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
                <div>
                  <strong className="text-slate-300 block mb-0.5">Evidence:</strong>
                  <span className="text-slate-200">{p.evidence}</span>
                </div>
                <div>
                  <strong className="text-purple-300 block mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    AI Neutral Explanation:
                  </strong>
                  <p className="text-slate-300 leading-relaxed">{p.explanation}</p>
                </div>
              </div>
            </div>

            {/* Guided Reflection Box */}
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-start gap-2.5 text-xs">
              <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-200 block font-semibold mb-0.5">Guided Reflection Prompt:</strong>
                <p className="text-purple-300/90 font-medium">{p.reflection}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
