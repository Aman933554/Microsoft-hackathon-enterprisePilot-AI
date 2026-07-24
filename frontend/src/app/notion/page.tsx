"use client";

import React, { useState } from 'react';
import { FileText, RefreshCw, ExternalLink, Check, Database, Shield, Lock, Unlock, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [databases, setDatabases] = useState<NotionDB[]>([]);
  const [loading, setLoading] = useState(true);

  // Data Viewer State
  const [selectedDbId, setSelectedDbId] = useState<string | null>(null);
  const [dbData, setDbData] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const fetchDatabases = async () => {
    try {
      const res = await fetch('/api/notion/databases');
      const data = await res.json();
      if (data.success && data.databases) {
        // Retrieve saved permissions from localStorage
        const savedPerms = JSON.parse(localStorage.getItem('notion_db_perms') || '{}');
        
        const mergedDatabases = data.databases.map((db: NotionDB) => ({
          ...db,
          access: savedPerms[db.id] || db.access
        }));
        setDatabases(mergedDatabases);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDatabases();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    await fetchDatabases();
    setIsSyncing(false);
    window.dispatchEvent(new CustomEvent("new-notification", { 
      detail: { title: "Notion Synced", message: "Successfully synchronized all connected Notion databases." } 
    }));
  };

  const toggleAccess = (id: string) => {
    setDatabases(prev => {
      const updated = prev.map(db => {
        if (db.id === id) {
          const nextAccess = db.access === "Read/Write" ? "Read Only" : db.access === "Read Only" ? "None" : "Read/Write";
          return { ...db, access: nextAccess };
        }
        return db;
      });
      
      // Save new permissions to localStorage so they persist across reloads
      const newPerms = updated.reduce((acc: any, db) => {
        acc[db.id] = db.access;
        return acc;
      }, {});
      localStorage.setItem('notion_db_perms', JSON.stringify(newPerms));
      
      return updated;
    });
  };

  const viewDatabaseData = async (id: string) => {
    // Check if permission is "None"
    const db = databases.find(d => d.id === id);
    if (db?.access === "None") {
      window.dispatchEvent(new CustomEvent("new-notification", { 
        detail: { title: "Access Denied", message: "Cannot read data from a database with 'None' access level." } 
      }));
      return;
    }

    setSelectedDbId(id);
    setLoadingData(true);
    setDbData([]);
    
    try {
      const res = await fetch(`/api/notion/database-data?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setDbData(data.data);
      } else {
        console.error(data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
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
          <div className="w-full bg-[#1c263f] rounded-lg p-4 border border-white/5 text-left space-y-3">
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
          <div className="px-6 py-4 border-b border-white/5 bg-[#1c263f] flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Database size={16} className="text-brand-purple" />
              Database Permissions
            </h3>
            <span className="text-xs text-slate-400">Click access level to toggle</span>
          </div>
          
          <div className="divide-y divide-white/5 overflow-y-auto custom-scrollbar flex-1 max-h-[400px] min-h-[200px]">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[200px] text-slate-400">
                <RefreshCw size={24} className="animate-spin mb-4 text-brand-purple" />
                <p>Fetching Notion databases...</p>
              </div>
            ) : databases.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[200px] text-slate-400">
                <Database size={24} className="mb-4 opacity-50 text-slate-500" />
                <p>No connected databases found.</p>
              </div>
            ) : (
              databases.map(db => (
                <div key={db.id} className="p-4 px-6 hover:bg-white/5 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1c263f] border border-white/5 flex items-center justify-center">
                      <FileText size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-0.5 max-w-[200px] md:max-w-sm truncate" title={db.name}>{db.name}</h4>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest">Last synced: {db.lastSynced}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => viewDatabaseData(db.id)}
                      disabled={db.access === "None"}
                      className={cn(
                        "p-2 rounded-md transition-colors flex items-center justify-center shrink-0 border",
                        db.access === "None" 
                          ? "bg-white/5 border-transparent text-slate-600 cursor-not-allowed" 
                          : "bg-[#1c263f] border-white/10 text-brand-purple hover:bg-brand-purple hover:text-white"
                      )}
                      title="View Data"
                    >
                      <Eye size={14} />
                    </button>
                    
                    <button 
                      onClick={() => toggleAccess(db.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-bold border transition-colors flex items-center gap-1.5 w-28 justify-center shrink-0",
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
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Database Data Viewer Modal */}
      <AnimatePresence>
        {selectedDbId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-[#0B1120] border border-white/10 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-[#131B2F]">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database size={18} className="text-brand-purple" />
                  Database Records
                </h3>
                <button 
                  onClick={() => setSelectedDbId(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-6 overflow-auto flex-1 custom-scrollbar">
                {loadingData ? (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                    <RefreshCw size={28} className="animate-spin mb-4 text-brand-purple" />
                    <p>Loading database rows...</p>
                  </div>
                ) : dbData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                    <Database size={32} className="mb-4 opacity-50" />
                    <p>This database is empty or has no readable rows.</p>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto custom-scrollbar border border-white/10 rounded-lg">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="text-xs uppercase bg-[#131B2F] text-slate-400">
                        <tr>
                          {Object.keys(dbData[0] || {}).filter(k => k !== 'id').map(key => (
                            <th key={key} className="px-4 py-3 whitespace-nowrap">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {dbData.map((row, i) => (
                          <tr key={row.id || i} className="hover:bg-white/5 transition-colors">
                            {Object.entries(row).filter(([k]) => k !== 'id').map(([key, value]) => (
                              <td key={key} className="px-4 py-3 whitespace-nowrap max-w-[200px] truncate">
                                {value ? String(value) : <span className="text-slate-600">-</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
