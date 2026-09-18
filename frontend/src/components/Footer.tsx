import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-[#07111f] py-8 px-6 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-white">InvestGuard</span>
          <span>— Hefty Hacks 2026 Finance × Trading Track</span>
        </div>
        <div className="flex items-center gap-6 text-slate-400">
          <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition">Dashboard</button>
          <button onClick={() => onNavigate('analysis')} className="hover:text-white transition">Behavior Analysis</button>
          <button onClick={() => onNavigate('journal')} className="hover:text-white transition">Journal</button>
          <button onClick={() => onNavigate('learn')} className="hover:text-white transition">Learn</button>
          <button onClick={() => onNavigate('docs')} className="hover:text-white transition">Project Report</button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-800/40 text-slate-500 text-[11px] text-center md:text-left">
        InvestGuard analyzes portfolio allocations and transaction logs to highlight behavioral antipatterns. It does not provide buy/sell signals, guarantee profits, or diagnose psychological conditions.
      </div>
    </footer>
  );
};
