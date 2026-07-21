"use client";

import React, { useState } from "react";
import { CheckSquare, Search, Filter, MoreHorizontal, Check, X, ShieldAlert, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const initialApprovals = [
  {
    id: "APP-4921",
    title: "Increase AWS Compute Limit",
    reason: "DevOps Agent requires higher EC2 limits to handle expected traffic spike for product launch.",
    budget: "$2,400/mo",
    priority: "High",
    recommendation: "Approve - ROI justifies cost.",
    teams: ["Engineering", "DevOps"],
    status: "Pending",
    color: "brand-purple"
  },
  {
    id: "APP-4922",
    title: "New Marketing Campaign",
    reason: "Launch multi-channel ad campaign on LinkedIn and Twitter.",
    budget: "$15,000",
    priority: "Medium",
    recommendation: "Needs Review - Exceeds quarterly budget.",
    teams: ["Marketing", "Finance"],
    status: "Needs Review",
    color: "yellow-500"
  },
  {
    id: "APP-4920",
    title: "Automated Refunds Policy",
    reason: "Approve automatic refunds for users under $20 to save support hours.",
    budget: "$5,000/mo risk",
    priority: "Medium",
    recommendation: "Approve - Saves 40h/week.",
    teams: ["Support", "Finance"],
    status: "Pending",
    color: "brand-emerald"
  }
];

const columns = ["Pending", "Needs Review", "Approved", "Rejected"];

export default function ApprovalsPage() {
  const [items, setItems] = useState(initialApprovals);

  const handleApprove = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: "Approved" } : item));
    
    // Dispatch a success notification
    window.dispatchEvent(new CustomEvent("new-notification", { 
      detail: { title: "Approval Granted", message: `Task ${id} has been approved.` } 
    }));
  };

  const handleReject = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: "Rejected" } : item));

    // Dispatch a rejected notification
    window.dispatchEvent(new CustomEvent("new-notification", { 
      detail: { title: "Approval Rejected", message: `Task ${id} has been rejected.` } 
    }));
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div className="flex items-center gap-5">
          <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <CheckSquare size={32} className="text-yellow-500" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-1">Approval Center</h1>
            <p className="text-slate-400 text-sm">
              Review and manage Human-in-the-Loop interventions.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search approvals..." className="bg-[#09222b] border border-[rgba(255,255,255,0.08)] rounded-md pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-blue transition-colors w-64 shadow-inner" />
          </div>
          <button className="p-2.5 rounded-md bg-[#09222b] border border-[rgba(255,255,255,0.08)] text-slate-400 hover:text-white transition-colors hover:bg-white/5 shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
            <Filter size={18} />
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {columns.map((col) => (
          <div key={col} className="flex-1 min-w-[320px] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white/90 flex items-center gap-2">
                {col}
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-slate-400">
                  {items.filter(a => a.status === col).length}
                </span>
              </h3>
              <button className="text-slate-400 hover:text-white transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-4 h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence>
                {items.filter(a => a.status === col).map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    whileHover={{ y: -2 }}
                  className="luxury-card p-5 border-l-4 group flex flex-col"
                  style={{ borderLeftColor: `var(--${item.color})` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.id}</span>
                    <span className={cn(
                      "text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest",
                      item.priority === "High" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-brand-blue/10 text-brand-blue border border-brand-blue/20"
                    )}>
                      {item.priority}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-white mb-2 tracking-tight text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{item.reason}</p>

                  <div className="space-y-2.5 mb-5 p-3 rounded-md bg-[#021114] border border-[rgba(255,255,255,0.05)] shadow-inner">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400 font-medium uppercase tracking-wider text-[9px]">Budget impact</span>
                      <span className="font-semibold text-white">{item.budget}</span>
                    </div>
                    <div className="flex justify-between text-[11px] items-center">
                      <span className="text-slate-400 flex items-center gap-1 font-medium uppercase tracking-wider text-[9px]"><Cpu size={10}/> AI Rec.</span>
                      <span className={cn(
                        "font-semibold",
                        item.recommendation.includes("Approve") ? "text-brand-emerald" : "text-yellow-500"
                      )}>{item.recommendation}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    {(col === "Pending" || col === "Needs Review") && (
                      <>
                        <button onClick={() => handleApprove(item.id)} className="flex-1 py-2 rounded-md bg-brand-emerald/10 hover:bg-brand-emerald/20 border border-brand-emerald/30 text-brand-emerald text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                          <Check size={14} /> Approve
                        </button>
                        <button onClick={() => handleReject(item.id)} className="flex-1 py-2 rounded-md bg-[#021114] hover:bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
                          <X size={14} /> Reject
                        </button>
                        <button className="px-3 py-2 rounded-md bg-[#09222b] hover:bg-white/10 border border-[rgba(255,255,255,0.08)] text-slate-400 hover:text-white transition-colors shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
                          <ShieldAlert size={14} />
                        </button>
                      </>
                    )}
                    {col === "Approved" && (
                      <div className="flex-1 py-2 rounded-md bg-brand-emerald/5 border border-brand-emerald/20 text-brand-emerald/70 text-xs font-bold flex items-center justify-center gap-1.5 cursor-default">
                        <Check size={14} /> Approved
                      </div>
                    )}
                    {col === "Rejected" && (
                      <div className="flex-1 py-2 rounded-md bg-red-500/5 border border-red-500/20 text-red-500/70 text-xs font-bold flex items-center justify-center gap-1.5 cursor-default">
                        <X size={14} /> Rejected
                      </div>
                    )}
                  </div>
                </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Empty state for column */}
              {items.filter(a => a.status === col).length === 0 && (
                <div className="h-32 rounded-xl border border-dashed border-[rgba(255,255,255,0.08)] bg-[#021114] flex flex-col items-center justify-center text-slate-400">
                  <span className="text-[10px] uppercase tracking-widest font-bold">No tasks</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
