import React from 'react';
import { PortfolioSummary, BehaviorAnalysisResult, Alert, Transaction } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Shield, TrendingUp, AlertTriangle, Layers, Activity, ArrowUpRight, ArrowDownRight, Clock, ChevronRight } from 'lucide-react';

interface DashboardProps {
  portfolio: PortfolioSummary | null;
  analysis: BehaviorAnalysisResult | null;
  alerts: Alert[];
  transactions: Transaction[];
  onNavigate: (route: string) => void;
}

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export const Dashboard: React.FC<DashboardProps> = ({
  portfolio,
  analysis,
  alerts,
  transactions,
  onNavigate,
}) => {
  const chartData = [
    { day: 'Mon', value: 118000 },
    { day: 'Tue', value: 119500 },
    { day: 'Wed', value: 121000 },
    { day: 'Thu', value: 120200 },
    { day: 'Fri', value: 123200 },
    { day: 'Sat', value: 123950 },
    { day: 'Sun', value: portfolio ? portfolio.portfolio_value : 124500 },
  ];

  const behavioralMatrix = analysis?.behavioral_matrix || {
    'FOMO-like Buying': 'Moderate',
    'Panic Selling': 'Low',
    'Overtrading': 'High',
    'Concentration': 'High',
    'Loss Aversion': 'Moderate',
    'Market Timing': 'High'
  };

  const getSeverityBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-rose-950/80 text-rose-300 border-rose-800/60';
      case 'moderate':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if high concentration or overtrading */}
      {analysis?.ml_analysis.is_anomaly && (
        <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-800/50 flex items-start gap-3">
          <Activity className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-purple-200">
              Isolation Forest ML Anomaly Signal Detected
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {analysis.ml_analysis.explanation}
            </p>
          </div>
          <button
            onClick={() => onNavigate('analysis')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition shrink-0"
          >
            View Details
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Total Portfolio Value</div>
          <div className="text-2xl font-bold text-white mt-1">
            ₹{portfolio ? portfolio.portfolio_value.toLocaleString('en-IN') : '1,24,500'}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2 font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>+₹{portfolio ? portfolio.todays_change.toLocaleString('en-IN') : '1,250'} (+1.02% Today)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Total Unrealized Gain</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            +₹{portfolio ? portfolio.total_gain_loss.toLocaleString('en-IN') : '18,450'}
          </div>
          <div className="text-xs text-slate-400 mt-2 font-medium">
            +{(portfolio ? portfolio.total_gain_loss_percent : 17.4).toFixed(1)}% Overall Return
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Active Asset Holdings</div>
          <div className="text-2xl font-bold text-white mt-1">
            {portfolio ? portfolio.holdings_count : 5} Assets
          </div>
          <div className="text-xs text-purple-400 mt-2 font-medium flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Max concentration: NVDA (41.2%)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Behavioral Alerts</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {alerts.filter(a => a.status === 'Unread').length} Alerts
          </div>
          <div className="text-xs text-slate-400 mt-2 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Overtrading & Concentration</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Valuation Trend */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Portfolio Valuation Trajectory</h3>
              <p className="text-xs text-slate-400">7-Day Portfolio performance trajectory</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono">7D</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={['auto', 'auto']} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1b2e', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Portfolio Value']}
                />
                <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Exposure Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Sector Allocation</h3>
            <p className="text-xs text-slate-400 mb-4">Portfolio asset concentration</p>
          </div>
          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolio?.sector_breakdown || [
                    { sector: 'Semiconductors', percentage: 41.2 },
                    { sector: 'Technology', percentage: 37.8 },
                    { sector: 'Consumer Discretionary', percentage: 10.5 },
                    { sector: 'Automotive', percentage: 10.0 }
                  ]}
                  dataKey="percentage"
                  nameKey="sector"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={3}
                >
                  {(portfolio?.sector_breakdown || [1,2,3,4]).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1b2e', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  formatter={(val: number) => [`${val}%`, 'Allocation']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {(portfolio?.sector_breakdown || []).map((sec, idx) => (
              <div key={sec.sector} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="text-slate-300">{sec.sector}</span>
                </div>
                <span className="font-semibold text-white">{sec.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Behavioral Overview Risk Matrix */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              Behavioral Risk Signal Matrix
            </h3>
            <p className="text-xs text-slate-400">Current behavioral indicators evaluated across 6 core antipatterns</p>
          </div>
          <button
            onClick={() => onNavigate('analysis')}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
          >
            <span>Full Pipeline Details</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(behavioralMatrix).map(([pattern, severity]) => (
            <div key={pattern} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
              <div className="text-xs font-semibold text-slate-300 leading-tight mb-2">{pattern}</div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border text-center ${getSeverityBadge(severity)}`}>
                {severity} Risk
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feeds Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts Feed */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Recent Smart Alerts
            </h3>
            <button onClick={() => onNavigate('alerts')} className="text-xs text-purple-400 hover:text-purple-300 font-medium">
              View All ({alerts.length})
            </button>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((a) => (
              <div key={a.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{a.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getSeverityBadge(a.severity)}`}>
                    {a.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{a.evidence}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Feed */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Recent Trade Execution Log
            </h3>
            <button onClick={() => onNavigate('transactions')} className="text-xs text-purple-400 hover:text-purple-300 font-medium">
              View All ({transactions.length})
            </button>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 3).map((t) => (
              <div key={t.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.type === 'BUY' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
                      {t.type}
                    </span>
                    <strong className="text-xs text-white">{t.symbol}</strong>
                    <span className="text-xs text-slate-400">({t.company})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {t.reason || 'Trade execution'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-white">₹{(t.quantity * t.price).toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-slate-400">{t.quantity} @ ₹{t.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
