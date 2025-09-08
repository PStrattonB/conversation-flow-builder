import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import type {Node, Edge, Connection} from "reactflow";
import "reactflow/dist/style.css";
import yaml from "js-yaml";

import type{ FlowNode, FlowEdge, ConversationFlow } from "./types/flow";

export default function App() {
  const initialNodes: Node[] = [
    {
      id: "1",
      position: { x: 250, y: 0 },
      data: {
        label: "Start: User utterance",
        utterance: "",
        expected: { intent: "", key: "", bot: "" },
      },
      type: "default",
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Add new node
  const addNode = () => {
    const newId = (nodes.length + 1).toString();
    const newNode: Node = {
      id: newId,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: `Node ${newId}`,
        utterance: "",
        expected: { intent: "", key: "", bot: "" },
      },
      type: "default",
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Connect nodes
  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // Select a node
  const onNodeClick = (_: any, node: Node) => {
    setSelectedNode(node);
  };

  // Generic update helper
  const updateNodeData = (field: string, value: string) => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? {
              ...n,
              data: {
                ...n.data,
                [field]: value,
                expected: {
                  intent: n.data.expected?.intent ?? "",
                  key: n.data.expected?.key ?? "",
                  bot: n.data.expected?.bot ?? "",
                },
              } as FlowNode, // Ensure type matches FlowNode
            }
          : n
      ) as Node<FlowNode>[]
    );

    setSelectedNode((prev) =>
      prev ? { ...prev, data: { ...prev.data, [field]: value } } : prev
    );
  };

  const updateExpected = (field: "intent" | "key" | "bot", value: string) => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? {
              ...n,
              data: {
                ...n.data,
                expected: {
                  intent: field === "intent" ? value : n.data.expected?.intent ?? "",
                  key: field === "key" ? value : n.data.expected?.key ?? "",
                  bot: field === "bot" ? value : n.data.expected?.bot ?? "",
                },
              },
            }
          : n
      )
    );

    setSelectedNode((prev) =>
      prev
        ? {
            ...prev,
            data: {
              ...prev.data,
              expected: { ...prev.data.expected, [field]: value },
            },
          }
        : prev
    );
  };

  // Export to YAML
  const exportToYAML = () => {
    const flow: ConversationFlow = {
      nodes: nodes.map((n) => ({
        id: n.id,
        label: n.data.label,
        utterance: n.data.utterance,
        expected: n.data.expected,
      })),
      edges: edges.map((e) => ({ source: e.source, target: e.target })),
    };

    const yamlStr = yaml.dump(flow);
    console.log(yamlStr);
    alert("Exported! Check console for YAML output.");
  };

return (
  <div style={{ height: "100vh", width: "100vw" }}>
    {/* Flow Canvas fills entire background */}
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      fitView
      style={{ height: "100%", width: "100%" }}
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>

    {/* Side Panel floats on top, fixed to right side */}
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "300px",
        height: "100%",
        background: "#fff",
        borderLeft: "1px solid #ccc",
        padding: "1rem",
        overflowY: "auto",
        zIndex: 1000,
      }}
    >
      <button onClick={addNode}>➕ Add Node</button>
      <button onClick={exportToYAML} style={{ marginLeft: "1rem" }}>
        ⬇️ Export to YAML
      </button>

      <div style={{ marginTop: "1rem" }}>
        {selectedNode ? (
          <>
            <h3>Edit Node {selectedNode.id}</h3>

            <label>
              Label:
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => updateNodeData("label", e.target.value)}
              />
            </label>

            <br />
            <label>
              Utterance:
              <input
                type="text"
                value={selectedNode.data.utterance || ""}
                onChange={(e) => updateNodeData("utterance", e.target.value)}
              />
            </label>

            <h4>Expected Response</h4>
            <label>
              Intent:
              <input
                type="text"
                value={selectedNode.data.expected?.intent || ""}
                onChange={(e) => updateExpected("intent", e.target.value)}
              />
            </label>

            <br />
            <label>
              Key:
              <input
                type="text"
                value={selectedNode.data.expected?.key || ""}
                onChange={(e) => updateExpected("key", e.target.value)}
              />
            </label>

            <br />
            <label>
              Bot Reply:
              <input
                type="text"
                value={selectedNode.data.expected?.bot || ""}
                onChange={(e) => updateExpected("bot", e.target.value)}
              />
            </label>
          </>
        ) : (
          <p>Select a node to edit</p>
        )}
      </div>
    </div>
  </div>
);
}
