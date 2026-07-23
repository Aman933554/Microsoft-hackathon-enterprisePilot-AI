"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, DollarSign, Target, MessageSquare, FileText, 
  ChevronDown, ChevronUp, Activity, CheckCircle, 
  RefreshCw, Radio, Cpu, Shield, Users, Mail, GitBranch, BarChart, Settings, ClipboardList
} from "lucide-react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  getSmoothStepPath,
  type EdgeProps,
  type ReactFlowInstance,
  type Node,
  type Edge
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";

// Custom Animated Edge Component
const AnimatedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: 16 });
  
  const status = data?.status || 'idle';
  const label = (data?.label as string) || '';
  const isLive = data?.isLive || false;

  let color = 'rgba(255,255,255,0.3)'; // idle
  if (status === 'running') color = '#00f0ff'; // brand-cyan
  else if (status === 'completed') color = '#10b981'; // brand-emerald
  else if (status === 'waiting' || status === 'human_approval') color = '#eab308'; // yellow-500
  else if (status === 'failed') color = '#ef4444'; // red-500

  // In live mode, completed edges also show continuous ambient data flow
  const showPacket = status === 'running' || (isLive && status === 'completed');
  const packetColor = status === 'running' ? color : 'rgba(16, 185, 129, 0.4)';
  const dur = status === 'running' ? "1.5s" : "3s";

  return (
    <>
      <defs>
        <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <style>
          {`
            .dash-anim {
              stroke-dasharray: 6 6;
              animation: dashMove 1s linear infinite;
            }
            @keyframes dashMove {
              from { stroke-dashoffset: 12; }
              to { stroke-dashoffset: 0; }
            }
          `}
        </style>
      </defs>
      
      {/* Background shadow path for depth */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(0,0,0,0.5)"
        strokeWidth={6}
        className="translate-y-1"
      />
      
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={status === 'running' ? 4 : 2.5}
        className={cn(
          "transition-all duration-500",
          status === 'running' ? 'dash-anim' : ''
        )}
        markerEnd={markerEnd}
        filter={status !== 'idle' ? `url(#glow-${id})` : undefined}
      />
      
      {showPacket && (
        <g>
          {/* Outer glow aura */}
          <circle r="14" fill={packetColor} opacity="0.6" filter={`url(#glow-${id})`} />
          {/* Core particle */}
          <circle r="6" fill="#09222b" filter={`url(#glow-${id})`} />
          
          {status === 'running' && label && (
            <text 
              x="20" 
              y="-20" 
              fill="#09222b" 
              fontSize="14" 
              fontWeight="bold" 
              className="drop-shadow-md"
              filter={`url(#glow-${id})`}
            >
              {label}
            </text>
          )}
          
          <animateMotion dur={dur} repeatCount="indefinite" calcMode="linear" keyPoints="0;1" keyTimes="0;1">
            <mpath href={`#${id}`} />
          </animateMotion>
        </g>
      )}
    </>
  );
};

// Custom Node Component
const AgentNode = ({ data, isConnectable }: any) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = data.icon;
  
  const statusConfig = {
    running: {
      color: "border-brand-cyan shadow-[0_0_15px_rgba(6,182,212,0.15)]",
      text: "text-brand-cyan",
      bg: "bg-brand-cyan/10",
      label: "Processing"
    },
    thinking: {
      color: "border-brand-purple shadow-[0_0_15px_rgba(139,92,246,0.15)]",
      text: "text-brand-purple",
      bg: "bg-brand-purple/10",
      label: "Thinking"
    },
    completed: {
      color: "border-brand-emerald shadow-[0_0_15px_rgba(16,185,129,0.15)]",
      text: "text-brand-emerald",
      bg: "bg-brand-emerald/10",
      label: "Completed"
    },
    waiting: {
      color: "border-yellow-500 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse",
      text: "text-yellow-500",
      bg: "bg-yellow-500/10",
      label: "Approval Required"
    },
    processing: {
      color: "border-brand-cyan shadow-[0_0_15px_rgba(6,182,212,0.15)]",
      text: "text-brand-cyan",
      bg: "bg-brand-cyan/10",
      label: "Processing"
    },
    idle: {
      color: "border-white/5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]",
      text: "text-slate-400",
      bg: "bg-white/5",
      label: "Idle"
    }
  };

  const currentStatus = (data.status as keyof typeof statusConfig) || "idle";
  const conf = statusConfig[currentStatus] || statusConfig["idle"];

  return (
    <div className={cn(
      "luxury-card p-[24px] transition-all duration-300 w-[360px] min-h-[140px] relative z-10 group gradient-border hover:-translate-y-1",
      conf.color,
      currentStatus !== 'idle' ? "shadow-[0_0_30px_rgba(6,182,212,0.15)]" : ""
    )}>
      <Handle type="target" position={Position.Top} id="top" isConnectable={isConnectable} className="w-2.5 h-2.5 bg-white/20 border-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} id="bottom" isConnectable={isConnectable} className="w-2.5 h-2.5 bg-white/20 border-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="target" position={Position.Left} id="left" isConnectable={isConnectable} className="w-2.5 h-2.5 bg-white/20 border-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Right} id="right" isConnectable={isConnectable} className="w-2.5 h-2.5 bg-white/20 border-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className={cn("p-3 rounded-xl border transition-colors relative z-10 bg-[#131b2f] flex items-center justify-center", conf.color.split(' ')[0])}>
              {data.avatar ? (
                <img src={data.avatar} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <Icon size={28} className={conf.text} />
              )}
            </div>
            {/* Glow effect behind icon */}
            <div className={cn("absolute inset-0 rounded-xl opacity-40 blur-md scale-110", conf.bg)} />
          </div>
          <div>
            <div className="text-lg font-bold text-white tracking-wide leading-tight mt-0.5">{data.label}</div>
            <div className={cn("text-[10px] uppercase tracking-widest font-bold mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border shadow-sm", conf.bg, conf.text, conf.color.split(' ')[0])}>
              <div className={cn("w-1 h-1 rounded-full", currentStatus !== 'idle' ? "animate-ping" : "")} style={{ backgroundColor: "currentColor" }}></div>
              {conf.label}
            </div>
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-white transition-colors pt-1">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-y-4 gap-x-2 text-sm border-t border-white/5 pt-4">
         <div className="flex flex-col gap-1 col-span-3">
           <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Current Task</span>
           <span className="text-white font-medium text-[12px] truncate" title={data.task || "Awaiting Assignment"}>{data.task || "Awaiting Assignment"}</span>
         </div>
         
         <div className="flex flex-col gap-1">
           <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Confidence</span>
           <span className="text-brand-emerald font-mono font-medium text-[12px]">{data.confidence ? `${data.confidence}%` : "---"}</span>
         </div>
         <div className="flex flex-col gap-1">
           <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Latency</span>
           <span className="text-brand-cyan font-mono font-medium text-[12px]">{data.duration || "0ms"}</span>
         </div>
         <div className="flex flex-col gap-1">
           <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Tokens</span>
           <span className="text-brand-purple font-mono font-medium text-[12px]">{data.tokens || "0"}</span>
         </div>

         <div className="flex flex-col gap-1">
           <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Memory</span>
           <span className="text-white font-mono font-medium text-[12px]">{data.memory || "12 MB"}</span>
         </div>
         <div className="flex flex-col gap-1">
           <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Cost</span>
           <span className="text-white font-mono font-medium text-[12px]">${data.cost || "0.00"}</span>
         </div>
         <div className="flex flex-col gap-1">
           <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Health</span>
           <span className={cn("font-medium text-[12px] flex items-center gap-1.5", currentStatus === 'idle' ? "text-slate-400" : "text-brand-emerald")}>
             <div className={cn("w-1.5 h-1.5 rounded-full", currentStatus === 'idle' ? "bg-white/20" : "bg-brand-emerald animate-pulse")} /> 
             {currentStatus === 'idle' ? "Standby" : "Optimal"}
           </span>
         </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-white/10 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Duration:</span> <span className="text-white font-mono">{data.duration || "0ms"}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Reasoning:</span> <span className="text-white truncate max-w-[180px]" title={data.reasoning || "N/A"}>{data.reasoning || "N/A"}</span></div>
              {data.logs && (
                <div className="mt-3 p-3 rounded bg-white/50 border border-white/5 font-mono text-xs text-slate-400 h-20 overflow-y-auto custom-scrollbar">
                  {data.logs}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Compact Integration Node Component
const IntegrationNode = ({ data, isConnectable }: any) => {
  const Icon = data.icon;
  
  const statusConfig = {
    running: { color: "border-brand-cyan shadow-[0_0_15px_rgba(6,182,212,0.2)]", icon: "text-brand-cyan", dot: "bg-brand-cyan animate-pulse" },
    completed: { color: "border-brand-emerald shadow-[0_0_15px_rgba(16,185,129,0.2)]", icon: "text-brand-emerald", dot: "bg-brand-emerald" },
    waiting: { color: "border-yellow-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]", icon: "text-yellow-500", dot: "bg-yellow-500 animate-pulse" },
    idle: { color: "border-white/5", icon: "text-slate-400", dot: "bg-white/20" }
  };
  
  const currentStatus = (data.status as keyof typeof statusConfig) || "idle";
  const conf = statusConfig[currentStatus] || statusConfig["idle"];

  return (
    <div className={cn(
      "luxury-card p-4 transition-all duration-300 w-[280px] relative z-10 group bg-[#131b2f] hover:-translate-y-0.5",
      conf.color
    )}>
      <Handle type="target" position={Position.Left} id="left" isConnectable={isConnectable} className="w-2.5 h-2.5 bg-white/20 border-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center gap-4">
        <div className={cn("p-2.5 rounded-xl border transition-colors bg-[#1c263f] relative overflow-hidden", conf.color.split(' ')[0])}>
          <Icon size={20} className={cn("relative z-10", conf.icon)} />
          <div className={cn("absolute inset-0 opacity-20", currentStatus !== 'idle' ? conf.dot.split(' ')[0] : "")} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-white tracking-wide truncate">{data.label}</div>
          <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold truncate mt-1">
            {data.task || "Awaiting Payload"}
          </div>
        </div>
        
        <div className={cn("w-2 h-2 rounded-full shrink-0 shadow-sm", conf.dot)} />
      </div>
    </div>
  );
};

const nodeTypes = {
  agentNode: AgentNode,
  integrationNode: IntegrationNode,
};

const edgeTypes = {
  animatedEdge: AnimatedEdge,
};

interface AgentGraphProps {
  logs: string[];
  isRunning: boolean;
  isFullScreen: boolean;
  isLiveMode: boolean;
}

export function AgentGraph({ logs, isRunning, isFullScreen, isLiveMode }: AgentGraphProps) {
  const [activeNode, setActiveNode] = useState<string>("System");
  const [rfInstance, setRfInstance] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const initialNodes: Node[] = [
    { id: "System", type: "agentNode", position: { x: 0, y: 250 }, data: { label: "User Goal", icon: Target, status: "idle", duration: "0ms", reasoning: "" } },
    { id: "PM", type: "agentNode", position: { x: 420, y: 250 }, data: { label: "Product Manager", icon: ClipboardList, status: "idle", duration: "0ms" } },
    { id: "Engineering", type: "agentNode", position: { x: 840, y: 50 }, data: { label: "Engineering Agent", icon: Cpu, status: "idle", duration: "0ms" } },
    { id: "Finance", type: "agentNode", position: { x: 840, y: 450 }, data: { label: "Finance Agent", icon: DollarSign, status: "idle", duration: "0ms" } },
    { id: "QA", type: "agentNode", position: { x: 1260, y: 50 }, data: { label: "QA Agent", icon: Shield, status: "idle", duration: "0ms" } },
    { id: "Approval", type: "agentNode", position: { x: 1260, y: 450 }, data: { label: "Human Approval", icon: Users, status: "idle", duration: "0ms" } },
    { id: "DevOps", type: "agentNode", position: { x: 1680, y: 250 }, data: { label: "DevOps", icon: Settings, status: "idle", duration: "0ms" } },
    { id: "GitHub", type: "integrationNode", position: { x: 2120, y: 50 }, data: { label: "GitHub", icon: GitBranch, status: "idle", duration: "0ms" } },
    { id: "Notion", type: "integrationNode", position: { x: 2120, y: 150 }, data: { label: "Notion Workspace", icon: FileText, status: "idle", duration: "0ms" } },
    { id: "Slack", type: "integrationNode", position: { x: 2120, y: 250 }, data: { label: "Slack Channel", icon: MessageSquare, status: "idle", duration: "0ms" } },
    { id: "Email", type: "integrationNode", position: { x: 2120, y: 350 }, data: { label: "Email", icon: Mail, status: "idle", duration: "0ms" } },
    { id: "Analytics", type: "integrationNode", position: { x: 2120, y: 450 }, data: { label: "Analytics", icon: BarChart, status: "idle", duration: "0ms" } }
  ];

  const initialEdges: Edge[] = [
    { id: "e-sys-pm", source: "System", target: "PM", sourceHandle: "right", targetHandle: "left", type: "animatedEdge", data: { status: 'idle', label: '', isLive: true } },
    { id: "e-pm-eng", source: "PM", target: "Engineering", sourceHandle: "right", targetHandle: "left", type: "animatedEdge", data: { status: 'idle', label: '', isLive: true } },
    { id: "e-pm-fin", source: "PM", target: "Finance", sourceHandle: "right", targetHandle: "left", type: "animatedEdge", data: { status: 'idle', label: '', isLive: true } },
    { id: "e-eng-qa", source: "Engineering", target: "QA", sourceHandle: "right", targetHandle: "left", type: "animatedEdge", data: { status: 'idle', label: '', isLive: true } },
    { id: "e-fin-app", source: "Finance", target: "Approval", sourceHandle: "right", targetHandle: "left", type: "animatedEdge", data: { status: 'idle', label: '', isLive: true } },
    { id: "e-qa-dev", source: "QA", target: "DevOps", sourceHandle: "right", targetHandle: "left", type: "animatedEdge", data: { status: 'idle', label: '', isLive: true } },
    { id: "e-app-dev", source: "Approval", target: "DevOps", sourceHandle: "right", targetHandle: "left", type: "animatedEdge", data: { status: 'idle', label: '', isLive: true } },
    
    // Integrations
    { id: "e-dev-git", source: "DevOps", target: "GitHub", sourceHandle: "right", targetHandle: "left", type: "animatedEdge", data: { status: 'idle', label: '', isLive: true } },
    { id: "e-dev-not", source: "DevOps", target: "Notion", sourceHandle: "right", targetHandle: "left", type: "animatedEdge", data: { status: 'idle', label: '', isLive: true } },
    { id: "e-dev-slk", source: "DevOps", target: "Slack", sourceHandle: "right", targetHandle: "left", type: "animatedEdge", data: { status: 'idle', label: '', isLive: true } },
    { id: "e-dev-eml", source: "DevOps", target: "Email", sourceHandle: "right", targetHandle: "left", type: "animatedEdge", data: { status: 'idle', label: '', isLive: true } },
    { id: "e-dev-ana", source: "DevOps", target: "Analytics", sourceHandle: "right", targetHandle: "left", type: "animatedEdge", data: { status: 'idle', label: '', isLive: true } }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync Live Mode toggle to edges
  useEffect(() => {
    setEdges(eds => eds.map(e => ({
      ...e,
      data: { ...e.data, isLive: isLiveMode }
    })));
  }, [isLiveMode, setEdges]);

  // Re-fit view dynamically when container resizes (fullscreen toggle, sidebar toggle, window resize)
  useEffect(() => {
    if (!rfInstance || !containerRef.current) return;
    
    let timeoutId: NodeJS.Timeout;
    const observer = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        rfInstance.fitView({ padding: 0.05, duration: 600 });
      }, 150); // slight delay to allow CSS transitions to complete
    });
    
    observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [rfInstance]);

  useEffect(() => {
    if (logs.length === 0) {
      setActiveNode("System");
      setNodes(initialNodes);
      setEdges(initialEdges.map(e => ({...e, data: {...e.data, isLive: isLiveMode}})));
      return;
    }

    const latestLog = logs[logs.length - 1];
    if (!latestLog) return;
    
    let current = "System";
    let nodeStatus = "running";
    let activeEdge = "";
    let edgeLabel = "Sending Data...";

    // State machine inference from logs
    if (latestLog.includes("Starting")) {
      current = "System";
      activeEdge = "e-sys-pm";
      edgeLabel = "Goal Sent";
      nodeStatus = "completed";
    } 
    else if (latestLog.includes("[PRODUCT MANAGER]")) {
      current = "PM";
      if (latestLog.includes("Delegating")) {
        activeEdge = "e-pm-eng";
        edgeLabel = "PRD Created";
        nodeStatus = "completed";
      } else {
        nodeStatus = "thinking";
      }
    }
    else if (latestLog.includes("[ENGINEERING AGENT]")) {
      current = "Engineering";
      if (latestLog.includes("requesting")) {
        activeEdge = "e-eng-fin";
        edgeLabel = "Request Budget";
        nodeStatus = "completed";
      } else if (latestLog.includes("Passing")) {
        activeEdge = "e-eng-qa";
        edgeLabel = "Code Ready";
        nodeStatus = "completed";
      } else {
        nodeStatus = "processing";
      }
    }
    else if (latestLog.includes("[QA AGENT]")) {
      current = "QA";
      if (latestLog.includes("writing") || latestLog.includes("Logging")) {
        activeEdge = "e-qa-appr";
        edgeLabel = "Tests Passed";
        nodeStatus = "completed";
      } else {
        nodeStatus = "processing";
      }
    }
    else if (latestLog.includes("[FINANCE AGENT]")) {
      current = "Finance";
      if (latestLog.includes("Escalating") || latestLog.includes("Workflow paused")) {
        activeEdge = "e-fin-appr";
        edgeLabel = "Escalated";
        nodeStatus = "completed";
      } else if (latestLog.includes("Approved") || latestLog.includes("Rejected")) {
        activeEdge = "e-fin-appr";
        edgeLabel = "Decision Sent";
        nodeStatus = "completed";
      } else {
        nodeStatus = "processing";
      }
    }
    else if (latestLog.includes("[HUMAN APPROVAL]") || latestLog.includes("Approval Required") || latestLog.includes("Manager")) {
      current = "Approval";
      if (latestLog.includes("Slack") || latestLog.includes("Email")) {
        nodeStatus = "waiting";
      } else if (latestLog.includes("Approved") || latestLog.includes("Rejected") || latestLog.includes("Simulating")) {
        activeEdge = "e-appr-dev";
        edgeLabel = "Approved";
        nodeStatus = "completed";
      }
    }
    else if (latestLog.includes("[DEVOPS]")) {
      current = "DevOps";
      activeEdge = "e-dev-git";
      edgeLabel = "Deploying";
      nodeStatus = "completed";
    }
    else if (latestLog.includes("[NOTION API]") || latestLog.includes("[SLACK]") || latestLog.includes("[GITHUB]") || latestLog.includes("[EMAIL]") || latestLog.includes("[ANALYTICS]")) {
      if (latestLog.includes("[GITHUB]")) current = "GitHub";
      else if (latestLog.includes("[NOTION API]")) current = "Notion";
      else if (latestLog.includes("[SLACK]")) current = "Slack";
      else if (latestLog.includes("[EMAIL]")) current = "Email";
      else if (latestLog.includes("[ANALYTICS]")) current = "Analytics";
      nodeStatus = "completed";
    }

    setActiveNode(current);

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === current) {
          // Fake task and confidence for visual appeal
          let task = "Processing request...";
          let conf = Math.floor(Math.random() * (99 - 85 + 1)) + 85;
          let tokens = Math.floor(Math.random() * 2000) + 400;
          let memory = Math.floor(Math.random() * 200) + 120 + " MB";
          let cost = (tokens * 0.00001).toFixed(4);
          
          if (n.id === 'PM') task = "Writing Specifications";
          if (n.id === 'Engineering') task = "Building Feature";
          if (n.id === 'QA') task = "Running Cypress Tests";
          if (n.id === 'Finance') task = "Verifying Budgets";
          if (n.id === 'DevOps') task = "Executing CI/CD Pipeline";
          
          return { ...n, data: { ...n.data, status: nodeStatus, logs: latestLog, duration: "1.2s", task, confidence: conf, tokens, memory, cost } };
        } 
        
        // Simplified completed tracking - mark any node before current in the tree as completed
        const isPastNode = 
          (current === "PM" && n.id === "System") ||
          (current === "Engineering" && (n.id === "System" || n.id === "PM")) ||
          (current === "Finance" && (n.id === "System" || n.id === "PM" || n.id === "Engineering")) ||
          (current === "QA" && (n.id === "System" || n.id === "PM" || n.id === "Engineering")) ||
          (current === "Approval" && (n.id === "System" || n.id === "PM" || n.id === "Engineering" || n.id === "QA" || n.id === "Finance")) ||
          (current === "DevOps" && (n.id !== "DevOps" && n.id !== "GitHub" && n.id !== "Notion" && n.id !== "Slack" && n.id !== "Email" && n.id !== "Analytics")) ||
          ((current === "GitHub" || current === "Notion" || current === "Slack" || current === "Email" || current === "Analytics") && (n.id !== "GitHub" && n.id !== "Notion" && n.id !== "Slack" && n.id !== "Email" && n.id !== "Analytics"));
          
        if (isPastNode) {
          return { ...n, data: { ...n.data, status: "completed" } };
        }
        
        return { ...n, data: { ...n.data, status: "idle" } };
      })
    );

    setEdges((eds) =>
      eds.map((e) => {
        let edgeStatus = 'idle';
        
        if (e.id === activeEdge) {
          edgeStatus = nodeStatus === 'waiting' ? 'waiting' : 'running';
        } else {
          const isPastEdge = 
            (current === "PM" && e.id === "e-sys-pm") ||
            (current === "Engineering" && (e.id === "e-sys-pm" || e.id === "e-pm-eng")) ||
            (current === "QA" && (e.id === "e-sys-pm" || e.id === "e-pm-eng" || e.id === "e-eng-qa")) ||
            (current === "Finance" && (e.id === "e-sys-pm" || e.id === "e-pm-eng" || e.id === "e-eng-fin")) ||
            (current === "Approval" && (e.id === "e-sys-pm" || e.id === "e-pm-eng" || e.id === "e-eng-fin" || e.id === "e-fin-appr" || e.id === "e-eng-qa" || e.id === "e-qa-appr")) ||
            (current === "DevOps" && e.id !== "e-dev-git" && e.id !== "e-dev-not" && e.id !== "e-dev-slk" && e.id !== "e-dev-eml" && e.id !== "e-dev-ana");
            
          if (isPastEdge) edgeStatus = 'completed';
        }

        return {
          ...e,
          data: { 
            ...e.data, 
            status: edgeStatus, 
            label: e.id === activeEdge ? edgeLabel : '',
            isLive: isLiveMode
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeStatus === 'running' ? '#00f0ff' : 
                   edgeStatus === 'completed' ? '#10b981' : 
                   edgeStatus === 'waiting' ? '#eab308' : 'rgba(255,255,255,0.4)',
          }
        };
      })
    );
  }, [logs]);

  return (
    <div ref={containerRef} className="w-full h-full rounded-[20px] overflow-hidden bg-[#131b2f] relative border border-white/5">
      <ReactFlow
        onInit={setRfInstance}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        onlyRenderVisibleElements
        fitViewOptions={{ padding: 0.2, minZoom: 0.1, maxZoom: 2 }}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        zoomOnPinch={false}
        panOnScroll={false}
        preventScrolling={false}
        panOnDrag={false}
        selectionOnDrag={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        snapToGrid={true}
        snapGrid={[20, 20]}
        className="bg-[#131b2f]"
      >
        <Background color="rgba(255,255,255,0.06)" gap={24} size={1} />
      </ReactFlow>
    </div>
  );
}
