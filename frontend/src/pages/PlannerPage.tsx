import React, { useState, useEffect } from 'react';
import { PlannerData } from '../types';
import { Calculator, ShieldCheck, DollarSign, Calendar, BarChart3, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PlannerPageProps {
  planner: PlannerData | null;
  onSavePlanner: (data: {
    monthly_income: number;
    monthly_expenses: number;
    existing_savings: number;
    desired_contribution: number;
    horizon_years: number;
  }) => Promise<void>;
}

export const PlannerPage: React.FC<PlannerPageProps> = ({ planner, onSavePlanner }) => {
  const [income, setIncome] = useState<number>(125000);
  const [expenses, setExpenses] = useState<number>(75000);
  const [savings, setSavings] = useState<number>(350000);
  const [contribution, setContribution] = useState<number>(25000);
  const [horizon, setHorizon] = useState<number>(5);

  useEffect(() => {
    if (planner) {
      setIncome(planner.monthly_income);
      setExpenses(planner.monthly_expenses);
      setSavings(planner.existing_savings);
      setContribution(planner.desired_contribution);
      setHorizon(planner.horizon_years);
    }
  }, [planner]);

  const availableMonthly = Math.max(income - expenses, 0);
  const total1Yr = contribution * 12;
  const total3Yr = contribution * 36;
  const total5Yr = contribution * 60;

  const chartData = [
    { name: '1 Year', total: total1Yr, color: '#7c3aed' },
    { name: '3 Years', total: total3Yr, color: '#3b82f6' },
    { name: '5 Years', total: total5Yr, color: '#10b981' }
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSavePlanner({
      monthly_income: Number(income),
      monthly_expenses: Number(expenses),
      existing_savings: Number(savings),
      desired_contribution: Number(contribution),
      horizon_years: Number(horizon)
    });
  };

  return (
    <div className="space-y-6">
      {/* Non-advisory Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-800/50 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <strong className="text-white font-bold block mb-0.5">Systematic Cash Flow & Contribution Planner</strong>
          This planner calculates pure systematic contributions over time without assuming stock market returns or speculative compounding rates.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Parameters Form */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-purple-400" />
            Financial Inputs
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Monthly Net Income (₹)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-white font-mono font-bold rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Monthly Living Expenses (₹)</label>
              <input
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-white font-mono font-bold rounded-lg px-3 py-2"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Available Monthly Surplus:</span>
              <strong className={`font-mono text-sm ${availableMonthly >= contribution ? 'text-emerald-400' : 'text-rose-400'}`}>
                ₹{availableMonthly.toLocaleString('en-IN')}
              </strong>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Existing Savings Capital (₹)</label>
              <input
                type="number"
                value={savings}
                onChange={(e) => setSavings(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-white font-mono font-bold rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Desired Monthly Contribution (₹)</label>
              <input
                type="number"
                value={contribution}
                onChange={(e) => setContribution(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-white font-mono font-bold rounded-lg px-3 py-2"
              />
            </div>

            {contribution > availableMonthly && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-[11px] text-rose-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Desired contribution exceeds available monthly surplus!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition"
            >
              Update Contribution Plan
            </button>
          </form>
        </div>

        {/* Contribution Results & Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">1 Year Total</span>
              <div className="text-2xl font-bold text-white mt-1">₹{total1Yr.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-slate-400 mt-1">₹{contribution.toLocaleString('en-IN')} / month</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">3 Years Total</span>
              <div className="text-2xl font-bold text-white mt-1">₹{total3Yr.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-slate-400 mt-1">36 monthly contributions</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">5 Years Total</span>
              <div className="text-2xl font-bold text-white mt-1">₹{total5Yr.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-slate-400 mt-1">60 monthly contributions</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              Cumulative Capital Contribution Timeline
            </h3>
            <p className="text-xs text-slate-400 mb-4">Total capital saved and contributed without assuming stock returns.</p>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0d1b2e', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Total Contributed']} />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
