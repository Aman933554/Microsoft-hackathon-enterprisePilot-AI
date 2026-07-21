"use client";

import React, { useState } from 'react';
import { FileText, RefreshCw, ExternalLink, Check, Database, Shield, Lock, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NotionDB {
  id: string;
  name: string;
  access: "Read/Write" | "Read Only" | "None";
  lastSynced: string;
}

const initialDatabases: NotionDB[] = [
  { id: "db1", name: "Engineering Roadmap", access: "Read/Write", lastSynced: "Just now" },
  { id: "db2", name: "Q3 Marketing Campaigns", access: "Read/Write", lastSynced: "2 hrs ago" },
  { id: "db3", name: "Employee Directory", access: "Read Only", lastSynced: "1 day ago" },
  { id: "db4", name: "Financial Projections", access: "None", lastSynced: "Never" },
];

export default function NotionWorkspacePage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [databases, setDatabases] = useState<NotionDB[]>(initialDatabases);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setDatabases(prev => prev.map(db => ({ ...db, lastSynced: "Just now" })));
      window.dispatchEvent(new CustomEvent("new-notification", { 
        detail: { title: "Notion Synced", message: "Successfully synchronized all connected Notion databases." } 
      }));
    }, 2000);
  };

  const toggleAccess = (id: string) => {
    setDatabases(prev => prev.map(db => {
      if (db.id === id) {
        const nextAccess = db.access === "Read/Write" ? "Read Only" : db.access === "Read Only" ? "None" : "Read/Write";
        return { ...db, access: nextAccess };
      }
      return db;
    }));
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10 border border-white/20">
            <FileText size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Notion Workspace</h1>
            <p className="text-slate-400 text-sm">Manage connected Notion databases and sync settings.</p>
          </div>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-white hover:bg-white/90 text-black text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} className={cn(isSyncing && "animate-spin")} /> 
          {isSyncing ? "Syncing Workspace..." : "Sync Now"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="lg:col-span-1 luxury-card p-8 text-center flex flex-col items-center justify-center border-dashed border-white/10">
          <div className="w-16 h-16 rounded-full bg-brand-emerald/10 flex items-center justify-center mb-4 border border-brand-emerald/20">
            <Check size={32} className="text-brand-emerald" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Workspace Connected</h2>
          <p className="text-sm text-slate-400 mb-6">Your Notion workspace is securely linked to the AI agent fleet.</p>
          <div className="w-full bg-[#09222b] rounded-lg p-4 border border-[rgba(255,255,255,0.08)] text-left space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Status</span>
              <span className="text-brand-emerald font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></span> Online
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Connected DBs</span>
              <span className="text-white font-medium">{databases.filter(d => d.access !== "None").length}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Last Global Sync</span>
              <span className="text-white font-medium">Just now</span>
            </div>
          </div>
        </div>

        {/* Databases List */}
        <div className="lg:col-span-2 luxury-card p-0 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-white/5 bg-[#09222b] flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Database size={16} className="text-brand-purple" />
              Database Permissions
            </h3>
            <span className="text-xs text-slate-400">Click access level to toggle</span>
          </div>
          
          <div className="divide-y divide-white/5 overflow-y-auto custom-scrollbar flex-1 max-h-[400px]">
            {databases.map(db => (
              <div key={db.id} className="p-4 px-6 hover:bg-white/5 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#09222b] border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                    <FileText size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-0.5">{db.name}</h4>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">Last synced: {db.lastSynced}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => toggleAccess(db.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-bold border transition-colors flex items-center gap-1.5 w-28 justify-center",
                    db.access === "Read/Write" && "bg-brand-emerald/10 border-brand-emerald/30 text-brand-emerald",
                    db.access === "Read Only" && "bg-brand-blue/10 border-brand-blue/30 text-brand-blue",
                    db.access === "None" && "bg-red-500/10 border-red-500/30 text-red-500",
                  )}
                >
                  {db.access === "Read/Write" && <Unlock size={12} />}
                  {db.access === "Read Only" && <Shield size={12} />}
                  {db.access === "None" && <Lock size={12} />}
                  {db.access}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
