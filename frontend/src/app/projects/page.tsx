import React from "react";
import { Folder, MoreHorizontal, Clock, CheckCircle, Target, Users, Play, Calendar } from "lucide-react";

export default function ProjectsPage() {
  const projects = [
    { name: "Enterprise Architecture Upgrade", status: "Active", progress: 65, agents: ["Engineering", "Finance", "QA"], priority: "High", due: "15 Days" },
    { name: "Q3 Marketing Campaign", status: "Planning", progress: 20, agents: ["Marketing", "Finance"], priority: "Medium", due: "30 Days" },
    { name: "Support Bot V2 Training", status: "Completed", progress: 100, agents: ["QA", "Support"], priority: "High", due: "0 Days" },
    { name: "SOC2 Compliance Audit", status: "Active", progress: 45, agents: ["Engineering", "Legal", "QA"], priority: "Critical", due: "10 Days" },
    { name: "Cloud Migration", status: "Paused", progress: 15, agents: ["Engineering", "Finance"], priority: "Low", due: "90 Days" },
    { name: "New Employee Onboarding", status: "Active", progress: 85, agents: ["HR", "IT"], priority: "Medium", due: "5 Days" },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-10 h-[calc(100vh-6rem)] flex flex-col p-8 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-5">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 relative">
            <Folder size={32} className="text-blue-500 relative z-10" />
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-1">Active Projects</h1>
            <p className="text-slate-400 text-sm">Monitor multi-agent execution across organizational campaigns.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-colors">
            Filter Projects
          </button>
          <button className="px-4 py-2 bg-brand-cyan hover:bg-brand-cyan/90 rounded-lg text-sm text-[#09222b] font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
            + New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl flex flex-col relative group hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md w-max ${
                  proj.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  proj.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  proj.status === 'Paused' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                  'bg-white/5 text-slate-400 border border-white/10'
                }`}>
                  {proj.status}
                </span>
                <h3 className="text-lg font-bold text-white mt-1 leading-tight">{proj.name}</h3>
              </div>
              <button className="text-slate-500 hover:text-white transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Execution Progress</span>
                <span className="text-xs font-bold text-white">{proj.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${proj.progress === 100 ? 'bg-blue-500' : 'bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`} 
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1"><Users size={12} /> Assigned Agents</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.agents.map((agent, j) => (
                    <span key={j} className="text-[10px] bg-[#1c263f] border border-white/5 px-1.5 py-0.5 rounded text-slate-300">
                      {agent}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1 justify-end text-right">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1 justify-end"><Calendar size={12} /> Deadline</span>
                <span className="text-xs font-bold text-white">{proj.due}</span>
              </div>
            </div>
            
            {/* Hover Play Button Overlay */}
            <div className="absolute inset-0 bg-[#0b1120]/60 backdrop-blur-sm rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center pl-1 hover:scale-110 transition-transform">
                <Play size={24} fill="currentColor" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
