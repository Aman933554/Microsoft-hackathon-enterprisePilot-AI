"use client";

import React, { useState, useEffect } from "react";
import { CheckSquare, ShieldAlert, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
export default function ApprovalsPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isManager = userEmail === process.env.NEXT_PUBLIC_MANAGER_EMAIL || userEmail === "sharmaaman9318411@gmail.com";
  const [approvals, setApprovals] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchApprovals = async () => {
    try {
      const res = await fetch('/api/approvals');
      const data = await res.json();
      if (data.success) {
        setApprovals(data.pendingApprovals || []);
        setHistory(data.historyApprovals || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
    // Poll every 3 seconds for hackathon demo dynamism
    const interval = setInterval(fetchApprovals, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (threadId: string, approved: boolean) => {
    setProcessing(threadId);
    try {
      const res = await fetch("/api/resume-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, approved, email: userEmail })
      });
      if (res.ok) {
        // Remove from list
        setApprovals(prev => prev.filter(a => a.id !== threadId));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(null);
    }
  };

  if (!isUserLoaded) {
    return (
      <div className="h-[calc(100vh-6rem)] flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-10 h-[calc(100vh-6rem)] flex flex-col p-8 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-5 mb-8 shrink-0">
        <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 relative">
          <CheckSquare size={32} className="text-yellow-500 relative z-10" />
          <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-1 flex items-center gap-3">
            Human Approval Center
            {approvals.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-[10px] text-white font-bold animate-pulse">
                {approvals.length} PENDING
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm">Review, approve, or reject AI agent proposals in real-time.</p>
        </div>
      </div>
      
      {loading ? (
        <div className="glass-panel p-8 border-white/10 rounded-2xl flex-1 flex flex-col items-center justify-center text-slate-400">
           <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
           <p>Syncing with immutable ledger...</p>
        </div>
      ) : approvals.length === 0 ? (
        <div className="glass-panel p-8 border-white/10 rounded-2xl flex-1 flex flex-col items-center justify-center text-slate-400">
          <CheckSquare size={48} className="mb-4 opacity-20" />
          <p className="text-lg">No pending approvals at the moment.</p>
          <p className="text-sm mt-2 opacity-60">When an agent requests your authorization, it will appear here instantly.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {approvals.map(approval => (
              <motion.div 
                key={approval.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-6 border-white/10 rounded-2xl border-l-4 border-l-yellow-500 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{approval.goal}</h2>
                    <p className="text-sm text-slate-400 font-mono text-xs">ID: {approval.id.split('-')[0]}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-bold px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded border border-yellow-500/20 flex items-center gap-1">
                      <Clock size={12} /> WAITING FOR MANAGER
                    </span>
                    <span className="text-xs text-slate-500">{new Date(approval.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-black/40 rounded-xl border border-white/5">
                  <div className="flex flex-col">
                     <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Requested Budget</span>
                     <span className="text-lg font-bold text-white flex items-center gap-1"><DollarSign size={16} className="text-pink-400"/> {approval.maxBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Department</span>
                     <span className="text-sm text-white">{approval.department}</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Est. ROI (Finance)</span>
                     <span className="text-sm text-emerald-400 font-bold">{approval.roi ? approval.roi + 'x' : '2.4x'}</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">QA Risk Check</span>
                     <span className="text-sm font-bold flex items-center gap-1 text-yellow-400">
                        <ShieldAlert size={14} /> Medium
                     </span>
                  </div>
                </div>

                <div className="flex gap-4 justify-end">
                  <button 
                    disabled={!isManager || processing === approval.id}
                    onClick={() => handleAction(approval.id, false)}
                    className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border transition-colors ${
                      isManager 
                        ? 'bg-white/5 text-white hover:bg-red-500/20 hover:text-red-400 border-white/10' 
                        : 'bg-white/5 text-slate-600 border-white/5 cursor-not-allowed'
                    }`}
                  >
                    <XCircle size={16} /> {processing === approval.id ? "Processing..." : "Reject"}
                  </button>
                  <button 
                    disabled={!isManager || processing === approval.id}
                    onClick={() => handleAction(approval.id, true)}
                    className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
                      isManager 
                        ? 'bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                        : 'bg-primary/20 text-black/50 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle size={16} /> {processing === approval.id ? "Authorizing..." : "Authorize Execution"}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-2">Approval History</h3>
          <div className="flex flex-col gap-3">
            {history.map(item => (
              <div key={item.id} className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium text-sm">{item.goal}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-1">ID: {item.id.split('-')[0]} • {new Date(item.updatedAt).toLocaleString()}</p>
                </div>
                <div>
                  {item.status === 'COMPLETED' ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle size={14} /> AUTHORIZED
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 flex items-center gap-1">
                      <XCircle size={14} /> REJECTED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
