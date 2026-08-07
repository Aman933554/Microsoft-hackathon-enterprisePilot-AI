"use client";

import React from "react";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { UserButton, useAuth } from "@clerk/nextjs";

function SignedIn({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  if (isSignedIn) return <>{children}</>;
  return null;
}

function SignedOut({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded || isSignedIn) return null;
  return <>{children}</>;
}

export default function LandingPage() {
  return (
    <div id="top" className={`min-h-screen bg-background text-foreground ${GeistSans.className}`}>
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 z-[-1] pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          radial-gradient(circle at 15% 50%, rgba(220, 20, 60, 0.06) 0%, transparent 40%),
          radial-gradient(circle at 85% 30%, rgba(255, 191, 0, 0.04) 0%, transparent 40%)
        `,
        backgroundSize: '30px 30px, 30px 30px, 100% 100%, 100% 100%',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed'
      }}></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">EnterprisePilot AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#top" className="relative text-primary group py-2">
              Home
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full shadow-[0_0_10px_rgba(220,20,60,0.8)]"></span>
            </a>
            <a href="#problem" className="relative hover:text-white transition-colors duration-300 group py-2">
              Problem
              <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-primary rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100 shadow-[0_0_10px_rgba(220,20,60,0.8)]"></span>
            </a>
            <a href="#how-it-works" className="relative hover:text-white transition-colors duration-300 group py-2">
              How It Works
              <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-primary rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100 shadow-[0_0_10px_rgba(220,20,60,0.8)]"></span>
            </a>
            <a href="#agents" className="relative hover:text-white transition-colors duration-300 group py-2">
              AI Agents
              <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-primary rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100 shadow-[0_0_10px_rgba(220,20,60,0.8)]"></span>
            </a>
            <a href="#integrations" className="relative hover:text-white transition-colors duration-300 group py-2">
              Integrations
              <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-primary rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100 shadow-[0_0_10px_rgba(220,20,60,0.8)]"></span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-primary px-4 py-2 border border-white/10 rounded-full hover:border-primary/50 transition-colors bg-white/5">
                Login
              </Link>
              <Link href="/login" className="text-sm font-medium text-white bg-primary hover:bg-primary/80 px-6 py-2 rounded-full transition-colors shadow-[0_0_20px_rgba(220,20,60,0.4)]">
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-sm font-medium text-primary bg-primary/10 border border-primary/30 hover:bg-primary/20 px-6 py-2 rounded-full transition-colors shadow-[0_0_20px_rgba(220,20,60,0.4)] mr-2">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-8 shadow-[0_0_15px_rgba(220,20,60,0.2)]">
              <span>AI-Native Enterprise Operating System</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
              Turn Business Requests into <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-600 to-amber-500 animate-[gradient_4s_linear_infinite] bg-[length:200%_auto]">Approved,</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-600 to-amber-500 animate-[gradient_4s_linear_infinite] bg-[length:200%_auto]">Actionable</span> Projects
            </h1>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg">
              EnterprisePilot AI connects specialized AI agents, company policies and human decision-makers to transform business requests into approved proposals, assigned tasks and real execution.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary/80 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(220,20,60,0.4)] text-lg">
                Get Started &rarr;
              </Link>
              <button className="px-8 py-4 rounded-full font-medium text-slate-300 border border-white/10 hover:bg-white/5 flex items-center gap-2 transition-colors text-lg">
                See How It Works
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="relative">
            {/* Visual Flowchart Representation */}
            <div className="bg-card/40 backdrop-blur-xl p-8 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.5)] border border-white/5">
              <div className="flex flex-col items-center gap-6">
                <div className="bg-emerald-500/10 text-emerald-400 px-6 py-4 rounded-xl border border-emerald-500/20 flex items-center gap-4 w-full">
                  <div className="bg-emerald-500/20 p-2 rounded-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Business Request</h4>
                    <p className="text-sm text-emerald-500/80">Submitted by employee</p>
                  </div>
                </div>
                
                <div className="w-px h-8 bg-white/10"></div>
                
                <div className="flex gap-4 w-full">
                  <div className="bg-primary/10 text-primary px-6 py-4 rounded-xl border border-primary/20 flex-1 flex flex-col items-center text-center shadow-[0_0_15px_rgba(220,20,60,0.1)]">
                    <div className="bg-primary/20 p-2 rounded-lg mb-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <h4 className="font-semibold text-white text-sm">AI Agents Collaborate</h4>
                    <p className="text-xs text-primary/80 mt-1">Analyze & negotiate</p>
                  </div>
                  <div className="bg-amber-500/10 text-amber-500 px-6 py-4 rounded-xl border border-amber-500/20 flex-1 flex flex-col items-center text-center">
                    <div className="bg-amber-500/20 p-2 rounded-lg mb-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <h4 className="font-semibold text-white text-sm">Human Approval</h4>
                    <p className="text-xs text-amber-500/80 mt-1">Review & approve</p>
                  </div>
                </div>
                
                <div className="w-px h-8 bg-white/10"></div>
                
                <div className="flex gap-4 w-full">
                  <div className="bg-card/60 text-slate-300 px-6 py-4 rounded-xl border border-white/5 flex-1 flex items-center gap-3">
                    <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                      <svg className="w-5 h-5 text-slate-300" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">GitHub Tasks</h4>
                      <p className="text-[10px] text-slate-500">Issues & assignments</p>
                    </div>
                  </div>
                  <div className="bg-card/60 text-slate-300 px-6 py-4 rounded-xl border border-white/5 flex-1 flex items-center gap-3">
                    <div className="bg-white/5 p-2 rounded-lg border border-white/10 text-primary">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">Calendar</h4>
                      <p className="text-[10px] text-slate-500">Schedule & notify</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Silos Section */}
      <section id="problem" className="py-24 bg-card/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Enterprise Silos Are Slowing Modern Businesses</h2>
            <p className="text-slate-400">Disconnected tools, manual coordination and slow approvals create unnecessary delays and risks.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(220,20,60,0.15)] transition-all">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="font-bold text-white mb-2">Information Silos</h3>
              <p className="text-sm text-slate-400">Product, Engineering, Finance and other departments keep information in separate tools.</p>
            </div>
            
            <div className="bg-card/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(255,191,0,0.15)] transition-all">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="font-bold text-white mb-2">Manual Coordination</h3>
              <p className="text-sm text-slate-400">Employees repeatedly move information between teams to keep work progressing.</p>
            </div>

            <div className="bg-card/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(220,20,60,0.15)] transition-all">
              <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-bold text-white mb-2">Slow Approvals</h3>
              <p className="text-sm text-slate-400">Important proposals remain blocked while teams wait for decisions.</p>
            </div>

            <div className="bg-card/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(220,20,60,0.15)] transition-all">
              <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="font-bold text-white mb-2">Missing Decision History</h3>
              <p className="text-sm text-slate-400">Organizations struggle to understand who decided what, why and what happened next.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section id="agents" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Specialized AI Agents Working for You</h2>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-card/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 text-center hover:border-primary/30 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3 className="font-bold text-white mb-2 text-sm">Product Manager Agent</h3>
              <p className="text-xs text-slate-400">Converts business requests into requirements, milestones and acceptance criteria.</p>
            </div>
            
            <div className="bg-card/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 text-center hover:border-primary/30 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <h3 className="font-bold text-white mb-2 text-sm">Engineering Agent</h3>
              <p className="text-xs text-slate-400">Creates technical architecture, estimates, implementation plans and tasks.</p>
            </div>

            <div className="bg-card/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 text-center hover:border-emerald-500/30 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-xl">$</span>
              </div>
              <h3 className="font-bold text-white mb-2 text-sm">Finance Agent</h3>
              <p className="text-xs text-slate-400">Checks budgets and company policies and negotiates excessive costs.</p>
            </div>

            <div className="bg-card/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 text-center hover:border-amber-500/30 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-bold text-white mb-2 text-sm">QA Agent</h3>
              <p className="text-xs text-slate-400">Creates test cases, quality checks and release requirements.</p>
            </div>

            <div className="bg-card/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 text-center hover:border-primary/30 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              </div>
              <h3 className="font-bold text-white mb-2 text-sm">DevOps Agent</h3>
              <p className="text-xs text-slate-400">Prepares deployment tasks, release checks and rollback plans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Human Decision Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 mb-24">
        <div className="bg-card/60 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.5)] text-white flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-bold mb-4">Agents Recommend.<br/>Humans Decide.</h2>
            <p className="text-slate-400">EnterprisePilot AI pauses before important financial, technical or production actions.</p>
          </div>
          <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-colors">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h4 className="font-semibold text-sm mb-1 text-white">Approve</h4>
              <p className="text-[10px] text-slate-400">Accept and proceed.</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 transition-colors">
              <div className="w-10 h-10 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-red-500/30">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <h4 className="font-semibold text-sm mb-1 text-white">Reject</h4>
              <p className="text-[10px] text-slate-400">Reject and stop process.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10 hover:border-amber-500/30 hover:bg-amber-500/10 transition-colors">
              <div className="w-10 h-10 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-500/30">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <h4 className="font-semibold text-sm mb-1 text-white">Request Revision</h4>
              <p className="text-[10px] text-slate-400">Request changes back.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10 hover:border-primary/30 hover:bg-primary/10 transition-colors">
              <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-3 border border-primary/30">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h4 className="font-semibold text-sm mb-1 text-white">Override</h4>
              <p className="text-[10px] text-slate-400">Approve with conditions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section id="integrations" className="py-20 min-h-[60vh] bg-gradient-to-br from-[#0a0a0a] to-[#120000] border-y border-white/5 text-white relative overflow-hidden flex items-center">
        {/* Subtle red background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl w-full mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Move From Request to Execution<br/>Without Losing Human Control</h2>
            <p className="text-slate-400 text-lg">Connect your teams, agents and tools in one secure platform.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary/80 transition-colors shadow-[0_0_20px_rgba(220,20,60,0.4)]">
              Get Started
            </Link>
            <Link href="/login" className="px-8 py-4 rounded-full font-bold border border-white/20 hover:bg-white/5 transition-colors text-slate-300">
              Login
            </Link>
          </div>
        </div>
      </section>
      
      <footer className="bg-background text-slate-500 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <div className="w-6 h-6 bg-primary/20 border border-primary/30 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-bold">EnterprisePilot AI</span>
          </div>
          <div className="text-sm">
            © 2026 EnterprisePilot AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
