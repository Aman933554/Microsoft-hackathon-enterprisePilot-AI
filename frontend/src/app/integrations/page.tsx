"use client";

import React, { useState } from "react";
import { Link2, CheckCircle, AlertCircle, GitBranch, MessageSquare, Database, CreditCard, Cloud, Triangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const initialIntegrations = [
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    description: "Send alerts, request human approvals, and stream agent logs to specific channels.",
    icon: <MessageSquare size={24} className="text-[#E01E5A]" />,
    status: "Connected",
    sync: "Real-time",
    scopes: ["channels:read", "chat:write", "users:read"],
    color: "bg-[#E01E5A]",
  },
  {
    id: "notion",
    name: "Notion",
    category: "Knowledge Base",
    description: "Sync agent decisions, update company wikis, and log budget changes.",
    icon: <Database size={24} className="text-white" />,
    status: "Connected",
    sync: "Every 5 mins",
    scopes: ["pages:write", "databases:read", "users:read"],
    color: "bg-white",
  },
  {
    id: "github",
    name: "GitHub Enterprise",
    category: "Engineering",
    description: "Create PRs, review code, and manage CI/CD deployment pipelines automatically.",
    icon: <GitBranch size={24} className="text-white" />,
    status: "Connected",
    sync: "Webhook",
    scopes: ["repo", "workflow", "read:org"],
    color: "bg-white",
  },
  {
    id: "linear",
    name: "Linear",
    category: "Project Management",
    description: "Create issues, update ticket statuses, and sync roadmap planning.",
    icon: <Triangle size={24} className="text-[#5E6AD2]" />,
    status: "Disconnected",
    sync: "Manual",
    scopes: ["issues:write", "projects:read"],
    color: "bg-[#5E6AD2]",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Finance",
    description: "Automate refunds, monitor subscription metrics, and audit failed charges.",
    icon: <CreditCard size={24} className="text-[#635BFF]" />,
    status: "Action Required",
    sync: "Real-time",
    scopes: ["charges:write", "customers:read"],
    color: "bg-[#635BFF]",
  },
  {
    id: "aws",
    name: "AWS",
    category: "Infrastructure",
    description: "Manage EC2 instances, monitor costs, and deploy new microservices.",
    icon: <Cloud size={24} className="text-[#FF9900]" />,
    status: "Connected",
    sync: "Every 15 mins",
    scopes: ["ec2:write", "s3:read", "billing:read"],
    color: "bg-[#FF9900]",
  }
];

export default function IntegrationsPage() {
  const [apps, setApps] = useState(initialIntegrations);
  const [loadingAppId, setLoadingAppId] = useState<string | null>(null);

  const handleToggleConnection = (id: string) => {
    const app = apps.find(a => a.id === id);
    if (!app) return;

    if (app.status === "Connected") {
      setApps(prev => prev.map(a => a.id === id ? { ...a, status: "Disconnected" } : a));
      window.dispatchEvent(new CustomEvent("new-notification", { 
        detail: { title: "Integration Disconnected", message: `${app.name} has been disconnected.` } 
      }));
    } else {
      setLoadingAppId(id);
      setTimeout(() => {
        setApps(prev => prev.map(a => a.id === id ? { ...a, status: "Connected" } : a));
        setLoadingAppId(null);
        window.dispatchEvent(new CustomEvent("new-notification", { 
          detail: { title: "Integration Connected", message: `${app.name} is now successfully connected.` } 
        }));
      }, 1500);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div className="flex items-center gap-5">
          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
            <Link2 size={32} className="text-pink-500" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-1">Integrations</h1>
            <p className="text-slate-400 text-sm">
              Connect your autonomous agents to external tools and databases.
            </p>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app, i) => (
          <motion.div 
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "luxury-card p-8 flex flex-col group transition-all",
              app.status === "Connected" ? "bg-[#021114]" : "bg-[#021114]/50 opacity-80 hover:opacity-100"
            )}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-5 items-center">
                <div className="p-3 rounded-xl bg-[#09222b] border border-[rgba(255,255,255,0.08)] flex items-center justify-center shadow-inner">
                  {app.icon}
                </div>
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-white leading-tight mb-1">{app.name}</h2>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{app.category}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {app.status === "Connected" ? (
                  <CheckCircle size={14} className="text-brand-emerald" />
                ) : app.status === "Action Required" ? (
                  <AlertCircle size={14} className="text-yellow-500" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                )}
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-widest",
                  app.status === "Connected" ? "text-brand-emerald" : 
                  app.status === "Action Required" ? "text-yellow-500" : "text-slate-400"
                )}>
                  {app.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-8 h-10 line-clamp-2 leading-relaxed">
              {app.description}
            </p>

            <div className="mt-auto space-y-5">
              <div className="flex justify-between items-center text-[11px] border-t border-[rgba(255,255,255,0.05)] pt-5">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Sync Frequency</span>
                <span className="text-white font-semibold">{app.sync}</span>
              </div>
              
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3 block">Authorized Scopes</span>
                <div className="flex flex-wrap gap-2">
                  {app.scopes.map(scope => (
                    <span key={scope} className="text-[10px] px-2 py-1 rounded bg-[#09222b] border border-[rgba(255,255,255,0.08)] text-white/80 font-mono shadow-sm">
                      {scope}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleToggleConnection(app.id)}
                disabled={loadingAppId === app.id}
                className={cn(
                  "w-full py-2.5 rounded-md text-xs font-bold transition-all mt-6 shadow-[0_2px_10px_rgba(255,255,255,0.05)] flex items-center justify-center gap-2",
                  app.status === "Connected" 
                    ? "bg-[#09222b] border border-[rgba(255,255,255,0.08)] hover:bg-white/5 text-white" 
                    : "bg-white text-black hover:bg-gray-200"
                )}
              >
                {loadingAppId === app.id ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Connecting...
                  </>
                ) : app.status === "Connected" ? (
                  "Disconnect"
                ) : (
                  "Connect Integration"
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
