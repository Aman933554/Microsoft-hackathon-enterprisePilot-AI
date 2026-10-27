"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, Shield, Settings, ClipboardList, DollarSign, User, 
  Mail, BarChart2, FileText, Bot, CheckCircle2, Zap, Folder, 
  ArrowRight, Hash, Play, Info, X, Sparkles, Check
} from 'lucide-react';

interface DashboardAgentWorkflowProps {
  isRunning?: boolean;
  needsApproval?: boolean;
  logs?: string[];
}

export function DashboardAgentWorkflow({ 
  isRunning = true, 
  needsApproval = false,
  logs = []
}: DashboardAgentWorkflowProps) {
  // If no logs, run an autonomous demonstration cycle
  const [autoCycleIndex, setAutoCycleIndex] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Auto cycle when idle or demo
  useEffect(() => {
    if (logs.length > 0) return;
    const interval = setInterval(() => {
      setAutoCycleIndex(prev => (prev + 1) % 6);
    }, 2800);
    return () => clearInterval(interval);
  }, [logs.length]);

  // Determine active agent from logs or auto-cycle
  let activeAgentKey = "product";
  let activeStep = 1; // 0 to 5

  if (logs.length > 0) {
    const recentLogs = logs.slice(-8).join(" ");
    if (recentLogs.includes("[DEVOPS]") || recentLogs.includes("Executing Pipeline") || recentLogs.includes("GitHub") || recentLogs.includes("Complete")) {
      activeAgentKey = "devops";
      activeStep = 4;
    } else if (needsApproval || recentLogs.includes("HUMAN") || recentLogs.includes("WAITING") || recentLogs.includes("Approval")) {
      activeAgentKey = "approval";
      activeStep = 3;
    } else if (recentLogs.includes("[QA AGENT]") || recentLogs.includes("QA")) {
      activeAgentKey = "qa";
      activeStep = 2;
    } else if (recentLogs.includes("[FINANCE AGENT]") || recentLogs.includes("Finance")) {
      activeAgentKey = "finance";
      activeStep = 1;
    } else if (recentLogs.includes("[ENGINEERING AGENT]") || recentLogs.includes("Architecture")) {
      activeAgentKey = "engineering";
      activeStep = 1;
    } else {
      activeAgentKey = "product";
      activeStep = 0;
    }
  } else {
    const agentKeys = ["product", "engineering", "finance", "qa", "approval", "devops"];
    activeAgentKey = agentKeys[autoCycleIndex];
    activeStep = Math.min(5, autoCycleIndex);
  }

  const agents = [
    {
      id: "engineering",
      title: "Engineering",
      subtitle: "Agent",
      role: "Lead Systems Architect",
      desc: "Analyzes system goals, plans modular architecture, scopes tech stack, and drafts implementation tasks.",
      icon: Code,
      color: "#3B82F6",
      integration: "GitHub"
    },
    {
      id: "qa",
      title: "QA",
      subtitle: "Agent",
      role: "Quality & Security Inspector",
      desc: "Validates security boundaries, plans test suites, checks regression risks, and audits compliance.",
      icon: Shield,
      color: "#8B5CF6",
      integration: "Analytics"
    },
    {
      id: "devops",
      title: "DevOps",
      subtitle: "Agent",
      role: "Deployment & CI/CD Orchestrator",
      desc: "Automates repository setup, opens pull requests with boilerplate code, and notifies engineers on Slack.",
      icon: Settings,
      color: "#10B981",
      integration: "Slack Channel"
    },
    {
      id: "product",
      title: "Product Manager",
      subtitle: "Agent",
      role: "Requirements & Scope Strategist",
      desc: "Translates high-level business goals into concrete feature specs and milestone acceptance criteria.",
      icon: ClipboardList,
      color: "#F97316",
      integration: "Notion Workspace"
    },
    {
      id: "finance",
      title: "Finance",
      subtitle: "Agent",
      role: "Financial Policy Auditor",
      desc: "Enforces enterprise budget thresholds, estimates infrastructure ROI, and negotiates cost revisions.",
      icon: DollarSign,
      color: "#14B8A6",
      integration: "Email"
    },
    {
      id: "approval",
      title: "Human Approval",
      subtitle: "Agent",
      role: "Managerial Decision Gate",
      desc: "Pauses the autonomous execution to request cryptographic authorization from authorized executives via email/Notion.",
      icon: User,
      color: "#F43F5E",
      integration: "Email"
    }
  ];

  const activeAgentData = agents.find(a => a.id === (selectedAgent || activeAgentKey)) || agents[0];

  return (
    <div className="w-full bg-[#0F172A] rounded-3xl p-4 sm:p-8 shadow-2xl overflow-hidden font-sans relative border border-slate-800 text-white transition-all">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">
        
        {/* Status Header Badge */}
        <div className="flex items-center justify-between w-full mb-6 px-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">Live Orchestration Engine</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">Active Agent:</span>
            <span 
              className="text-xs font-bold px-3 py-1 rounded-full border shadow-sm transition-all"
              style={{ 
                color: activeAgentData.color, 
                borderColor: `${activeAgentData.color}60`,
                backgroundColor: `${activeAgentData.color}15`
              }}
            >
              {activeAgentData.title} {activeAgentData.subtitle}
            </span>
          </div>
        </div>

        {/* 1. TOP NODE: AI AGENTS */}
        <div className="bg-slate-900 border-2 border-slate-700 hover:border-blue-500 rounded-2xl px-8 py-3.5 flex items-center gap-4 shadow-xl z-20 transition-all hover:scale-105 cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/30">
            Ai<sup className="text-xs">+</sup>
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
              AI AGENTS <Sparkles size={16} className="text-yellow-400 animate-pulse" />
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">Autonomous Multi-Agent Collaboration</p>
          </div>
        </div>

        {/* Space between Top and Agents with Animated SVG Lines */}
        <div className="h-12 w-full relative">
           <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
              <line x1="50%" y1="0" x2="50%" y2="50%" stroke="#334155" strokeWidth="2" />
              <line x1="8.33%" y1="50%" x2="91.66%" y2="50%" stroke="#334155" strokeWidth="2" />
              {[8.33, 25, 41.66, 58.33, 75, 91.66].map(x => (
                <g key={x}>
                  <line x1={`${x}%`} y1="50%" x2={`${x}%`} y2="100%" stroke="#334155" strokeWidth="2" />
                  <circle cx={`${x}%`} cy="50%" r="3.5" fill="#475569" />
                </g>
              ))}
              <circle cx="50%" cy="50%" r="3.5" fill="#3B82F6" />
              
              {/* Dynamic Animated Packets */}
              {[8.33, 25, 41.66, 58.33, 75, 91.66].map((x, i) => (
                <motion.circle
                  key={`signal1-${x}`}
                  r="4"
                  fill="#38BDF8"
                  animate={{
                    cx: ["50%", "50%", `${x}%`, `${x}%`],
                    cy: ["0%", "50%", "50%", "100%"],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.35
                  }}
                  style={{ filter: "drop-shadow(0 0 6px #38BDF8)" }}
                />
              ))}
           </svg>
        </div>

        {/* 2. MIDDLE LAYER: 6 AGENTS */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 z-20 relative">
          {agents.map((agent) => {
            const isActive = activeAgentKey === agent.id;
            const isApprovalBlink = agent.id === "approval" && (needsApproval || isActive);
            
            return (
              <AgentCard 
                key={agent.id}
                title={agent.title} 
                subtitle={agent.subtitle} 
                icon={agent.icon} 
                color={agent.color} 
                isActive={isActive}
                isBlinking={isApprovalBlink}
                onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
              />
            );
          })}
        </div>

        {/* Space between Agents and Integrations */}
        <div className="h-12 w-full relative">
           <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
              {[8.33, 25, 41.66, 58.33, 75, 91.66].map(x => (
                <line key={`drop-${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="50%" stroke="#334155" strokeWidth="2" />
              ))}
              <line x1="8.33%" y1="50%" x2="91.66%" y2="50%" stroke="#334155" strokeWidth="2" />
              {[8.33, 25, 41.66, 58.33, 75, 91.66].map(x => (
                <circle key={`dot-${x}`} cx={`${x}%`} cy="50%" r="3.5" fill="#475569" />
              ))}
              
              {/* 5 drops */}
              {[10, 30, 50, 70, 90].map(x => (
                <g key={`drop2-${x}`}>
                  <line x1={`${x}%`} y1="50%" x2={`${x}%`} y2="100%" stroke="#334155" strokeWidth="2" />
                  <circle cx={`${x}%`} cy="50%" r="3.5" fill="#475569" />
                </g>
              ))}

              {/* Animated Signals down to tools */}
              {[8.33, 25, 41.66, 58.33, 75, 91.66].map((x, i) => {
                const destX = [10, 30, 50, 70, 90][i % 5];
                return (
                  <motion.circle
                    key={`signal2-${x}`}
                    r="4"
                    fill="#10B981"
                    animate={{
                      cx: [`${x}%`, `${x}%`, `${destX}%`, `${destX}%`],
                      cy: ["0%", "50%", "50%", "100%"],
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.4 + 1.2
                    }}
                    style={{ filter: "drop-shadow(0 0 6px #10B981)" }}
                  />
                );
              })}
           </svg>
        </div>

        {/* 3. BOTTOM LAYER: 5 INTEGRATIONS */}
        <div className="w-full px-[2%] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 z-20">
           <IntegrationCard 
              title="GitHub" 
              subtitle="Code, PRs, Issues" 
              isActive={activeAgentKey === "devops" || activeAgentKey === "engineering"}
              iconContent={<div className="w-9 h-9 flex items-center justify-center bg-black border border-white/20 text-white rounded-xl shadow-md"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></div>} 
           />
           <IntegrationCard 
              title="Notion Workspace" 
              subtitle="Docs, Wikis, Policies" 
              isActive={activeAgentKey === "product" || activeAgentKey === "finance"}
              iconContent={<div className="w-9 h-9 flex items-center justify-center bg-slate-900 border border-white/20 text-white rounded-xl font-bold font-serif text-base shadow-md">N</div>} 
           />
           <IntegrationCard 
              title="Slack Channel" 
              subtitle="Team Alerts & Kickoff" 
              isActive={activeAgentKey === "devops"}
              iconContent={<div className="w-9 h-9 flex items-center justify-center bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl shadow-md"><Hash size={20} /></div>} 
           />
           <IntegrationCard 
              title="Email / SMTP" 
              subtitle="Manager Approval Links" 
              isActive={activeAgentKey === "approval"}
              iconContent={<div className="w-9 h-9 flex items-center justify-center bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl shadow-md"><Mail size={18} fill="currentColor" /></div>} 
           />
           <IntegrationCard 
              title="Analytics" 
              subtitle="Risk, ROI, Insights" 
              isActive={activeAgentKey === "qa" || activeAgentKey === "finance"}
              iconContent={<div className="w-9 h-9 flex items-center justify-center bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl shadow-md"><BarChart2 size={18} /></div>} 
           />
        </div>

        {/* 4. WORKFLOW BAR */}
        <div className="mt-10 w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between z-20 overflow-x-auto gap-2 backdrop-blur-md">
           <WorkflowStep 
             title="Task Received" 
             icon={FileText} 
             color="#3B82F6" 
             isActive={activeStep === 0} 
             isDone={activeStep > 0} 
           />
           <ArrowRight className="text-slate-600 flex-shrink-0" size={14} />
           
           <WorkflowStep 
             title="AI Agents Collaborate" 
             icon={Bot} 
             color="#8B5CF6" 
             isActive={activeStep === 1} 
             isDone={activeStep > 1} 
           />
           <ArrowRight className="text-slate-600 flex-shrink-0" size={14} />
           
           <WorkflowStep 
             title="Results & Recommendations" 
             icon={CheckCircle2} 
             color="#10B981" 
             isActive={activeStep === 2} 
             isDone={activeStep > 2} 
           />
           <ArrowRight className="text-slate-600 flex-shrink-0" size={14} />
           
           <WorkflowStep 
             title={<span>Human Approval<br/><span className="text-[9px] font-normal opacity-70">(Required)</span></span>} 
             icon={User} 
             color="#F43F5E" 
             isActive={activeStep === 3} 
             isDone={activeStep > 3} 
           />
           <ArrowRight className="text-slate-600 flex-shrink-0" size={14} />
           
           <WorkflowStep 
             title={<span>GitHub PR<br/>Created</span>} 
             icon={GithubIcon} 
             color="#0EA5E9" 
             isActive={activeStep === 4} 
             isDone={activeStep > 4} 
           />
           <ArrowRight className="text-slate-600 flex-shrink-0" size={14} />
           
           <WorkflowStep 
             title={<span>Insights & Logs<br/>Stored</span>} 
             icon={Folder} 
             color="#A855F7" 
             isActive={activeStep === 5} 
             isDone={activeStep >= 5} 
           />
        </div>

        {/* 5. Selected Agent Detail Popover / Interactive Card */}
        <AnimatePresence>
          {selectedAgent && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-2xl relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ borderLeftColor: activeAgentData.color, borderLeftWidth: "4px" }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" 
                  style={{ backgroundColor: `${activeAgentData.color}20`, color: activeAgentData.color }}
                >
                  <activeAgentData.icon size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{activeAgentData.title} Agent</h4>
                    <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono">
                      {activeAgentData.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">{activeAgentData.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-slate-400">Integrated with: <b className="text-white">{activeAgentData.integration}</b></span>
                <button 
                  onClick={() => setSelectedAgent(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

function AgentCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  color, 
  isActive = false, 
  isBlinking = false, 
  onClick 
}: { 
  title: string; 
  subtitle: string; 
  icon: any; 
  color: string; 
  isActive?: boolean; 
  isBlinking?: boolean; 
  onClick?: () => void; 
}) {
  return (
    <div 
      onClick={onClick}
      className={`rounded-2xl flex flex-col items-center justify-center p-3 sm:p-4 text-center h-full gap-2 transition-all duration-300 relative z-20 cursor-pointer ${
        isBlinking 
          ? 'animate-pulse shadow-[0_0_30px_rgba(244,63,94,0.7)] border-2 scale-105' 
          : isActive 
          ? 'scale-105 shadow-xl border-2' 
          : 'hover:scale-[1.03] hover:border-slate-600 border'
      }`} 
      style={{ 
        backgroundColor: isActive ? `${color}18` : "#1E293B",
        borderColor: isActive || isBlinking ? color : "rgba(255,255,255,0.1)",
        boxShadow: isActive ? `0 0 25px ${color}30` : undefined
      }}
    >
      {isActive && (
        <span 
          className="absolute -top-2 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase text-white shadow-sm"
          style={{ backgroundColor: color }}
        >
          Active
        </span>
      )}

      <div className="flex flex-col items-center gap-1 sm:gap-2">
        <div 
          className="p-2 rounded-xl transition-all"
          style={{ 
            backgroundColor: isActive ? color : `${color}20`,
            color: isActive ? "#FFFFFF" : color 
          }}
        >
          <Icon size={24} strokeWidth={2.2} />
        </div>
        <div className="flex flex-col mt-0.5">
          <span className="font-bold text-[10px] sm:text-xs leading-tight text-white">{title}</span>
          <span className="text-[9px] sm:text-[11px] leading-tight mt-0.5 opacity-70 font-medium text-slate-300">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}

function IntegrationCard({ 
  title, 
  subtitle, 
  iconContent,
  isActive = false
}: { 
  title: string; 
  subtitle: string; 
  iconContent: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <div className={`rounded-xl border shadow-sm flex flex-col xl:flex-row items-center xl:items-start text-center xl:text-left p-3 gap-2.5 h-full relative z-20 transition-all ${
      isActive 
        ? 'bg-slate-800/90 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-[1.02]' 
        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
    }`}>
      <div className="flex-shrink-0">
        {iconContent}
      </div>
      <div className="flex flex-col justify-center">
        <span className="font-bold text-[10px] sm:text-xs text-white leading-tight">{title}</span>
        <span className="text-[8px] sm:text-[10px] text-slate-400 leading-tight mt-0.5 hidden sm:block">{subtitle}</span>
      </div>
    </div>
  );
}

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

function WorkflowStep({ 
  title, 
  icon: Icon, 
  color, 
  isActive = false,
  isDone = false
}: { 
  title: React.ReactNode; 
  icon: any; 
  color: string; 
  isActive?: boolean;
  isDone?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 flex-shrink-0 px-2 py-1 rounded-xl transition-all ${
      isActive ? 'bg-white/10 ring-1 ring-white/20' : ''
    }`}>
      <div 
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all ${
          isDone ? 'bg-emerald-500/20 text-emerald-400' : isActive ? 'text-white' : 'text-slate-400 bg-white/5'
        }`}
        style={{ 
          backgroundColor: isActive ? color : undefined,
          boxShadow: isActive ? `0 0 15px ${color}80` : undefined 
        }}
      >
        {isDone ? <Check size={14} strokeWidth={3} /> : <Icon size={14} />}
      </div>
      <span className={`font-bold text-[9px] sm:text-[11px] leading-tight max-w-[110px] ${
        isActive ? 'text-white' : isDone ? 'text-slate-300' : 'text-slate-400'
      }`}>
        {title}
      </span>
    </div>
  );
}
