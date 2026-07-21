"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Plus, Play, Command, Sparkles, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";

export function TopBar({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen?: boolean; setIsSidebarOpen?: (val: boolean) => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "System Update", message: "EnterprisePilot v2.1 deployed.", time: "Just now", read: false },
    { id: 2, title: "Budget Approved", message: "Finance approved Q3 marketing budget.", time: "2h ago", read: true }
  ]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleNewNotification = (e: any) => {
      const newNotif = {
        id: Date.now(),
        title: e.detail.title,
        message: e.detail.message,
        time: "Just now",
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    };
    window.addEventListener("new-notification", handleNewNotification);
    return () => window.removeEventListener("new-notification", handleNewNotification);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLaunch = () => {
    if (pathname !== "/") {
      router.push("/?launch=true");
    } else {
      window.dispatchEvent(new CustomEvent("launch-campaign"));
    }
  };

  return (
    <>
    <header className="h-16 border-b border-[rgba(255,255,255,0.05)] bg-[#021114]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6">
      {/* Left section: Breadcrumbs & Search */}
      <div className="flex items-center gap-4 flex-1">
        
        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -ml-2 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors flex items-center justify-center"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb style text */}
        <div className="hidden lg:flex items-center text-sm font-medium text-slate-400">
          <span className="hover:text-white cursor-pointer transition-colors">Nexus Enterprise</span>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white">Dashboard</span>
        </div>

        {/* Global Command Palette */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="flex-1 max-w-md hidden md:flex items-center gap-2 bg-[#09222b] hover:bg-white/10 border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-1.5 text-sm text-slate-400 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] ml-4"
        >
          <Search size={14} className="text-slate-400" />
          <span className="flex-1 text-left">Search or ask AI...</span>
          <div className="flex items-center gap-1 bg-[#021114] border border-[rgba(255,255,255,0.08)] px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-400">
            <Command size={10} />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right section: Actions & Stats */}
      <div className="flex items-center gap-4">
        <div className="hidden xl:flex items-center gap-6 mr-2 border-r border-[rgba(255,255,255,0.05)] pr-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Model</span>
            <span className="text-xs font-medium text-brand-purple flex items-center gap-1">
              <Sparkles size={10} /> GPT-4o
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Credits</span>
            <span className="text-xs font-medium text-white">84,204 <span className="text-slate-400">/ 100k</span></span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Status</span>
            <div className="flex items-center gap-1.5">
              <div className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              </div>
              <span className="text-xs font-medium text-white">Nominal</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors relative"
          >
            <Bell size={16} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-cyan rounded-full shadow-[0_0_5px_rgba(6,182,212,0.5)]"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-80 bg-[#021114] border border-[rgba(255,255,255,0.08)] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.05)] bg-[#09222b]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h3>
                  <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[10px] text-brand-cyan hover:text-white transition-colors font-semibold">
                        Mark all read
                      </button>
                    )}
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No notifications</div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => {
                          // Mark as read
                          setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                          // Hide panel
                          setShowNotifications(false);
                          // Route based on title
                          const t = notif.title.toLowerCase();
                          if (t.includes("approval") || t.includes("budget")) {
                            router.push("/approvals");
                          } else if (t.includes("agent")) {
                            router.push("/agents");
                          } else if (t.includes("workflow") || t.includes("project")) {
                            router.push("/workflows");
                          } else {
                            // Fallback to Dashboard
                            router.push("/");
                          }
                        }}
                        className={`p-4 border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors cursor-pointer ${notif.read ? 'opacity-70' : 'bg-brand-cyan/5'}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-xs font-semibold ${notif.read ? 'text-white' : 'text-brand-cyan'}`}>{notif.title}</span>
                          <span className="text-[9px] text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="hidden sm:flex items-center gap-1.5 bg-[#09222b] hover:bg-white/10 border border-[rgba(255,255,255,0.08)] rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors">
          <Plus size={14} strokeWidth={2} />
          <span>New</span>
        </button>

        <motion.button 
          onClick={handleLaunch}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 rounded-md px-4 py-1.5 text-xs font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-colors"
        >
          <Play size={12} fill="currentColor" />
          <span>Launch Workflow</span>
        </motion.button>
      </div>
    </header>

    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20vh] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-[#021114] border border-[rgba(255,255,255,0.08)] rounded-xl shadow-2xl z-[101] overflow-hidden flex flex-col"
          >
            <div className="flex items-center px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
              <Search size={18} className="text-slate-400 mr-3" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search workflows, agents, or ask AI..." 
                className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-400 text-sm"
              />
              <div className="flex items-center gap-1 bg-[#09222b] px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-[rgba(255,255,255,0.05)]">
                ESC
              </div>
            </div>
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">Suggestions</div>
              <div className="flex flex-col gap-1">
                {["Launch Q3 Marketing Campaign", "Check Finance Approvals", "View Active AI Agents", "System Settings"].map((item, i) => (
                  <div key={i} onClick={() => setIsSearchOpen(false)} className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer flex items-center gap-3 transition-colors">
                    <Sparkles size={14} className="text-brand-purple" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
