// ============================================================
// InvestGuard — Portfolio & Holdings Breakdown
// Live position monitoring, sector diversification weights,
// and automated concentration risk indicators.
// ============================================================

import React, { useState } from 'react';
import {
  PieChart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Search,
  BookOpen,
  ArrowLeftRight,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatINR, formatPercent } from '../lib/formatters';

interface PortfolioPageProps {
  onNavigate: (page: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onNavigate }) => {
  const { holdings, detectionConfig } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  // Aggregates
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalPnl = totalValue - totalInvested;
  const totalPnlPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  // Sector breakdown
  const sectorMap: Record<string, { value: number; count: number }> = {};
  for (const h of holdings) {
    if (!sectorMap[h.sector]) {
      sectorMap[h.sector] = { value: 0, count: 0 };
    }
    sectorMap[h.sector].value += h.currentValue;
    sectorMap[h.sector].count += 1;
  }

  const sectors = Object.keys(sectorMap);
  const sectorColors = [
    '#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6',
  ];

  // Filtering
  const filteredHoldings = holdings.filter(h => {
    const matchesSearch =
      h.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'ALL' || h.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Value */}
        <div className="p-5 rounded-2xl glass-card">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Portfolio Value
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {formatINR(totalValue)}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            {totalPnl >= 0 ? (
              <span className="text-xs font-semibold text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{formatINR(totalPnl)} ({formatPercent(totalPnlPct)})
              </span>
            ) : (
              <span className="text-xs font-semibold text-rose-400 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {formatINR(totalPnl)} ({formatPercent(totalPnlPct)})
              </span>
            )}
            <span className="text-[11px] text-slate-400">Total Unrealized P&L</span>
          </div>
        </div>

        {/* Invested Capital */}
        <div className="p-5 rounded-2xl glass-card">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Invested Capital
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {formatINR(totalInvested)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Cost basis across {holdings.length} active positions
          </p>
        </div>

        {/* Concentration Alert */}
        <div className="p-5 rounded-2xl glass-card">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Concentration Benchmark
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-indigo-400 tracking-tight">
              {detectionConfig.concentrationThreshold}%
            </span>
            <span className="text-xs text-slate-400">Max Single Position Target</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {holdings.filter(h => h.allocationPercent >= detectionConfig.concentrationThreshold).length} stock(s) exceed benchmark
          </p>
        </div>
      </div>

      {/* Sector Allocation Visual Bar */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Sector Allocation Distribution
            </h3>
            <p className="text-xs text-slate-400">
              Diversification spread across simulated market sectors
            </p>
          </div>
        </div>

        {/* Multi-color segment bar */}
        <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden flex">
          {sectors.map((sec, idx) => {
            const pct = totalValue > 0 ? (sectorMap[sec].value / totalValue) * 100 : 0;
            const color = sectorColors[idx % sectorColors.length];
            return (
              <div
                key={sec}
                title={`${sec}: ${pct.toFixed(1)}%`}
                style={{ width: `${pct}%`, backgroundColor: color }}
                className="h-full transition-all duration-300 hover:opacity-80"
              />
            );
          })}
        </div>

        {/* Sector Legend */}
        <div className="flex flex-wrap gap-4 pt-1">
          {sectors.map((sec, idx) => {
            const pct = totalValue > 0 ? (sectorMap[sec].value / totalValue) * 100 : 0;
            const color = sectorColors[idx % sectorColors.length];
            return (
              <div key={sec} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-slate-300 font-medium">{sec}</span>
                <span className="text-slate-400 font-mono">({pct.toFixed(1)}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Holdings Table */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Active Holdings Log ({filteredHoldings.length})
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated in real-time against simulated daily price feeds
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticker or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48 sm:w-60"
              />
            </div>

            {/* Sector filter */}
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="text-xs bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="ALL">All Sectors</option>
              {sectors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 pl-2">Asset / Ticker</th>
                <th className="pb-3 text-right">Quantity</th>
                <th className="pb-3 text-right">Avg Buy</th>
                <th className="pb-3 text-right">Current Price</th>
                <th className="pb-3 text-right">Market Value</th>
                <th className="pb-3 text-right">Portfolio Share</th>
                <th className="pb-3 text-right">Unrealized P&L</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHoldings.map((h) => {
                const isConcentrated = h.allocationPercent >= detectionConfig.concentrationThreshold;

                return (
                  <tr key={h.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-xs bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">
                          {h.ticker}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-100">{h.name}</div>
                          <div className="text-[10px] text-slate-400">{h.sector}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono text-slate-300">{h.quantity}</td>
                    <td className="py-3 text-right font-mono text-slate-300">{formatINR(h.avgBuyPrice)}</td>
                    <td className="py-3 text-right font-mono text-slate-200 font-semibold">{formatINR(h.currentPrice)}</td>
                    <td className="py-3 text-right font-mono font-bold text-white">{formatINR(h.currentValue)}</td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <span className="font-mono text-slate-300">{h.allocationPercent.toFixed(1)}%</span>
                        {isConcentrated && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                            <ShieldAlert className="w-2.5 h-2.5 text-amber-400" />
                            Overweight
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono font-semibold">
                      <span className={h.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {h.unrealizedPnl >= 0 ? '+' : ''}{formatINR(h.unrealizedPnl)} ({formatPercent(h.unrealizedPnlPercent)})
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onNavigate('transactions')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="View Trade History"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onNavigate('journal')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Open in Journal"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
