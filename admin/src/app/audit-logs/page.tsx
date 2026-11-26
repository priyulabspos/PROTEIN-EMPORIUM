'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, Search, Filter, ShieldCheck, Download, 
  Sparkles, RefreshCw, Clock, ArrowRight, User
} from 'lucide-react';
import { store } from '@/lib/store';
import { AuditLog } from '@/lib/types';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setLogs(store.getAuditLogs());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredLogs = logs.filter(l => {
    const matchesSearch = 
      l.staff_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.entity_id && l.entity_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.entity_name && l.entity_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesModule = moduleFilter === 'ALL' || l.module === moduleFilter;
    const matchesAction = actionFilter === 'ALL' || l.action === actionFilter;
    return matchesSearch && matchesModule && matchesAction;
  });

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Staff Email', 'Role', 'Action', 'Module', 'Entity ID', 'Entity Description', 'Timestamp', 'IP Address'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.staff_email,
      l.role,
      l.action,
      l.module,
      l.entity_id || '',
      l.entity_name || '',
      l.created_at,
      l.ip_address || '127.0.0.1'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Protein_Emporium_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audit trail CSV exported.');
  };

  const getActionBadge = (action: AuditLog['action']) => {
    switch (action) {
      case 'CREATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">CREATE</span>;
      case 'UPDATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">UPDATE</span>;
      case 'DELETE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">DELETE</span>;
      case 'STATUS_CHANGE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">STATUS</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">{action}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#16130F] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-orange-500/30 animate-in fade-in slide-in-from-bottom-3">
          <Sparkles className="w-5 h-5 text-[#F58A07]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#16130F] font-heading uppercase flex items-center gap-2">
            <History className="w-6 h-6 text-[#F58A07]" /> Forensic Audit Trail & Activity Logs
          </h1>
          <p className="text-sm text-slate-500">
            Immutable tracking of who changed what, when, and from where (prices, stock adjustments, orders, staff).
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" /> Export Audit Trail
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search email, entity ID, description..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          {(['ALL', 'ORDERS', 'PRODUCTS', 'INVENTORY', 'RETURNS', 'STAFF', 'SETTINGS'] as const).map(mod => (
            <button
              key={mod}
              onClick={() => setModuleFilter(mod)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                moduleFilter === mod 
                  ? 'bg-[#16130F] text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">State Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No audit logs found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(l.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'medium' })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block text-xs">{l.staff_email}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{l.role}</span>
                    </td>
                    <td className="py-3 px-4">
                      {getActionBadge(l.action)}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs font-bold text-slate-700">
                      {l.module}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-700 max-w-md">
                      {l.entity_name || l.entity_id || 'System action'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {l.old_data || l.new_data ? (
                        <button
                          onClick={() => setSelectedLog(l)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                        >
                          View Diff
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">--</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diff Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="font-bold text-[#16130F] text-lg font-heading">
              Audit State Diff
            </h3>
            <p className="text-xs text-slate-500">
              {selectedLog.staff_email} • {selectedLog.action} on {selectedLog.module} ({selectedLog.entity_id})
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <span className="font-bold text-rose-800 block mb-1">Previous State</span>
                <pre className="font-mono text-[11px] text-rose-950 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(selectedLog.old_data, null, 2) || 'None'}
                </pre>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-800 block mb-1">New State</span>
                <pre className="font-mono text-[11px] text-emerald-950 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(selectedLog.new_data, null, 2) || 'None'}
                </pre>
              </div>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-[#16130F] text-white hover:bg-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
