// ============================================================
// InvestGuard — Settings & Detection Sensitivity Configuration
// Fine-tune behavioral detector thresholds, manage data backups,
// and customize platform risk tolerance parameters.
// ============================================================

import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Download,
  Upload,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Lock,
  Flame,
  Repeat,
  PieChart,
  ArrowDownRight,
  Hourglass,
  Activity,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { DEFAULT_DETECTION_CONFIG } from '../engine/analyzer';

export const SettingsPage: React.FC = () => {
  const {
    detectionConfig,
    updateDetectionConfig,
    resetToDefaults,
    exportDataJSON,
    importDataJSON,
  } = useStore();

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  const handleConfigChange = (key: string, value: number | string) => {
    updateDetectionConfig({ [key]: value });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleExport = () => {
    const data = exportDataJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `investguard_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJSON(content);
      if (success) {
        setImportStatus('✓ Data restored successfully');
      } else {
        setImportStatus('✗ Invalid backup file format');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Behavioral Detection Sensitivity & Configuration
                </h2>
                {saveToast && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-in fade-in">
                    ✓ Thresholds Updated
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Adjust detection thresholds to match your personal investment style. Any changes trigger instant re-evaluation across all historical transactions.
              </p>
            </div>
          </div>

          <button
            onClick={resetToDefaults}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all flex-shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Defaults
          </button>
        </div>
      </div>

      {/* 6 Bias Detector Sensitivity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. FOMO Buying */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">FOMO Buying Detector</h3>
              <p className="text-xs text-slate-400">Triggered on buying after rapid price surges</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Price Surge Trigger:</span>
                <span className="text-indigo-400 font-bold">+{detectionConfig.fomoPriceSurgeThreshold}%</span>
              </div>
              <input
                type="range"
                min="4"
                max="25"
                value={detectionConfig.fomoPriceSurgeThreshold}
                onChange={(e) => handleConfigChange('fomoPriceSurgeThreshold', Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Lookback Window:</span>
                <span className="text-indigo-400 font-bold">{detectionConfig.fomoLookbackDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="14"
                value={detectionConfig.fomoLookbackDays}
                onChange={(e) => handleConfigChange('fomoLookbackDays', Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Overtrading */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Repeat className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Overtrading Detector</h3>
              <p className="text-xs text-slate-400">Triggered by clusters of high turnover</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Trade Count Trigger:</span>
                <span className="text-indigo-400 font-bold">≥ {detectionConfig.overtradingTradeCountThreshold} Trades</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                value={detectionConfig.overtradingTradeCountThreshold}
                onChange={(e) => handleConfigChange('overtradingTradeCountThreshold', Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Clustering Window:</span>
                <span className="text-indigo-400 font-bold">{detectionConfig.overtradingWindowDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={detectionConfig.overtradingWindowDays}
                onChange={(e) => handleConfigChange('overtradingWindowDays', Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Concentration Alert */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Concentration Benchmark</h3>
              <p className="text-xs text-slate-400">Max portfolio allocation per asset</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Max Single Position Weight:</span>
                <span className="text-indigo-400 font-bold">{detectionConfig.concentrationThreshold}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={detectionConfig.concentrationThreshold}
                onChange={(e) => handleConfigChange('concentrationThreshold', Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-400">Standard institutional guideline is 15% to 25% max per security.</p>
          </div>
        </div>

        {/* 4. Panic Selling */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Panic Selling Detector</h3>
              <p className="text-xs text-slate-400">Triggered on selling after steep drops</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Drop Magnitude Trigger:</span>
                <span className="text-rose-400 font-bold">-{detectionConfig.panicDropThreshold}%</span>
              </div>
              <input
                type="range"
                min="3"
                max="20"
                value={detectionConfig.panicDropThreshold}
                onChange={(e) => handleConfigChange('panicDropThreshold', Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Lookback Window:</span>
                <span className="text-indigo-400 font-bold">{detectionConfig.panicLookbackDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={detectionConfig.panicLookbackDays}
                onChange={(e) => handleConfigChange('panicLookbackDays', Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 5. Loss Aversion */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Hourglass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Loss Aversion / Drawdown Drift</h3>
              <p className="text-xs text-slate-400">Holding deep losses past threshold duration</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Drawdown Threshold:</span>
                <span className="text-rose-400 font-bold">-{detectionConfig.lossAversionDrawdownThreshold}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={detectionConfig.lossAversionDrawdownThreshold}
                onChange={(e) => handleConfigChange('lossAversionDrawdownThreshold', Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Minimum Holding Duration:</span>
                <span className="text-indigo-400 font-bold">{detectionConfig.lossAversionDaysHeldThreshold} Days</span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                value={detectionConfig.lossAversionDaysHeldThreshold}
                onChange={(e) => handleConfigChange('lossAversionDaysHeldThreshold', Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 6. Market Timing */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Market Timing Reversal</h3>
              <p className="text-xs text-slate-400">Rapid opposite trade cycles</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Reversal Cycle Window:</span>
                <span className="text-indigo-400 font-bold">{detectionConfig.marketTimingWindowDays} Days</span>
              </div>
              <input
                type="range"
                min="2"
                max="21"
                value={detectionConfig.marketTimingWindowDays}
                onChange={(e) => handleConfigChange('marketTimingWindowDays', Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-400">Detects rapid buy-then-sell or sell-then-buy cycles in the same ticker.</p>
          </div>
        </div>
      </div>

      {/* Backup, Export & Privacy Section */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Data Privacy & Local Storage Backup
          </h3>
          <p className="text-xs text-slate-400">
            InvestGuard processes all behavioral analysis locally in your browser sandbox. No portfolio data is transmitted to external servers.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Download className="w-4 h-4" />
            Export Backup (JSON)
          </button>

          <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all">
            <Upload className="w-4 h-4" />
            Restore from Backup
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          {importStatus && (
            <span className="text-xs font-semibold text-emerald-400 animate-in fade-in">
              {importStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
