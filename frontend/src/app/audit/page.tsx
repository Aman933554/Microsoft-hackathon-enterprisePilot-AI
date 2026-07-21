"use client";

import React, { useState } from 'react';
import { ShieldAlert, Download, Filter, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  event: string;
  ip: string;
  status: "SUCCESS" | "FAILED" | "WARNING";
}

const mockLogs: AuditLog[] = [
  { id: "1", timestamp: "2026-07-21 14:29:00", actor: "System", event: "Executed autonomous agent sync task", ip: "192.168.1.101", status: "SUCCESS" },
  { id: "2", timestamp: "2026-07-21 14:28:15", actor: "Finance Agent", event: "Attempted to access restricted database (Stripe)", ip: "10.0.0.45", status: "FAILED" },
  { id: "3", timestamp: "2026-07-21 14:27:00", actor: "User (admin)", event: "Updated global IAM policies", ip: "203.0.113.42", status: "SUCCESS" },
  { id: "4", timestamp: "2026-07-21 14:26:00", actor: "System", event: "API rate limit approaching for GitHub integration", ip: "192.168.1.104", status: "WARNING" },
  { id: "5", timestamp: "2026-07-21 14:21:40", actor: "Engineering Agent", event: "Created Pull Request #1402", ip: "10.0.0.46", status: "SUCCESS" },
  { id: "6", timestamp: "2026-07-21 14:15:00", actor: "User (johndoe)", event: "Failed login attempt (invalid credentials)", ip: "198.51.100.12", status: "FAILED" },
  { id: "7", timestamp: "2026-07-21 14:10:00", actor: "System", event: "Automated database backup completed", ip: "192.168.1.107", status: "SUCCESS" },
  { id: "8", timestamp: "2026-07-21 14:05:00", actor: "Marketing Agent", event: "High latency detected during Notion sync", ip: "10.0.0.48", status: "WARNING" },
];

export default function AuditLogsPage() {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const filteredLogs = mockLogs.filter(log => filterStatus === "ALL" || log.status === filterStatus);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      window.dispatchEvent(new CustomEvent("new-notification", { 
        detail: { title: "Export Complete", message: "Audit logs have been exported as CSV." } 
      }));
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <ShieldAlert size={32} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Audit Logs</h1>
            <p className="text-slate-400 text-sm">Security, access, and compliance tracking.</p>
          </div>
        </div>
        <div className="flex gap-3 relative">
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold transition-colors shadow-[0_2px_10px_rgba(255,255,255,0.05)]",
                filterStatus !== "ALL" || isFilterOpen ? "bg-white/10 text-white border-white/20" : "bg-[#09222b] border-[rgba(255,255,255,0.08)] hover:bg-white/5 text-white"
              )}
            >
              <Filter size={14} /> 
              {filterStatus === "ALL" ? "Filter Logs" : `Filtered: ${filterStatus}`}
              {filterStatus !== "ALL" && (
                <X 
                  size={14} 
                  className="ml-2 text-slate-400 hover:text-white" 
                  onClick={(e) => { e.stopPropagation(); setFilterStatus("ALL"); }}
                />
              )}
            </button>
            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-[#021114] border border-[rgba(255,255,255,0.08)] rounded-md shadow-2xl overflow-hidden z-50 p-1"
                  >
                    <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-[rgba(255,255,255,0.08)] mb-1">Status Filter</div>
                    {["ALL", "SUCCESS", "FAILED", "WARNING"].map((status) => (
                      <button
                        key={status}
                        onClick={() => { setFilterStatus(status); setIsFilterOpen(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm transition-all rounded hover:bg-white/10 flex items-center justify-between",
                          filterStatus === status ? "text-brand-cyan font-medium bg-white/5" : "text-white"
                        )}
                      >
                        {status === "ALL" ? "Show All" : status}
                        {filterStatus === status && <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#09222b] border border-[rgba(255,255,255,0.08)] hover:bg-white/5 text-xs font-semibold text-white transition-colors shadow-[0_2px_10px_rgba(255,255,255,0.05)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </header>

      <div className="luxury-card overflow-hidden p-0 border-[rgba(255,255,255,0.08)] bg-[#021114]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)] bg-[#09222b] text-slate-400 text-xs uppercase tracking-widest font-bold">
                <th className="p-5 font-bold">Timestamp</th>
                <th className="p-5 font-bold">Actor</th>
                <th className="p-5 font-bold">Event</th>
                <th className="p-5 font-bold">IP Address</th>
                <th className="p-5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-white relative">
              <AnimatePresence mode="popLayout">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <motion.tr 
                      key={log.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-5 text-slate-400 font-mono text-xs group-hover:text-white transition-colors">{log.timestamp}</td>
                      <td className="p-5 font-medium">{log.actor}</td>
                      <td className="p-5 text-slate-400 group-hover:text-white/90 transition-colors">{log.event}</td>
                      <td className="p-5 font-mono text-xs text-slate-400">{log.ip}</td>
                      <td className="p-5">
                        <span className={cn(
                          "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                          log.status === "SUCCESS" && "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20",
                          log.status === "FAILED" && "bg-red-500/10 text-red-500 border border-red-500/20",
                          log.status === "WARNING" && "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                        )}>
                          {log.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={5} className="p-10 text-center text-slate-400 border-b border-[rgba(255,255,255,0.05)]">
                      No audit logs found for the selected filter.
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
