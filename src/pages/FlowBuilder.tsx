import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from 'react-flow-renderer';
import Header from '../components/Layout/Header';
import FlowNodeEditor from '../components/FlowBuilder/FlowNodeEditor';
import { PlusIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 25 },
  },
];

const initialEdges: Edge[] = [];

const nodeTypes = {
  trigger: 'Trigger',
  condition: 'Condition',
  action: 'Action',
  delay: 'Delay',
  webhook: 'Webhook',
};

const FlowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isFlowActive, setIsFlowActive] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: 'default',
      data: { 
        label: nodeTypes[type as keyof typeof nodeTypes],
        nodeType: type,
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const updateNodeData = (nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  };

  const toggleFlow = () => {
    setIsFlowActive(!isFlowActive);
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header 
        title="Flow Builder" 
        subtitle="Create automated WhatsApp conversation flows" 
      />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {Object.entries(nodeTypes).map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => addNode(type)}
                  className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleFlow}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isFlowActive
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isFlowActive ? (
                <>
                  <PauseIcon className="h-4 w-4 mr-2" />
                  Pause Flow
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Activate Flow
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
          {/* Flow Canvas */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          </div>
          
          {/* Node Editor */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Node Editor</h3>
            {selectedNode ? (
              <FlowNodeEditor
                node={selectedNode}
                onUpdate={(data) => updateNodeData(selectedNode.id, data)}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Select a node to edit its properties</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder;