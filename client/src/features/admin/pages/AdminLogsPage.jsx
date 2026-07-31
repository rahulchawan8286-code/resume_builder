import { useState } from 'react';
import { mockAdminLogs } from '../data/mockAdminData';
import { Search, Terminal, Download, ArrowDownToLine } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState(mockAdminLogs);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = logs.filter((log) => {
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const exportLogs = () => {
    toast.success('Logs exported to console file format (JSON)');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Logs Console</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Audit log records representing system activities and exceptions.</p>
        </div>
        <button onClick={exportLogs} className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-muted transition-all">
          <ArrowDownToLine className="h-3.5 w-3.5" /> Export Logs
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search system logs messages..."
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-xl border border-border bg-card px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Types</option>
          <option value="auth">Auth Logs</option>
          <option value="ai">AI Logs</option>
          <option value="upload">Upload Logs</option>
          <option value="error">Error Logs</option>
          <option value="admin">Admin Actions</option>
        </select>
      </div>

      {/* Terminal log panel */}
      <div className="rounded-2xl border border-border bg-slate-950 font-mono text-xs text-slate-300 p-5 shadow-inner overflow-x-auto space-y-2">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-slate-500">
          <span>CONSOLE AUDIT STREAM</span>
          <span>ONLINE</span>
        </div>
        {filtered.map((log) => (
          <div key={log.id} className="flex items-start gap-3 py-1 hover:bg-white/5 rounded px-2 transition-colors">
            <span className="text-slate-500 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            <span className={`font-semibold shrink-0 uppercase tracking-wider ${
              log.type === 'error' ? 'text-red-500' :
              log.type === 'auth' ? 'text-indigo-400' :
              log.type === 'ai' ? 'text-pink-400' : 'text-green-400'
            }`}>[{log.type}]</span>
            <span className="flex-1 break-all">{log.message}</span>
            <span className={`shrink-0 text-[10px] font-bold ${log.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {log.status.toUpperCase()}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-slate-600 py-6">No logs match the criteria.</div>
        )}
      </div>
    </div>
  );
}
