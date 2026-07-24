"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Users, GitBranch, CheckSquare, Folder, BookOpen, 
  FileText, Puzzle, BarChart2, ShieldAlert, Settings, Cpu, Home
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "../lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";

export function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean, setIsOpen?: (val: boolean) => void }) {
  const pathname = usePathname();
  const { user } = useUser();

  const platformItems = [
    { icon: Home, label: "Main Website", href: "/" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "AI Agents", href: "/agents" },
    { icon: GitBranch, label: "Workflow Studio", href: "/workflows" },
    { icon: CheckSquare, label: "Approvals", href: "/approvals" },
    { icon: Folder, label: "Projects", href: "/projects" },
    { icon: BookOpen, label: "Knowledge Base", href: "/knowledge" },
    { icon: FileText, label: "Notion Workspace", href: "/notion" },
    { icon: Puzzle, label: "Integrations", href: "/integrations" },
    { icon: BarChart2, label: "Analytics", href: "/analytics" },
    { icon: ShieldAlert, label: "Audit Logs", href: "/audit" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const recentProjects = [
    { label: "AI Expense Predictor", color: "bg-purple-500" },
    { label: "Q3 Marketing Agent", color: "bg-purple-500" },
    { label: "Support Bot V2", color: "bg-purple-500" },
  ];

  const pinnedWorkflows = [
    { label: "Lead Qualification", color: "bg-emerald-500" },
  ];

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: isOpen !== false ? 0 : -280 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed top-0 left-0 w-[260px] h-screen bg-[#0b1120] border-r border-white/5 flex flex-col z-50 overflow-y-auto custom-scrollbar"
    >
      {/* Header */}
      <Link href="/" className="flex items-center gap-3 p-5 mt-2 hover:bg-white/5 transition-colors cursor-pointer">
        <div className="w-10 h-10 rounded-xl bg-[#1e293b]/50 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
          <Cpu size={20} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-[15px] font-bold text-white leading-tight">Nexus Enterprise</h2>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 leading-tight">
            AI-Native Enterprise<br/>Operating System
          </span>
        </div>
      </Link>

      <div className="flex flex-col flex-1 px-3 mt-4 gap-6 pb-20">
        
        {/* PLATFORM SECTION */}
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Platform</div>
          {platformItems.map((item, index) => {
            const Icon = item.icon;
            // Dashboard is active on root
            const isActive = pathname === item.href;
            
            return (
              <Link href={item.href} key={index} className="outline-none">
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all relative group overflow-hidden",
                    isActive ? "bg-white/5 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                  )}
                  <Icon size={18} className={isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-400"} />
                  <span className={cn("text-[13.5px]", isActive ? "font-semibold" : "font-medium")}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* RECENT PROJECTS SECTION */}
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-2">Recent Projects</div>
          {recentProjects.map((item, index) => (
            <Link href="/projects" key={index} className="outline-none">
              <div className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] rounded-lg cursor-pointer transition-colors group">
                <div className={cn("w-1.5 h-1.5 rounded-full ml-1", item.color, "opacity-70 group-hover:opacity-100 shadow-[0_0_5px_rgba(168,85,247,0.4)]")} />
                <span className="text-[13px] font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* PINNED WORKFLOWS SECTION */}
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-2">Pinned Workflows</div>
          {pinnedWorkflows.map((item, index) => (
            <Link href="/workflows" key={index} className="outline-none">
              <div className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] rounded-lg cursor-pointer transition-colors group">
                <div className={cn("w-1.5 h-1.5 rounded-full ml-1", item.color, "opacity-70 group-hover:opacity-100 shadow-[0_0_5px_rgba(16,185,129,0.4)]")} />
                <span className="text-[13px] font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>

      </div>

      {/* User Profile */}
      <div className="fixed bottom-0 left-0 w-[260px] p-4 bg-[#0b1120] border-t border-white/5 z-20">
        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-white">
                {user?.fullName || "Guest User"}
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
