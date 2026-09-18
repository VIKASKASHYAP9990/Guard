import React, { useState } from 'react';
import { Holding } from '../types';
import { Search, Filter, AlertTriangle, ArrowUpDown, PieChart, Layers } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export const PortfolioPage: React.FC<{ holdings: Holding[] }> = ({ holdings }) => {
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState<'current_value' | 'portfolio_percent' | 'gain_loss_percent'>('current_value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const totalPortfolioVal = holdings.reduce((sum, h) => sum + (h.quantity * h.current_price), 0);

  // Check for high concentration
  const concentratedHolding = holdings.find((h) => {
    const pct = ((h.quantity * h.current_price) / (totalPortfolioVal || 1)) * 100;
    return pct >= 30;
  });

  const sectors = ['ALL', ...Array.from(new Set(holdings.map((h) => h.sector)))];

  const filteredHoldings = holdings
    .filter((h) => {
      const matchSearch = h.symbol.toLowerCase().includes(search.toLowerCase()) || h.company.toLowerCase().includes(search.toLowerCase());
      const matchSector = sectorFilter === 'ALL' || h.sector === sectorFilter;
      return matchSearch && matchSector;
    })
    .sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

  const pieData = holdings.map((h) => ({
    name: h.symbol,
    value: Math.round((h.quantity * h.current_price) / (totalPortfolioVal || 1) * 1000) / 10
  }));

  const handleSort = (key: 'current_value' | 'portfolio_percent' | 'gain_loss_percent') => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Concentration Warning Banner */}
      {concentratedHolding && (
        <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-amber-200">
              Concentration Risk Detected: {concentratedHolding.symbol}
            </div>
            <div className="text-xs text-amber-300/90 mt-0.5">
              {((concentratedHolding.quantity * concentratedHolding.current_price) / (totalPortfolioVal || 1) * 100).toFixed(1)}% of your portfolio is currently allocated to {concentratedHolding.company}. Consider whether this single holding matches your intended strategy.
            </div>
          </div>
        </div>
      )}

      {/* Top Controls & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by symbol or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>{sec === 'ALL' ? 'All Sectors' : sec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Portfolio Breakdown Charts & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-400" />
            Holding Allocation Weights (%)
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={3}
                >
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0d1b2e', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-2">Portfolio Metrics</h3>
            <div className="space-y-4 mt-4 text-xs">
              <div>
                <span className="text-slate-400">Total Portfolio Value:</span>
                <div className="text-xl font-bold text-white mt-0.5">₹{totalPortfolioVal.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-slate-400">Total Number of Holdings:</span>
                <div className="text-base font-semibold text-slate-200 mt-0.5">{holdings.length} Assets</div>
              </div>
              <div>
                <span className="text-slate-400">Largest Holding:</span>
                <div className="text-sm font-semibold text-purple-300 mt-0.5">
                  {concentratedHolding ? `${concentratedHolding.symbol} (${((concentratedHolding.quantity * concentratedHolding.current_price) / (totalPortfolioVal || 1) * 100).toFixed(1)}%)` : 'Balanced'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">Portfolio Holdings Table</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Symbol / Company</th>
                <th className="p-4">Sector</th>
                <th className="p-4 text-right">Quantity</th>
                <th className="p-4 text-right">Avg Buy Price</th>
                <th className="p-4 text-right">Current Price</th>
                <th className="p-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('current_value')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Current Value</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('gain_loss_percent')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Gain / Loss</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('portfolio_percent')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Portfolio %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHoldings.map((h) => {
                const val = h.quantity * h.current_price;
                const gl = val - (h.quantity * h.average_buy_price);
                const gl_pct = (gl / (h.quantity * h.average_buy_price) * 100);
                const pct = (val / (totalPortfolioVal || 1)) * 100;
                const isConcentrated = pct >= 30;

                return (
                  <tr key={h.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{h.symbol}</span>
                        {isConcentrated && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                            High Conc.
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{h.company}</div>
                    </td>
                    <td className="p-4 text-slate-300">{h.sector}</td>
                    <td className="p-4 text-right font-mono">{h.quantity}</td>
                    <td className="p-4 text-right font-mono">₹{h.average_buy_price}</td>
                    <td className="p-4 text-right font-mono font-semibold text-white">₹{h.current_price}</td>
                    <td className="p-4 text-right font-mono font-bold text-white">₹{val.toLocaleString('en-IN')}</td>
                    <td className={`p-4 text-right font-mono font-semibold ${gl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {gl >= 0 ? '+' : ''}₹{gl.toLocaleString('en-IN')} ({gl_pct >= 0 ? '+' : ''}{gl_pct.toFixed(2)}%)
                    </td>
                    <td className="p-4 text-right font-mono font-bold">
                      <span className={isConcentrated ? 'text-amber-400 font-extrabold' : 'text-slate-200'}>
                        {pct.toFixed(1)}%
                      </span>
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
