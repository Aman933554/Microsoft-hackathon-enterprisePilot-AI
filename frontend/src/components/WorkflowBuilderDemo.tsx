"use client";

import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Handle,
  Position,
  BaseEdge,
  getBezierPath,
  EdgeLabelRenderer,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// SVG Icons
const Icons = {
  FileText: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>,
  Bot: () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>,
  Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  Database: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>,
  Calculator: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>,
  Sheet: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>,
  GitBranch: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>,
  Mail: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Slack: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M13 2v7h7"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M10 9h4"/></svg>,
  Bell: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Lightning: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Play: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Save: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  ArrowLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  DotsVertical: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>,
};

// Custom Edge with Label
const CustomEdge = ({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, style, markerEnd
}: any) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: '#0a0a0a',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: 10,
              color: '#888',
              pointerEvents: 'all',
              zIndex: 10,
            }}
            className="nodrag nopan"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

// Node wrapper with glow and styles
const BaseNode = ({ children, color, isExecuting, hasExecuted }: any) => {
  return (
    <div className={`relative rounded-2xl bg-[#0f111a] border border-[#2a2d3d] p-4 min-w-[200px] transition-all duration-300 ${isExecuting ? 'scale-105 shadow-2xl' : ''}`}>
      {/* Glow Effect */}
      <div 
        className="absolute -inset-[1px] rounded-2xl blur-[4px] opacity-30 pointer-events-none transition-all duration-500" 
        style={{ 
          background: `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
          opacity: isExecuting ? 0.8 : hasExecuted ? 0.4 : 0.2,
          boxShadow: isExecuting ? `0 0 30px ${color}80` : 'none'
        }} 
      />
      
      {/* Node Content */}
      <div className="relative z-10 flex items-center gap-4">
        {children}
      </div>

      {/* Execution Status Badge */}
      {hasExecuted && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-[#0f111a] z-20">
          <Icons.Check />
        </div>
      )}
    </div>
  );
};

// Custom Node Types
const TriggerNode = ({ data, isConnectable }: any) => (
  <BaseNode color="#3b82f6" isExecuting={data.isExecuting} hasExecuted={data.hasExecuted}>
    <div className="absolute -top-3 -left-3 w-7 h-7 bg-amber-500/20 text-amber-500 border border-amber-500/50 rounded-full flex items-center justify-center z-20">
      <Icons.Lightning />
    </div>
    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
      <Icons.FileText />
    </div>
    <div>
      <div className="font-bold text-white text-sm">1. Form Submitted</div>
      <div className="text-xs text-slate-400">Webhook</div>
    </div>
    <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-2 h-2 bg-slate-500" />
  </BaseNode>
);

const AgentNode = ({ data, isConnectable }: any) => (
  <BaseNode color="#a855f7" isExecuting={data.isExecuting} hasExecuted={data.hasExecuted}>
    <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-2 h-2 bg-slate-500" />
    
    <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
      <Icons.Bot />
    </div>
    <div>
      <div className="font-bold text-white text-base">2. AI Agent</div>
      <div className="text-xs text-slate-400">Main Agent</div>
    </div>
    
    <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-2 h-2 bg-slate-500" />
    
    {/* Bottom Handles for Resources */}
    <div className="absolute -bottom-6 left-0 w-full flex justify-between px-4 z-20">
      <div className="flex flex-col items-center">
        <Handle type="source" position={Position.Bottom} id="model" className="w-2 h-2 bg-blue-500 !relative !transform-none" />
        <span className="text-[9px] text-blue-400 mt-1 font-medium">Model</span>
      </div>
      <div className="flex flex-col items-center">
        <Handle type="source" position={Position.Bottom} id="memory" className="w-2 h-2 bg-emerald-500 !relative !transform-none" />
        <span className="text-[9px] text-emerald-400 mt-1 font-medium">Memory</span>
      </div>
      <div className="flex flex-col items-center">
        <Handle type="source" position={Position.Bottom} id="tool" className="w-2 h-2 bg-amber-500 !relative !transform-none" />
        <span className="text-[9px] text-amber-500 mt-1 font-medium">Tool</span>
      </div>
    </div>
  </BaseNode>
);

const ResourceNode = ({ data, isConnectable }: any) => {
  const configs: any = {
    model: { title: "3. Google Gemini", sub: "Chat Model", color: "#3b82f6", icon: <Icons.Sparkles /> },
    memory: { title: "4. Simple Memory", sub: "Memory", color: "#10b981", icon: <Icons.Database /> },
    tool: { title: "5. Calculator", sub: "Tool", color: "#f59e0b", icon: <Icons.Calculator /> },
  };
  const config = configs[data.type || 'model'];
  
  return (
    <div className={`relative rounded-2xl bg-[#0f111a] border border-[#2a2d3d] p-4 w-[140px] flex flex-col items-center text-center transition-all duration-300 ${data.isExecuting ? 'scale-105' : ''}`}>
      <div className="absolute -inset-[1px] rounded-2xl blur-[4px] opacity-20 pointer-events-none transition-all duration-500" style={{ background: config.color, opacity: data.isExecuting ? 0.6 : data.hasExecuted ? 0.3 : 0.1, boxShadow: data.isExecuting ? `0 0 30px ${config.color}80` : 'none' }} />
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-2 h-2 z-20" style={{ backgroundColor: config.color }} />
      
      <div className="relative z-10 w-10 h-10 rounded-xl mb-3 flex items-center justify-center border" style={{ backgroundColor: `${config.color}20`, color: config.color, borderColor: `${config.color}30` }}>
        {config.icon}
      </div>
      <div className="relative z-10 font-bold text-white text-[11px] leading-tight mb-1">{config.title}</div>
      <div className="relative z-10 text-[10px] text-slate-500">{config.sub}</div>

      {data.hasExecuted && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-[#0f111a] z-20">
          <Icons.Check />
        </div>
      )}
    </div>
  );
};

const ActionNode = ({ data, isConnectable }: any) => {
  const configs: any = {
    sheet: { title: "6. Append row", sub: "in sheet", color: "#10b981", icon: <Icons.Sheet /> },
    email: { title: "8. Send Email", sub: "send: message", color: "#a855f7", icon: <Icons.Mail /> },
    slack: { title: "9. Send Slack", sub: "send: message", color: "#ec4899", icon: <Icons.Slack /> },
    notify: { title: "10. Notify", sub: "send: notification", color: "#f59e0b", icon: <Icons.Bell /> },
  };
  const config = configs[data.type];

  return (
    <BaseNode color={config.color} isExecuting={data.isExecuting} hasExecuted={data.hasExecuted}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-2 h-2 bg-slate-500" />
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: config.color, color: '#fff' }}>
        {config.icon}
      </div>
      <div>
        <div className="font-bold text-white text-[13px] leading-tight">{config.title}</div>
        <div className="text-[10px] text-slate-400">{config.sub}</div>
      </div>
      {data.type === 'sheet' && (
        <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-2 h-2 bg-slate-500" />
      )}
    </BaseNode>
  );
};

const LogicNode = ({ data, isConnectable }: any) => (
  <BaseNode color="#a855f7" isExecuting={data.isExecuting} hasExecuted={data.hasExecuted}>
    <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-2 h-2 bg-slate-500" />
    <Handle type="source" position={Position.Top} isConnectable={isConnectable} className="w-2 h-2 bg-slate-500 opacity-0" /> {/* dummy for routing */}
    
    <div className="flex items-center gap-3 pr-4">
      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
        <Icons.GitBranch />
      </div>
      <div>
        <div className="font-bold text-white text-[13px]">7. Switch</div>
        <div className="text-[10px] text-slate-400">mode: Rules</div>
      </div>
    </div>

    {/* Multiple Outputs */}
    <div className="absolute -right-3 top-0 h-full flex flex-col justify-evenly py-2 z-20">
      <div className="flex items-center gap-1">
        <span className="text-[9px] text-slate-400">1</span>
        <Handle type="source" position={Position.Right} id="out1" className="!relative !transform-none w-2 h-2 bg-slate-500" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[9px] text-slate-400">2</span>
        <Handle type="source" position={Position.Right} id="out2" className="!relative !transform-none w-2 h-2 bg-slate-500" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[9px] text-slate-400">3</span>
        <Handle type="source" position={Position.Right} id="out3" className="!relative !transform-none w-2 h-2 bg-slate-500" />
      </div>
    </div>
  </BaseNode>
);

const nodeTypes = {
  triggerNode: TriggerNode,
  agentNode: AgentNode,
  resourceNode: ResourceNode,
  actionNode: ActionNode,
  logicNode: LogicNode,
};
const edgeTypes = {
  custom: CustomEdge,
};

// Initial Data
const initialNodes: Node[] = [
  { id: '1', type: 'triggerNode', position: { x: 50, y: 250 }, data: {} },
  { id: '2', type: 'agentNode', position: { x: 350, y: 220 }, data: {} },
  
  // Resources
  { id: '3', type: 'resourceNode', position: { x: 250, y: 450 }, data: { type: 'model' } },
  { id: '4', type: 'resourceNode', position: { x: 420, y: 450 }, data: { type: 'memory' } },
  { id: '5', type: 'resourceNode', position: { x: 580, y: 450 }, data: { type: 'tool' } },
  
  // Actions & Logic
  { id: '6', type: 'actionNode', position: { x: 650, y: 230 }, data: { type: 'sheet' } },
  { id: '7', type: 'logicNode', position: { x: 750, y: 380 }, data: {} },
  
  { id: '8', type: 'actionNode', position: { x: 1000, y: 200 }, data: { type: 'email' } },
  { id: '9', type: 'actionNode', position: { x: 1000, y: 320 }, data: { type: 'slack' } },
  { id: '10', type: 'actionNode', position: { x: 1000, y: 450 }, data: { type: 'notify' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'custom', animated: true, data: { label: '1 item' }, style: { stroke: '#475569', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', target: '3', sourceHandle: 'model', type: 'custom', animated: true, data: { label: 'Model' }, style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' } },
  { id: 'e2-4', source: '2', target: '4', sourceHandle: 'memory', type: 'custom', animated: true, data: { label: '2 items total' }, style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5,5' } },
  { id: 'e2-5', source: '2', target: '5', sourceHandle: 'tool', type: 'custom', animated: true, data: { label: 'Tool' }, style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5,5' } },
  
  { id: 'e2-6', source: '2', target: '6', type: 'custom', animated: true, data: { label: '1 item' }, style: { stroke: '#475569', strokeWidth: 2 } },
  
  { id: 'e6-7', source: '6', target: '7', type: 'custom', animated: true, data: { label: '1 item' }, style: { stroke: '#475569', strokeWidth: 2, strokeDasharray: '5,5' } },
  
  { id: 'e7-8', source: '7', target: '8', sourceHandle: 'out1', type: 'custom', animated: true, data: { label: '1 item' }, style: { stroke: '#475569', strokeWidth: 2 } },
  { id: 'e7-9', source: '7', target: '9', sourceHandle: 'out2', type: 'custom', animated: true, data: { label: '1 item' }, style: { stroke: '#475569', strokeWidth: 2 } },
  { id: 'e7-10', source: '7', target: '10', sourceHandle: 'out3', type: 'custom', animated: true, data: { label: '1 item' }, style: { stroke: '#475569', strokeWidth: 2 } },
];

export function WorkflowBuilderDemo() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isRunning, setIsRunning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const executeWorkflow = () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowSuccess(false);

    // Reset states
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, isExecuting: false, hasExecuted: false } })));
    setEdges(eds => eds.map(e => ({ ...e, style: { ...e.style, stroke: '#475569' } })));

    const sequence = [
      { nodes: ['1'], time: 500 },
      { nodes: ['2', '3', '4', '5'], time: 1500 },
      { nodes: ['6'], time: 2500 },
      { nodes: ['7'], time: 3500 },
      { nodes: ['8', '9', '10'], time: 4500 },
    ];

    sequence.forEach(({ nodes: targetNodes, time }, index) => {
      setTimeout(() => {
        setNodes(nds => nds.map(n => {
          if (targetNodes.includes(n.id)) return { ...n, data: { ...n.data, isExecuting: true, hasExecuted: false } };
          // Previous nodes finish execution
          if (index > 0 && sequence[index - 1].nodes.includes(n.id)) return { ...n, data: { ...n.data, isExecuting: false, hasExecuted: true } };
          return n;
        }));
        
        // Color active edges
        setEdges(eds => eds.map(e => {
          if (targetNodes.includes(e.target)) return { ...e, style: { ...e.style, stroke: '#a855f7' } };
          return e;
        }));
      }, time);
    });

    // Finish
    setTimeout(() => {
      setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, isExecuting: false, hasExecuted: true } })));
      setShowSuccess(true);
      setIsRunning(false);
    }, 6000);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)] bg-[#050505] relative flex flex-col h-[700px]">
      
      {/* Header UI */}
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a] z-10 relative">
        <div className="flex items-center gap-4">
          <button className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-400 transition-colors">
            <Icons.ArrowLeft />
          </button>
          <h2 className="font-bold text-white tracking-tight">AI Agent Workflow</h2>
          <div className="flex items-center gap-2 ml-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-medium text-emerald-400">Active</span>
          </div>
        </div>

        <div className="hidden md:flex items-center p-1 bg-[#151515] rounded-xl border border-white/5">
          <button className="px-6 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-medium text-sm">Editor</button>
          <button className="px-6 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors font-medium text-sm">Executions</button>
          <button className="px-6 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors font-medium text-sm">Evaluations</button>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Icons.Save /> <span className="hidden md:inline">Save</span>
          </button>
          <button className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg flex items-center justify-center transition-colors">
            <Icons.Play />
          </button>
          <button className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg flex items-center justify-center transition-colors">
            <Icons.DotsVertical />
          </button>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          className="dark"
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          panOnDrag={false}
          preventScrolling={false}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#222" />
        </ReactFlow>

        {/* Execute Button */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <button 
            onClick={executeWorkflow}
            disabled={isRunning}
            className={`px-8 py-4 rounded-xl font-bold text-white shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all flex items-center gap-2 ${
              isRunning ? 'bg-slate-700 cursor-not-allowed opacity-80' : 'bg-gradient-to-r from-orange-500 to-purple-600 hover:scale-105 active:scale-95'
            }`}
          >
            <Icons.Lightning />
            {isRunning ? 'Executing...' : 'Execute Workflow'}
          </button>
        </div>

        {/* Success Toast */}
        <div className={`absolute bottom-8 right-8 z-20 bg-[#151515] border border-emerald-500/30 p-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-500 ${
          showSuccess ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}>
          <div className="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/30">
            <Icons.Check />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Workflow executed successfully</div>
            <div className="text-xs text-slate-400">2.4s • 10 steps</div>
          </div>
        </div>
      </div>
    </div>
  );
}
