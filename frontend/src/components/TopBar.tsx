"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Plus, Play, Command, Sparkles, Menu, X, CheckSquare, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";

export function TopBar({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen?: boolean; setIsSidebarOpen?: (val: boolean) => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const loadInitialNotifications = async () => {
      try {
        const res = await fetch("/api/approvals");
        const data = await res.json();
        if (data.success && data.pendingApprovals) {
          const loaded = data.pendingApprovals.map((app: any, idx: number) => ({
            id: app.id || idx,
            title: "Approval Required",
            message: `Managerial sign-off needed for ${app.title || 'Agent Workflow'}.`,
            time: "Just now",
            read: false
          }));
          setNotifications([{ id: 'sys1', title: "System Update", message: "EnterprisePilot v2.1 deployed.", time: "Just now", read: false }, ...loaded]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadInitialNotifications();
  }, []);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [model, setModel] = useState("GPT-4o");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [credits, setCredits] = useState(84204);
  const [status, setStatus] = useState("Nominal");

  useEffect(() => {
    const onLaunch = () => {
      setStatus("Processing");
      setCredits(prev => prev - (Math.floor(Math.random() * 25) + 10)); // subtract 10-35 credits
      setTimeout(() => setStatus("Nominal"), 15000);
    };
    window.addEventListener("launch-campaign", onLaunch);
    return () => window.removeEventListener("launch-campaign", onLaunch);
  }, []);

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
  const filteredNotifications = notifications.filter(n => filter === 'all' || !n.read);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleLaunch = () => {
    if (pathname !== "/") {
      router.push("/?launch=true");
    } else {
      window.dispatchEvent(new CustomEvent("launch-campaign"));
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchItems = [
    { name: "Launch Agent Workflow", path: "/", action: "launch" },
    { name: "Check Finance Approvals", path: "/approvals", action: "navigate" },
    { name: "View Active AI Agents", path: "/workflows", action: "navigate" },
    { name: "Manage Knowledge Base", path: "/knowledge", action: "navigate" },
    { name: "Configure Integrations", path: "/integrations", action: "navigate" },
    { name: "System Settings", path: "/settings", action: "navigate" }
  ];

  const filteredItems = searchItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleSelect = (item: typeof searchItems[0]) => {
    setIsSearchOpen(false);
    setSearchQuery("");

    if (item.action === "launch") {
      if (pathname !== "/") {
        router.push("/?launch=true");
      } else {
        window.dispatchEvent(new CustomEvent("launch-campaign"));
      }
    } else {
      router.push(item.path);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && filteredItems.length > 0) {
      e.preventDefault();
      const item = filteredItems[selectedIndex];
      if (item) handleSelect(item);
    }
  };

  return (
    <>
      <header className="h-16 border-b border-white/5 bg-[#0b1120]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6">
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
            className="flex-1 max-w-md hidden md:flex items-center gap-2 bg-[#1c263f] hover:bg-white/10 border border-white/5 rounded-lg px-3 py-1.5 text-sm text-slate-400 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] ml-4"
          >
            <Search size={14} className="text-slate-400" />
            <span className="flex-1 text-left">Search or ask AI...</span>
            <div className="flex items-center gap-1 bg-[#131b2f] border border-white/5 px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-400">
              <Command size={10} />
              <span>K</span>
            </div>
          </button>
        </div>

        {/* Right section: Actions & Stats */}
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-6 mr-2 border-r border-white/5 pr-6">
            <div className="flex flex-col relative">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Model</span>
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="text-xs font-medium text-brand-purple flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                <Sparkles size={10} /> {model}
              </button>
              <AnimatePresence>
                {showModelDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowModelDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full left-0 mt-2 w-40 bg-[#0b1120] border border-white/5 rounded-lg shadow-xl overflow-hidden z-50 flex flex-col"
                    >
                      {["GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro"].map(m => (
                        <div
                          key={m}
                          onClick={() => { setModel(m); setShowModelDropdown(false); }}
                          className={`px-3 py-2 text-xs cursor-pointer whitespace-nowrap hover:bg-white/10 transition-colors ${model === m ? 'text-brand-cyan bg-white/5' : 'text-slate-300'}`}
                        >
                          {m}
                        </div>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Credits</span>
              <span className="text-xs font-medium text-white">{credits.toLocaleString()} <span className="text-slate-400">/ 100k</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Status</span>
              <div className="flex items-center gap-1.5">
                <div className="relative flex h-2 w-2 items-center justify-center">
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${status === 'Nominal' ? 'bg-brand-emerald' : 'bg-yellow-500'}`}></span>
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${status === 'Nominal' ? 'bg-brand-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]'}`}></span>
                </div>
                <span className={`text-xs font-medium ${status === 'Nominal' ? 'text-white' : 'text-yellow-400'}`}>{status}</span>
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
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-[#0b1120] border border-white/5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 flex flex-col"
                >
                  <div className="px-4 py-3 border-b border-white/5 bg-[#1c263f]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Bell size={14} className="text-brand-cyan" />
                        Notifications
                      </h3>
                      <div className="flex gap-2">
                        <button onClick={markAllRead} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors" title="Mark all read">
                          <CheckSquare size={14} />
                        </button>
                        <button onClick={clearAll} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-red-400 transition-colors" title="Clear all">
                          <Trash2 size={14} />
                        </button>
                        <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors" title="Close">
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilter('all')}
                        className={`text-[10px] px-2 py-1 rounded-full font-medium transition-colors ${filter === 'all' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilter('unread')}
                        className={`text-[10px] px-2 py-1 rounded-full font-medium transition-colors ${filter === 'unread' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      >
                        Unread ({unreadCount})
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar bg-[#0b1120]">
                    {filteredNotifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No notifications to show.
                      </div>
                    ) : (
                      filteredNotifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group flex gap-3 ${!n.read ? 'bg-brand-cyan/5' : ''}`}
                          onClick={() => {
                            setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
                            setShowNotifications(false);
                            if (n.title.includes("Approval") || n.title.includes("Action Required") || n.title.includes("Budget")) {
                              window.location.href = "/approvals";
                            } else if (n.title.includes("System Update")) {
                              window.location.href = "/settings";
                            }
                          }}
                        >
                          {!n.read && (
                            <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full mt-1.5 shrink-0 shadow-[0_0_5px_rgba(6,182,212,0.5)] animate-pulse"></div>
                          )}
                          {n.read && (
                            <div className="w-1.5 h-1.5 bg-transparent rounded-full mt-1.5 shrink-0"></div>
                          )}
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-white mb-0.5">{n.title}</div>
                            <div className="text-xs text-slate-400 leading-relaxed mb-1">{n.message}</div>
                            <div className="text-[10px] text-slate-500 font-medium">{n.time}</div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(n.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-red-400 transition-all shrink-0 self-start"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleLaunch}
            className="hidden sm:flex items-center gap-1.5 bg-[#1c263f] hover:bg-white/10 border border-white/5 rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors"
          >
            <Plus size={14} />
            New Agent
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
              className="fixed top-[20vh] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-[#131b2f] border border-white/5 rounded-xl shadow-2xl z-[101] overflow-hidden flex flex-col"
            >
              <div className="flex items-center px-4 py-3 border-b border-white/5">
                <Search size={18} className="text-slate-400 mr-3" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search workflows, agents, or ask AI..."
                  className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-400 text-sm"
                />
                <div className="flex items-center gap-1 bg-[#1c263f] px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-white/5">
                  ESC
                </div>
              </div>
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">Suggestions</div>
                <div className="flex flex-col gap-1">
                  {filteredItems.length === 0 ? (
                    <div className="px-3 py-4 text-sm text-slate-400 text-center">
                      No results found for "{searchQuery}"
                    </div>
                  ) : (
                    filteredItems.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={`px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${i === selectedIndex ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                      >
                        <Sparkles size={14} className={i === selectedIndex ? 'text-brand-cyan' : 'text-brand-purple'} />
                        {item.name}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
