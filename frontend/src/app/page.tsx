"use client";

import React, { useState, useEffect } from "react";
import { Play, Activity, Box, Settings, Bell, Terminal, Cpu, FolderKanban, Clock, CheckSquare, DollarSign, CheckCircle, Plus, FileText, ImageIcon, UploadCloud, ShieldAlert, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentGraph } from "../components/AgentGraph";
import { TerminalLog } from "../components/TerminalLog";
import { ApprovalModal } from "../components/ApprovalModal";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";

function SignedIn({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  if (isSignedIn) return <>{children}</>;
  return null;
}

function SignedOut({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded || isSignedIn) return null;
  return <>{children}</>;
}

type AppStep = "dashboard" | "form" | "loading" | "workflow";

export default function Dashboard() {
  const [appStep, setAppStep] = useState<AppStep>("dashboard");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [threadId, setThreadId] = useState<string>("");
  const [aiReasoningText, setAiReasoningText] = useState<string>("");
  const [view, setView] = useState<"graph" | "terminal">("graph");
  const [timeRemaining, setTimeRemaining] = useState(1800);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [recentExecutions, setRecentExecutions] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [sysHealth, setSysHealth] = useState({
    latency: 42,
    errorRate: 0.01,
    activeAgents: 12,
    queueSize: 0,
    riskScore: 60
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSysHealth(prev => {
        // Very fast and dramatic fluctuation for demo purposes
        let newRisk = prev.riskScore + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 30 + 15);
        if (newRisk < 15) newRisk = Math.floor(Math.random() * 20) + 70; // jump high
        if (newRisk > 95) newRisk = Math.floor(Math.random() * 20) + 15; // jump low
        newRisk = Math.max(10, Math.min(95, newRisk));
        
        return {
          latency: Math.max(15, Math.min(200, prev.latency + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20 + 5))),
          errorRate: isRunning ? Math.max(0.01, Math.min(0.08, +(prev.errorRate + (Math.random() > 0.5 ? 0.02 : -0.02)).toFixed(2))) : 0.01,
          activeAgents: isRunning ? 15 : Math.max(8, Math.min(14, prev.activeAgents + (Math.random() > 0.5 ? 1 : -1))),
          queueSize: isRunning ? Math.floor(Math.random() * 5) + 1 : 0,
          riskScore: newRisk
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (completed) {
      setShowSuccessPopup(true);
      const timer = setTimeout(() => setShowSuccessPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [completed]);

  useEffect(() => {
    const loadExecutions = async () => {
      try {
        const [resWorkflows, resApprovals] = await Promise.all([
          fetch("/api/workflows"),
          fetch("/api/approvals")
        ]);
        
        const dataW = await resWorkflows.json();
        const dataA = await resApprovals.json();
        
        if (dataW.success && dataW.workflows) {
          setRecentExecutions(dataW.workflows);
        }
        if (dataA.success && dataA.pendingApprovals) {
          setPendingApprovals(dataA.pendingApprovals);
        }
      } catch (e) {}
    };
    loadExecutions();
    const interval = setInterval(loadExecutions, 5000);
    return () => clearInterval(interval);
  }, []);

  // Form states
  const [featureTitle, setFeatureTitle] = useState("AI Expense Tracker");
  const [description, setDescription] = useState("Build an AI-powered expense tracker that automatically categorizes expenses, detects fraud and generates reports.");
  const [priority, setPriority] = useState("High");
  const [department, setDepartment] = useState("Engineering");
  const [deadline, setDeadline] = useState("15 Days");
  const [expectedUsers, setExpectedUsers] = useState("5000");
  const [attachments, setAttachments] = useState<{name: string}[]>([]);
  const [budget, setBudget] = useState<number | "">(45000);
  const [template, setTemplate] = useState("Custom");

  const applyTemplate = (val: string) => {
    setTemplate(val);
    if (val === "Website Development") {
      setFeatureTitle("E-commerce Website");
      setDescription("Humaari company ke liye ek nayi E-commerce website banao jisme payment gateway ho.");
      setBudget(50000);
    } else if (val === "Cloud Migration") {
      setFeatureTitle("AWS Cloud Migration");
      setDescription("Humara purana data local server se AWS (Cloud) par shift karo.");
      setBudget(200000);
    } else if (val === "Mobile App") {
      setFeatureTitle("Expense Tracker App");
      setDescription("Ek expense tracker mobile app banani hai jo 5,000 users support kare.");
      setBudget(120000);
    } else if (val === "Bug Fixing") {
      setFeatureTitle("System Bug Fixing");
      setDescription("System mein bahut errors aa rahe hain, unhe identify karke fix karo.");
      setBudget(15000);
    }
  };
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPaused) {
      interval = setInterval(() => setTimeRemaining(t => t > 0 ? t - 1 : 0), 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

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

  const handleSubmit = () => {
    setAppStep("loading");
    setTimeout(() => {
      startWorkflow();
    }, 2500);
  };

  const startWorkflow = async () => {
    setAppStep("workflow");
    setIsRunning(true);
    setLogs([]);
    setCompleted(false);
    setIsPaused(false);
    setShowApprovalModal(false);
    
    setLogs(["🚀 Starting AI-Native Enterprise OS Demo..."]);

    const combinedGoal = `Product: ${template !== "Custom" ? template : "General"}\nFeature: ${featureTitle}\nDescription: ${description}\nPriority: ${priority}\nDepartment: ${department}\nDeadline: ${deadline}\nExpected Users: ${expectedUsers}`;

    try {
      const res = await fetch("/api/run-agent", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: combinedGoal, maxBudget: budget })
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.budgetEvaluation?.aiReasoning) {
          setAiReasoningText(data.budgetEvaluation.aiReasoning);
        }
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
               window.dispatchEvent(new CustomEvent("new-notification", { 
                 detail: { 
                   title: "Approval Required", 
                   message: `Managerial sign-off needed for ${featureTitle} budget proposal.` 
                 } 
               }));
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

  let currentBudget = 0;
  let status = "Pending";
  let productTier = "";

  for (const log of logs) {
    if (!log) continue;
    const moneyMatch = log.match(/[\$₹]?(\d[\d,]+)/);
    if ((log.includes("Proposed architecture") || log.includes("Revised budget down to")) && moneyMatch) {
      currentBudget = parseInt(moneyMatch[1].replace(/,/g, ''));
    } else if (log.includes("Budget of") && moneyMatch) {
      currentBudget = parseInt(moneyMatch[1].replace(/,/g, ''));
    }
    
    const tierMatch = log.match(/deliver a (Good|Best|Premium|Standard) tier product/i);
    if (tierMatch) {
      productTier = tierMatch[1];
    }

    if (log.includes("within policy") || log.includes("Approved")) status = "Within Policy";
    else if (log.includes("exceeds our policy") || log.includes("Rejected")) status = "Exceeds Policy";
    else if (log.includes("proposing") || log.includes("Revised") || log.includes("Proposed")) status = "Proposed";
  }

  const budgetColor = status === "Within Policy" ? "text-emerald-400" : status === "Exceeds Policy" ? "text-red-400" : "text-cyan-400";
  const bgBudgetColor = status === "Within Policy" ? "bg-emerald-400" : status === "Exceeds Policy" ? "bg-red-400" : "bg-cyan-400";
  const isBudgetValid = currentBudget > 0;

  return (
    <div className="animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-10">
      
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">EnterprisePilot AI</h1>
          <p className="text-slate-400 max-w-md text-center mb-4">
            Authentication is required to access the AI Enterprise Operating System. Please sign in to continue.
          </p>
          <SignInButton mode="modal">
            <button className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              Sign In to EnterpriseOS
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
      <header className="mb-10 flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-white/90 drop-shadow-sm">EnterprisePilot AI</h1>
            <p className="text-slate-400 text-lg">
              AI Employees Running a Company, Humans Making Strategic Decisions.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <AnimatePresence>
              {isPaused && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative flex items-center gap-2 cursor-pointer px-4 py-2 bg-yellow-500/20 text-yellow-500 rounded-xl hover:bg-yellow-500/30 transition-colors border border-yellow-500/30 font-bold"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowApprovalModal(!showApprovalModal)}
                >
                  <motion.div 
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                  />
                  1 Action Required
                </motion.button>
              )}
            </AnimatePresence>

            {/* Clerk User Profile / Logout Button */}
            <div className="bg-white/5 border border-white/10 p-2 rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-white/10 transition-colors">
               <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10" } }} />
            </div>
          </div>
        </div>
      </header>


      {/* DASHBOARD STEP */}
      {appStep === "dashboard" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-8">
          <div className="flex flex-row items-stretch justify-between gap-4">
            <div className="grid grid-cols-6 gap-4 flex-1">
              <div className="glass-panel p-4 flex flex-col gap-2 hover:-translate-y-1 transition-transform cursor-pointer text-center items-center justify-center">
                <FolderKanban className="text-blue-400 mb-1" size={24} />
                <div className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap">Projects</div>
                <div className="text-2xl font-bold text-white">{recentExecutions.length > 0 ? recentExecutions.length + (appStep !== "dashboard" ? 1 : 0) : (15 + (appStep !== "dashboard" ? 1 : 0))}</div>
              </div>
              
              <div className="glass-panel p-4 flex flex-col gap-2 hover:-translate-y-1 transition-transform cursor-pointer text-center items-center justify-center">
                <Activity className="text-primary mb-1" size={24} />
                <div className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap">Running Agents</div>
                <div className="text-2xl font-bold text-gradient">{sysHealth.activeAgents}</div>
              </div>

              <div className="glass-panel p-4 flex flex-col gap-2 hover:-translate-y-1 transition-transform cursor-pointer text-center items-center justify-center">
                <CheckSquare className="text-yellow-400 mb-1" size={24} />
                <div className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap">Pending</div>
                <div className="text-2xl font-bold text-white">{pendingApprovals.length + (isPaused ? 1 : 0)}</div>
              </div>

              <div className="glass-panel p-4 flex flex-col gap-2 hover:-translate-y-1 transition-transform cursor-pointer text-center items-center justify-center">
                <DollarSign className="text-pink-400 mb-1" size={24} />
                <div className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap">Budget Used</div>
                <div className="text-2xl font-bold text-white">
                   ₹{recentExecutions.filter(w => w.status === 'COMPLETED' || w.status === 'APPROVED').reduce((sum, w) => sum + (w.maxBudget || 0), 0).toLocaleString()}
                </div>
              </div>

              <div className="glass-panel p-4 flex flex-col gap-2 hover:-translate-y-1 transition-transform cursor-pointer text-center items-center justify-center">
                <CheckCircle className="text-emerald-400 mb-1" size={24} />
                <div className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap">Completed</div>
                <div className="text-2xl font-bold text-white">{recentExecutions.filter(w => w.status === 'COMPLETED' || w.status === 'APPROVED').length + (completed ? 1 : 0)}</div>
              </div>

              <div className="glass-panel p-4 flex flex-col gap-2 hover:-translate-y-1 transition-transform cursor-pointer text-center items-center justify-center">
                <Clock className="text-purple-400 mb-1" size={24} />
                <div className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap">Avg Time</div>
                <div className="text-2xl font-bold text-white">
                  {recentExecutions.length > 0 ? 
                    `${Math.max(1, Math.round(recentExecutions.reduce((s, w) => s + w.durationMs, 0) / recentExecutions.length / 60000))}m` 
                    : "3m"}
                </div>
              </div>
            </div>

            <div className="flex items-stretch min-w-[200px]">
              <button 
                className="bg-primary text-black hover:bg-primary/90 px-6 w-full rounded-xl font-bold text-lg flex flex-col items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
                onClick={() => setAppStep("form")}
              >
                <Plus size={28} />
                <span className="text-center leading-tight">New<br/>Feature Request</span>
              </button>
            </div>
          </div>

          <div className="w-full">
            <h2 className="text-xl font-bold text-white/80 mb-4 px-2">Agent Workflow Map</h2>
            <div className="glass-panel p-2 h-[400px] border-white/10 rounded-2xl w-full">
              <AgentGraph logs={[]} isRunning={false} isFullScreen={true} isLiveMode={false} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {/* Recent Executions */}
            <div className="glass-panel p-6 border-white/10 rounded-2xl flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={16} /> Recent Executions</h3>
              <div className="flex flex-col gap-3">
                {recentExecutions.length > 0 ? recentExecutions.slice(0, 4).map((exec, i) => {
                  const isSuccess = exec.status === "COMPLETED" || exec.status === "APPROVED";
                  const isFailed = exec.status === "REJECTED" || exec.status === "FAILED";
                  const statusColor = isSuccess ? "bg-emerald-500/20 text-emerald-400" : isFailed ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400";
                  
                  let title = exec.title !== "Untitled Workflow" ? exec.title : "Agent Task";
                  if (exec.goal && exec.goal.includes("Feature:")) {
                    title = exec.goal.split("\n")[0].replace("Feature: ", "");
                  }

                  const timeAgo = Math.round((new Date().getTime() - new Date(exec.createdAt).getTime()) / 60000);
                  const timeStr = timeAgo < 1 ? "Just now" : `${timeAgo}m ago`;
                  
                  return (
                  <div key={exec.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-sm truncate max-w-[200px]">{title}</span>
                      <span className="text-slate-400 text-xs">{timeStr} • Duration: {Math.max(12, Math.round(exec.durationMs/1000))}s</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${statusColor}`}>{exec.status.replace("_", " ")}</span>
                      <span className="text-slate-400 text-xs mt-1">ROI: {exec.roi > 0 ? exec.roi + 'x' : (exec.roi === 0 ? '2.4x' : 'N/A')}</span>
                    </div>
                  </div>
                  );
                }) : (
                   <div className="text-slate-500 text-sm p-4 text-center">No recent executions found.</div>
                )}
              </div>
            </div>

            {/* Human Approval Queue */}
            <div className="glass-panel p-6 border-white/10 rounded-2xl flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><CheckSquare size={16} /> Human Approval Queue</h3>
              <div className="flex flex-col gap-3">
                {pendingApprovals.length > 0 ? pendingApprovals.slice(0, 3).map((item, i) => {
                  let title = item.title !== "Untitled Workflow" ? item.title : "Agent Task";
                  if (item.goal && item.goal.includes("Feature:")) {
                    title = item.goal.split("\n")[0].replace("Feature: ", "");
                  }
                  
                  return (
                  <div key={item.id} className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/5 hover:border-yellow-500/30 transition-colors cursor-pointer group" onClick={() => window.location.href = '/approvals'}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium text-sm truncate max-w-[180px]">{title}</span>
                      <span className="text-yellow-400 text-xs font-bold bg-yellow-500/10 px-2 py-1 rounded-md animate-pulse">Pending</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>Waiting on: <span className="text-white">Manager</span></span>
                      <span>Budget: <span className="text-pink-400">₹{item.maxBudget ? item.maxBudget.toLocaleString() : '45,000'}</span></span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                      <span>Risk: <span className={item.riskScore > 50 ? "text-red-400" : "text-emerald-400"}>{item.riskScore > 50 ? 'High' : 'Medium'}</span></span>
                      <button className="text-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100 font-bold">Review →</button>
                    </div>
                  </div>
                  );
                }) : (
                  <div className="text-slate-500 text-sm p-4 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                     All caught up! No pending approvals.
                  </div>
                )}
              </div>
            </div>

            {/* System Health & Risk Summary */}
            <div className="flex flex-col gap-6">
              <div className="glass-panel p-6 border-white/10 rounded-2xl flex flex-col gap-4 flex-1">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Activity size={16} /> System Health</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-xs mb-1">API Latency</span>
                    <span className="text-white font-bold text-xl flex items-center gap-2">{sysHealth.latency}ms <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-xs mb-1">Error Rate</span>
                    <span className={sysHealth.errorRate > 0.04 ? "text-yellow-400 font-bold text-xl transition-colors" : "text-emerald-400 font-bold text-xl transition-colors"}>{sysHealth.errorRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-xs mb-1">Active Agents</span>
                    <span className="text-white font-bold text-xl">{sysHealth.activeAgents} / 15</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-xs mb-1">Queue Size</span>
                    <span className="text-white font-bold text-xl">{sysHealth.queueSize} Tasks</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 border-white/10 rounded-2xl flex flex-col gap-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={16} /> Risk Summary</h3>
                <div className="flex justify-between items-end mt-2">
                  <div className="flex flex-col">
                    <span className={`text-3xl font-bold flex items-center gap-2 transition-colors ${sysHealth.riskScore < 40 ? 'text-emerald-400' : sysHealth.riskScore < 75 ? 'text-yellow-400' : 'text-red-500'}`}>
                      <AlertTriangle size={24} /> {sysHealth.riskScore < 40 ? 'Low' : sysHealth.riskScore < 75 ? 'Medium' : 'High'}
                    </span>
                    <span className="text-slate-400 text-xs mt-1">Average Enterprise Risk</span>
                  </div>
                  <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${sysHealth.riskScore < 40 ? 'bg-emerald-400' : sysHealth.riskScore < 75 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: `${sysHealth.riskScore}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* FORM STEP */}
      {appStep === "form" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 max-w-3xl mx-auto border border-primary/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative">
          <button 
            onClick={() => setAppStep("dashboard")}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            ✕ Cancel
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">📝 New Feature Request</h2>
          
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Quick Template</label>
                <select value={template} onChange={(e) => applyTemplate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary/50 appearance-none">
                  <option value="Custom">Custom / Manual</option>
                  <option value="Website Development">Website Development</option>
                  <option value="Cloud Migration">Cloud Migration</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Bug Fixing">Bug Fixing</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Proposed Budget (₹)</label>
                <input type="number" value={budget} onChange={(e) => setBudget(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary/50" />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Feature Title</label>
              <input type="text" value={featureTitle} onChange={(e) => setFeatureTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary/50" />
            </div>

            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary/50 resize-none"></textarea>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary/50 appearance-none">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Department</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary/50 appearance-none">
                  <option>Engineering</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Deadline</label>
                <input type="text" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Expected Users</label>
                <input type="text" value={expectedUsers} onChange={(e) => setExpectedUsers(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary/50" />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Attachments</label>
              <div className="flex flex-wrap gap-4">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 group relative">
                    {file.name.endsWith('.pdf') ? (
                      <FileText size={18} className="text-red-400" />
                    ) : (
                      <ImageIcon size={18} className="text-blue-400" />
                    )}
                    <span className="text-sm text-white/80">{file.name}</span>
                    <button 
                      className="absolute -top-2 -right-2 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                ))}
                
                <label className="flex items-center justify-center gap-2 border border-dashed border-white/20 rounded-xl px-4 py-3 cursor-pointer hover:border-white/40 bg-white/5 transition-colors">
                  <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    onChange={(e) => {
                      if (e.target.files) {
                        const newFiles = Array.from(e.target.files).map(f => ({ name: f.name }));
                        setAttachments(prev => [...prev, ...newFiles]);
                      }
                    }} 
                  />
                  <UploadCloud size={18} className="text-slate-400" /> <span className="text-sm text-slate-400">Upload</span>
                </label>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleSubmit}
                className="bg-primary text-black hover:bg-primary/90 px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
              >
                Submit Request <Play size={18} fill="currentColor" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* LOADING STEP */}
      {appStep === "loading" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32">
          <Cpu className="text-primary animate-pulse mb-6" size={64} />
          <h2 className="text-3xl font-bold text-white mb-4">Engineering Agent Thinking...</h2>
          <div className="font-mono text-primary text-xl tracking-[0.3em] font-bold">
            <motion.span
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 2, ease: "linear" }}
              className="inline-block"
            >
              ████████░░░░
            </motion.span>
          </div>
          <p className="text-slate-400 mt-6 max-w-md text-center">
            AI Engineering Manager is analyzing {featureTitle} to propose architecture and budget...
          </p>
        </motion.div>
      )}

      {/* WORKFLOW STEP */}
      {appStep === "workflow" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Live Execution</h2>
            <button 
              className="text-sm text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
              onClick={() => setAppStep("dashboard")}
            >
              ← Back to Dashboard
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                 <div className={`p-2 rounded-lg bg-black/30 border ${isBudgetValid ? (status === 'Within Policy' ? 'border-emerald-500/30' : 'border-red-500/30') : 'border-white/5'}`}>
                    <DollarSignIcon className={isBudgetValid ? budgetColor : "text-white/20"} size={20} />
                 </div>
                 <div className="text-slate-400 text-sm uppercase tracking-widest font-semibold">Proposal Budget</div>
              </div>
              
              <motion.div className="flex items-baseline gap-2 mt-1">
                <span className={`text-3xl font-bold ${isBudgetValid ? budgetColor : "text-white/20"}`}>
                  {isBudgetValid ? `₹${currentBudget.toLocaleString()}` : "---"}
                </span>
                {status === "Exceeds Policy" && <span className="text-xs text-red-400 font-medium tracking-wide">(Exceeds Policy)</span>}
                {status === "Within Policy" && <span className="text-xs text-emerald-400 font-medium tracking-wide">(Within Policy{productTier ? ` - ${productTier} Tier` : ''})</span>}
              </motion.div>
              
              <div className="w-full h-1.5 bg-black/40 rounded-full mt-4 overflow-hidden">
                 <div 
                   className={`h-full transition-all duration-1000 ${bgBudgetColor}`}
                   style={{ width: isBudgetValid ? '100%' : '0%' }} 
                 />
              </div>
            </motion.div>

            <motion.div className="glass-panel p-6 flex flex-col gap-2">
              <Box className="text-pink-500 mb-2" size={28} />
              <div className="text-slate-400 text-sm uppercase tracking-widest font-semibold">Policy Limit</div>
              <div className="text-3xl font-bold text-pink-400">₹{budget.toLocaleString()}</div>
            </motion.div>
          </div>

          {aiReasoningText && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 mb-6 border-cyan-500/30 bg-cyan-900/10"
            >
              <div className="flex items-center gap-2 mb-2 text-cyan-400">
                <Activity size={18} />
                <h3 className="font-semibold text-sm uppercase tracking-widest">AI Budget Recommendation</h3>
              </div>
              <p className="text-white/90 leading-relaxed font-medium">
                {aiReasoningText}
              </p>
            </motion.div>
          )}

          <div className="flex bg-black/40 p-1 rounded-xl w-fit mb-6 border border-white/5">
            <button 
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${view === "graph" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white/80 hover:bg-white/5"}`} 
              onClick={() => setView("graph")}
            >
              <Cpu size={16} /> Visual Graph
            </button>
            <button 
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${view === "terminal" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white/80 hover:bg-white/5"}`} 
              onClick={() => setView("terminal")}
            >
              <Terminal size={16} /> Terminal Log
            </button>
          </div>

          <motion.div 
            className={`glass-panel border-white/10 ${view === 'terminal' ? 'p-0 border-none bg-transparent shadow-none backdrop-blur-none' : 'p-4 h-[600px] w-full'}`}
          >
            {view === "graph" ? (
              <AgentGraph logs={logs} isRunning={isRunning} isFullScreen={false} isLiveMode={isRunning} />
            ) : (
              <TerminalLog logs={logs} isRunning={isRunning} />
            )}
          </motion.div>
        </motion.div>
      )}

      <ApprovalModal 
        show={isPaused && showApprovalModal} 
        onClose={() => setShowApprovalModal(false)}
        onApprove={() => resumeWorkflow(true)}
        onReject={() => resumeWorkflow(false)}
        currentBudget={currentBudget > 0 ? currentBudget : budget}
        timeRemaining={timeRemaining}
        featureTitle={featureTitle}
        productTier={productTier}
      />

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="bg-brand-emerald/10 border border-brand-emerald/30 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.2)] flex items-center gap-4 backdrop-blur-xl">
              <div className="p-2 bg-brand-emerald/20 rounded-full">
                <CheckCircle className="text-brand-emerald" size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm tracking-wide">Workflow Completed</h4>
                <p className="text-brand-emerald/80 text-xs mt-0.5 font-medium">All tasks executed successfully</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </SignedIn>
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
