"use client";

import React, { useState } from 'react';
import { BookOpen, Search, Upload, X, FileText, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface KBItem {
  id: string;
  title: string;
  description: string;
  docsCount: number;
  updatedAt: string;
}

const initialItems: KBItem[] = [
  { id: "1", title: "Company Policies", description: "Vectorized documents regarding HR and finance policies.", docsCount: 142, updatedAt: "2d ago" },
  { id: "2", title: "API Documentation", description: "Technical docs and OpenAPI specs for internal services.", docsCount: 56, updatedAt: "5h ago" },
  { id: "3", title: "Customer Support Logs", description: "Anonymized support tickets for support bot training.", docsCount: 8904, updatedAt: "1d ago" },
];

export default function KnowledgeBasePage() {
  const [items, setItems] = useState<KBItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '' });

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title) return;
    
    const added: KBItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description || "Newly uploaded dataset.",
      docsCount: Math.floor(Math.random() * 50) + 1,
      updatedAt: "Just now"
    };
    
    setItems([added, ...items]);
    setIsModalOpen(false);
    setNewItem({ title: '', description: '' });
    
    // Notification
    window.dispatchEvent(new CustomEvent("new-notification", { 
      detail: { title: "Upload Complete", message: `Dataset "${added.title}" is now vectorized and ready.` } 
    }));
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20">
            <BookOpen size={32} className="text-brand-cyan" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Knowledge Base</h1>
            <p className="text-slate-400 text-sm">Central repository for enterprise data, models, and embeddings.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search knowledge base..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-[#09222b] border border-[rgba(255,255,255,0.08)] rounded-md pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan transition-colors shadow-inner" 
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-brand-cyan hover:bg-brand-cyan/90 text-black text-sm font-bold transition-colors shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            <Upload size={16} /> Upload Data
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
              className="luxury-card p-6 border-white/5 hover:border-brand-cyan/30 transition-colors cursor-pointer group flex flex-col"
            >
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Database size={24} className="text-slate-400 group-hover:text-brand-cyan transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">{item.description}</p>
              <div className="flex justify-between items-center text-xs mt-auto pt-4 border-t border-white/5">
                <span className="text-brand-cyan font-semibold flex items-center gap-1.5"><FileText size={12} /> {item.docsCount} Documents</span>
                <span className="text-slate-400">{item.updatedAt}</span>
              </div>
            </motion.div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full h-40 flex items-center justify-center border border-dashed border-white/10 rounded-xl text-slate-400">
              No knowledge base items found.
            </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#021114] border border-[rgba(255,255,255,0.08)] rounded-xl shadow-2xl z-[51] overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)] bg-[#09222b]">
                <h2 className="text-lg font-semibold text-white">Upload to Knowledge Base</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleUpload} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Dataset Name</label>
                  <input 
                    type="text" 
                    required
                    value={newItem.title}
                    onChange={e => setNewItem({...newItem, title: e.target.value})}
                    placeholder="e.g., Q3 Marketing Guidelines" 
                    className="w-full bg-[#09222b] border border-[rgba(255,255,255,0.08)] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Description (Optional)</label>
                  <textarea 
                    value={newItem.description}
                    onChange={e => setNewItem({...newItem, description: e.target.value})}
                    placeholder="What is this dataset about?" 
                    className="w-full bg-[#09222b] border border-[rgba(255,255,255,0.08)] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan transition-colors resize-none h-24"
                  />
                </div>
                
                <div className="border-2 border-dashed border-[rgba(255,255,255,0.08)] rounded-lg p-8 flex flex-col items-center justify-center text-center mt-2 hover:bg-white/5 hover:border-brand-cyan/30 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-brand-cyan/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload size={18} className="text-brand-cyan" />
                  </div>
                  <span className="text-sm font-medium text-white mb-1">Click to browse or drag and drop</span>
                  <span className="text-xs text-slate-400">PDF, DOCX, TXT, CSV (max. 50MB)</span>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-md bg-brand-cyan hover:bg-brand-cyan/90 text-black text-sm font-bold transition-colors">
                    Process & Vectorize
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
