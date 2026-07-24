"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Brain, DollarSign, Activity, Settings2, 
  Database, MessageSquare, Terminal, Shield, Sparkles, 
  Cpu, Gavel, HandHeart, Code, LineChart, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

const initialAgents = [
  {
    id: "engineering",
    name: "Engineering Agent",
    role: "Lead Developer",
    icon: <Code size={24} className="text-brand-cyan" />,
    color: "brand-cyan",
    model: "GPT-4o",
    task: "Building Expense Predictor",
    confidence: "98%",
    memory: "1.4 GB",
    reasoning: "75%",
    latency: "145ms",
    tokens: "12,450",
    cost: "$0.14",
    lastDecision: "Adopted React Flow for visualization.",
    status: "Active"
  },
  {
    id: "finance",
    name: "Finance Agent",
    role: "Policy Enforcer",
    icon: <DollarSign size={24} className="text-brand-purple" />,
    color: "brand-purple",
    model: "Claude 3.5 Sonnet",
    task: "Auditing Q3 Budgets",
    confidence: "99%",
    memory: "800 MB",
    reasoning: "100%",
    latency: "85ms",
    tokens: "4,200",
    cost: "$0.06",
    lastDecision: "Rejected budget > ₹50,000",
    status: "Active"
  },
  {
    id: "qa",
    name: "QA Agent",
    role: "Quality Assurance",
    icon: <Shield size={24} className="text-brand-emerald" />,
    color: "brand-emerald",
    model: "GPT-4o-mini",
    task: "Running E2E Cypress Tests",
    confidence: "94%",
    memory: "2.1 GB",
    reasoning: "60%",
    latency: "210ms",
    tokens: "18,900",
    cost: "$0.02",
    lastDecision: "Flagged edge case in UI component.",
    status: "Active"
  },
  {
    id: "marketing",
    name: "Marketing Agent",
    role: "Creative Strategist",
    icon: <Sparkles size={24} className="text-pink-500" />,
    color: "pink-500",
    model: "GPT-4o",
    task: "Drafting Product Launch Tweet",
    confidence: "91%",
    memory: "950 MB",
    reasoning: "80%",
    latency: "340ms",
    tokens: "8,100",
    cost: "$0.10",
    lastDecision: "A/B testing two copy variants.",
    status: "Idle"
  },
  {
    id: "devops",
    name: "DevOps Agent",
    role: "Infrastructure Lead",
    icon: <Terminal size={24} className="text-orange-500" />,
    color: "orange-500",
    model: "Claude 3.5 Sonnet",
    task: "Scaling Kubernetes Cluster",
    confidence: "99%",
    memory: "512 MB",
    reasoning: "40%",
    latency: "45ms",
    tokens: "1,200",
    cost: "$0.01",
    lastDecision: "Autoscaled nodes by +2.",
    status: "Active"
  },
  {
    id: "hr",
    name: "HR Agent",
    role: "Talent Acquisition",
    icon: <Users size={24} className="text-yellow-500" />,
    color: "yellow-500",
    model: "GPT-4o-mini",
    task: "Screening Engineering Resumes",
    confidence: "88%",
    memory: "1.2 GB",
    reasoning: "90%",
    latency: "150ms",
    tokens: "24,000",
    cost: "$0.04",
    lastDecision: "Shortlisted 5 candidates.",
    status: "Active"
  },
  {
    id: "legal",
    name: "Legal Agent",
    role: "Compliance Officer",
    icon: <Gavel size={24} className="text-red-500" />,
    color: "red-500",
    model: "GPT-4o",
    task: "Reviewing Vendor Contract",
    confidence: "97%",
    memory: "3.4 GB",
    reasoning: "30%",
    latency: "520ms",
    tokens: "45,000",
    cost: "$0.60",
    lastDecision: "Flagged indemnity clause.",
    status: "Active"
  },
  {
    id: "support",
    name: "Support Agent",
    role: "Customer Success",
    icon: <HandHeart size={24} className="text-brand-blue" />,
    color: "brand-blue",
    model: "Claude 3 Haiku",
    task: "Resolving Ticket #492",
    confidence: "95%",
    memory: "400 MB",
    reasoning: "100%",
    latency: "30ms",
    tokens: "850",
    cost: "$0.001",
    lastDecision: "Refunded $15 to user.",
    status: "Idle"
  }
];

const colorMap: Record<string, { text: string, border: string, shadow: string, bg: string }> = {
  "brand-cyan": { text: "text-brand-cyan", border: "border-brand-cyan/20", shadow: "shadow-[0_0_15px_rgba(6,182,212,0.15)]", bg: "bg-brand-cyan" },
  "brand-purple": { text: "text-brand-purple", border: "border-brand-purple/20", shadow: "shadow-[0_0_15px_rgba(139,92,246,0.15)]", bg: "bg-brand-purple" },
  "brand-emerald": { text: "text-brand-emerald", border: "border-brand-emerald/20", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]", bg: "bg-brand-emerald" },
  "pink-500": { text: "text-pink-500", border: "border-pink-500/20", shadow: "shadow-[0_0_15px_rgba(236,72,153,0.15)]", bg: "bg-pink-500" },
  "orange-500": { text: "text-orange-500", border: "border-orange-500/20", shadow: "shadow-[0_0_15px_rgba(249,115,22,0.15)]", bg: "bg-orange-500" },
  "yellow-500": { text: "text-yellow-500", border: "border-yellow-500/20", shadow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]", bg: "bg-yellow-500" },
  "red-500": { text: "text-red-500", border: "border-red-500/20", shadow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]", bg: "bg-red-500" },
  "brand-blue": { text: "text-brand-blue", border: "border-brand-blue/20", shadow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]", bg: "bg-brand-blue" }
};

export default function AgentsPage() {
  const [fleet, setFleet] = useState(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFleet(currentFleet => currentFleet.map(agent => {
        if (agent.status !== "Active") return agent;

        // Simulate slight fluctuations in metrics
        const baseLatency = parseInt(agent.latency) || 100;
        const newLatency = Math.max(10, baseLatency + (Math.floor(Math.random() * 21) - 10));
        
        const baseMemory = parseFloat(agent.memory) || 1.0;
        const memChange = (Math.random() * 0.1 - 0.05);
        const newMemory = Math.max(0.1, baseMemory + memChange).toFixed(1) + (agent.memory.includes("GB") ? " GB" : " MB");

        const tokensNum = parseInt(agent.tokens.replace(/,/g, '')) + Math.floor(Math.random() * 50);
        
        return {
          ...agent,
          latency: `${newLatency}ms`,
          memory: newMemory,
          tokens: tokensNum.toLocaleString()
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleDeploy = () => {
    window.dispatchEvent(new CustomEvent("new-notification", { 
      detail: { title: "Agent Deployment", message: "Provisioning a new autonomous agent in the cloud..." } 
    }));
  };

  const handleViewDetails = (agent: any) => {
    setSelectedAgent(agent);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div className="flex items-center gap-5">
          <div className="p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20">
            <Users size={32} className="text-brand-cyan" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-1">Agent Fleet</h1>
            <p className="text-slate-400 text-sm">
              Manage and monitor your autonomous AI workforce in real-time.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleDeploy} className="px-5 py-2.5 rounded-md bg-[#1c263f] border border-white/5 text-xs font-semibold text-white hover:bg-white/5 transition-colors shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
            Deploy New Agent
          </button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
        {fleet.map((agent, i) => (
          <motion.div 
            key={agent.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="luxury-card flex flex-col overflow-hidden group"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                  <div className={cn(
                    "p-3 rounded-xl border bg-[#131b2f]",
                    colorMap[agent.color].border,
                    colorMap[agent.color].shadow
                  )}>
                    {agent.icon}
                  </div>
                  <div>
                    <h2 className={cn("text-base font-semibold tracking-tight", colorMap[agent.color].text)}>{agent.name}</h2>
                    <div className="text-xs font-medium text-slate-400 mt-0.5">{agent.role}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#131b2f] border border-white/5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    <Settings2 size={10} />
                    {agent.model}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      agent.status === "Active" ? "bg-brand-emerald shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" : "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"
                    )} />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{agent.status}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Current Task</div>
                <div className="text-xs font-medium text-white bg-[#131b2f] border border-white/5 rounded-md px-3 py-2.5 truncate shadow-inner">
                  {agent.task}
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="p-6 grid grid-cols-2 gap-5 bg-[#131b2f] flex-1">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Confidence</div>
                <div className="text-xl font-light tracking-tight text-white flex items-baseline gap-1">
                  {agent.confidence}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Reasoning</div>
                <div className="flex items-center gap-3">
                  <div className="text-xl font-light tracking-tight text-white">{agent.reasoning}</div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className={cn("h-full", colorMap[agent.color].bg)} style={{ width: agent.reasoning }} />
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Cpu size={10}/> Memory</div>
                <div className="text-sm font-medium text-white">{agent.memory}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Activity size={10}/> Latency</div>
                <div className="text-sm font-medium text-white">{agent.latency}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Database size={10}/> Tokens</div>
                <div className="text-sm font-medium text-white">{agent.tokens}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><DollarSign size={10}/> Est. Cost</div>
                <div className="text-sm font-medium text-white">{agent.cost}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Last Decision</div>
              <div className="text-sm text-white font-medium mb-6 h-10 line-clamp-2">
                "{agent.lastDecision}"
              </div>
              
              <button onClick={() => handleViewDetails(agent)} className="w-full py-2.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 bg-[#1c263f] border border-white/5 hover:bg-white/5 text-white shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "w-full max-w-2xl bg-[#131b2f] border rounded-2xl overflow-hidden shadow-2xl flex flex-col",
                colorMap[selectedAgent.color].border
              )}
            >
              <div className="p-6 border-b border-white/5 bg-[#131b2f] flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  <div className={cn(
                    "p-3 rounded-xl border bg-[#1c263f]",
                    colorMap[selectedAgent.color].border,
                    colorMap[selectedAgent.color].shadow
                  )}>
                    {selectedAgent.icon}
                  </div>
                  <div>
                    <h2 className={cn("text-xl font-semibold tracking-tight", colorMap[selectedAgent.color].text)}>{selectedAgent.name}</h2>
                    <div className="text-sm font-medium text-slate-400 mt-0.5">{selectedAgent.role} • {selectedAgent.model}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAgent(null)}
                  className="p-2 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Live Terminal Logs</h3>
                <div className="bg-[#131b2f] border border-white/5 rounded-lg p-4 font-mono text-[11px] text-slate-400 leading-relaxed h-48 overflow-y-auto shadow-inner custom-scrollbar">
                  <div className="text-brand-cyan mb-2">➜ Connecting to {selectedAgent.name} secure channel...</div>
                  <div className="mb-2">✓ Authentication successful.</div>
                  <div className="mb-2">➜ Loading context for task: {selectedAgent.task}</div>
                  <div className="mb-2">✓ Context loaded. Memory allocation: {selectedAgent.memory}.</div>
                  <div className="text-white mb-2">➜ [SYSTEM] Last recorded decision: "{selectedAgent.lastDecision}"</div>
                  <div className="mb-2 opacity-50 animate-pulse">➜ Waiting for next instruction stream...</div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-[#1c263f] border border-white/5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</div>
                    <div className={cn("text-sm font-bold flex items-center gap-1.5", selectedAgent.status === "Active" ? "text-brand-emerald" : "text-yellow-500")}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", selectedAgent.status === "Active" ? "bg-brand-emerald animate-pulse" : "bg-yellow-500")} />
                      {selectedAgent.status}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#1c263f] border border-white/5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Latency</div>
                    <div className="text-sm font-bold text-white">{selectedAgent.latency}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#1c263f] border border-white/5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Est. Cost</div>
                    <div className="text-sm font-bold text-white">{selectedAgent.cost}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
