// ============================================================
// InvestGuard — Transaction History & Trade Entry
// Full CRUD for trade executions with automatic behavior engine updates.
// ============================================================

import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Plus,
  Trash2,
  Filter,
  Download,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { TradeType, Transaction } from '../types';
import { formatINR } from '../lib/formatters';
import { FICTIONAL_TICKERS, getLatestPrice } from '../lib/mockData';

interface TransactionsPageProps {
  onNavigate: (page: string) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onNavigate }) => {
  const { transactions, addTransaction, deleteTransaction } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<TradeType | 'ALL'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New trade form state
  const [formData, setFormData] = useState({
    ticker: FICTIONAL_TICKERS[0].ticker,
    type: 'BUY' as TradeType,
    quantity: 10,
    price: FICTIONAL_TICKERS[0].initialPrice,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    reason: 'Long-term growth',
    intendedHoldingPeriod: '6_TO_12_MONTHS',
  });

  const handleTickerChange = (ticker: string) => {
    const stock = FICTIONAL_TICKERS.find(t => t.ticker === ticker);
    const latestPrice = getLatestPrice(ticker);
    setFormData(prev => ({
      ...prev,
      ticker,
      price: latestPrice > 0 ? latestPrice : (stock?.initialPrice || 100),
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stock = FICTIONAL_TICKERS.find(t => t.ticker === formData.ticker);

    addTransaction({
      ticker: formData.ticker,
      name: stock?.name || formData.ticker,
      sector: stock?.sector || 'General',
      type: formData.type,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      date: formData.date,
      notes: formData.notes,
      reason: formData.reason,
      intendedHoldingPeriod: formData.intendedHoldingPeriod,
    });

    setIsAddModalOpen(false);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch =
      t.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleExportCSV = () => {
    const headers = ['Date', 'Ticker', 'Name', 'Sector', 'Type', 'Quantity', 'Price', 'Total Amount', 'Reason'];
    const rows = filteredTransactions.map(t => [
      t.date,
      t.ticker,
      `"${t.name}"`,
      t.sector || '',
      t.type,
      t.quantity,
      t.price,
      t.amount,
      `"${t.reason || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `investguard_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Action Controls */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Transaction History & Trade Log
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                {transactions.length} Total Trades
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Every trade is evaluated against your behavioral indicators in real time.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Record New Trade
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticker or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-52 sm:w-64"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
              {(['ALL', 'BUY', 'SELL'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    typeFilter === type
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-slate-400">
            Showing {filteredTransactions.length} of {transactions.length} entries
          </span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 pl-2">Date</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Asset / Ticker</th>
                <th className="pb-3 text-right">Quantity</th>
                <th className="pb-3 text-right">Execution Price</th>
                <th className="pb-3 text-right">Total Turnover</th>
                <th className="pb-3">Decision Thesis / Reason</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 pl-2 font-mono text-slate-400">{tx.date}</td>
                  <td className="py-3">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                      tx.type === 'BUY'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">
                        {tx.ticker}
                      </span>
                      <span className="font-medium text-slate-200">{tx.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-mono text-slate-300">{tx.quantity}</td>
                  <td className="py-3 text-right font-mono text-slate-300">{formatINR(tx.price)}</td>
                  <td className="py-3 text-right font-mono font-bold text-white">{formatINR(tx.amount)}</td>
                  <td className="py-3 text-slate-400 max-w-xs truncate">
                    {tx.reason || tx.notes || '—'}
                  </td>
                  <td className="py-3 text-right pr-2">
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Trade"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Trade Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Record New Simulated Trade</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Ticker selector */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Fictional Indian Stock Ticker</label>
                <select
                  value={formData.ticker}
                  onChange={(e) => handleTickerChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {FICTIONAL_TICKERS.map(t => (
                    <option key={t.ticker} value={t.ticker}>
                      {t.ticker} — {t.name} ({t.sector})
                    </option>
                  ))}
                </select>
              </div>

              {/* Trade Type */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, type: 'BUY' }))}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    formData.type === 'BUY'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  BUY (Long Position)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, type: 'SELL' }))}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    formData.type === 'SELL'
                      ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  SELL (Exit Position)
                </button>
              </div>

              {/* Quantity and Price */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Quantity (Shares)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData(p => ({ ...p, quantity: Math.max(1, Number(e.target.value)) }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Execution Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(p => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Trade Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Investment Thesis & Holding Period */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Primary Rationale</label>
                  <select
                    value={formData.reason}
                    onChange={(e) => setFormData(p => ({ ...p, reason: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Long-term growth">Long-term growth</option>
                    <option value="Valuation">Valuation</option>
                    <option value="Dividend">Dividend</option>
                    <option value="Short-term opportunity">Short-term opportunity</option>
                    <option value="Portfolio allocation">Portfolio allocation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Intended Holding Period</label>
                  <select
                    value={formData.intendedHoldingPeriod}
                    onChange={(e) => setFormData(p => ({ ...p, intendedHoldingPeriod: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="LESS_THAN_1_MONTH">&lt; 1 Month</option>
                    <option value="1_TO_6_MONTHS">1 to 6 Months</option>
                    <option value="6_TO_12_MONTHS">6 to 12 Months</option>
                    <option value="1_TO_3_YEARS">1 to 3 Years</option>
                    <option value="3_PLUS_YEARS">3+ Years</option>
                  </select>
                </div>
              </div>

              {/* Total Calculation Preview */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Total Transaction Amount:</span>
                <span className="text-white font-bold text-sm">
                  {formatINR(formData.quantity * formData.price)}
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save & Evaluate Behavior
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
