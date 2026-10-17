"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Database, CheckCircle2 } from 'lucide-react';

type Step = 
  | 'IDLE' 
  | 'SIGNAL_IN' 
  | 'ORCH_PROCESSING' 
  | 'SIGNAL_TO_DATA' 
  | 'DATA_PROCESSING' 
  | 'SIGNAL_FROM_DATA' 
  | 'SIGNAL_TO_ANALYSIS' 
  | 'ANALYSIS_PROCESSING' 
  | 'SIGNAL_FROM_ANALYSIS' 
  | 'FINAL_REPORT';

// Path data for the SVG (1000x750 viewBox to match 4:3 aspect ratio)
const paths = {
  in: "M 150 250 C 250 200, 350 300, 480 350",
  toData: "M 480 390 C 420 500, 350 550, 270 600",
  fromData: "M 290 600 C 370 520, 450 450, 490 390",
  toAnalysis: "M 520 370 C 620 330, 720 360, 800 450",
  fromAnalysis: "M 820 460 C 720 400, 620 400, 520 390",
};

export function MultiAgentFlow() {
  const [step, setStep] = useState<Step>('IDLE');
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const runSequence = () => {
      setStep('IDLE');
      timer = setTimeout(() => setStep('SIGNAL_IN'), 500);
      timer = setTimeout(() => setStep('ORCH_PROCESSING'), 2000);
      timer = setTimeout(() => setStep('SIGNAL_TO_DATA'), 3500);
      timer = setTimeout(() => setStep('DATA_PROCESSING'), 5000);
      timer = setTimeout(() => setStep('SIGNAL_FROM_DATA'), 7000);
      timer = setTimeout(() => setStep('SIGNAL_TO_ANALYSIS'), 8500);
      timer = setTimeout(() => setStep('ANALYSIS_PROCESSING'), 10000);
      timer = setTimeout(() => setStep('SIGNAL_FROM_ANALYSIS'), 12000);
      timer = setTimeout(() => setStep('FINAL_REPORT'), 13500);
      timer = setTimeout(runSequence, 17000); // Loop
    };

    runSequence();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto bg-card/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative z-10">
      
      {/* Background 3D Image Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/3]">
        <img 
          src="/multi-agent-diagram.jpg" 
          alt="AI Agents Collaboration" 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Darkening */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent pointer-events-none" />

        {/* SVG overlay for connection paths and animated signals */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          viewBox="0 0 1000 750" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="signalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Faint base lines connecting the robots */}
          <path d={paths.in} stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6 6" fill="none" />
          <path d={paths.toData} stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6 6" fill="none" />
          <path d={paths.toAnalysis} stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6 6" fill="none" />

          {/* Animated Signals */}
          <AnimatePresence>
            {step === 'SIGNAL_IN' && (
              <motion.path
                key="sig-in"
                d={paths.in}
                fill="none"
                stroke="url(#signalGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow)"
                initial={{ pathLength: 0.2, pathOffset: -0.2, opacity: 0 }}
                animate={{ pathLength: 0.2, pathOffset: 1, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )}
            {step === 'SIGNAL_TO_DATA' && (
              <motion.path
                key="sig-to-data"
                d={paths.toData}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow)"
                initial={{ pathLength: 0.2, pathOffset: -0.2, opacity: 0 }}
                animate={{ pathLength: 0.2, pathOffset: 1, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )}
            {step === 'SIGNAL_FROM_DATA' && (
              <motion.path
                key="sig-from-data"
                d={paths.fromData}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow)"
                initial={{ pathLength: 0.2, pathOffset: -0.2, opacity: 0 }}
                animate={{ pathLength: 0.2, pathOffset: 1, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )}
            {step === 'SIGNAL_TO_ANALYSIS' && (
              <motion.path
                key="sig-to-analysis"
                d={paths.toAnalysis}
                fill="none"
                stroke="#F43F5E"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow)"
                initial={{ pathLength: 0.2, pathOffset: -0.2, opacity: 0 }}
                animate={{ pathLength: 0.2, pathOffset: 1, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )}
            {step === 'SIGNAL_FROM_ANALYSIS' && (
              <motion.path
                key="sig-from-analysis"
                d={paths.fromAnalysis}
                fill="none"
                stroke="#F43F5E"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow)"
                initial={{ pathLength: 0.2, pathOffset: -0.2, opacity: 0 }}
                animate={{ pathLength: 0.2, pathOffset: 1, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>
        </svg>

        {/* Animated UI Badges - Positioned carefully to maintain distance from lines */}
        <AnimatePresence>
          
          {/* USER REQUEST (Top Left edge) */}
          {['SIGNAL_IN', 'ORCH_PROCESSING'].includes(step) && (
            <motion.div 
              key="user-req"
              initial={{ opacity: 0, x: -20, scale: 0.9 }} 
              animate={{ opacity: 1, x: 0, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-[20%] left-[2%] bg-blue-500/20 backdrop-blur-md border border-blue-500/40 text-blue-100 p-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] flex flex-col gap-2 max-w-[180px]"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <Terminal className="w-4 h-4" /> User Request
              </div>
              <div className="text-xs font-mono leading-tight">
                "Analyze Q3 Revenue and fetch CRM data."
              </div>
            </motion.div>
          )}

          {/* ORCHESTRATOR PROCESSING (Center Robot) */}
          {['ORCH_PROCESSING', 'SIGNAL_TO_DATA', 'SIGNAL_TO_ANALYSIS'].includes(step) && (
            <motion.div 
              key="orch-proc"
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="absolute top-[18%] left-[45%] -translate-x-1/2 bg-purple-500/20 backdrop-blur-md border border-purple-500/40 text-purple-100 p-2.5 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-semibold whitespace-nowrap">
                {step === 'SIGNAL_TO_DATA' ? 'Delegating to Data...' : 
                 step === 'SIGNAL_TO_ANALYSIS' ? 'Delegating to Analysis...' : 
                 'Orchestrator Processing...'}
              </span>
            </motion.div>
          )}

          {/* DATA AGENT (Bottom Left Robot) */}
          {['DATA_PROCESSING', 'SIGNAL_FROM_DATA'].includes(step) && (
            <motion.div 
              key="data-agent"
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute bottom-[8%] left-[12%] backdrop-blur-md border p-3 rounded-xl flex flex-col gap-2 ${step === 'SIGNAL_FROM_DATA' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-amber-500/20 border-amber-500/40 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.3)]'}`}
            >
              <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${step === 'SIGNAL_FROM_DATA' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {step === 'SIGNAL_FROM_DATA' ? <CheckCircle2 className="w-4 h-4" /> : <Database className="w-4 h-4 animate-pulse" />} Data Agent
              </div>
              <div className="text-[11px] font-medium opacity-90">
                {step === 'SIGNAL_FROM_DATA' ? 'Data extracted successfully.' : 'Extracting 5,000 CRM records...'}
              </div>
            </motion.div>
          )}

          {/* ANALYSIS AGENT (Right Robot) */}
          {['ANALYSIS_PROCESSING', 'SIGNAL_FROM_ANALYSIS'].includes(step) && (
            <motion.div 
              key="analysis-agent"
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute top-[35%] right-[5%] backdrop-blur-md border p-3 rounded-xl flex flex-col gap-2 ${step === 'SIGNAL_FROM_ANALYSIS' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-rose-500/20 border-rose-500/40 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)]'}`}
            >
              <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${step === 'SIGNAL_FROM_ANALYSIS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {step === 'SIGNAL_FROM_ANALYSIS' ? <CheckCircle2 className="w-4 h-4" /> : <Cpu className="w-4 h-4 animate-pulse" />} Analysis Agent
              </div>
              <div className="text-[11px] font-medium opacity-90">
                {step === 'SIGNAL_FROM_ANALYSIS' ? 'Analysis complete.' : 'Computing Q3 revenue trends...'}
              </div>
            </motion.div>
          )}

          {/* FINAL REPORT (Center / Bottom) */}
          {(step === 'FINAL_REPORT') && (
            <motion.div 
              key="final-report"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="absolute bottom-[10%] left-1/2 -translate-x-1/2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-100 p-4 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-4 border-t-2 border-t-emerald-500"
            >
              <div className="bg-emerald-500/20 p-2 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Workflow Complete</span>
                <span className="text-[15px] font-medium mt-0.5">Q3 Revenue Report is ready for review</span>
              </div>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>
    </div>
  );
}
