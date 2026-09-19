// ============================================================
// InvestGuard — Investment Goal Planner & Compounding Engine
// Disciplined SIP wealth projections, compounding trajectory calculation,
// and behavioral milestone tracking.
// ============================================================

import React, { useState } from 'react';
import {
  Target,
  Plus,
  Trash2,
  TrendingUp,
  Calendar,
  Sparkles,
  ShieldCheck,
  Coins,
  ArrowUpRight,
  Info,
  X,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PlannerGoal } from '../types';
import { formatINR, formatPercent } from '../lib/formatters';

interface PlannerPageProps {
  onNavigate: (page: string) => void;
}

export const PlannerPage: React.FC<PlannerPageProps> = ({ onNavigate }) => {
  const { goals, addGoal, deleteGoal } = useStore();

  // Interactive SIP Calculator State
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(25000);
  const [timeHorizonYears, setTimeHorizonYears] = useState(10);
  const [annualReturnRate, setAnnualReturnRate] = useState(12);

  // Goal Modal State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: 2500000,
    currentAmount: 500000,
    targetDate: '2030-12-31',
    monthlyContribution: 20000,
    expectedReturnRate: 12,
    category: 'Long-term Wealth',
    notes: '',
  });

  // Calculate Compounding Future Value
  // FV = P * (1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
  const calculateSIPProjection = (p: number, pmt: number, years: number, rPct: number) => {
    const r = rPct / 100 / 12;
    const months = years * 12;
    const futureInitial = p * Math.pow(1 + r, months);
    const futureSIP = r > 0 ? pmt * ((Math.pow(1 + r, months) - 1) / r) * (1 + r) : pmt * months;
    const totalFutureValue = Math.round(futureInitial + futureSIP);
    const totalDeposited = p + pmt * months;
    const wealthGain = totalFutureValue - totalDeposited;

    return { totalFutureValue, totalDeposited, wealthGain };
  };

  const projection = calculateSIPProjection(
    initialInvestment,
    monthlyContribution,
    timeHorizonYears,
    annualReturnRate
  );

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGoal({
      title: newGoal.title,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: Number(newGoal.currentAmount),
      targetDate: newGoal.targetDate,
      monthlyContribution: Number(newGoal.monthlyContribution),
      expectedReturnRate: Number(newGoal.expectedReturnRate),
      category: newGoal.category,
      notes: newGoal.notes || undefined,
    });
    setIsGoalModalOpen(false);
    setNewGoal({
      title: '',
      targetAmount: 2500000,
      currentAmount: 500000,
      targetDate: '2030-12-31',
      monthlyContribution: 20000,
      expectedReturnRate: 12,
      category: 'Long-term Wealth',
      notes: '',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Investment Goal Planner & SIP Compounding Trajectory
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Disciplined, goal-oriented contributions significantly reduce emotional trading tendencies like panic selling and overtrading.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create Milestone Goal
          </button>
        </div>
      </div>

      {/* Interactive SIP & Compounding Simulation */}
      <div className="p-6 rounded-2xl glass-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Interactive Compounding Trajectory Calculator
            </h3>
            <p className="text-xs text-slate-400">
              Simulate disciplined wealth accumulation with monthly systematic contributions
            </p>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-400">Initial Lump Sum (₹)</label>
            <input
              type="number"
              step="10000"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Math.max(0, Number(e.target.value)))}
              className="w-full text-sm font-mono font-bold bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-400">Monthly Contribution (₹)</label>
            <input
              type="number"
              step="1000"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
              className="w-full text-sm font-mono font-bold bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-400">Horizon: {timeHorizonYears} Years</label>
            <input
              type="range"
              min="1"
              max="30"
              value={timeHorizonYears}
              onChange={(e) => setTimeHorizonYears(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer mt-2"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-400">Expected Return: {annualReturnRate}% p.a.</label>
            <input
              type="range"
              min="4"
              max="20"
              value={annualReturnRate}
              onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer mt-2"
            />
          </div>
        </div>

        {/* Results Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
            <span className="text-xs font-semibold text-indigo-300 block mb-1">Projected Future Wealth</span>
            <div className="text-2xl lg:text-3xl font-extrabold text-white font-mono">
              {formatINR(projection.totalFutureValue)}
            </div>
            <p className="text-[11px] text-indigo-400/80 mt-1">At year {timeHorizonYears}</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Total Principal Deposited</span>
            <div className="text-xl lg:text-2xl font-bold text-slate-200 font-mono">
              {formatINR(projection.totalDeposited)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Your capital contribution</p>
          </div>

          <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
            <span className="text-xs font-semibold text-emerald-400 block mb-1">Estimated Wealth Gain</span>
            <div className="text-xl lg:text-2xl font-bold text-emerald-300 font-mono">
              +{formatINR(projection.wealthGain)}
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-1">Compound return multiplier</p>
          </div>
        </div>
      </div>

      {/* Tracked Milestone Goals */}
      <div className="p-6 rounded-2xl glass-card space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Tracked Financial Goals ({goals.length})
            </h3>
            <p className="text-xs text-slate-400">
              Stay focused on long-term outcomes to curb short-term impulse trading
            </p>
          </div>
        </div>

        {goals.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-400">
            No financial goals tracked. Click "Create Milestone Goal" to establish long-term targets.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(goal => {
              const progressPct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

              return (
                <div
                  key={goal.id}
                  className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-3.5 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        {goal.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1.5">{goal.title}</h4>
                    </div>

                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between text-xs font-mono">
                    <span className="text-slate-400">Current: {formatINR(goal.currentAmount)}</span>
                    <span className="text-white font-bold">Target: {formatINR(goal.targetAmount)}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{progressPct}% Funded</span>
                    <span>Target Date: {goal.targetDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create New Milestone Goal</h3>
              <button
                onClick={() => setIsGoalModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGoalSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Early Retirement Fund"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal(p => ({ ...p, targetAmount: Number(e.target.value) }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Current Saved (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal(p => ({ ...p, currentAmount: Number(e.target.value) }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Target Date</label>
                  <input
                    type="date"
                    required
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal(p => ({ ...p, targetDate: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Long-term Wealth">Long-term Wealth</option>
                    <option value="Retirement">Retirement</option>
                    <option value="Emergency Fund">Emergency Fund</option>
                    <option value="Higher Education">Higher Education</option>
                    <option value="Home Purchase">Home Purchase</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
