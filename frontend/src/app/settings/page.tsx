"use client";

import React, { useState } from "react";
import { Settings, Key, Database, Shield, Bell, CheckCircle2, Bot, FileText, Webhook, Users, Sliders, Globe, Lock, Save, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Tab = "general" | "models" | "integrations" | "security";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // Form states
  const [workspaceName, setWorkspaceName] = useState("Nexus Enterprise");
  const [devMode, setDevMode] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      window.dispatchEvent(new CustomEvent("new-notification", { 
        detail: { title: "Settings Saved", message: "Your system configurations have been updated." } 
      }));
    }, 2000);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10 border border-white/20">
            <Settings size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">System Settings</h1>
            <p className="text-slate-400 text-sm">
              Configure your AI-Native Enterprise Operating System and AI agent integrations.
            </p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saved}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-bold transition-all shadow-[0_2px_10px_rgba(255,255,255,0.05)]",
            saved ? "bg-brand-emerald text-black" : "bg-white text-black hover:bg-gray-200"
          )}
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? "Saved Successfully" : "Save Changes"}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
          <button 
            onClick={() => setActiveTab("general")}
            className={cn("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors", activeTab === "general" ? "bg-[#09222b] border border-[rgba(255,255,255,0.08)] text-brand-cyan" : "text-slate-400 hover:bg-white/5 hover:text-white")}
          >
            <Globe size={18} /> General
          </button>
          <button 
            onClick={() => setActiveTab("models")}
            className={cn("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors", activeTab === "models" ? "bg-[#09222b] border border-[rgba(255,255,255,0.08)] text-brand-purple" : "text-slate-400 hover:bg-white/5 hover:text-white")}
          >
            <Bot size={18} /> AI Models & Logic
          </button>
          <button 
            onClick={() => setActiveTab("integrations")}
            className={cn("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors", activeTab === "integrations" ? "bg-[#09222b] border border-[rgba(255,255,255,0.08)] text-brand-emerald" : "text-slate-400 hover:bg-white/5 hover:text-white")}
          >
            <Webhook size={18} /> Integrations
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={cn("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors", activeTab === "security" ? "bg-[#09222b] border border-[rgba(255,255,255,0.08)] text-red-400" : "text-slate-400 hover:bg-white/5 hover:text-white")}
          >
            <Shield size={18} /> Security & Access
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 luxury-card p-8 bg-[#021114] min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {activeTab === "general" && (
              <motion.div key="general" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1"><Globe size={20} className="text-brand-cyan" /> Workspace Preferences</h3>
                  <p className="text-sm text-slate-400 mb-6">Manage basic settings for your enterprise environment.</p>
                </div>

                <div className="grid gap-6 max-w-2xl">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Workspace Name</label>
                    <input type="text" value={workspaceName} onChange={e => setWorkspaceName(e.target.value)} className="w-full bg-[#09222b] border border-[rgba(255,255,255,0.08)] rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Admin Email Address</label>
                    <input type="email" defaultValue="admin@nexus-corp.com" className="w-full bg-[#09222b] border border-[rgba(255,255,255,0.08)] rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Default Timezone</label>
                    <select className="w-full bg-[#09222b] border border-[rgba(255,255,255,0.08)] rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan transition-colors cursor-pointer">
                      <option value="pst">Pacific Time (PT)</option>
                      <option value="est">Eastern Time (ET)</option>
                      <option value="utc">Coordinated Universal Time (UTC)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "models" && (
              <motion.div key="models" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1"><Bot size={20} className="text-brand-purple" /> AI Models & Logic</h3>
                  <p className="text-sm text-slate-400 mb-6">Configure the underlying LLMs that power your autonomous agents.</p>
                </div>

                <div className="grid gap-6 max-w-2xl">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Default Global Model</label>
                    <select className="w-full bg-[#09222b] border border-[rgba(255,255,255,0.08)] rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple transition-colors cursor-pointer">
                      <option>GPT-4o (Recommended)</option>
                      <option>Claude 3.5 Sonnet</option>
                      <option>Gemini 1.5 Pro</option>
                      <option>Llama 3 70B (Local)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Primary API Key</label>
                    <div className="relative">
                      <input type={showKey ? "text" : "password"} defaultValue="sk-proj-9x8f7s6d5a4q3w2e1r0..." className="w-full bg-[#09222b] border border-[rgba(255,255,255,0.08)] rounded-md pl-4 pr-12 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple transition-colors font-mono" />
                      <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                        {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Model Temperature (0.0 - 1.0)</label>
                      <span className="text-xs text-brand-purple font-mono">0.2</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.1" defaultValue="0.2" className="w-full accent-brand-purple cursor-pointer" />
                    <p className="text-xs text-slate-400 mt-2">Lower values produce more deterministic, factual responses. Higher values increase creativity.</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#09222b] border border-[rgba(255,255,255,0.08)] rounded-lg mt-4">
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">Developer Mode (Mock Agents)</h4>
                      <p className="text-xs text-slate-400">Skip actual API calls and use simulated agent responses for faster local testing.</p>
                    </div>
                    <div 
                      onClick={() => setDevMode(!devMode)}
                      className={cn("w-11 h-6 rounded-full relative cursor-pointer transition-colors", devMode ? "bg-brand-purple" : "bg-white/10")}
                    >
                      <div className={cn("absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform", devMode && "translate-x-5")} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "integrations" && (
              <motion.div key="integrations" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1"><Webhook size={20} className="text-brand-emerald" /> Core Integrations</h3>
                  <p className="text-sm text-slate-400 mb-6">Manage access tokens for primary external systems.</p>
                </div>

                <div className="grid gap-6 max-w-2xl">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2"><FileText size={14} /> Notion Integration Token</label>
                    <input type="password" defaultValue="secret_AbCdEfGhIjKlMnOpQrStUvWxYz" className="w-full bg-[#09222b] border border-[rgba(255,255,255,0.08)] rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-emerald transition-colors font-mono" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2"><Webhook size={14} /> Slack Webhook URL</label>
                    <input type="url" defaultValue="https://hooks.slack.com/services/T00000000/B00000000/XXXX" className="w-full bg-[#09222b] border border-[rgba(255,255,255,0.08)] rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-emerald transition-colors font-mono" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1"><Shield size={20} className="text-red-400" /> Security & Access</h3>
                  <p className="text-sm text-slate-400 mb-6">Protect your workspace and manage session policies.</p>
                </div>

                <div className="grid gap-6 max-w-2xl">
                  <div className="flex items-center justify-between p-4 bg-[#09222b] border border-red-500/20 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1 flex items-center gap-2"><Lock size={14} className="text-red-400" /> Require Two-Factor Authentication</h4>
                      <p className="text-xs text-slate-400">Force all workspace users to enable 2FA on their accounts.</p>
                    </div>
                    <div 
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={cn("w-11 h-6 rounded-full relative cursor-pointer transition-colors", twoFactor ? "bg-red-500" : "bg-white/10")}
                    >
                      <div className={cn("absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform", twoFactor && "translate-x-5")} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Idle Session Timeout</label>
                    <select className="w-full bg-[#09222b] border border-[rgba(255,255,255,0.08)] rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-400 transition-colors cursor-pointer">
                      <option value="15m">15 Minutes</option>
                      <option value="1h">1 Hour</option>
                      <option value="24h">24 Hours</option>
                      <option value="never">Never (Not Recommended)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
