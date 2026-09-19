// ============================================================
// InvestGuard — Sidebar Navigation Component
// Clean, responsive sidebar with active route highlights,
// alert badges, quick scenario switcher, and demo mode indicator.
// ============================================================

import React from 'react';
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  PieChart,
  ArrowLeftRight,
  BookOpen,
  Target,
  GraduationCap,
  Settings,
  ShieldCheck,
  Sparkles,
  FlaskConical,
  LogOut,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { ScenarioType } from '../types';
import { SCENARIOS } from '../lib/mockData';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen = true,
  onClose,
}) => {
  const { alerts, isDemoMode, activeScenario, setScenario, logout, isAnalyzing } = useStore();

  const newAlertsCount = alerts.filter(a => a.status === 'NEW').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'behavior', label: 'Behavior Engine', icon: Activity, badge: isAnalyzing ? 'Evaluating...' : null },
    { id: 'alerts', label: 'Behavioral Alerts', icon: AlertTriangle, badge: newAlertsCount > 0 ? `${newAlertsCount}` : null, badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
    { id: 'portfolio', label: 'Portfolio & Holdings', icon: PieChart },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'journal', label: 'Trade Journal', icon: BookOpen },
    { id: 'planner', label: 'Goal Planner', icon: Target },
    { id: 'learn', label: 'Behavioral Academy', icon: GraduationCap },
    { id: 'settings', label: 'Detection Config', icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 group text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">InvestGuard</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Behavioral Analytics</p>
          </div>
        </button>
      </div>

      {/* Demo Scenario Switcher Widget */}
      {isDemoMode && (
        <div className="mx-3 my-3 p-3 rounded-xl bg-gradient-to-b from-indigo-950/40 to-slate-900/60 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
              <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
              Demo Scenario
            </span>
            <span className="text-[10px] text-indigo-400/80 font-mono bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-800/50">
              Active
            </span>
          </div>
          <select
            value={activeScenario}
            onChange={(e) => setScenario(e.target.value as ScenarioType)}
            className="w-full text-xs bg-slate-950/80 border border-slate-700/70 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
          >
            {SCENARIOS.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Platform Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info & Disclaimers */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <div className="px-2 py-1 text-[10px] text-slate-400 bg-slate-950/60 rounded-lg border border-slate-800/50 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
          <span>Fictional Indian market simulation. No trade recommendations.</span>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit / Reset App</span>
        </button>
      </div>
    </aside>
  );
};
