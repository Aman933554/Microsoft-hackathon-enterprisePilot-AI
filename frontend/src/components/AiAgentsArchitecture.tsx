"use client";

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Edge,
  Node,
  Position,
  Handle,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Code2, 
  ShieldCheck, 
  Settings, 
  ClipboardList, 
  DollarSign, 
  User,
  Hash,
  Mail,
  BarChart,
  BookOpen
} from 'lucide-react';

const RootNode = ({ data }: any) => (
  <div className="bg-white rounded-xl shadow-2xl px-6 py-4 flex items-center gap-4 min-w-[220px] border border-slate-200">
    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
      Ai+
    </div>
    <div className="text-[#0a0a0a] font-bold text-lg tracking-wide">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="w-0 h-0 border-none bg-transparent" />
  </div>
);

const GithubIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const AgentNode = ({ data }: any) => {
  const Icon = data.icon;
  const isHumanApproval = data.label.includes('Human Approval');
  
  return (
    <div className={`bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center gap-3 w-[160px] hover:-translate-y-1 transition-all duration-300 border ${
      isHumanApproval 
        ? 'border-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
        : 'border-slate-100'
    }`}>
      <Handle type="target" position={Position.Top} className="w-0 h-0 border-none bg-transparent" />
      <div className={`text-${data.color} mb-1`}>
        <Icon className="w-8 h-8" style={{ color: data.hexColor }} />
      </div>
      <div className="text-center font-bold text-sm leading-tight" style={{ color: data.hexColor }}>
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-0 h-0 border-none bg-transparent" />
    </div>
  );
};

const IntegrationNode = ({ data }: any) => {
  const Icon = data.icon;
  return (
    <div className="bg-white rounded-xl shadow-xl p-3 flex items-center gap-4 w-[240px] border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
      <Handle type="target" position={Position.Top} className="w-0 h-0 border-none bg-transparent" />
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: data.bg }}>
        <Icon className="w-5 h-5" style={{ color: data.iconColor }} />
      </div>
      <div className="flex flex-col">
        <span className="text-[#0a0a0a] font-bold text-sm">{data.label}</span>
        <span className="text-slate-500 text-[10px] leading-tight mt-0.5">{data.sublabel}</span>
      </div>
    </div>
  );
};

const edgeStyle = {
  animated: true,
  style: { stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '5,5' },
};

const initialNodes: Node[] = [
  // Root
  {
    id: 'root',
    type: 'rootNode',
    position: { x: 450, y: 50 },
    data: { label: 'AI AGENTS' }
  },
  // Agents (Row 1)
  {
    id: 'agent-1',
    type: 'agentNode',
    position: { x: 0, y: 200 },
    data: { label: 'Engineering\nAgent', icon: Code2, hexColor: '#3b82f6' }
  },
  {
    id: 'agent-2',
    type: 'agentNode',
    position: { x: 180, y: 200 },
    data: { label: 'QA\nAgent', icon: ShieldCheck, hexColor: '#a855f7' }
  },
  {
    id: 'agent-3',
    type: 'agentNode',
    position: { x: 360, y: 200 },
    data: { label: 'DevOps\nAgent', icon: Settings, hexColor: '#10b981' }
  },
  {
    id: 'agent-4',
    type: 'agentNode',
    position: { x: 540, y: 200 },
    data: { label: 'Product Manager\nAgent', icon: ClipboardList, hexColor: '#f97316' }
  },
  {
    id: 'agent-5',
    type: 'agentNode',
    position: { x: 720, y: 200 },
    data: { label: 'Finance\nAgent', icon: DollarSign, hexColor: '#14b8a6' }
  },
  {
    id: 'agent-6',
    type: 'agentNode',
    position: { x: 900, y: 200 },
    data: { label: 'Human Approval\nAgent', icon: User, hexColor: '#ef4444' }
  },
  // Integrations (Row 2)
  {
    id: 'int-1',
    type: 'integrationNode',
    position: { x: 70, y: 400 },
    data: { label: 'GitHub', sublabel: 'Code, PRs, Issues', icon: GithubIcon, bg: '#18181b', iconColor: '#ffffff' }
  },
  {
    id: 'int-2',
    type: 'integrationNode',
    position: { x: 330, y: 400 },
    data: { label: 'Notion Workspace', sublabel: 'Docs, Wikis, Knowledge Base', icon: BookOpen, bg: '#18181b', iconColor: '#ffffff' }
  },
  {
    id: 'int-3',
    type: 'integrationNode',
    position: { x: 590, y: 400 },
    data: { label: 'Slack Channel', sublabel: 'Team Chat, Collaboration', icon: Hash, bg: '#ef4444', iconColor: '#ffffff' }
  },
  {
    id: 'int-4',
    type: 'integrationNode',
    position: { x: 850, y: 400 },
    data: { label: 'Email', sublabel: 'Alerts, Reports, Notifications', icon: Mail, bg: '#3b82f6', iconColor: '#ffffff' }
  },
  {
    id: 'int-5',
    type: 'integrationNode',
    position: { x: 1110, y: 400 }, // Wait, there are 5 integrations for 6 agents. So the layout needs to be tighter.
    data: { label: 'Analytics', sublabel: 'Metrics, Reports, Insights', icon: BarChart, bg: '#8b5cf6', iconColor: '#ffffff' }
  },
];

const initialEdges: Edge[] = [
  // Root to Agents
  { id: 'e-r-1', source: 'root', target: 'agent-1', type: 'step', ...edgeStyle },
  { id: 'e-r-2', source: 'root', target: 'agent-2', type: 'step', ...edgeStyle },
  { id: 'e-r-3', source: 'root', target: 'agent-3', type: 'step', ...edgeStyle },
  { id: 'e-r-4', source: 'root', target: 'agent-4', type: 'step', ...edgeStyle },
  { id: 'e-r-5', source: 'root', target: 'agent-5', type: 'step', ...edgeStyle },
  { id: 'e-r-6', source: 'root', target: 'agent-6', type: 'step', ...edgeStyle },
  
  // Agents to Integrations
  { id: 'e-a1-i1', source: 'agent-1', target: 'int-1', type: 'step', ...edgeStyle },
  { id: 'e-a2-i2', source: 'agent-2', target: 'int-2', type: 'step', ...edgeStyle },
  { id: 'e-a3-i3', source: 'agent-3', target: 'int-3', type: 'step', ...edgeStyle },
  { id: 'e-a4-i3', source: 'agent-4', target: 'int-3', type: 'step', ...edgeStyle },
  { id: 'e-a5-i4', source: 'agent-5', target: 'int-4', type: 'step', ...edgeStyle },
  { id: 'e-a6-i5', source: 'agent-6', target: 'int-5', type: 'step', ...edgeStyle },
];

export function AiAgentsArchitecture() {
  const nodeTypes = useMemo(() => ({
    rootNode: RootNode,
    agentNode: AgentNode,
    integrationNode: IntegrationNode,
  }), []);

  return (
    <div className="w-full h-[600px] bg-transparent rounded-2xl relative">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnDrag={false}
        preventScrolling={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        {/* We can use a custom background if needed, but it should inherit from the parent section */}
      </ReactFlow>
    </div>
  );
}
