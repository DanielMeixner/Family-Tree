import React, { useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";

const nodeWidth = 180;
const nodeHeight = 60;

function getLayoutedElements(nodes, edges, direction = "TB") {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x, y },
      targetPosition: direction === "TB" ? "top" : "left",
      sourcePosition: direction === "TB" ? "bottom" : "right",
    };
  });
}

function buildGraph(data) {
  const nodes = data.map((person) => ({
    id: person.id,
    data: {
      label: `${person.name} ${person.familyname}`,
      gender: person.gender,
      dob: person.dob,
      dod: person.dod,
    },
    type: "default",
    position: { x: 0, y: 0 },
  }));
  const edges = [];
  data.forEach((person) => {
    if (person.parent1) {
      edges.push({ id: `${person.parent1}->${person.id}`, source: person.parent1, target: person.id });
    }
    if (person.parent2) {
      edges.push({ id: `${person.parent2}->${person.id}`, source: person.parent2, target: person.id });
    }
  });
  const layoutedNodes = getLayoutedElements(nodes, edges);
  return { nodes: layoutedNodes, edges };
}

export default function Family-Tree({ data }) {
  const { nodes, edges } = useMemo(() => buildGraph(data), [data]);
  if (!data.length) return null;
  return (
    <div style={{ width: "100%", height: "600px", background: "#f9f9f9" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}
