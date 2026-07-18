"use client";

import React from "react";
import { Users, Brain, DollarSign, Activity, Settings2, Database, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function AgentsPage() {
  const agents = [
    {
      id: "marketing",
      name: "Marketing Agent",
      role: "Creative Strategist",
      icon: <Brain size={28} color="var(--accent-cyan)" />,
      color: "var(--accent-cyan)",
      model: "GPT-4o",
      description: "Autonomous creative agent responsible for ideating campaigns, drafting marketing copy, and proposing initial budget allocations. Directly integrates with the Notion Campaigns database to log rationales.",
      capabilities: ["Content Generation", "Notion API", "Strategy"],
      status: "Online",
      latency: "120ms"
    },
    {
      id: "finance",
      name: "Finance Agent",
      role: "Policy Enforcer",
      icon: <DollarSign size={28} color="var(--accent-purple)" />,
      color: "var(--accent-purple)",
      model: "GPT-4o",
      description: "Strict policy enforcement agent. Reviews all proposed budgets against enterprise limits. Automatically rejects non-compliant requests and pauses the orchestrator to request Human-in-the-Loop approval.",
      capabilities: ["Policy Engine", "Notion API", "Slack API"],
      status: "Online",
      latency: "85ms"
    }
  ];

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Users size={32} color="var(--accent-cyan)" />
          <div>
            <h1>Agent Fleet</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              Manage and monitor your autonomous AI workforce.
            </p>
          </div>
        </div>
      </header>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
        gap: "1.5rem" 
      }}>
        {agents.map((agent, i) => (
          <div 
            key={agent.id}
            className="glass-panel" 
            style={{ 
              padding: "1.75rem", 
              display: "flex", 
              flexDirection: "column", 
              gap: "1.25rem",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = `0 10px 30px ${agent.color}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ 
                  background: `${agent.color}15`, 
                  padding: "0.75rem", 
                  borderRadius: "12px",
                  border: `1px solid ${agent.color}30`
                }}>
                  {agent.icon}
                </div>
                <div>
                  <h2 style={{ fontSize: "1.25rem", margin: 0, color: agent.color }}>{agent.name}</h2>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{agent.role}</div>
                </div>
              </div>
              <div style={{ 
                background: "var(--bg-secondary)", 
                padding: "4px 8px", 
                borderRadius: "6px", 
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <Settings2 size={12} />
                {agent.model}
              </div>
            </div>

            {/* Description */}
            <p style={{ color: "var(--text-secondary)", margin: 0, lineHeight: 1.6, fontSize: "0.95rem" }}>
              {agent.description}
            </p>

            {/* Capabilities */}
            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                Active Capabilities
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {agent.capabilities.map(cap => (
                  <span key={cap} style={{ 
                    background: "rgba(255,255,255,0.05)", 
                    border: "1px solid rgba(255,255,255,0.1)", 
                    padding: "4px 10px", 
                    borderRadius: "20px", 
                    fontSize: "0.8rem",
                    color: "var(--text-primary)"
                  }}>
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Status */}
            <div style={{ 
              marginTop: "auto", 
              paddingTop: "1.25rem", 
              borderTop: "1px solid var(--border-light)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ 
                  width: "8px", height: "8px", borderRadius: "50%", 
                  background: "var(--accent-emerald)",
                  boxShadow: "0 0 10px var(--accent-emerald)"
                }} />
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{agent.status}</span>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <Activity size={14} />
                {agent.latency}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
