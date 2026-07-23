"use client";

import React, { useState } from "react";
import { Settings, User, Bell, Shield, Key, Database, CheckCircle, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [firstName, setFirstName] = useState("Aman");
  const [lastName, setLastName] = useState("Sharma");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const tabs = [
    { name: "Profile", icon: User },
    { name: "Notifications", icon: Bell },
    { name: "Security", icon: Shield },
    { name: "API Keys", icon: Key },
    { name: "Data Management", icon: Database },
  ];

  return (
    <div className="p-8 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20">
          <Settings className="text-brand-cyan" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Settings</h1>
          <p className="text-slate-400 mt-1">Manage your EnterpriseOS preferences and configurations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar menu */}
        <div className="md:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-sm ${
                activeTab === tab.name
                  ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <tab.icon size={16} /> {tab.name}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="md:col-span-3">
          <div className="bg-[#0b1120] border border-white/5 rounded-2xl p-6 shadow-xl min-h-[400px]">
            <h2 className="text-xl font-semibold text-white mb-6 border-b border-white/5 pb-4">{activeTab} Information</h2>
            
            {activeTab === "Profile" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#131b2f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-cyan transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#131b2f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-cyan transition-colors" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input type="email" defaultValue="john.doe@enterpriseos.ai" className="w-full bg-[#131b2f] border border-white/10 rounded-lg px-4 py-2.5 text-slate-400 cursor-not-allowed focus:outline-none transition-colors" disabled />
                  <p className="text-xs text-slate-500 mt-2">Email address cannot be changed for enterprise accounts without admin approval.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Role</label>
                  <input type="text" defaultValue="Enterprise Manager" className="w-full bg-[#131b2f] border border-white/10 rounded-lg px-4 py-2.5 text-slate-400 cursor-not-allowed focus:outline-none transition-colors" disabled />
                </div>
                
                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving || saveSuccess}
                    className={`px-6 py-2.5 font-bold rounded-lg transition-all flex items-center gap-2 ${
                      saveSuccess 
                        ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                        : isSaving
                        ? 'bg-brand-cyan/50 text-black cursor-not-allowed'
                        : 'bg-brand-cyan text-black hover:bg-brand-cyan/90 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    }`}
                  >
                    {isSaving && <Loader2 size={18} className="animate-spin" />}
                    {saveSuccess && <CheckCircle size={18} />}
                    {saveSuccess ? 'Changes Saved' : isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="space-y-6 animate-in fade-in text-slate-300">
                <p>Configure how you receive alerts and updates.</p>
                <div className="space-y-4 mt-4">
                  {["Email Notifications", "Push Notifications", "Slack Integration Alerts", "Weekly Digest"].map(setting => (
                    <div key={setting} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <span>{setting}</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-cyan cursor-pointer" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Security" && (
              <div className="space-y-6 animate-in fade-in text-slate-300">
                <p>Manage your account security and authentication methods.</p>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">Two-Factor Authentication (2FA)</h4>
                    <p className="text-xs text-slate-400 mt-1">Add an extra layer of security to your account.</p>
                  </div>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm font-medium">Enable 2FA</button>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between mt-4">
                  <div>
                    <h4 className="font-semibold text-white">Password</h4>
                    <p className="text-xs text-slate-400 mt-1">Last changed 3 months ago.</p>
                  </div>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm font-medium">Update</button>
                </div>
              </div>
            )}

            {activeTab === "API Keys" && (
              <div className="space-y-6 animate-in fade-in text-slate-300">
                <p>Manage API keys for integrating EnterpriseOS with external services.</p>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-white">Production Key</span>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Active</span>
                  </div>
                  <div className="flex gap-2">
                    <input type="password" value="sk_live_1234567890abcdef" className="flex-1 bg-[#131b2f] border border-white/10 rounded-lg px-4 py-2 text-slate-400" readOnly />
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm">Copy</button>
                  </div>
                </div>
                <button className="px-4 py-2 w-full border border-dashed border-white/20 text-slate-400 hover:text-white hover:border-white/40 transition-colors rounded-lg text-sm flex items-center justify-center gap-2">
                  <Key size={14} /> Generate New Key
                </button>
              </div>
            )}

            {activeTab === "Data Management" && (
              <div className="space-y-6 animate-in fade-in text-slate-300">
                <p>Export your data or manage your workspace retention policies.</p>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">Export Workspace Data</h4>
                    <p className="text-xs text-slate-400 mt-1">Download all your agents, workflows, and logs in JSON format.</p>
                  </div>
                  <button className="px-4 py-2 bg-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan/30 transition-colors rounded-lg text-sm font-medium">Export Data</button>
                </div>
                <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20 flex items-center justify-between mt-4">
                  <div>
                    <h4 className="font-semibold text-red-400">Delete Account</h4>
                    <p className="text-xs text-red-400/70 mt-1">Permanently remove your account and all data.</p>
                  </div>
                  <button className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors rounded-lg text-sm font-medium">Delete</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
