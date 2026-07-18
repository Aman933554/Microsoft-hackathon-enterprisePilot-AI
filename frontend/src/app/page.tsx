"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, CheckCircle, Activity, Box, Zap, AlertCircle, Terminal, Cpu, Settings, Bell, Clock, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentGraph } from "../components/AgentGraph";

export default function Dashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [view, setView] = useState<"graph" | "terminal">("graph");
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes for escalation
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Interactive Inputs
  const [goalInput, setGoalInput] = useState("Build AI Expense Predictor feature");
  const [budgetInput, setBudgetInput] = useState(45000);
  const [showConfig, setShowConfig] = useState(false);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (view === "terminal") {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, view]);

  // Timer for Escalation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPaused) {
      interval = setInterval(() => setTimeRemaining(t => t > 0 ? t - 1 : 0), 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Polling for mobile approval
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    if (isPaused && showApprovalModal && threadId) {
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/status?threadId=${threadId}`);
          const data = await res.json();
          if (data.resolved) {
            setIsPaused(false);
            setShowApprovalModal(false);
            setIsRunning(true);
            setLogs(prev => [...prev, `[SYSTEM] Remote action received via Email: ${data.approved ? "Approved ✅" : "Rejected ❌"}`]);
            
            // Replay the logs that happened on the backend
            if (data.logs && data.logs.length > 0) {
              let index = 0;
              const logInterval = setInterval(() => {
                if (index < data.logs.length) {
                  setLogs(prev => [...prev, data.logs[index]]);
                  index++;
                } else {
                  clearInterval(logInterval);
                  setIsRunning(false);
                  setCompleted(true);
                }
              }, 1500);
            } else {
              setIsRunning(false);
              setCompleted(true);
            }
          }
        } catch (e) {}
      }, 2000);
    }
    return () => clearInterval(pollInterval);
  }, [isPaused, showApprovalModal, threadId]);


  const startWorkflow = async () => {
    setIsRunning(true);
    setLogs([]);
    setCompleted(false);
    setIsPaused(false);
    setShowConfig(false);
    setShowApprovalModal(false);
    
    setLogs(["🚀 Starting AI-Native Enterprise OS Demo..."]);

    try {
      const res = await fetch("/api/run-agent", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goalInput, maxBudget: budgetInput })
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
               setIsPaused(true);
               setShowApprovalModal(true);
               setThreadId(data.threadId);
               setTimeout(() => setLogs(prev => [...prev, "[SYSTEM] ⏰ Reminder #1 → Slack Message Sent to Manager"]), 5000);
               setTimeout(() => setLogs(prev => [...prev, "[SYSTEM] ⏰ Reminder #2 → Email Sent to Manager"]), 10000);
               setTimeout(() => setLogs(prev => [...prev, "[SYSTEM] 🚨 Escalating to Director Agent due to timeout..."]), 15000);
               setTimeout(() => setLogs(prev => [...prev, "[SYSTEM] 📝 Logged escalation event in Notion."]), 18000);
            } else {
               setCompleted(true);
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

  const resumeWorkflow = async (approved: boolean) => {
    setIsPaused(false);
    setShowApprovalModal(false);
    setIsRunning(true);
    setLogs(prev => [...prev, "> Simulating Notion Webhook Trigger..."]);
    
    try {
      const res = await fetch("/api/resume-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, approved })
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
            setCompleted(true);
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

  const parseLog = (log: string) => {
    if (!log) return { type: 'system', text: '' };
    
    let type = 'system';
    if (log.includes("[MARKETING AGENT]")) type = 'marketing';
    if (log.includes("[FINANCE AGENT]")) type = 'finance';
    if (log.includes("[SLACK]")) type = 'slack';
    
    let text = log
      .replace("[MARKETING AGENT] (Mock Mode)", "")
      .replace("[FINANCE AGENT] (Mock Mode)", "")
      .replace("[FINANCE AGENT]", "")
      .replace("[MARKETING AGENT]", "")
      .replace("[SLACK]", "")
      .trim();
      
    return { type, text };
  };

  // Derive budget dynamically from logs
  let currentBudget = 0;
  let status = "Pending";

  for (const log of logs) {
    if (!log) continue;
    // Extract numbers formatted like $50000 or $50,000 or ₹45000
    const moneyMatch = log.match(/[\$₹]?(\d[\d,]+)/);
    if (log.includes("Marketing requested:") && moneyMatch) {
      currentBudget = parseInt(moneyMatch[1].replace(/,/g, ''));
    } else if (log.includes("Budget of") && moneyMatch) {
      currentBudget = parseInt(moneyMatch[1].replace(/,/g, ''));
    }
    
    if (log.includes("within policy") || log.includes("Approved")) status = "Within Policy";
    else if (log.includes("exceeds our policy") || log.includes("Rejected")) status = "Exceeds Policy";
    else if (log.includes("proposing") || log.includes("Revised")) status = "Proposed";
  }

  const budgetColor = status === "Within Policy" ? "var(--accent-emerald)" : status === "Exceeds Policy" ? "var(--accent-danger)" : "var(--accent-cyan)";
  const isBudgetValid = currentBudget > 0;

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1>Campaign Approvals</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              Watch your AI agents negotiate and execute tasks autonomously.
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "1rem" }}>
            <motion.div 
              style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
              whileHover={{ background: 'rgba(255,255,255,0.1)' }}
              onClick={() => { if (isPaused) setShowApprovalModal(!showApprovalModal); }}
            >
              <Bell size={20} color="var(--text-secondary)" />
              {isPaused && (
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', background: 'var(--accent-danger)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-danger)' }}
                />
              )}
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn" 
              onClick={() => setShowConfig(!showConfig)}
              style={{ background: showConfig ? "rgba(255,255,255,0.1)" : "" }}
            >
              <Settings size={18} /> Configuration
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary" 
              onClick={startWorkflow} 
              disabled={isRunning}
              style={{ boxShadow: isRunning ? 'none' : 'var(--shadow-glow)' }}
            >
              {isRunning ? (
                <>Running <div className="loader"></div></>
              ) : (
                <><Play size={18} fill="currentColor" /> Launch Workflow</>
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showConfig && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden", marginTop: "1rem" }}
            >
              <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1rem", border: "1px solid var(--accent-cyan)" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>Campaign Goal</label>
                  <input 
                    type="text" 
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    style={{ 
                      width: "100%", padding: "0.75rem", borderRadius: "8px", 
                      background: "rgba(0,0,0,0.5)", border: "1px solid var(--border-light)", color: "white" 
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                    Finance Policy (Max Budget): ₹{budgetInput.toLocaleString()}
                  </label>
                  <input 
                    type="range" 
                    min="5000" max="200000" step="5000"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(Number(e.target.value))}
                    style={{ width: "100%", cursor: "pointer", accentColor: "var(--accent-purple)" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <motion.div whileHover={{ y: -5 }} className="glass-panel stat-card">
          <Activity className="stat-icon" size={24} />
          <div className="stat-label">Active Agents</div>
          <div className="stat-value text-gradient">2</div>
        </motion.div>
        
        <motion.div whileHover={{ y: -5 }} className="glass-panel stat-card">
          <DollarSignIcon className="stat-icon" size={24} color={isBudgetValid ? budgetColor : "var(--border-light)"} />
          <div className="stat-label">Current Proposal Budget</div>
          <motion.div 
            className="stat-value"
            animate={{ color: isBudgetValid ? budgetColor : "var(--text-muted)" }}
            style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}
          >
            {isBudgetValid ? `₹${currentBudget.toLocaleString()}` : "---"}
            {status === "Exceeds Policy" && <span style={{ fontSize: "0.8rem", color: "var(--accent-danger)" }}>(Exceeds Policy)</span>}
            {status === "Within Policy" && <span style={{ fontSize: "0.8rem", color: "var(--accent-emerald)" }}>(Within Policy)</span>}
          </motion.div>
          
          <div className="progress-container">
             <div 
               className="progress-bar" 
               style={{ 
                 width: isBudgetValid ? '100%' : '0%', 
                 background: budgetColor 
               }} 
             />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-panel stat-card">
          <Box className="stat-icon" size={24} />
          <div className="stat-label">Finance Policy Limit</div>
          <div className="stat-value" style={{ color: "var(--accent-purple)" }}>₹{budgetInput.toLocaleString()}</div>
        </motion.div>
      </div>

      <div className="view-toggle" style={{ width: "250px" }}>
        <button className={view === "graph" ? "active" : ""} onClick={() => setView("graph")}>
          <Cpu size={14} style={{ display: "inline", marginRight: "4px" }} /> Visual Graph
        </button>
        <button className={view === "terminal" ? "active" : ""} onClick={() => setView("terminal")}>
          <Terminal size={14} style={{ display: "inline", marginRight: "4px" }} /> Terminal Log
        </button>
      </div>

      <motion.div 
        className="glass-panel"
        style={{ padding: view === 'terminal' ? 0 : '1rem', display: 'flex', flexDirection: 'column' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {view === "graph" ? (
          <AgentGraph logs={logs} isRunning={isRunning} />
        ) : (
          <>
            <div className="terminal-header">
              <div className="terminal-dots">
                <div className="dot red"></div>
                <div className="dot yellow"></div>
                <div className="dot green"></div>
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "0.5rem", fontFamily: "monospace" }}>
                agent-orchestrator.exe
              </span>
              
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                 {isRunning && (
                   <motion.div 
                     initial={{ opacity: 0 }} 
                     animate={{ opacity: [0, 1, 0] }} 
                     transition={{ repeat: Infinity, duration: 1.5 }}
                     style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.75rem' }}
                   >
                     <Activity size={12} /> Live stream
                   </motion.div>
                 )}
              </div>
            </div>
            
            <div className="terminal-container">
              <div className="terminal-body">
                {!isRunning && logs.length === 0 && (
                  <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", gap: "1rem" }}>
                    <AlertCircle size={32} opacity={0.5} />
                    <p>System idle. Click "Launch Workflow" to start the simulation.</p>
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
                        className="log-line"
                      >
                        <span className="log-time">
                          [{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}]
                        </span>
                        <span className={`log-agent ${type}`}>
                          {type === 'marketing' && 'Marketing : '}
                          {type === 'finance' && 'Finance   : '}
                          {type === 'slack' && 'Slack     : '}
                          {type === 'system' && '> '}
                        </span>
                        <span className="log-content">{text}</span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={terminalEndRef} />
              </div>
            </div>
          </>
        )}
      </motion.div>
      
      <AnimatePresence>
        {isPaused && showApprovalModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 999 }}
              onClick={() => setShowApprovalModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                background: "rgba(10, 10, 10, 0.95)",
                border: "1px solid rgba(234, 179, 8, 0.4)",
                padding: "2rem",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1)",
                zIndex: 1000,
                width: "550px",
                maxWidth: "90vw"
              }}
            >
              <motion.button 
                whileHover={{ scale: 1.1, color: "white" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowApprovalModal(false)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={20} />
              </motion.button>
              <div style={{ textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1.5rem" }}>
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }} 
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  style={{ display: "inline-block", marginBottom: "1rem" }}
                >
                  <AlertCircle size={48} color="#eab308" style={{ filter: "drop-shadow(0 0 12px rgba(234, 179, 8, 0.4))" }} />
                </motion.div>
                <h3 style={{ margin: 0, color: "#eab308", fontSize: "1.5rem", letterSpacing: "-0.5px" }}>Waiting for Human Approval</h3>
                <p style={{ margin: 0, color: "var(--text-secondary)", marginTop: "0.5rem" }}>Workflow is paused pending managerial sign-off.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", background: "rgba(255,255,255,0.03)" }}>
                  <h5 style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>Request Details</h5>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Feature</span>
                    <span style={{ color: "white", fontSize: "0.9rem" }}>AI Expense Predictor</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Requested By</span>
                    <span style={{ color: "white", fontSize: "0.9rem" }}>Engineering Agent</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Budget</span>
                    <span style={{ color: "var(--accent-purple)", fontSize: "0.9rem", fontWeight: 600 }}>₹{currentBudget.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Risk Level</span>
                    <span style={{ color: "var(--accent-danger)", fontSize: "0.9rem" }}>Medium</span>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", background: "rgba(255,255,255,0.03)" }}>
                  <h5 style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>Status Checks</h5>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                    <CheckCircle size={14} color="var(--accent-emerald)" /> Finance Approved
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    <CheckCircle size={14} color="var(--accent-emerald)" /> QA Approved
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    <CheckCircle size={14} color="var(--accent-emerald)" /> Engineering Ready
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: "1rem", background: "rgba(0,0,0,0.3)" }}>
                 <h5 style={{ margin: "0 0 1rem 0", color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>Notification Escalation</h5>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                     <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "white" }}>
                       📧 Email Sent <CheckCircle size={14} color="var(--accent-emerald)" />
                     </span>
                     <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "white" }}>
                       💬 Slack Delivered <CheckCircle size={14} color="var(--accent-emerald)" />
                     </span>
                     <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "white" }}>
                       🔔 Browser Push <CheckCircle size={14} color="var(--accent-emerald)" />
                     </span>
                     <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "white" }}>
                       📱 SMS Delivered <CheckCircle size={14} color="var(--accent-emerald)" />
                     </span>
                   </div>
                   <div style={{ textAlign: "center", padding: "1rem", borderLeft: "1px solid rgba(255,255,255,0.1)", minWidth: "160px" }}>
                     <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                       <Clock size={14} /> Time Remaining
                     </div>
                     <div style={{ fontFamily: "monospace", fontSize: "1.75rem", color: "white", textShadow: "0 0 10px rgba(255,255,255,0.3)" }}>
                       {formatTime(timeRemaining)}
                     </div>
                     <div style={{ fontSize: "0.7rem", color: "var(--accent-danger)", marginTop: "0.25rem" }}>Escalates to VP next</div>
                   </div>
                 </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button 
                  className="btn" 
                  style={{ gridColumn: "span 2", display: "flex", justifyContent: "center", gap: "0.5rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", height: "40px", marginBottom: "0.25rem" }}
                  onClick={() => window.open("https://notion.so", "_blank")}
                >
                  <ExternalLink size={16} /> Open Source of Truth in Notion
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ background: "var(--accent-emerald)", color: "black", border: "none", height: "48px", fontWeight: 600, fontSize: "1rem" }}
                  onClick={() => resumeWorkflow(true)}
                >
                  Approve
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ background: "var(--accent-danger)", color: "white", border: "none", height: "48px", fontWeight: 600, fontSize: "1rem" }}
                  onClick={() => resumeWorkflow(false)}
                >
                  Reject
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              background: "rgba(16, 185, 129, 0.15)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              padding: "1.5rem",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              zIndex: 100
            }}
          >
            <CheckCircle size={32} color="var(--accent-emerald)" />
            <div>
              <h4 style={{ margin: 0, color: "var(--accent-emerald)" }}>Workflow Completed</h4>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-primary)", marginTop: "0.25rem" }}>
                Notion and Slack have been successfully updated.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DollarSignIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
