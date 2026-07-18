"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, DollarSign, Target, MessageSquare, FileText } from "lucide-react";

interface AgentGraphProps {
  logs: string[];
  isRunning: boolean;
}

export function AgentGraph({ logs, isRunning }: AgentGraphProps) {
  const [activeNode, setActiveNode] = useState<string>("System");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (logs.length === 0) {
      setActiveNode("System");
      setMessage("");
      return;
    }

    const latestLog = logs[logs.length - 1];
    
    if (!latestLog) return;
    
    if (latestLog.includes("[MARKETING AGENT]")) {
      setActiveNode("Marketing");
    } else if (latestLog.includes("[FINANCE AGENT]")) {
      setActiveNode("Finance");
    } else if (latestLog.includes("[MESSAGE SQUARE]")) {
      setActiveNode("Slack");
    } else if (latestLog.includes("[NOTION API]")) {
      setActiveNode("Notion");
    } else if (latestLog.includes("Workflow paused")) {
      setActiveNode("Human");
    } else {
      setActiveNode("System");
    }

    const cleanedMessage = latestLog
      .replace(/\[.*?\]/g, "")
      .replace(" (Mock Mode)", "")
      .replace("*** ORCHESTRATOR PAUSED ***", "Waiting for approval...")
      .trim();
      
    setMessage(cleanedMessage || "Processing...");
  }, [logs]);

  const nodes = [
    { id: "System", label: "Goal Input", icon: <Target size={24} />, x: "10%", y: "50%", color: "var(--accent-emerald)" },
    { id: "Marketing", label: "Marketing Agent", icon: <Brain size={24} />, x: "35%", y: "20%", color: "var(--accent-cyan)" },
    { id: "Finance", label: "Finance Agent", icon: <DollarSign size={24} />, x: "35%", y: "80%", color: "var(--accent-purple)" },
    { id: "Notion", label: "Notion System", icon: <FileText size={24} />, x: "65%", y: "50%", color: "#ffffff" },
    { id: "Slack", label: "Slack Notify", icon: <MessageSquare size={24} />, x: "90%", y: "50%", color: "var(--accent-purple)" }
  ];

  return (
    <div className="agent-graph-container glass-panel" style={{ position: "relative", height: "500px", overflow: "hidden", padding: 0 }}>
      {/* Background grid */}
      <div className="graph-grid" />
      
      {/* Dynamic Status Message */}
      <div style={{ position: "absolute", top: "1.5rem", left: "1.5rem", right: "1.5rem", textAlign: "center", zIndex: 10 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass-panel message-pill"
            style={{ 
              display: "inline-block", 
              padding: "0.75rem 1.5rem", 
              borderRadius: "30px",
              border: `1px solid ${nodes.find(n => n.id === activeNode)?.color || '#fff'}50`,
              background: `linear-gradient(90deg, transparent, ${nodes.find(n => n.id === activeNode)?.color || '#fff'}10, transparent)`,
              boxShadow: `0 4px 20px ${nodes.find(n => n.id === activeNode)?.color || '#fff'}20`
            }}
          >
            <span style={{ color: nodes.find(n => n.id === activeNode)?.color || '#fff', fontWeight: 600, marginRight: "0.5rem" }}>
              {activeNode}:
            </span>
            <span style={{ color: "var(--text-primary)" }}>{message || "Waiting for workflow to start..."}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          style={{
            position: "absolute",
            left: node.x,
            top: node.y,
            transform: "translate(-50%, -50%)",
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem"
          }}
        >
          <motion.div
            animate={{
              boxShadow: activeNode === node.id 
                ? `0 0 30px ${node.color}80, inset 0 0 20px ${node.color}50` 
                : `0 0 10px transparent, inset 0 0 0 transparent`,
              borderColor: activeNode === node.id ? node.color : "var(--border-light)",
              scale: activeNode === node.id ? 1.15 : 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="graph-node"
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "var(--bg-secondary)",
              border: "2px solid",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: activeNode === node.id ? node.color : "var(--text-muted)",
              position: "relative",
              backdropFilter: "blur(10px)"
            }}
          >
            {node.icon}
            {/* Pulsing ring when active */}
            {activeNode === node.id && (
              <motion.div
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  position: "absolute",
                  inset: -2,
                  borderRadius: "50%",
                  border: `2px solid ${node.color}`,
                }}
              />
            )}
          </motion.div>
          
          <div style={{
            background: "rgba(0,0,0,0.6)",
            padding: "0.35rem 0.85rem",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: activeNode === node.id ? node.color : "var(--text-secondary)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--border-light)"
          }}>
            {node.label}
          </div>
        </motion.div>
      ))}

      {/* Connecting Lines */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* System to Marketing */}
        <path d="M 10 50 Q 20 50 35 20" fill="none" stroke="var(--border-light)" strokeWidth="2" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
        {/* Marketing to Finance */}
        <path d="M 35 20 L 35 80" fill="none" stroke="var(--border-light)" strokeWidth="2" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
        {/* Finance to Notion */}
        <path d="M 35 80 Q 50 80 65 50" fill="none" stroke="var(--border-light)" strokeWidth="2" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
        {/* Marketing to Notion */}
        <path d="M 35 20 Q 50 20 65 50" fill="none" stroke="var(--border-light)" strokeWidth="2" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
        {/* Notion to Slack */}
        <path d="M 65 50 L 90 50" fill="none" stroke="var(--border-light)" strokeWidth="2" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
        
        {/* Data Packets Animation */}
        {isRunning && logs.length > 0 && (
           <circle r="5" fill={nodes.find(n => n.id === activeNode)?.color || "var(--accent-cyan)"} filter="url(#glow)">
             <animateMotion 
               dur="1.5s" 
               repeatCount="indefinite"
               keyPoints="0;1"
               keyTimes="0;1"
                path={
                 activeNode === "Marketing" ? "M 10 50 Q 20 50 35 20" :
                 activeNode === "Finance" ? "M 35 20 L 35 80" :
                 activeNode === "Notion" ? "M 35 80 Q 50 80 65 50" :
                 activeNode === "Slack" ? "M 65 50 L 90 50" : "M 10 50 Q 20 50 35 20"
               }
             />
           </circle>
        )}
      </svg>
    </div>
  );
}
