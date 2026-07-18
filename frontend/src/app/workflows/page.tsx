"use client";

import React from "react";
import { Workflow, Plus, Play, Pause, FileEdit, Brain, DollarSign, MessageSquare, Database, Mail, Users } from "lucide-react";

export default function WorkflowsPage() {
  const workflows = [
    {
      id: 1,
      title: "Marketing & Finance Sync",
      description: "Autonomous negotiation between creative and budget policies.",
      status: "Active",
      runs: 142,
      color: "var(--accent-emerald)",
      nodes: [
        <Brain key="1" size={16} color="var(--accent-cyan)" />, 
        <DollarSign key="2" size={16} color="var(--accent-purple)" />, 
        <Database key="3" size={16} color="#fff" />, 
        <MessageSquare key="4" size={16} color="#eab308" />
      ]
    },
    {
      id: 2,
      title: "Customer Support Triaging",
      description: "Classifies incoming tickets and routes to correct departments.",
      status: "Paused",
      runs: 840,
      color: "#eab308",
      nodes: [
        <MessageSquare key="1" size={16} color="#fff" />, 
        <Brain key="2" size={16} color="var(--accent-cyan)" />, 
        <Mail key="3" size={16} color="var(--accent-emerald)" />
      ]
    },
    {
      id: 3,
      title: "HR Recruitment Pipeline",
      description: "Screens resumes and schedules initial candidate interviews.",
      status: "Draft",
      runs: 0,
      color: "var(--text-muted)",
      nodes: [
        <Mail key="1" size={16} color="#fff" />, 
        <Brain key="2" size={16} color="var(--accent-cyan)" />, 
        <Users key="3" size={16} color="var(--accent-purple)" />
      ]
    }
  ];

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      <header style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Workflow size={32} color="var(--accent-emerald)" />
          <div>
            <h1>Active Workflows</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", margin: 0 }}>
              Monitor and construct multi-agent LangGraph architectures.
            </p>
          </div>
        </div>
        <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={18} />
          Create New Workflow
        </button>
      </header>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {workflows.map((wf) => (
          <div key={wf.id} className="glass-panel" style={{ 
            padding: "1.5rem", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            transition: "all 0.2s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.transform = "translateX(5px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
            e.currentTarget.style.transform = "translateX(0)";
          }}>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
              {/* Play/Pause Icon */}
              <div style={{ 
                width: "48px", height: "48px", 
                borderRadius: "12px", 
                background: `var(--bg-secondary)`, 
                border: "1px solid var(--border-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: wf.color
              }}>
                {wf.status === "Active" ? <Play size={20} fill="currentColor" /> : 
                 wf.status === "Paused" ? <Pause size={20} fill="currentColor" /> : 
                 <FileEdit size={20} />}
              </div>

              {/* Info */}
              <div>
                <h3 style={{ margin: "0 0 0.25rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {wf.title}
                  <span style={{ 
                    fontSize: "0.7rem", 
                    padding: "2px 8px", 
                    borderRadius: "12px", 
                    background: `${wf.color}20`,
                    color: wf.color,
                    border: `1px solid ${wf.color}40`,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    {wf.status}
                  </span>
                </h3>
                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>{wf.description}</p>
              </div>
            </div>

            {/* Nodes Sequence & Stats */}
            <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
              {/* Nodes Sequence */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {wf.nodes.map((node, i) => (
                  <React.Fragment key={i}>
                    <div style={{ 
                      width: "32px", height: "32px", borderRadius: "50%", 
                      background: "var(--bg-hover)", 
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1px solid var(--border-light)"
                    }}>
                      {node}
                    </div>
                    {i < wf.nodes.length - 1 && (
                      <div style={{ width: "12px", height: "1px", background: "var(--border-light)" }} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Runs */}
              <div style={{ textAlign: "right", minWidth: "80px" }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>{wf.runs}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Runs</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
