"use client";

import React, { useState } from "react";
import { Workflow, Plus, Play, Pause, FileEdit, Brain, DollarSign, MessageSquare, Database, Mail, Users, Filter, Search } from "lucide-react";
import { AgentGraph } from "@/components/AgentGraph";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState("Enterprise Architecture Pipeline");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const workflows = [
    {
      id: 1,
      title: "Enterprise Architecture Pipeline",
      description: "Autonomous negotiation between Engineering budget and Finance policies.",
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

  const handleRunWorkflow = async () => {
    setIsRunning(true);
    setLogs(["🚀 Starting AI-Native Enterprise OS Demo from Studio..."]);

    try {
      const res = await fetch("/api/run-agent", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: "Feature: Workflow Studio Auto-Test", maxBudget: 50000 })
      });
      const data = await res.json();
      
      if (data.success) {
        let index = 0;
        const interval = setInterval(() => {
          if (index < data.logs.length) {
            setLogs(prev => [...prev, data.logs[index]]);
            index++;
          } else {
            clearInterval(interval);
            setIsRunning(false);
            if (data.isPaused) {
              setLogs(prev => [...prev, "⏳ Workflow Paused: Waiting for human approval via Notion."]);
            }
          }
        }, 1500); 
      } else {
        setLogs(prev => [...prev, "❌ Error: " + data.error]);
        setIsRunning(false);
      }
    } catch (err: any) {
      setLogs(prev => [...prev, "❌ Connection Error: " + err.message]);
      setIsRunning(false);
    }
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
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#1c263f] border border-white/5 text-xs font-semibold text-white hover:bg-white/5 transition-colors shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
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
                  ? "border-brand-purple/50 bg-[#1c263f] shadow-inner" 
                  : "hover:bg-[#1c263f] bg-[#131b2f] hover:translate-x-1"
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

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
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
        <div className="flex-1 luxury-card bg-[#131b2f] overflow-hidden flex flex-col relative">
          <div className="px-6 py-4 border-b border-white/5 bg-[#1c263f] flex items-center justify-between shrink-0 shadow-inner">
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
              {activeTab === "Enterprise Architecture Pipeline" && !isRunning && (
                <button 
                  onClick={handleRunWorkflow}
                  className="px-4 py-1.5 rounded-md bg-brand-emerald/20 hover:bg-brand-emerald/30 border border-brand-emerald/40 text-brand-emerald text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center gap-1.5"
                >
                  <Play size={14} fill="currentColor" /> Run Demo
                </button>
              )}
              {isRunning && (
                <button className="px-4 py-1.5 rounded-md bg-yellow-500/20 border border-yellow-500/40 text-yellow-500 text-xs font-bold flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" /> Running...
                </button>
              )}
              <button className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-colors">
                View Logs
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            {activeTab === "Enterprise Architecture Pipeline" ? (
              <AgentGraph logs={logs.length > 0 ? logs : ["[SYSTEM] Ready to execute. Click 'Run Demo' to start."]} isRunning={isRunning} isFullScreen={true} isLiveMode={isRunning} />
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
