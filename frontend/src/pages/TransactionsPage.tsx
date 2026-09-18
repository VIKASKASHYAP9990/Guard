import React, { useState } from 'react';
import { Transaction } from '../types';
import { Search, Plus, ArrowLeftRight, X, Sparkles } from 'lucide-react';

interface TransactionsPageProps {
  transactions: Transaction[];
  onAddTransaction: (tx: {
    symbol: string;
    company: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    reason?: string;
    expected_holding_period?: string;
  }) => Promise<void>;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, onAddTransaction }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [symbol, setSymbol] = useState('NVDA');
  const [company, setCompany] = useState('NVIDIA Corporation');
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState(50);
  const [price, setPrice] = useState(128.4);
  const [reason, setReason] = useState('Purchased after short rally');
  const [expectedHoldingPeriod, setExpectedHoldingPeriod] = useState('6 Months');

  const filtered = transactions.filter((t) => {
    const matchSearch = t.symbol.toLowerCase().includes(search.toLowerCase()) || t.company.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'ALL' || t.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddTransaction({
        symbol,
        company,
        type,
        quantity: Number(quantity),
        price: Number(price),
        reason,
        expected_holding_period: expectedHoldingPeriod,
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to submit transaction', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1 rounded-md transition ${typeFilter === 'ALL' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('BUY')}
              className={`px-3 py-1 rounded-md transition ${typeFilter === 'BUY' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400'}`}
            >
              Buys
            </button>
            <button
              onClick={() => setTypeFilter('SELL')}
              className={`px-3 py-1 rounded-md transition ${typeFilter === 'SELL' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400'}`}
            >
              Sells
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg shadow-purple-900/40 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-purple-400" />
            Transaction History Logs ({filtered.length})
          </h3>
          <span className="text-xs text-slate-400">Triggers Behavior Analysis & Alert Pipeline automatically</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">Symbol / Company</th>
                <th className="p-4 text-right">Quantity</th>
                <th className="p-4 text-right">Execution Price</th>
                <th className="p-4 text-right">Total Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Reason / Thesis</th>
                <th className="p-4">Expected Holding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded border ${t.type === 'BUY' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-rose-950 text-rose-300 border-rose-800'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white">{t.symbol}</div>
                    <div className="text-[11px] text-slate-400">{t.company}</div>
                  </td>
                  <td className="p-4 text-right font-mono font-semibold text-slate-200">{t.quantity}</td>
                  <td className="p-4 text-right font-mono text-slate-200">₹{t.price}</td>
                  <td className="p-4 text-right font-mono font-bold text-white">₹{(t.quantity * t.price).toLocaleString('en-IN')}</td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="p-4 text-slate-300 max-w-xs truncate">{t.reason || '—'}</td>
                  <td className="p-4 text-slate-400">{t.expected_holding_period || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1b2e] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                Add Trade Execution
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Stock Symbol</label>
                  <input
                    type="text"
                    required
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Company Name</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'BUY' | 'SELL')}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Price (₹)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Reason for Trade</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why are you making this trade?"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Expected Holding Period</label>
                <input
                  type="text"
                  value={expectedHoldingPeriod}
                  onChange={(e) => setExpectedHoldingPeriod(e.target.value)}
                  placeholder="e.g. 6 Months, 2 Years"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
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
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-900/40 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Processing Pipeline...' : 'Save & Analyze'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
