"use client";

import React, { useState } from "react";
import { Settings, Key, Database, Shield, Bell, CheckCircle2, Bot, FileText, Webhook } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [devMode, setDevMode] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Settings size={32} color="var(--text-primary)" />
          <div>
            <h1>System Settings</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", margin: 0 }}>
              Configure your Enterprise OS and AI agent integrations.
            </p>
          </div>
        </div>
      </header>
      
      <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr" }}>
        
        {/* API Credentials */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem" }}>
            <Key size={20} color="var(--accent-cyan)" />
            <h3 style={{ margin: 0 }}>API Credentials</h3>
          </div>
          
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                <Bot size={16} /> OpenAI API Key
              </label>
              <input type="password" defaultValue="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx" className="glass-panel" style={{ 
                width: "100%", padding: "0.75rem 1rem", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "8px", outline: "none" 
              }} />
            </div>
            
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                <FileText size={16} /> Notion Integration Token
              </label>
              <input type="password" defaultValue="secret_xxxxxxxxxxxxxxxxxxxxxxxxxx" className="glass-panel" style={{ 
                width: "100%", padding: "0.75rem 1rem", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "8px", outline: "none" 
              }} />
            </div>
          </div>
        </div>

        {/* System Connections */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem" }}>
            <Database size={20} color="var(--accent-emerald)" />
            <h3 style={{ margin: 0 }}>Database & Webhooks</h3>
          </div>
          
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                <Webhook size={16} /> Slack Webhook URL
              </label>
              <input type="url" defaultValue="https://hooks.slack.com/services/T00000000/B00000000/XXXX" className="glass-panel" style={{ 
                width: "100%", padding: "0.75rem 1rem", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "8px", outline: "none" 
              }} />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem" }}>
            <Shield size={20} color="var(--accent-purple)" />
            <h3 style={{ margin: 0 }}>Global Preferences</h3>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
            <div>
              <h4 style={{ margin: "0 0 0.25rem 0" }}>Developer Mode (Mock Agents)</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Skip actual API calls and use simulated agent responses for faster local testing.</p>
            </div>
            {/* Custom Toggle Switch */}
            <div 
              onClick={() => setDevMode(!devMode)}
              style={{
                width: "44px", height: "24px", 
                background: devMode ? "var(--accent-purple)" : "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                position: "relative",
                cursor: "pointer",
                transition: "background 0.3s ease"
              }}
            >
              <div style={{
                position: "absolute", top: "2px", left: devMode ? "22px" : "2px",
                width: "20px", height: "20px", background: "#fff",
                borderRadius: "50%",
                transition: "left 0.3s ease"
              }} />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          <button 
            onClick={handleSave}
            className="btn btn-primary" 
            style={{ 
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: saved ? "var(--accent-emerald)" : "var(--text-primary)",
              color: saved ? "#000" : "var(--bg-primary)",
              transition: "all 0.3s ease",
              width: "200px",
              justifyContent: "center"
            }}
          >
            {saved ? <CheckCircle2 size={18} /> : null}
            {saved ? "Saved Successfully!" : "Save Configuration"}
          </button>
        </div>

      </div>
    </div>
  );
}
