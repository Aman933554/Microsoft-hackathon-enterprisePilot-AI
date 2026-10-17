import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Shield, Settings, ClipboardList, DollarSign, User, Mail, BarChart2, FileText, Bot, CheckCircle2, Zap, Folder, ArrowRight, Hash } from 'lucide-react';

export function DashboardAgentWorkflow({ isRunning = true, needsApproval = false }: { isRunning?: boolean, needsApproval?: boolean }) {

  return (
    <div className="w-full bg-[#FAFAFA] rounded-3xl p-4 sm:p-10 shadow-lg overflow-hidden font-sans relative border border-slate-200">
      <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">
        
        {/* 1. TOP NODE: AI AGENTS */}
        <div className="bg-white border-[1.5px] border-slate-800 rounded-xl px-8 py-4 flex items-center gap-4 shadow-sm z-20">
          <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner">
            Ai<sup className="text-sm">+</sup>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-wide">AI AGENTS</h2>
        </div>

        {/* Space between Top and Agents */}
        <div className="h-12 w-full relative">
           <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
              <line x1="50%" y1="0" x2="50%" y2="50%" stroke="#1E293B" strokeWidth="2" />
              <line x1="8.33%" y1="50%" x2="91.66%" y2="50%" stroke="#1E293B" strokeWidth="2" />
              {[8.33, 25, 41.66, 58.33, 75, 91.66].map(x => (
                <g key={x}>
                  <line x1={`${x}%`} y1="50%" x2={`${x}%`} y2="100%" stroke="#1E293B" strokeWidth="2" />
                  <circle cx={`${x}%`} cy="50%" r="3.5" fill="#1E293B" />
                </g>
              ))}
              <circle cx="50%" cy="50%" r="3.5" fill="#1E293B" />
              
              {/* Animated Signals */}
              {isRunning && [8.33, 25, 41.66, 58.33, 75, 91.66].map((x, i) => (
                <motion.circle
                  key={`signal1-${x}`}
                  r="4"
                  fill="#3B82F6"
                  animate={{
                    cx: ["50%", "50%", `${x}%`, `${x}%`],
                    cy: ["0%", "50%", "50%", "100%"],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4
                  }}
                  style={{ filter: "drop-shadow(0 0 6px #3B82F6)" }}
                />
              ))}
           </svg>
        </div>

        {/* 2. MIDDLE LAYER: 6 AGENTS */}
        <div className="w-full grid grid-cols-6 gap-2 sm:gap-4 z-20 relative">
           <AgentCard title="Engineering" subtitle="Agent" icon={Code} color="#3B82F6" />
           <AgentCard title="QA" subtitle="Agent" icon={Shield} color="#8B5CF6" />
           <AgentCard title="DevOps" subtitle="Agent" icon={Settings} color="#10B981" />
           <AgentCard title="Product Manager" subtitle="Agent" icon={ClipboardList} color="#F97316" />
           <AgentCard title="Finance" subtitle="Agent" icon={DollarSign} color="#14B8A6" />
           <AgentCard title="Human Approval" subtitle="Agent" icon={User} color="#F43F5E" isBlinking={needsApproval} />
        </div>

        {/* Space between Agents and Integrations */}
        <div className="h-12 w-full relative">
           <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
              {[8.33, 25, 41.66, 58.33, 75, 91.66].map(x => (
                <line key={`drop-${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="50%" stroke="#1E293B" strokeWidth="2" />
              ))}
              <line x1="8.33%" y1="50%" x2="91.66%" y2="50%" stroke="#1E293B" strokeWidth="2" />
              {[8.33, 25, 41.66, 58.33, 75, 91.66].map(x => (
                <circle key={`dot-${x}`} cx={`${x}%`} cy="50%" r="3.5" fill="#1E293B" />
              ))}
              
              {/* 5 drops */}
              {[10, 30, 50, 70, 90].map(x => (
                <g key={`drop2-${x}`}>
                  <line x1={`${x}%`} y1="50%" x2={`${x}%`} y2="100%" stroke="#1E293B" strokeWidth="2" />
                  <circle cx={`${x}%`} cy="50%" r="3.5" fill="#1E293B" />
                </g>
              ))}

              {/* Animated Signals */}
              {isRunning && [8.33, 25, 41.66, 58.33, 75, 91.66].map((x, i) => {
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
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5 + 1.5
                    }}
                    style={{ filter: "drop-shadow(0 0 6px #10B981)" }}
                  />
                );
              })}
           </svg>
        </div>

        {/* 3. BOTTOM LAYER: 5 INTEGRATIONS */}
        <div className="w-full px-[5%] grid grid-cols-5 gap-3 sm:gap-5 z-20">
           <IntegrationCard 
              title="GitHub" 
              subtitle="Code, PRs, Issues" 
              iconContent={<div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></div>} 
           />
           <IntegrationCard 
              title="Notion Workspace" 
              subtitle="Docs, Wikis, Knowledge Base" 
              iconContent={<div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-lg font-bold font-serif text-lg">N</div>} 
           />
           <IntegrationCard 
              title="Slack Channel" 
              subtitle="Team Chat, Collaboration" 
              iconContent={<div className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-rose-500 rounded-full"><Hash size={24} /></div>} 
           />
           <IntegrationCard 
              title="Email" 
              subtitle="Alerts, Reports, Notifications" 
              iconContent={<div className="w-10 h-10 flex items-center justify-center bg-[#3B82F6] text-white rounded-full"><Mail size={20} fill="currentColor" /></div>} 
           />
           <IntegrationCard 
              title="Analytics" 
              subtitle="Metrics, Reports, Insights" 
              iconContent={<div className="w-10 h-10 flex items-center justify-center bg-[#8B5CF6] text-white rounded-full"><BarChart2 size={20} /></div>} 
           />
        </div>

        {/* 4. WORKFLOW BAR */}
        <div className="mt-12 w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between z-20 overflow-x-auto gap-2">
           <WorkflowStep title="Task Received" icon={FileText} color="#3B82F6" bg="bg-blue-50" />
           <ArrowRight className="text-slate-300 flex-shrink-0" size={16} />
           <WorkflowStep title="AI Agents Collaborate" icon={Bot} color="#8B5CF6" bg="bg-purple-50" />
           <ArrowRight className="text-slate-300 flex-shrink-0" size={16} />
           <WorkflowStep title="Results & Recommendations" icon={CheckCircle2} color="#10B981" bg="bg-emerald-50" />
           <ArrowRight className="text-slate-300 flex-shrink-0" size={16} />
           <WorkflowStep title={<span>Human Approval<br/><span className="font-normal text-[8px] sm:text-[9px]">(if required)</span></span>} icon={User} color="#F43F5E" bg="bg-rose-50" />
           <ArrowRight className="text-slate-300 flex-shrink-0" size={16} />
           <WorkflowStep title={<span>GitHub Issue<br/>Created</span>} icon={GithubIcon} color="#1E293B" bg="bg-slate-100" />
           <ArrowRight className="text-slate-300 flex-shrink-0" size={16} />
           <WorkflowStep title={<span>Insights & History<br/>Stored</span>} icon={Folder} color="#8B5CF6" bg="bg-purple-50" />
        </div>

      </div>
    </div>
  );
}

function AgentCard({ title, subtitle, icon: Icon, color, isBlinking = false, onClick }: { title: string, subtitle: string, icon: any, color: string, isBlinking?: boolean, onClick?: () => void }) {
  const textColor = isBlinking ? '#FFFFFF' : color;
  const bgColor = isBlinking ? '#0F172A' : '#FFFFFF';

  return (
    <div 
      onClick={onClick}
      className={`rounded-xl shadow-sm flex flex-col items-center justify-center p-3 sm:p-4 text-center h-full gap-2 transition-all duration-300 relative z-20 ${
        isBlinking 
          ? 'animate-pulse shadow-[0_0_25px_rgba(244,63,94,0.8)] cursor-pointer border-2' 
          : 'hover:shadow-md border'
      }`} 
      style={{ 
        backgroundColor: bgColor,
        borderColor: isBlinking ? color : `${color}40` 
      }}
    >
      <div className="flex flex-col items-center gap-1 sm:gap-2">
        <Icon size={28} style={{ color: isBlinking ? color : color }} strokeWidth={2} />
        <div className="flex flex-col mt-1">
          <span className="font-bold text-[9px] sm:text-[13px] leading-tight" style={{ color: textColor }}>{title}</span>
          <span className="font-bold text-[9px] sm:text-[13px] leading-tight mt-0.5" style={{ color: textColor }}>{subtitle}</span>
        </div>
      </div>
    </div>
  )
}

function IntegrationCard({ title, subtitle, iconContent }: { title: string, subtitle: string, iconContent: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col xl:flex-row items-center xl:items-start text-center xl:text-left p-3 sm:p-4 gap-2 sm:gap-3 h-full relative z-20">
      <div className="flex-shrink-0">
        {iconContent}
      </div>
      <div className="flex flex-col justify-center">
        <span className="font-bold text-[9px] sm:text-xs text-slate-800 leading-tight">{title}</span>
        <span className="text-[8px] sm:text-[10px] text-slate-500 leading-tight mt-1 hidden sm:block">{subtitle}</span>
      </div>
    </div>
  )
}

const GithubIcon = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

function WorkflowStep({ title, icon: Icon, color, bg }: { title: React.ReactNode, icon: any, color: string, bg: string }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${bg}`} style={{ color }}>
        <Icon size={18} />
      </div>
      <span className="font-bold text-[8px] sm:text-[11px] text-slate-700 leading-tight max-w-[120px]">{title}</span>
    </div>
  )
}
