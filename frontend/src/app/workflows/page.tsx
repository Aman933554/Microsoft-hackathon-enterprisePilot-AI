"use client";

import React, { useState } from "react";
import { Workflow, Plus, Play, Pause, FileEdit, Brain, DollarSign, MessageSquare, Database, Mail, Users, Filter, Search } from "lucide-react";
import { AgentGraph } from "@/components/AgentGraph";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState("Marketing & Finance Sync");

  const workflows = [
    {
      id: 1,
      title: "Marketing & Finance Sync",
      description: "Autonomous negotiation between creative and budget policies.",
      status: "Active",
      runs: 142,
      color: "brand-emerald",
      nodes: [Brain, DollarSign, Database, MessageSquare]
    },
    {
      id: 2,
      title: "Customer Support Triaging",
      description: "Classifies incoming tickets and routes to correct departments.",
      status: "Paused",
      runs: 840,
      color: "yellow-500",
      nodes: [MessageSquare, Brain, Mail]
    },
    {
      id: 3,
      title: "HR Recruitment Pipeline",
      description: "Screens resumes and schedules initial candidate interviews.",
      status: "Draft",
      runs: 0,
      color: "muted-foreground",
      nodes: [Mail, Brain, Users]
    }
  ];

  const colorMap: Record<string, { bg10: string, border30: string, text: string, bg20: string }> = {
    "brand-emerald": { bg10: "bg-brand-emerald/10", border30: "border-brand-emerald/30", text: "text-brand-emerald", bg20: "bg-brand-emerald/20" },
    "yellow-500": { bg10: "bg-yellow-500/10", border30: "border-yellow-500/30", text: "text-yellow-500", bg20: "bg-yellow-500/20" },
    "muted-foreground": { bg10: "bg-muted-foreground/10", border30: "border-muted-foreground/30", text: "text-slate-400", bg20: "bg-muted-foreground/20" }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10 h-[calc(100vh-6rem)] flex flex-col">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4 shrink-0">
        <div className="flex items-center gap-5">
          <div className="p-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20">
            <Workflow size={32} className="text-brand-purple" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-1">Workflow Studio</h1>
            <p className="text-slate-400 text-sm">
              Design, monitor, and deploy multi-agent architectures.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#09222b] border border-[rgba(255,255,255,0.08)] text-xs font-semibold text-white hover:bg-white/5 transition-colors shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
            <Plus size={14} /> Create New Workflow
          </button>
        </div>
      </header>
      
      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Sidebar: List */}
        <div className="w-[400px] flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar pr-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search workflows..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-purple transition-colors" />
            </div>
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
              <Filter size={16} />
            </button>
          </div>

          {workflows.map((wf) => (
            <div 
              key={wf.id} 
              onClick={() => setActiveTab(wf.title)}
              className={cn(
                "luxury-card p-5 transition-all duration-300 cursor-pointer group flex flex-col",
                activeTab === wf.title 
                  ? "border-brand-purple/50 bg-[#09222b] shadow-inner" 
                  : "hover:bg-[#09222b] bg-[#021114] hover:translate-x-1"
              )}
            >
              <div className="flex gap-4 items-start mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
                  colorMap[wf.color].bg10, colorMap[wf.color].border30, colorMap[wf.color].text
                )}>
                  {wf.status === "Active" ? <Play size={18} fill="currentColor" /> : 
                   wf.status === "Paused" ? <Pause size={18} fill="currentColor" /> : 
                   <FileEdit size={18} />}
                </div>

                <div>
                  <h3 className="font-semibold text-white text-sm flex items-center gap-2 mb-1 tracking-tight">
                    {wf.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{wf.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[rgba(255,255,255,0.05)]">
                <div className="flex items-center">
                  {wf.nodes.map((NodeIcon, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-background border border-white/10 flex items-center justify-center -ml-1 first:ml-0 shadow-sm relative z-10">
                      <NodeIcon size={10} className="text-slate-400" />
                    </div>
                  ))}
                </div>
                
                <div className="text-right flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider",
                    colorMap[wf.color].bg20, colorMap[wf.color].text
                  )}>
                    {wf.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{wf.runs} runs</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Area: Interactive Canvas */}
        <div className="flex-1 luxury-card bg-[#021114] overflow-hidden flex flex-col relative">
          <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.05)] bg-[#09222b] flex items-center justify-between shrink-0 shadow-inner">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-white flex items-center gap-2 mb-0.5">
                {activeTab}
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-brand-emerald/20 bg-brand-emerald/10 text-brand-emerald text-[9px] font-bold uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" /> Live
                </span>
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Interactive Canvas • Drag nodes to reposition</p>
            </div>
            
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-colors">
                View Logs
              </button>
              <button className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-colors">
                Export JSON
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            {activeTab === "Marketing & Finance Sync" ? (
              // Re-use our awesome React Flow Component but with dummy logs so it renders fully.
              <AgentGraph logs={["[SYSTEM] Initializing", "[MARKETING AGENT] Running strategy", "[FINANCE AGENT] Reviewing"]} isRunning={true} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center flex-col text-slate-400 gap-4">
                <Workflow size={48} className="opacity-20" />
                <p>Select a workflow to visualize its architecture.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
