import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { BookOpen, Plus, Sparkles, CheckCircle2, ArrowRight, HelpCircle, X } from 'lucide-react';

interface JournalPageProps {
  journals: JournalEntry[];
  onAddJournal: (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
}

export const JournalPage: React.FC<JournalPageProps> = ({ journals, onAddJournal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [symbol, setSymbol] = useState('TATAMOTORS');
  const [thesis, setThesis] = useState('Long-term fundamental thesis based on EV production expansion and commercial vehicle demand.');
  const [holdingPeriod, setHoldingPeriod] = useState('2-3 Years');
  const [reconsiderCondition, setReconsiderCondition] = useState('Reconsider if quarterly EV gross margins drop below 12% for 2 consecutive quarters.');
  const [reflection, setReflection] = useState('Sold position after 3 days following a 5.9% morning price pullback.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAddJournal({
        symbol,
        thesis,
        holding_period: holdingPeriod,
        reconsider_condition: reconsiderCondition,
        reflection
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to add journal entry', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            Investment Intent Journal
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track original investment theses vs actual trade executions to evaluate discipline.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Entry</span>
        </button>
      </div>

      {/* Thesis vs Action Comparison Cards */}
      <div className="space-y-6">
        {journals.map((j) => (
          <div key={j.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white bg-purple-950 border border-purple-800 px-3 py-1 rounded-lg">
                  {j.symbol}
                </span>
                <span className="text-xs text-slate-400">Target Horizon: <strong className="text-slate-200">{j.holding_period}</strong></span>
              </div>
              <span className="text-xs text-slate-400 font-mono">{new Date(j.created_at).toLocaleDateString()}</span>
            </div>

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  ORIGINAL THESIS
                </div>
                <p className="text-slate-200 leading-relaxed font-medium">{j.thesis}</p>
                <div className="pt-2 border-t border-slate-800/60 text-slate-400">
                  <strong className="text-slate-300 block mb-0.5">Reconsider Condition:</strong>
                  {j.reconsider_condition}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 space-y-2">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                  ACTUAL EXECUTION / ACTION
                </div>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {j.reflection || 'Position modified within short holding timeframe.'}
                </p>
                <div className="pt-2 border-t border-amber-800/30 text-amber-300/80">
                  <strong className="text-amber-200 block mb-0.5">Thesis Alignment Check:</strong>
                  Action occurred prior to original target holding window.
                </div>
              </div>
            </div>

            {/* Reflection prompt */}
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-start gap-2.5 text-xs">
              <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-200 block font-semibold mb-0.5">Self-Reflection Question:</strong>
                <p className="text-purple-300">
                  Did your original investment thesis change, or was this action influenced by short-term price fluctuations?
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Journal Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1b2e] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Record Investment Intent
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Symbol</label>
                  <input
                    type="text"
                    required
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Expected Holding Window</label>
                  <input
                    type="text"
                    required
                    value={holdingPeriod}
                    onChange={(e) => setHoldingPeriod(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Why am I investing? (Core Thesis)</label>
                <textarea
                  rows={2}
                  required
                  value={thesis}
                  onChange={(e) => setThesis(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">What would make me reconsider?</label>
                <textarea
                  rows={2}
                  required
                  value={reconsiderCondition}
                  onChange={(e) => setReconsiderCondition(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Actual Trade Reflection / What happened?</label>
                <textarea
                  rows={2}
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-900/40"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
