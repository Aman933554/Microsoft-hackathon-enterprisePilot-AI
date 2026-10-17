"use client";

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Edge,
  Node,
  Position,
  Handle,
  ConnectionMode,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  ClipboardList, 
  Bot, 
  Database, 
  Calculator, 
  FileSpreadsheet, 
  GitBranch, 
  Mail,
  Sparkles,
  CheckCircle2,
  Zap
} from 'lucide-react';

// --- CUSTOM NODES ---

const TriggerNode = ({ data }: any) => (
  <div className="bg-[#1a1d21] border-2 border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[140px] shadow-lg relative">
    <div className="absolute -left-3 -top-3 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
      <Zap className="w-3 h-3 text-white" />
    </div>
    <div className="bg-[#1f2937] p-3 rounded-xl border border-cyan-500/50 mb-2">
      <ClipboardList className="w-8 h-8 text-cyan-400" />
    </div>
    <span className="text-white text-sm font-semibold">{data.label}</span>
    <div className="absolute -bottom-2 -right-2 bg-[#1a1d21] rounded-full">
      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    </div>
    <Handle type="source" position={Position.Right} className="w-3 h-3 bg-slate-400 border-2 border-[#1a1d21]" />
  </div>
);

const AgentNode = ({ data }: any) => (
  <div className="bg-[#2d3036] border-2 border-emerald-500 rounded-2xl w-[300px] shadow-xl relative">
    <div className="p-4 flex items-center gap-4">
      <div className="bg-[#1f2937] p-2 rounded-lg">
        <Bot className="w-8 h-8 text-slate-300" />
      </div>
      <span className="text-white text-lg font-bold">{data.label}</span>
    </div>
    <div className="absolute -bottom-2 -right-2 bg-[#1a1d21] rounded-full">
      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    </div>
    
    <Handle type="target" position={Position.Left} className="w-3 h-3 bg-emerald-500 border-2 border-[#1a1d21]" />
    <Handle type="source" position={Position.Right} id="out" className="w-3 h-3 bg-emerald-500 border-2 border-[#1a1d21]" />
    
    {/* Bottom Handles for Model, Memory, Tool */}
    <Handle type="target" position={Position.Bottom} id="model" style={{ left: '30%' }} className="w-3 h-3 bg-emerald-500 border-2 border-[#1a1d21]" />
    <Handle type="target" position={Position.Bottom} id="memory" style={{ left: '50%' }} className="w-3 h-3 bg-emerald-500 border-2 border-[#1a1d21]" />
    <Handle type="target" position={Position.Bottom} id="tool" style={{ left: '70%' }} className="w-3 h-3 bg-slate-400 border-2 border-[#1a1d21]" />
    
    <div className="absolute -bottom-6 left-[20%] text-[10px] text-slate-400">Chat Model</div>
    <div className="absolute -bottom-6 left-[45%] text-[10px] text-slate-400">Memory</div>
    <div className="absolute -bottom-6 left-[68%] text-[10px] text-slate-400">Tool</div>
  </div>
);

const ResourceNode = ({ data }: any) => (
  <div className="flex flex-col items-center">
    <div className={`bg-[#1a1d21] border-2 ${data.active ? 'border-emerald-500' : 'border-slate-600'} rounded-full w-20 h-20 flex items-center justify-center mb-2 shadow-lg relative`}>
      {data.icon}
      {data.badge && (
        <div className="absolute -bottom-2 bg-[#1a1d21] px-2 py-0.5 rounded-full border border-emerald-500 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span className="text-[10px] text-emerald-500">{data.badge}</span>
        </div>
      )}
      <Handle type="source" position={Position.Top} className="w-3 h-3 bg-emerald-500 border-2 border-[#1a1d21]" />
    </div>
    <span className="text-white text-sm font-semibold text-center w-32">{data.label}</span>
  </div>
);

const ActionNode = ({ data }: any) => (
  <div className="bg-[#1a1d21] border border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[140px] shadow-lg relative">
    <div className="bg-[#1f2937] p-3 rounded-xl border border-slate-600 mb-2">
      {data.icon}
    </div>
    <span className="text-white text-sm font-semibold text-center">{data.label}</span>
    {data.sublabel && <span className="text-slate-400 text-xs mt-1">{data.sublabel}</span>}
    {data.success && (
      <div className="absolute -bottom-2 -right-2 bg-[#1a1d21] rounded-full">
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      </div>
    )}
    <Handle type="target" position={Position.Left} className="w-3 h-3 bg-emerald-500 border-2 border-[#1a1d21]" />
    {data.hasOutput !== false && (
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-emerald-500 border-2 border-[#1a1d21]" />
    )}
    {data.hasBottomOutput && (
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-emerald-500 border-2 border-[#1a1d21]" />
    )}
  </div>
);

const SwitchNode = ({ data }: any) => (
  <div className="bg-[#1a1d21] border-2 border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px] shadow-lg relative">
    <div className="bg-[#1f2937] p-3 rounded-xl border border-blue-500 mb-2">
      <GitBranch className="w-8 h-8 text-blue-400" />
    </div>
    <span className="text-white text-sm font-semibold">Switch</span>
    <span className="text-slate-400 text-xs mt-1">mode: Rules</span>
    <div className="absolute -bottom-2 -right-2 bg-[#1a1d21] rounded-full">
      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    </div>
    <Handle type="target" position={Position.Left} className="w-3 h-3 bg-emerald-500 border-2 border-[#1a1d21]" />
    
    {/* Multiple Outputs */}
    <Handle type="source" position={Position.Right} id="0" style={{ top: '30%' }} className="w-3 h-3 bg-emerald-500 border-2 border-[#1a1d21]" />
    <Handle type="source" position={Position.Right} id="1" style={{ top: '50%' }} className="w-3 h-3 bg-slate-400 border-2 border-[#1a1d21]" />
    <Handle type="source" position={Position.Right} id="2" style={{ top: '70%' }} className="w-3 h-3 bg-slate-400 border-2 border-[#1a1d21]" />
    
    <div className="absolute right-[-15px] top-[24%] text-[10px] text-slate-400">0</div>
    <div className="absolute right-[-15px] top-[46%] text-[10px] text-slate-400">1</div>
    <div className="absolute right-[-15px] top-[68%] text-[10px] text-slate-400">2</div>
  </div>
);

const initialNodes: Node[] = [
  {
    id: 'trigger',
    type: 'triggerNode',
    position: { x: 50, y: 250 },
    data: { label: 'On form submission' }
  },
  {
    id: 'agent',
    type: 'agentNode',
    position: { x: 350, y: 150 },
    data: { label: 'AI Agent' }
  },
  {
    id: 'model',
    type: 'resourceNode',
    position: { x: 280, y: 400 },
    data: { 
      label: 'Google Gemini Chat Model',
      icon: <Sparkles className="w-10 h-10 text-blue-400" />,
      active: true
    }
  },
  {
    id: 'memory',
    type: 'resourceNode',
    position: { x: 420, y: 400 },
    data: { 
      label: 'Simple Memory',
      icon: <Database className="w-10 h-10 text-emerald-400" />,
      active: true,
      badge: '2'
    }
  },
  {
    id: 'calculator',
    type: 'resourceNode',
    position: { x: 550, y: 400 },
    data: { 
      label: 'Calculator',
      icon: <Calculator className="w-10 h-10 text-slate-400" />,
      active: false
    }
  },
  {
    id: 'sheet',
    type: 'actionNode',
    position: { x: 750, y: 150 },
    data: { 
      label: 'Append row in sheet',
      sublabel: 'append: sheet',
      icon: <FileSpreadsheet className="w-8 h-8 text-emerald-500" />,
      success: true,
      hasBottomOutput: true
    }
  },
  {
    id: 'switch',
    type: 'switchNode',
    position: { x: 800, y: 350 },
    data: {}
  },
  {
    id: 'email1',
    type: 'actionNode',
    position: { x: 1050, y: 180 },
    data: { 
      label: 'Send a message',
      sublabel: 'send: message',
      icon: <Mail className="w-8 h-8 text-blue-500" />,
      success: true,
      hasOutput: true
    }
  },
  {
    id: 'email2',
    type: 'actionNode',
    position: { x: 1050, y: 350 },
    data: { 
      label: 'Send a message1',
      sublabel: 'send: message',
      icon: <Mail className="w-8 h-8 text-blue-500" />,
      success: false,
      hasOutput: true
    }
  },
  {
    id: 'email3',
    type: 'actionNode',
    position: { x: 1050, y: 520 },
    data: { 
      label: 'Send a message2',
      sublabel: 'send: message',
      icon: <Mail className="w-8 h-8 text-blue-500" />,
      success: false,
      hasOutput: false
    }
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1',
    source: 'trigger',
    target: 'agent',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
    label: '1 item',
    labelStyle: { fill: '#94a3b8', fontSize: 12 },
    labelBgStyle: { fill: 'transparent' }
  },
  {
    id: 'e2',
    source: 'model',
    target: 'agent',
    targetHandle: 'model',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' },
    label: '1 item',
    labelStyle: { fill: '#94a3b8', fontSize: 12 },
    labelBgStyle: { fill: 'transparent' }
  },
  {
    id: 'e3',
    source: 'memory',
    target: 'agent',
    targetHandle: 'memory',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' },
    label: '2 items total',
    labelStyle: { fill: '#94a3b8', fontSize: 12 },
    labelBgStyle: { fill: 'transparent' }
  },
  {
    id: 'e4',
    source: 'calculator',
    target: 'agent',
    targetHandle: 'tool',
    style: { stroke: '#475569', strokeWidth: 2, strokeDasharray: '5 5' },
  },
  {
    id: 'e5',
    source: 'agent',
    sourceHandle: 'out',
    target: 'sheet',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
    label: '1 item',
    labelStyle: { fill: '#94a3b8', fontSize: 12 },
    labelBgStyle: { fill: 'transparent' }
  },
  {
    id: 'e6',
    source: 'sheet',
    sourceHandle: 'bottom',
    target: 'switch',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
    label: '1 item',
    labelStyle: { fill: '#94a3b8', fontSize: 12 },
    labelBgStyle: { fill: 'transparent' }
  },
  {
    id: 'e7',
    source: 'sheet',
    target: 'email1',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
    label: '1 item',
    labelStyle: { fill: '#94a3b8', fontSize: 12 },
    labelBgStyle: { fill: 'transparent' }
  },
  {
    id: 'e8',
    source: 'switch',
    sourceHandle: '0',
    target: 'email1',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
    label: '1 item',
    labelStyle: { fill: '#94a3b8', fontSize: 12 },
    labelBgStyle: { fill: 'transparent' }
  },
  {
    id: 'e9',
    source: 'switch',
    sourceHandle: '1',
    target: 'email2',
    type: 'smoothstep',
    style: { stroke: '#475569', strokeWidth: 2 }
  },
  {
    id: 'e10',
    source: 'switch',
    sourceHandle: '2',
    target: 'email3',
    type: 'smoothstep',
    style: { stroke: '#475569', strokeWidth: 2 }
  },
];

export function WorkflowDemo() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => ({
    triggerNode: TriggerNode,
    agentNode: AgentNode,
    resourceNode: ResourceNode,
    actionNode: ActionNode,
    switchNode: SwitchNode
  }), []);

  return (
    <div className="w-full h-[600px] bg-[#0f1115] rounded-3xl border border-white/10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] overflow-hidden relative">
      
      {/* Editor Header */}
      <div className="absolute top-0 left-0 w-full h-14 bg-[#1a1d21] border-b border-white/5 flex items-center justify-center gap-2 z-10">
        <button className="px-4 py-1.5 bg-[#2d3036] text-white text-sm font-medium rounded-lg shadow-sm">Editor</button>
        <button className="px-4 py-1.5 text-slate-400 hover:text-white text-sm font-medium rounded-lg transition-colors">Executions</button>
        <button className="px-4 py-1.5 text-slate-400 hover:text-white text-sm font-medium rounded-lg transition-colors">Evaluations</button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2, minZoom: 0.1, maxZoom: 1 }}
        className="pt-14"
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
      >
        <Background color="#2a2e33" gap={20} size={2} />
      </ReactFlow>

      {/* Floating Action Button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-4">
        <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg flex items-center gap-2 transition-colors">
          <Zap className="w-5 h-5" />
          Execute workflow
        </button>
      </div>
      
      {/* Success Toast */}
      <div className="absolute bottom-6 right-6 z-10 bg-[#1a1d21] border border-emerald-500/30 p-4 rounded-2xl shadow-xl flex items-start gap-3">
        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
        <div>
          <p className="text-white font-bold text-sm">Workflow executed successfully</p>
        </div>
      </div>
    </div>
  );
}
