"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, DollarSign, ShieldCheck, Database, BarChart2, Wrench } from 'lucide-react';

const AGENTS = [
  { id: 'engineering', name: 'ENGINEERING AGENT', icon: Settings, color: '#3B82F6', hue: 'hue-rotate-[45deg]', x: 14 },
  { id: 'finance', name: 'FINANCE AGENT', icon: DollarSign, color: '#10B981', hue: 'hue-rotate-[-60deg]', x: 28.4 },
  { id: 'qa', name: 'QA (QUALITY ASSURANCE) AGENT', icon: ShieldCheck, color: '#F97316', hue: 'hue-rotate-[180deg]', x: 42.8 },
  { id: 'data', name: 'DATA AGENT', icon: Database, color: '#14B8A6', hue: 'hue-rotate-[0deg]', x: 57.2 },
  { id: 'analysis', name: 'ANALYSIS AGENT', icon: BarChart2, color: '#EC4899', hue: 'hue-rotate-[135deg]', x: 71.6 },
  { id: 'devops', name: 'DEVOPS AGENT', icon: Wrench, color: '#0EA5E9', hue: 'hue-rotate-[45deg]', x: 86 },
];

export function AgentHierarchyFlow() {
  const [activeSignals, setActiveSignals] = useState<{ id: number; targetId: string; progress: number }[]>([]);

  useEffect(() => {
    // Generate new signals randomly
    const timer = setInterval(() => {
      const targetAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
      setActiveSignals(prev => [...prev, { id: Date.now(), targetId: targetAgent.id, progress: 0 }]);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto luxury-card overflow-hidden relative z-10 aspect-[16/10] sm:aspect-[2/1] min-h-[500px]">
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />

      {/* SVG Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 500" preserveAspectRatio="none">
        {/* Main vertical line from orchestrator */}
        <path d="M 500 160 L 500 230" stroke="rgba(255,255,255,0.15)" strokeWidth="3" fill="none" />
        {/* Horizontal distribution line */}
        <path d="M 140 230 L 860 230" stroke="rgba(255,255,255,0.15)" strokeWidth="3" fill="none" strokeLinejoin="round" />
        {/* Vertical lines to child agents */}
        {AGENTS.map((agent) => (
          <path key={`line-${agent.id}`} d={`M ${agent.x * 10} 230 L ${agent.x * 10} 270`} stroke="rgba(255,255,255,0.15)" strokeWidth="3" fill="none" />
        ))}
      </svg>

      {/* Orchestrator Node */}
      <div className="absolute top-[8%] left-[50%] -translate-x-1/2 flex flex-col items-center z-20">
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-card/80 backdrop-blur-md rounded-full border-[3px] border-[#A855F7] flex flex-col items-center justify-center relative shadow-[0_0_20px_rgba(168,85,247,0.3)] p-1">
          <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-inner">
            <img src="/robot-head.jpg" alt="Orchestrator Robot" className="w-full h-full object-cover scale-[1.2] hue-rotate-[90deg] brightness-110" />
          </div>
        </div>
        <div className="mt-3 bg-card/80 backdrop-blur-md border-2 border-[#A855F7] px-4 py-1.5 rounded-lg text-center shadow-[0_0_15px_rgba(168,85,247,0.2)] min-w-[160px]">
          <p className="text-[#c084fc] font-black text-[11px] sm:text-[13px] tracking-wide leading-tight">ORCHESTRATOR<br/>AGENT</p>
        </div>
      </div>

      {/* Child Agents */}
      {AGENTS.map((agent) => {
        const Icon = agent.icon;
        return (
          <div 
            key={agent.id}
            className="absolute top-[54%] flex flex-col items-center z-20"
            style={{ left: `${agent.x}%`, transform: 'translateX(-50%)' }}
          >
            <div 
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-card/80 backdrop-blur-md rounded-full border-[3px] flex flex-col items-center justify-center relative p-1"
              style={{ borderColor: agent.color, boxShadow: `0 0 15px ${agent.color}40` }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-inner">
                <img src="/robot-head.jpg" alt={`${agent.name} Robot`} className={`w-full h-full object-cover scale-[1.2] ${agent.hue} brightness-110`} />
              </div>
              <div 
                className="absolute -bottom-3 sm:-bottom-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white border-2 border-[#0F172A] shadow-lg"
                style={{ backgroundColor: agent.color }}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            </div>
            
            <div 
              className="mt-6 bg-card/80 backdrop-blur-md border-[1.5px] sm:border-2 px-1 sm:px-2 py-1.5 rounded-lg text-center w-[85px] sm:w-[105px] lg:w-[125px] flex items-center justify-center min-h-[38px] sm:min-h-[44px]"
              style={{ borderColor: agent.color, boxShadow: `0 0 10px ${agent.color}30` }}
            >
              <p className="font-bold text-[7px] sm:text-[8px] lg:text-[10px] tracking-tight leading-tight" style={{ color: agent.color }}>
                {agent.name.includes('QA') ? <><span className="block">QA (QUALITY</span><span className="block">ASSURANCE)</span><span className="block">AGENT</span></> : agent.name}
              </p>
            </div>
          </div>
        );
      })}

      {/* Animated Signals Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 1000 500" preserveAspectRatio="none">
        <defs>
          <filter id="glow-signal">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {AGENTS.map((agent) => (
          <motion.circle
            key={`signal-${agent.id}`}
            r="6"
            fill={agent.color}
            filter="url(#glow-signal)"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              cx: [500, 500, agent.x * 10, agent.x * 10],
              cy: [160, 230, 230, 270]
            }}
            transition={{ 
              duration: 2.5, 
              ease: "easeInOut", 
              repeat: Infinity, 
              repeatDelay: Math.random() * 3 
            }}
          />
        ))}
      </svg>
    </div>
  );
}
