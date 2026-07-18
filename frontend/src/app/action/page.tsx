"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, AlertCircle, Clock, ExternalLink } from "lucide-react";

function ActionContent() {
  const searchParams = useSearchParams();
  const threadId = searchParams.get("threadId");
  const approved = searchParams.get("approved") === "true";
  const budgetStr = searchParams.get("budget");
  const feature = searchParams.get("feature") || "AI Expense Predictor";
  
  const currentBudget = budgetStr ? parseInt(budgetStr) : 38400;

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(1790);

  useEffect(() => {
    let interval = setInterval(() => setTimeRemaining(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    if (!threadId) {
      setStatus("error");
      setErrorMessage("Missing threadId parameter.");
      return;
    }

    const processAction = async () => {
      try {
        const res = await fetch("/api/resume-agent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ threadId, approved }),
        });

        if (res.ok) {
          setStatus("success");
        } else {
          const data = await res.json();
          setStatus("error");
          setErrorMessage(data.error || "Failed to process action.");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message);
      }
    };

    // Small delay for dramatic effect
    setTimeout(processAction, 1500);
  }, [threadId, approved]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: "rgba(10, 10, 10, 0.95)",
        border: "1px solid rgba(234, 179, 8, 0.4)",
        padding: "2rem",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1)",
        width: "550px",
        maxWidth: "95vw"
      }}
    >
      <div style={{ textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1.5rem" }}>
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ display: "inline-block", marginBottom: "1rem" }}
        >
          <AlertCircle size={48} color="#eab308" style={{ filter: "drop-shadow(0 0 12px rgba(234, 179, 8, 0.4))" }} />
        </motion.div>
        <h3 style={{ margin: 0, color: "#eab308", fontSize: "1.5rem", letterSpacing: "-0.5px" }}>Approval Authorized</h3>
        <p style={{ margin: 0, color: "var(--text-secondary)", marginTop: "0.5rem" }}>Reviewing remote workflow authorization via Email.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h5 style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>Request Details</h5>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Feature</span>
            <span style={{ color: "white", fontSize: "0.9rem", textAlign: "right" }}>{feature}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Requested By</span>
            <span style={{ color: "white", fontSize: "0.9rem" }}>Engineering Agent</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Budget</span>
            <span style={{ color: "var(--accent-purple)", fontSize: "0.9rem", fontWeight: 600 }}>₹{currentBudget.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Risk Level</span>
            <span style={{ color: "var(--accent-danger)", fontSize: "0.9rem" }}>Medium</span>
          </div>
        </div>

        <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h5 style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>Status Checks</h5>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            <CheckCircle size={14} color="var(--accent-emerald)" /> Finance Approved
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            <CheckCircle size={14} color="var(--accent-emerald)" /> QA Approved
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            <CheckCircle size={14} color="var(--accent-emerald)" /> Engineering Ready
          </div>
        </div>
      </div>

      <div style={{ padding: "1rem", background: "rgba(0,0,0,0.3)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
         <h5 style={{ margin: "0 0 1rem 0", color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>Notification Escalation</h5>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
             <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "white" }}>
               📧 Email Sent <CheckCircle size={14} color="var(--accent-emerald)" />
             </span>
             <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "white" }}>
               💬 Slack Delivered <CheckCircle size={14} color="var(--accent-emerald)" />
             </span>
             <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "white" }}>
               🔔 Browser Push <CheckCircle size={14} color="var(--accent-emerald)" />
             </span>
           </div>
           <div style={{ textAlign: "center", padding: "1rem", borderLeft: "1px solid rgba(255,255,255,0.1)", minWidth: "160px" }}>
             <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
               <Clock size={14} /> Time Remaining
             </div>
             <div style={{ fontFamily: "monospace", fontSize: "1.75rem", color: "white", textShadow: "0 0 10px rgba(255,255,255,0.3)" }}>
               {formatTime(timeRemaining)}
             </div>
           </div>
         </div>
      </div>
      
      {/* Dynamic Action Section based on state */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginTop: "0.5rem", padding: "1.5rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
        {status === "loading" && (
          <>
            <Loader2 className="animate-spin" size={32} color="var(--accent-cyan)" />
            <span style={{ color: "white", fontWeight: 600 }}>Executing your decision remotely...</span>
          </>
        )}
        
        {status === "success" && (
          <>
            {approved ? <CheckCircle size={48} color="var(--accent-emerald)" /> : <XCircle size={48} color="var(--accent-danger)" />}
            <span style={{ color: approved ? "var(--accent-emerald)" : "var(--accent-danger)", fontSize: "1.25rem", fontWeight: "bold" }}>
              {approved ? "Successfully Approved!" : "Successfully Rejected!"}
            </span>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textAlign: "center" }}>The workflow has resumed on your main computer. You can close this tab.</span>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={48} color="var(--accent-danger)" />
            <span style={{ color: "var(--accent-danger)", fontSize: "1.25rem", fontWeight: "bold" }}>Action Failed</span>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{errorMessage}</span>
          </>
        )}
      </div>

      <button 
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", height: "40px", cursor: "pointer", borderRadius: "6px", color: "white", fontFamily: "inherit", width: "100%" }}
        onClick={() => window.open("https://notion.so", "_blank")}
      >
        <ExternalLink size={16} /> View full context in Notion
      </button>

    </motion.div>
  );
}

export default function ActionPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#000", padding: "1rem" }}>
      <Suspense fallback={<Loader2 className="animate-spin" size={48} color="var(--accent-purple)" />}>
        <ActionContent />
      </Suspense>
    </div>
  );
}
