import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertCircle } from 'lucide-react';

interface TerminalLogProps {
  logs: string[];
  isRunning: boolean;
}

export function TerminalLog({ logs, isRunning }: TerminalLogProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const parseLog = (log: string) => {
    if (!log) return { type: 'system', text: '' };
    
    let type = 'system';
    if (log.includes("[ENGINEERING AGENT]")) type = 'engineering';
    if (log.includes("[FINANCE AGENT]")) type = 'finance';
    if (log.includes("[SLACK]")) type = 'slack';
    if (log.includes("[NOTION MCP")) type = 'notion';
    if (log.includes("[GITHUB MOCK]") || log.includes("[GITHUB API]")) type = 'github';
    
    let text = log
      .replace("[ENGINEERING AGENT] (Mock Mode)", "")
      .replace("[FINANCE AGENT] (Mock Mode)", "")
      .replace("[FINANCE AGENT]", "")
      .replace("[ENGINEERING AGENT]", "")
      .replace("[SLACK]", "")
      .replace(/\[NOTION MCP - .*?\]/, "")
      .replace("[GITHUB MOCK]", "")
      .replace("[GITHUB API]", "")
      .trim();
      
    return { type, text };
  };

  return (
    <>
      <div className="flex items-center justify-between bg-black/60 px-4 py-2 border-b border-white/5 rounded-t-[24px]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          </div>
          <span className="text-xs text-slate-400 ml-2 font-mono">
            nexus-agent-engine.exe
          </span>
        </div>
        
        <div className="flex items-center gap-2">
           {isRunning && (
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: [0, 1, 0] }} 
               transition={{ repeat: Infinity, duration: 1.5 }}
               className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold tracking-wider uppercase"
             >
               <Activity size={12} /> Live stream
             </motion.div>
           )}
        </div>
      </div>
      
      <div className="bg-[#090d18]/80 backdrop-blur-3xl rounded-b-[24px] p-4 h-[500px] overflow-y-auto font-mono text-sm leading-relaxed border-t-0 shadow-inner">
        {!isRunning && logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-white/30 gap-4">
            <AlertCircle size={32} className="opacity-50" />
            <p className="font-sans">System idle. Click "Launch Workflow" to start the simulation.</p>
          </div>
        )}
        
        <AnimatePresence>
          {logs.map((log, i) => {
            const { type, text } = parseLog(log);
            if (!text) return null;
            
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 mb-2"
              >
                <span className="text-white/20 whitespace-nowrap">
                  [{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}]
                </span>
                <span className={`whitespace-nowrap font-bold ${
                  type === 'engineering' ? 'text-pink-400 drop-shadow-[0_0_5px_rgba(244,114,182,0.5)]' :
                  type === 'finance' ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' :
                  type === 'slack' ? 'text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]' :
                  type === 'notion' ? 'text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]' :
                  type === 'github' ? 'text-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]' :
                  'text-slate-400'
                }`}>
                  {type === 'engineering' && 'Engineering : '}
                  {type === 'finance' && 'Finance     : '}
                  {type === 'slack' && 'Slack     : '}
                  {type === 'notion' && 'NotionMCP : '}
                  {type === 'github' && 'GitHub    : '}
                  {type === 'system' && '> '}
                </span>
                <span className="text-white/80">{text}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={terminalEndRef} />
      </div>
    </>
  );
}
