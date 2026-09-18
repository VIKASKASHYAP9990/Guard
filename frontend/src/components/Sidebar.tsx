import React from 'react';
import { Shield, LayoutDashboard, PieChart, ArrowLeftRight, Activity, Bell, BookOpen, Calculator, GraduationCap, FileText, RotateCcw, X } from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  alertsCount: number;
  transactionsCount: number;
  onResetDemo: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  alertsCount,
  transactionsCount,
  onResetDemo,
  isOpen,
  onClose,
}) => {
  const mainNav = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, count: transactionsCount },
    { id: 'analysis', label: 'Behavior Analysis', icon: Activity },
    { id: 'alerts', label: 'Smart Alerts', icon: Bell, count: alertsCount, countColor: 'bg-amber-500' },
  ];

  const planNav = [
    { id: 'journal', label: 'Investment Journal', icon: BookOpen },
    { id: 'planner', label: 'Investment Planner', icon: Calculator },
    { id: 'learn', label: 'Learn & Education', icon: GraduationCap },
  ];

  const hackathonNav = [
    { id: 'docs', label: 'Docs & Hackathon Report', icon: FileText },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-64 bg-[#0a1628] border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col justify-between
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      <aside className={sidebarClasses}>
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
            <button
              onClick={() => { onNavigate('landing'); onClose(); }}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-900/50 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Invest<span className="text-purple-400">Guard</span>
              </span>
            </button>
            <button
              onClick={onClose}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hackathon Badge & Reset Demo Button */}
          <div className="mx-4 my-4 p-3 bg-purple-950/40 border border-purple-800/40 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Hefty Hacks 2026</div>
              <div className="text-xs text-slate-300">Finance × Trading</div>
            </div>
            <button
              onClick={() => { onResetDemo(); onClose(); }}
              title="Reset Demo Data"
              className="p-1.5 rounded-lg bg-purple-900/50 hover:bg-purple-800/70 text-purple-200 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-6 text-sm">
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Workspace
              </div>
              <div className="space-y-1">
                {mainNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { onNavigate(item.id); onClose(); }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors
                        ${isActive ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${item.countColor || 'bg-slate-700'}`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Plan & Reflect
              </div>
              <div className="space-y-1">
                {planNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { onNavigate(item.id); onClose(); }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors
                        ${isActive ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}
                      `}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Hackathon Submission
              </div>
              <div className="space-y-1">
                {hackathonNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { onNavigate(item.id); onClose(); }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors
                        ${isActive ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}
                      `}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#07111f]/60">
          <div className="text-[11px] text-slate-500 leading-tight">
            🛡️ <strong className="text-slate-400">InvestGuard</strong> is an educational behavioral mirror. Does not provide financial advice.
          </div>
        </div>
      </aside>
    </>
  );
};
