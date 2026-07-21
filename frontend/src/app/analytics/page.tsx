"use client";

import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Coins, Clock, Cpu, BarChart3, Download, RefreshCw, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const todayData = [
  { name: "00:00", tokens: 12000, cost: 0.24 },
  { name: "04:00", tokens: 18000, cost: 0.36 },
  { name: "08:00", tokens: 45000, cost: 0.90 },
  { name: "12:00", tokens: 85000, cost: 1.70 },
  { name: "16:00", tokens: 92000, cost: 1.84 },
  { name: "20:00", tokens: 35000, cost: 0.70 },
];

const weeklyData = [
  { name: "Mon", tokens: 120000, cost: 2.4 },
  { name: "Tue", tokens: 180000, cost: 3.6 },
  { name: "Wed", tokens: 150000, cost: 3.0 },
  { name: "Thu", tokens: 280000, cost: 5.6 },
  { name: "Fri", tokens: 250000, cost: 5.0 },
  { name: "Sat", tokens: 90000,  cost: 1.8 },
  { name: "Sun", tokens: 110000, cost: 2.2 },
];

const monthlyData = [
  { name: "Week 1", tokens: 820000, cost: 16.4 },
  { name: "Week 2", tokens: 980000, cost: 19.6 },
  { name: "Week 3", tokens: 750000, cost: 15.0 },
  { name: "Week 4", tokens: 1150000, cost: 23.0 },
];

const allTimeData = [
  { name: "Q1", tokens: 2400000, cost: 48.0 },
  { name: "Q2", tokens: 3800000, cost: 76.0 },
  { name: "Q3", tokens: 5100000, cost: 102.0 },
  { name: "Q4", tokens: 4200000, cost: 84.0 },
];

const utilizationToday = [
  { name: "00:00", eng: 20, fin: 10, mkt: 5 },
  { name: "04:00", eng: 15, fin: 12, mkt: 8 },
  { name: "08:00", eng: 65, fin: 45, mkt: 30 },
  { name: "12:00", eng: 85, fin: 70, mkt: 65 },
  { name: "16:00", eng: 90, fin: 50, mkt: 80 },
  { name: "20:00", eng: 45, fin: 20, mkt: 40 },
];

const utilizationWeekly = [
  { name: "Mon", eng: 75, fin: 50, mkt: 40 },
  { name: "Tue", eng: 80, fin: 55, mkt: 45 },
  { name: "Wed", eng: 85, fin: 45, mkt: 50 },
  { name: "Thu", eng: 90, fin: 60, mkt: 65 },
  { name: "Fri", eng: 85, fin: 65, mkt: 70 },
  { name: "Sat", eng: 30, fin: 15, mkt: 20 },
  { name: "Sun", eng: 25, fin: 10, mkt: 15 },
];

const utilizationMonthly = [
  { name: "Wk 1", eng: 80, fin: 50, mkt: 45 },
  { name: "Wk 2", eng: 82, fin: 55, mkt: 50 },
  { name: "Wk 3", eng: 78, fin: 60, mkt: 65 },
  { name: "Wk 4", eng: 88, fin: 65, mkt: 70 },
];

const utilizationAllTime = [
  { name: "Q1", eng: 65, fin: 40, mkt: 30 },
  { name: "Q2", eng: 75, fin: 50, mkt: 45 },
  { name: "Q3", eng: 85, fin: 60, mkt: 65 },
  { name: "Q4", eng: 92, fin: 68, mkt: 75 },
];

type Timeframe = "today" | "weekly" | "monthly" | "all-time";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("weekly");
  const [isExporting, setIsExporting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      window.dispatchEvent(new CustomEvent("new-notification", { 
        detail: { title: "Report Exported", message: "System Intelligence report downloaded successfully." } 
      }));
    }, 2000);
  };

  const getDataForTimeframe = () => {
    switch (timeframe) {
      case "today": return { tokens: todayData, util: utilizationToday, roi: "$4,120", hours: "112h", eqv: "1", cost: "$5.74", tokenStr: "287K", utilAvg: "72%" };
      case "weekly": return { tokens: weeklyData, util: utilizationWeekly, roi: "$42,500", hours: "1,240h", eqv: "7", cost: "$23.60", tokenStr: "1.18M", utilAvg: "84%" };
      case "monthly": return { tokens: monthlyData, util: utilizationMonthly, roi: "$175,200", hours: "5,120h", eqv: "32", cost: "$74.00", tokenStr: "3.7M", utilAvg: "89%" };
      case "all-time": return { tokens: allTimeData, util: utilizationAllTime, roi: "$1.4M", hours: "42,500h", eqv: "260", cost: "$310.00", tokenStr: "15.5M", utilAvg: "91%" };
    }
  };

  const currentData = getDataForTimeframe();

  const getTimeframeLabel = (tf: Timeframe) => {
    switch (tf) {
      case "today": return "Today";
      case "weekly": return "Last 7 Days";
      case "monthly": return "Last 30 Days";
      case "all-time": return "All Time";
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div className="flex items-center gap-5">
          <div className="p-3 rounded-xl bg-brand-blue/10 border border-brand-blue/20">
            <BarChart3 size={32} className="text-brand-blue" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-1">System Intelligence</h1>
            <p className="text-slate-400 text-sm">
              Performance metrics, cost analysis, and agent ROI.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-3 w-40 bg-[#09222b] border border-[rgba(255,255,255,0.08)] rounded-md px-4 py-2.5 text-sm font-medium text-white hover:border-brand-cyan/50 hover:bg-[#021114] transition-all focus:outline-none shadow-[0_2px_10px_rgba(255,255,255,0.05)]"
            >
              {getTimeframeLabel(timeframe)}
              <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 md:left-0 w-40 mt-2 bg-[#021114] border border-[rgba(255,255,255,0.08)] rounded-md shadow-2xl overflow-hidden z-50 p-1"
                  >
                    {(["today", "weekly", "monthly", "all-time"] as Timeframe[]).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => { setTimeframe(tf); setIsDropdownOpen(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm transition-all rounded hover:bg-white/10 flex items-center justify-between",
                          timeframe === tf ? "text-brand-cyan font-medium bg-white/5" : "text-white"
                        )}
                      >
                        {getTimeframeLabel(tf)}
                        {timeframe === tf && <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#09222b] border border-[rgba(255,255,255,0.08)] hover:bg-white/5 text-xs font-semibold text-white transition-colors shadow-[0_2px_10px_rgba(255,255,255,0.05)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            {isExporting ? "Generating..." : "Export Report"}
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="luxury-card p-6 flex flex-col justify-between border-l-2 border-l-brand-emerald">
          <div className="flex items-center justify-between mb-8 text-slate-400">
            <h3 className="text-[10px] font-bold uppercase tracking-widest">ROI Value</h3>
            <div className="p-1.5 rounded bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
              <TrendingUp size={14} />
            </div>
          </div>
          <div>
            <div className="text-4xl font-light tracking-tight text-white mb-2">{currentData.roi}</div>
            <p className="text-[11px] text-brand-emerald flex items-center gap-1 font-semibold uppercase tracking-wider">
              +12.5% vs last period
            </p>
          </div>
        </div>

        <div className="luxury-card p-6 flex flex-col justify-between border-l-2 border-l-brand-cyan">
          <div className="flex items-center justify-between mb-8 text-slate-400">
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Hours Saved</h3>
            <div className="p-1.5 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
              <Clock size={14} />
            </div>
          </div>
          <div>
            <div className="text-4xl font-light tracking-tight text-white mb-2">{currentData.hours}</div>
            <p className="text-[11px] text-brand-emerald flex items-center gap-1 font-semibold uppercase tracking-wider">
              Eqv. to {currentData.eqv} full-time employees
            </p>
          </div>
        </div>

        <div className="luxury-card p-6 flex flex-col justify-between border-l-2 border-l-brand-purple">
          <div className="flex items-center justify-between mb-8 text-slate-400">
            <h3 className="text-[10px] font-bold uppercase tracking-widest">API Cost</h3>
            <div className="p-1.5 rounded bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
              <Coins size={14} />
            </div>
          </div>
          <div>
            <div className="text-4xl font-light tracking-tight text-white mb-2">{currentData.cost}</div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
              {currentData.tokenStr} tokens processed
            </p>
          </div>
        </div>

        <div className="luxury-card p-6 flex flex-col justify-between border-l-2 border-l-pink-500">
          <div className="flex items-center justify-between mb-8 text-slate-400">
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Agent Utilization</h3>
            <div className="p-1.5 rounded bg-pink-500/10 text-pink-500 border border-pink-500/20">
              <Cpu size={14} />
            </div>
          </div>
          <div>
            <div className="text-4xl font-light tracking-tight text-white mb-2">{currentData.utilAvg}</div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
              Average across fleet
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="luxury-card p-8 bg-[#021114]">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">Token Usage ({getTimeframeLabel(timeframe)})</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData.tokens} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val} dx={-10} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.01)' }}
                  contentStyle={{ backgroundColor: '#09222b', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="tokens" fill="#00F0FF" radius={[4, 4, 0, 0]} maxBarSize={40} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="luxury-card p-8 bg-[#021114]">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">Agent Fleet Utilization</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData.util} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09222b', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="eng" name="Engineering" stroke="#A855F7" fillOpacity={1} fill="url(#colorEng)" strokeWidth={2} animationDuration={1000} />
                <Area type="monotone" dataKey="fin" name="Finance" stroke="#10B981" fillOpacity={1} fill="url(#colorFin)" strokeWidth={2} animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
