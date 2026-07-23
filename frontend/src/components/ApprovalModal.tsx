import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, ExternalLink, X } from 'lucide-react';

interface ApprovalModalProps {
  show: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  currentBudget: number;
  timeRemaining: number;
  featureTitle?: string;
  productTier?: string;
}

export function ApprovalModal({ show, onClose, onApprove, onReject, currentBudget, timeRemaining, featureTitle = "AI Expense Predictor", productTier = "" }: ApprovalModalProps) {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[999]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            className="fixed top-1/2 left-1/2 bg-[#0b1120]/95 border border-yellow-500/40 p-8 rounded-2xl flex flex-col gap-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.1)] z-[1000] w-[550px] max-w-[90vw]"
          >
            <motion.button 
              whileHover={{ scale: 1.1, color: "white" }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-4 right-4 bg-transparent border-none text-slate-400 cursor-pointer p-1 flex items-center justify-center hover:text-white transition-colors"
            >
              <X size={20} />
            </motion.button>
            <div className="text-center border-b border-white/10 pb-6">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="inline-block mb-4"
              >
                <AlertCircle size={48} className="text-yellow-500 drop-shadow-[0_0_12px_rgba(234,179,8,0.4)]" />
              </motion.div>
              <h3 className="m-0 text-yellow-500 text-2xl tracking-tight font-semibold">Waiting for Human Approval</h3>
              <p className="m-0 text-white/60 mt-2">Workflow is paused pending managerial sign-off.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-4 flex flex-col gap-2 bg-white/5">
                <h5 className="m-0 text-slate-400 text-xs uppercase tracking-wider font-semibold">Request Details</h5>
                <div className="flex justify-between mt-2">
                  <span className="text-white/60 text-sm">Feature</span>
                  <span className="text-white text-sm font-medium">{featureTitle} {productTier && <span className="text-emerald-400">({productTier})</span>}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Requested By</span>
                  <span className="text-white text-sm font-medium">Engineering Agent</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Budget</span>
                  <span className="text-pink-500 text-sm font-bold">₹{currentBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Risk Level</span>
                  <span className="text-red-500 text-sm font-medium">Medium</span>
                </div>
              </div>

              <div className="glass-panel p-4 flex flex-col gap-2 bg-white/5">
                <h5 className="m-0 text-slate-400 text-xs uppercase tracking-wider font-semibold">Status Checks</h5>
                <div className="flex items-center gap-2 text-white/60 text-sm mt-2">
                  <CheckCircle size={14} className="text-emerald-500" /> Finance Approved
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <CheckCircle size={14} className="text-emerald-500" /> QA Approved
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <CheckCircle size={14} className="text-emerald-500" /> Engineering Ready
                </div>
              </div>
            </div>

            <div className="glass-panel p-4 bg-black/30">
               <h5 className="m-0 mb-4 text-slate-400 text-xs uppercase tracking-wider font-semibold">Notification Escalation</h5>
               <div className="flex justify-between items-center">
                 <div className="flex flex-col gap-3">
                   <span className="flex items-center gap-2 text-sm text-white">
                     📧 Email Sent <CheckCircle size={14} className="text-emerald-500" />
                   </span>
                   <span className="flex items-center gap-2 text-sm text-white">
                     💬 Slack Delivered <CheckCircle size={14} className="text-emerald-500" />
                   </span>
                   <span className="flex items-center gap-2 text-sm text-white">
                     🔔 Browser Push <CheckCircle size={14} className="text-emerald-500" />
                   </span>
                   <span className="flex items-center gap-2 text-sm text-white">
                     📱 SMS Delivered <CheckCircle size={14} className="text-emerald-500" />
                   </span>
                 </div>
                 <div className="text-center p-4 border-l border-white/10 min-w-[160px]">
                   <div className="flex items-center justify-center gap-2 text-white/60 mb-2 text-sm font-medium">
                     <Clock size={14} /> Time Remaining
                   </div>
                   <div className="font-mono text-3xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] font-bold">
                     {formatTime(timeRemaining)}
                   </div>
                   <div className="text-[11px] text-red-500 mt-1 uppercase font-semibold">Escalates to VP next</div>
                 </div>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button 
                className="col-span-2 flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 h-10 rounded-lg text-white text-sm font-medium transition-colors"
                onClick={() => window.open("https://notion.so", "_blank")}
              >
                <ExternalLink size={16} /> Open Source of Truth in Notion
              </button>
              <button 
                className="bg-emerald-500 hover:bg-emerald-400 text-black border-none h-12 rounded-lg font-bold text-base transition-colors"
                onClick={onApprove}
              >
                Approve
              </button>
              <button 
                className="bg-red-500 hover:bg-red-400 text-white border-none h-12 rounded-lg font-bold text-base transition-colors"
                onClick={onReject}
              >
                Reject
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
