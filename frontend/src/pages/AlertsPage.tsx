import React, { useState } from 'react';
import { Alert } from '../types';
import { Bell, AlertTriangle, CheckCircle2, Eye, XCircle, Sparkles, Filter, HelpCircle } from 'lucide-react';

interface AlertsPageProps {
  alerts: Alert[];
  onUpdateStatus: (id: number, status: 'Unread' | 'Reviewed' | 'Dismissed') => Promise<void>;
  onNavigate: (route: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ alerts, onUpdateStatus, onNavigate }) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [activeModalAlert, setActiveModalAlert] = useState<Alert | null>(null);

  const filteredAlerts = alerts.filter((a) => {
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
    return matchStatus && matchSeverity;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'high':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'moderate':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2 text-sm text-slate-300 font-semibold">
          <Bell className="w-4 h-4 text-purple-400" />
          <span>Smart Behavioral Alerts Center ({filteredAlerts.length})</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Unread">Unread</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Severities</option>
              <option value="High">High Severity</option>
              <option value="Moderate">Moderate Severity</option>
              <option value="Low">Low Severity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No active alerts for selected filter</h3>
            <p className="text-xs text-slate-400 mt-1">Your investment activity matches your default rules.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl bg-slate-900/80 border transition-all ${alert.status === 'Unread' ? 'border-purple-500/50 shadow-lg shadow-purple-950/20' : 'border-slate-800 opacity-80'}`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${getSeverityBadge(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <h3 className="text-base font-bold text-white">{alert.title}</h3>
                  <span className="text-xs text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
                    {alert.pattern_type}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {new Date(alert.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <strong className="text-slate-300 block mb-1">Factual Evidence:</strong>
                  <p className="text-slate-200">{alert.evidence}</p>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/30">
                  <strong className="text-purple-300 block mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    AI Neutral Explanation:
                  </strong>
                  <p className="text-slate-300 leading-relaxed">{alert.description}</p>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/30 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-indigo-200 block font-semibold mb-0.5">Reflection Question:</strong>
                    <p className="text-indigo-300">{alert.reflection_question}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-400">Status: <strong className="text-slate-200">{alert.status}</strong></span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('transactions')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Transaction</span>
                  </button>
                  {alert.status === 'Unread' && (
                    <button
                      onClick={() => onUpdateStatus(alert.id, 'Reviewed')}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium flex items-center gap-1.5 transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark as Reviewed</span>
                    </button>
                  )}
                  {alert.status !== 'Dismissed' && (
                    <button
                      onClick={() => onUpdateStatus(alert.id, 'Dismissed')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-rose-300 font-medium flex items-center gap-1.5 transition"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Dismiss</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
