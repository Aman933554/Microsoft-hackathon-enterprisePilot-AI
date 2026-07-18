"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, Workflow, Settings, Zap } from "lucide-react";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Users, label: "Agents", href: "/agents" },
    { icon: Workflow, label: "Workflows", href: "/workflows" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "280px",
        height: "100vh",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-light)",
        padding: "2rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        zIndex: 50
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3rem" }}>
        <div style={{
          background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
          borderRadius: "8px",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Zap size={24} color="#fff" />
        </div>
        <h2 style={{ fontSize: "1.25rem", margin: 0, color: "#fff" }}>Enterprise OS</h2>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em", marginBottom: "0.5rem", paddingLeft: "0.5rem" }}>
          Main Menu
        </div>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={index} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: isActive ? "rgba(0, 240, 255, 0.1)" : "transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "var(--bg-hover)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
              >
                <Icon size={18} color={isActive ? "var(--accent-cyan)" : "currentColor"} />
                <span style={{ fontWeight: 500 }}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ 
        marginTop: "auto", 
        padding: "1rem", 
        background: "rgba(16, 185, 129, 0.1)", 
        borderRadius: "8px",
        border: "1px solid rgba(16, 185, 129, 0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-emerald)" }} />
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--accent-emerald)" }}>System Online</span>
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: 0 }}>
          All AI Agents are operational.
        </p>
      </div>
    </motion.aside>
  );
}
