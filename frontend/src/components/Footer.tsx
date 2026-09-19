// ============================================================
// InvestGuard — Mandatory Regulatory Compliance Footer
// Required across all pages to ensure SEBI/FinTech compliance
// ============================================================

import React from 'react';
import { ShieldCheck, Info, Sparkles } from 'lucide-react';
import { REGULATORY_DISCLAIMER } from '../content/copy';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 backdrop-blur px-4 lg:px-8 py-6 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Compliance Notice */}
        <div className="flex items-start gap-3 max-w-3xl">
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-slate-400 text-[11px]">
            <strong className="text-slate-300">Regulatory Disclaimer: </strong>
            {REGULATORY_DISCLAIMER}
          </p>
        </div>

        {/* Project Meta */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-shrink-0">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            InvestGuard Core v1.0
          </span>
          <span>•</span>
          <span className="text-slate-400">Hefty Hacks 2026</span>
        </div>
      </div>
    </footer>
  );
};
