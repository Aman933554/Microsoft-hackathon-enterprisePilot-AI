"use client";

import React, { useMemo, useEffect, useState, useRef } from 'react';
import {
  ReactFlow,
  Background,
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
  Bot, 
  Sparkles, 
  Database, 
  Calculator, 
  FileSpreadsheet, 
  GitBranch, 
  Mail, 
  CheckCircle2, 
  Zap,
  ClipboardList,
  User
} from 'lucide-react';

const BaseNode = ({ children, selected, className = "", borderColor = "border-slate-700" }: any) => (
  <div className={`relative bg-[#1e2330] rounded-xl border-2 ${selected ? 'border-blue-500' : borderColor} p-4 shadow-xl min-w-[180px] flex flex-col items-center justify-center gap-3 transition-colors duration-500 ${className}`}>
    {children}
  </div>
);

const TriggerNode = ({ data, selected }: any) => (
  <BaseNode selected={selected} borderColor="border-[#10b981]">
    <div className="absolute -top-3 -left-3 bg-[#f97316] w-6 h-6 rounded-md flex items-center justify-center z-10">
      <Zap className="w-4 h-4 text-white" />
    </div>
    <div className="bg-[#0ea5e9]/20 p-3 rounded-xl">
      <ClipboardList className="w-8 h-8 text-[#0ea5e9]" />
    </div>
    <div className="text-white font-semibold text-sm">{data.label}</div>
    <div className="absolute -bottom-2 -right-2 bg-[#10b981] w-5 h-5 rounded-full flex items-center justify-center z-10">
      <CheckCircle2 className="w-3 h-3 text-white" />
    </div>
    <Handle type="source" position={Position.Right} className="w-2 h-2 bg-slate-500 border-none" />
  </BaseNode>
);

const AiAgentNode = ({ data, selected }: any) => (
  <div className={`relative bg-[#1e2330] rounded-2xl border-2 ${selected ? 'border-blue-500' : 'border-[#10b981]'} shadow-xl min-w-[280px]`}>
    <div className="flex items-center justify-center gap-3 p-4">
      <div className="bg-white/10 p-2 rounded-lg">
        <Bot className="w-6 h-6 text-white" />
      </div>
      <div className="text-white font-bold text-lg">{data.label}</div>
    </div>

    
    <Handle type="target" position={Position.Left} className="w-2 h-2 bg-slate-500 border-none" style={{ top: '35px' }} />
    <Handle type="source" position={Position.Right} className="w-2 h-2 bg-slate-500 border-none" style={{ top: '35px' }} />
    
    {/* Bottom handles for tools */}
    <Handle type="target" id="chat_model" position={Position.Bottom} className="w-2 h-2 bg-slate-500 border-none" style={{ left: '20%' }} />
    <Handle type="target" id="memory" position={Position.Bottom} className="w-2 h-2 bg-slate-500 border-none" style={{ left: '50%' }} />
    <Handle type="target" id="tool" position={Position.Bottom} className="w-2 h-2 bg-slate-500 border-none" style={{ left: '80%' }} />
    
    <div className="absolute -bottom-6 left-[10%] text-[10px] text-slate-400 font-semibold whitespace-nowrap">Chat Model</div>
    <div className="absolute -bottom-6 left-[42%] text-[10px] text-slate-400 font-semibold whitespace-nowrap">Memory</div>
    <div className="absolute -bottom-6 left-[78%] text-[10px] text-slate-400 font-semibold whitespace-nowrap">Tool</div>
    
    <div className="absolute -bottom-2 -right-2 bg-[#10b981] w-5 h-5 rounded-full flex items-center justify-center z-10">
      <CheckCircle2 className="w-3 h-3 text-white" />
    </div>
  </div>
);

const ApprovalNode = ({ data, selected }: any) => (
  <BaseNode selected={selected} borderColor={data.success ? 'border-[#10b981]' : data.waiting ? 'border-amber-500' : 'border-slate-700'}>
    <div className={`absolute -top-3 -left-3 w-6 h-6 rounded-md flex items-center justify-center z-10 ${data.waiting ? 'bg-amber-500 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)]' : data.success ? 'bg-[#10b981]' : 'bg-slate-700'}`}>
      <User className="w-4 h-4 text-white" />
    </div>
    <div className={`${data.waiting ? 'bg-amber-500/20' : data.success ? 'bg-[#10b981]/20' : 'bg-slate-700/20'} p-3 rounded-xl transition-colors duration-300`}>
      <User className={`w-8 h-8 ${data.waiting ? 'text-amber-500' : data.success ? 'text-[#10b981]' : 'text-slate-400'}`} />
    </div>
    <div className="text-white font-semibold text-sm text-center">{data.label}</div>
    {data.waiting && (
       <div className="flex gap-2 mt-2">
         <button onClick={data.onApprove} className="bg-[#10b981] hover:bg-[#059669] text-white text-[10px] px-3 py-1.5 rounded-md font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all active:scale-95 cursor-pointer z-50">Approve</button>
       </div>
    )}
    
    <Handle type="target" position={Position.Left} className="w-2 h-2 bg-slate-500 border-none" />
    <Handle type="source" position={Position.Right} className="w-2 h-2 bg-slate-500 border-none" />
    
    {data.success && (
      <div className="absolute -bottom-2 -right-2 bg-[#10b981] w-5 h-5 rounded-full flex items-center justify-center z-10 animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="w-3 h-3 text-white" />
      </div>
    )}
  </BaseNode>
);

const ComponentNode = ({ data }: any) => {
  const Icon = data.icon;
  return (
    <div className={`relative flex flex-col items-center justify-center`}>
      <Handle type="source" position={Position.Top} className="w-2 h-2 bg-slate-500 border-none" />
      <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center bg-[#1e2330] z-10`} style={{ borderColor: data.color }}>
        <Icon className="w-8 h-8" style={{ color: data.color }} />
      </div>
      <div className="text-white font-semibold text-xs mt-2 text-center max-w-[100px]">{data.label}</div>
      {data.items && <div className="text-slate-400 text-[10px] mt-1">{data.items}</div>}
    </div>
  );
};

const ActionNode = ({ data, selected }: any) => {
  const Icon = data.icon;
  return (
    <BaseNode selected={selected} borderColor={data.success ? 'border-[#10b981]' : 'border-slate-700'}>
      <div className="bg-[#3b82f6]/20 p-3 rounded-xl">
        <Icon className="w-8 h-8 text-[#3b82f6]" />
      </div>
      <div className="text-white font-semibold text-sm text-center">{data.label}</div>
      <div className="text-slate-400 text-xs">{data.sublabel}</div>
      
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-slate-500 border-none" />
      <Handle type="source" id="right" position={Position.Right} className="w-2 h-2 bg-slate-500 border-none" />
      {data.hasBottomOutput && (
        <Handle type="source" id="bottom" position={Position.Bottom} className="w-2 h-2 bg-slate-500 border-none" />
      )}
      
      {data.success && (
        <div className="absolute -bottom-2 -right-2 bg-[#10b981] w-5 h-5 rounded-full flex items-center justify-center z-10 animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="w-3 h-3 text-white" />
        </div>
      )}
    </BaseNode>
  );
};

const SwitchNode = ({ data, selected }: any) => (
  <BaseNode selected={selected} borderColor="border-[#10b981]" className="!p-0 overflow-hidden min-h-[140px]">
    <div className="p-4 flex flex-col items-center gap-2 mt-2">
      <div className="bg-[#8b5cf6]/20 p-3 rounded-xl">
        <GitBranch className="w-8 h-8 text-[#8b5cf6]" />
      </div>
      <div className="text-white font-semibold text-sm">{data.label}</div>
      <div className="text-slate-400 text-xs mb-2">{data.sublabel}</div>
    </div>
    
    <Handle type="target" position={Position.Left} className="w-2 h-2 bg-slate-500 border-none" />
    
    <Handle type="source" id="out-0" position={Position.Right} style={{ top: '35%' }} className="w-2 h-2 bg-slate-500 border-none" />
    <span className="absolute text-[10px] text-slate-400" style={{ right: '12px', top: '31%' }}>0</span>
    <Handle type="source" id="out-1" position={Position.Right} style={{ top: '55%' }} className="w-2 h-2 bg-slate-500 border-none" />
    <span className="absolute text-[10px] text-slate-400" style={{ right: '12px', top: '51%' }}>1</span>
    <Handle type="source" id="out-2" position={Position.Right} style={{ top: '75%' }} className="w-2 h-2 bg-slate-500 border-none" />
    <span className="absolute text-[10px] text-slate-400" style={{ right: '12px', top: '71%' }}>2</span>

    <div className="absolute -bottom-2 -right-2 bg-[#10b981] w-5 h-5 rounded-full flex items-center justify-center z-10">
      <CheckCircle2 className="w-3 h-3 text-white" />
    </div>
  </BaseNode>
);

const StatusNode = ({ data }: any) => (
  <div className={`bg-[#1e2330] rounded-xl border ${data.success ? 'border-[#10b981]' : 'border-slate-700'} px-6 py-4 flex items-center justify-center gap-3 transition-colors duration-500`}>
    <CheckCircle2 className={`w-5 h-5 ${data.success ? 'text-[#10b981]' : 'text-slate-600'}`} />
    <span className={`font-semibold text-sm ${data.success ? 'text-white' : 'text-slate-500'}`}>{data.label}</span>
  </div>
);

const edgeAnimatedGreen = {
  animated: true,
  style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5,5' },
};

const edgeAnimatedGray = {
  animated: true,
  style: { stroke: '#64748b', strokeWidth: 2, strokeDasharray: '5,5' },
};

const edgeSolidGray = {
  animated: false,
  style: { stroke: '#64748b', strokeWidth: 2 },
};

const initialNodes: Node[] = [
  {
    id: 'trigger',
    type: 'triggerNode',
    position: { x: -200, y: 50 },
    data: { label: 'On form submission' }
  },
  {
    id: 'ai-agent',
    type: 'aiAgentNode',
    position: { x: 100, y: -50 },
    data: { label: 'AI Agent' }
  },
  {
    id: 'gemini',
    type: 'componentNode',
    position: { x: 0, y: 250 },
    data: { label: 'Google Gemini Chat Model', icon: Sparkles, color: '#10b981' }
  },
  {
    id: 'memory',
    type: 'componentNode',
    position: { x: 170, y: 250 },
    data: { label: 'Simple Memory', items: '2 items total', icon: Database, color: '#10b981' }
  },
  {
    id: 'calculator',
    type: 'componentNode',
    position: { x: 330, y: 250 },
    data: { label: 'Calculator', icon: Calculator, color: '#64748b' }
  },
  {
    id: 'human-approval',
    type: 'approvalNode',
    position: { x: 450, y: -50 },
    data: { label: 'Human Approval' }
  },
  {
    id: 'append-row',
    type: 'actionNode',
    position: { x: 750, y: -50 },
    data: { label: 'Append row in sheet', sublabel: 'append: sheet', icon: FileSpreadsheet, success: true, hasBottomOutput: true }
  },
  {
    id: 'switch',
    type: 'switchNode',
    position: { x: 750, y: 200 },
    data: { label: 'Switch', sublabel: 'mode: Rules' }
  },
  {
    id: 'send-message-0',
    type: 'actionNode',
    position: { x: 1050, y: -150 },
    data: { label: 'Send a message', sublabel: 'send: message', icon: Mail, success: true }
  },
  {
    id: 'send-message-1',
    type: 'actionNode',
    position: { x: 1050, y: 50 },
    data: { label: 'Send a message1', sublabel: 'send: message', icon: Mail }
  },
  {
    id: 'send-message-2',
    type: 'actionNode',
    position: { x: 1050, y: 250 },
    data: { label: 'Send a message2', sublabel: 'send: message', icon: Mail }
  },
  {
    id: 'success',
    type: 'statusNode',
    position: { x: 950, y: 450 },
    data: { label: 'Workflow executed successfully' }
  }
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'trigger', target: 'ai-agent', type: 'default', ...edgeAnimatedGreen, label: '1 item', labelStyle: { fill: '#10b981', fontSize: 12, fontWeight: 'bold' }, labelBgStyle: { fill: 'transparent' } },
  
  { id: 'e2', source: 'gemini', target: 'ai-agent', targetHandle: 'chat_model', type: 'default', ...edgeAnimatedGreen, label: '1 item', labelStyle: { fill: '#10b981', fontSize: 12, fontWeight: 'bold' }, labelBgStyle: { fill: 'transparent' } },
  { id: 'e3', source: 'memory', target: 'ai-agent', targetHandle: 'memory', type: 'default', ...edgeAnimatedGreen },
  { id: 'e4', source: 'calculator', target: 'ai-agent', targetHandle: 'tool', type: 'default', ...edgeAnimatedGray },
  
  { id: 'e5', source: 'ai-agent', target: 'human-approval', type: 'default', ...edgeAnimatedGreen, label: '1 item', labelStyle: { fill: '#10b981', fontSize: 12, fontWeight: 'bold' }, labelBgStyle: { fill: 'transparent' } },
  { id: 'e5a', source: 'human-approval', target: 'append-row', type: 'default', ...edgeAnimatedGreen, label: '1 item', labelStyle: { fill: '#10b981', fontSize: 12, fontWeight: 'bold' }, labelBgStyle: { fill: 'transparent' } },
  
  { id: 'e6', source: 'append-row', target: 'send-message-0', sourceHandle: 'right', type: 'default', ...edgeAnimatedGreen, label: '1 item', labelStyle: { fill: '#10b981', fontSize: 12, fontWeight: 'bold' }, labelBgStyle: { fill: 'transparent' } },
  { id: 'e7', source: 'append-row', target: 'switch', sourceHandle: 'bottom', type: 'step', ...edgeAnimatedGreen, label: '1 item', labelStyle: { fill: '#10b981', fontSize: 12, fontWeight: 'bold' }, labelBgStyle: { fill: 'transparent' } },
  
  { id: 'e8', source: 'switch', target: 'send-message-1', sourceHandle: 'out-1', type: 'step', ...edgeSolidGray },
  { id: 'e9', source: 'switch', target: 'send-message-2', sourceHandle: 'out-2', type: 'step', ...edgeSolidGray },
];

const baseNodes = initialNodes.map(n => ({
  ...n,
  data: { ...n.data, success: false, waiting: false }
}));

const baseEdges = initialEdges.map(e => ({
  ...e,
  ...edgeSolidGray,
  label: undefined,
}));

export function AiAgentDemo() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const stepRef = useRef(0);
  const isApprovedRef = useRef(false);

  useEffect(() => {
    // Initialize nodes with onApprove callback
    setNodes(baseNodes.map(n => 
      n.id === 'human-approval' 
        ? { ...n, data: { ...n.data, onApprove: () => { isApprovedRef.current = true; } } }
        : n
    ));
    setEdges(baseEdges);

    const interval = setInterval(() => {
      let currentStep = stepRef.current;
      
      // Step 4 is Human Approval - wait until approved
      if (currentStep === 4 && !isApprovedRef.current) {
        setNodes(nds => nds.map(n => 
          n.id === 'human-approval' 
            ? { ...n, data: { ...n.data, waiting: true, success: false } } 
            : n
        ));
        return; // Pause here
      }
      
      currentStep = (currentStep + 1) % 10; // Increased to 10 steps due to the extra approval node
      if (currentStep === 0) {
        isApprovedRef.current = false; // Reset approval for the next loop
      }
      stepRef.current = currentStep;
      
      let newNodes = [...baseNodes].map(n => 
        n.id === 'human-approval' 
          ? { ...n, data: { ...n.data, onApprove: () => { isApprovedRef.current = true; } } }
          : n
      );
      let newEdges = [...baseEdges];
      
      if (currentStep >= 1) {
        newEdges = newEdges.map(e => e.id === 'e1' ? { ...e, ...edgeAnimatedGreen, label: '1 item', labelStyle: { fill: '#10b981', fontSize: 12, fontWeight: 'bold' }, labelBgStyle: { fill: 'transparent' } } : e);
      }
      if (currentStep >= 2) {
        newEdges = newEdges.map(e => (e.id === 'e2' || e.id === 'e3') ? { ...e, ...edgeAnimatedGreen, label: '1 item', labelStyle: { fill: '#10b981', fontSize: 12, fontWeight: 'bold' }, labelBgStyle: { fill: 'transparent' } } : e);
      }
      if (currentStep >= 3) {
        newEdges = newEdges.map(e => e.id === 'e5' ? { ...e, ...edgeAnimatedGreen, label: '1 item', labelStyle: { fill: '#10b981', fontSize: 12, fontWeight: 'bold' }, labelBgStyle: { fill: 'transparent' } } : e);
      }
      if (currentStep >= 4) {
        // Here it's approved because we passed the wait condition
        newNodes = newNodes.map(n => n.id === 'human-approval' ? { ...n, data: { ...n.data, waiting: false, success: true } } : n);
      }
      if (currentStep >= 5) {
        newEdges = newEdges.map(e => e.id === 'e5a' ? { ...e, ...edgeAnimatedGreen, label: '1 item', labelStyle: { fill: '#10b981', fontSize: 12, fontWeight: 'bold' }, labelBgStyle: { fill: 'transparent' } } : e);
      }
      if (currentStep >= 6) {
        newNodes = newNodes.map(n => n.id === 'append-row' ? { ...n, data: { ...n.data, success: true } } : n);
      }
      if (currentStep >= 7) {
        newEdges = newEdges.map(e => (e.id === 'e6' || e.id === 'e7') ? { ...e, ...edgeAnimatedGreen, label: '1 item', labelStyle: { fill: '#10b981', fontSize: 12, fontWeight: 'bold' }, labelBgStyle: { fill: 'transparent' } } : e);
      }
      if (currentStep >= 8) {
        newNodes = newNodes.map(n => n.id === 'send-message-0' ? { ...n, data: { ...n.data, success: true } } : n);
      }
      if (currentStep >= 9) {
        newNodes = newNodes.map(n => n.id === 'success' ? { ...n, data: { ...n.data, success: true } } : n);
      }
      
      setNodes(newNodes);
      setEdges(newEdges);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  const nodeTypes = useMemo(() => ({
    triggerNode: TriggerNode,
    aiAgentNode: AiAgentNode,
    componentNode: ComponentNode,
    actionNode: ActionNode,
    switchNode: SwitchNode,
    statusNode: StatusNode,
    approvalNode: ApprovalNode
  }), []);

  return (
    <div className="w-full max-w-6xl mx-auto overflow-hidden relative z-10 h-[500px] sm:h-[600px] rounded-2xl border border-slate-800 bg-[#0f1115] shadow-2xl">

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.1, minZoom: 0.1, maxZoom: 1.5 }}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
      >
        <Background color="#333" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
