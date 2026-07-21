import React from 'react';
import { FolderKanban, Plus } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <header className="mb-8 flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20">
            <FolderKanban size={32} className="text-brand-purple" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Projects</h1>
            <p className="text-slate-400 text-lg">Manage your enterprise initiatives and active deployments.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-purple hover:bg-brand-purple/90 text-white text-sm font-medium transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <Plus size={16} /> New Project
        </button>
      </header>

      <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-white/10">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <FolderKanban size={32} className="text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No Active Projects</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-6">You haven't created any projects yet. Create a new project to start organizing your AI workflows.</p>
      </div>
    </div>
  );
}
