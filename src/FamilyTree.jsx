import React, { useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import CustomNode from "./CustomNode";

const nodeWidth = 220;
const nodeHeight = 140;

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

  // Calculate year-based Y positions
  const yearBasedPositions = calculateYearBasedPositions(nodes);

  return nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);
    const yearBasedY = yearBasedPositions[node.id];
    
    return {
      ...node,
      position: { 
        x, 
        y: yearBasedY !== undefined ? yearBasedY : y 
      },
      targetPosition: direction === "TB" ? "top" : "left",
      sourcePosition: direction === "TB" ? "bottom" : "right",
    };
  });
}

function calculateYearBasedPositions(nodes) {
  const positions = {};
  const pixelsPerYear = 50;
  
  // Extract birth years from nodes
  const birthYears = [];
  nodes.forEach(node => {
    const dob = node.data.dob;
    if (dob && dob.trim() !== '') {
      const year = parseInt(dob.split('-')[0], 10);
      if (!isNaN(year)) {
        birthYears.push(year);
      }
    }
  });
  
  // Find the earliest birth year as reference point
  const earliestYear = birthYears.length > 0 ? Math.min(...birthYears) : 1900;
  
  // Calculate Y positions based on birth years
  nodes.forEach(node => {
    const dob = node.data.dob;
    if (dob && dob.trim() !== '') {
      const year = parseInt(dob.split('-')[0], 10);
      if (!isNaN(year)) {
        positions[node.id] = (year - earliestYear) * pixelsPerYear;
      }
    }
  });
  
  return positions;
}

function buildGraph(data, settings) {
  // Create a map for quick lookup
  const personMap = new Map();
  data.forEach(person => {
    personMap.set(person.id, person);
  });

  const nodes = data.map((person) => ({
    id: person.id,
    data: {
      name: person.name,
      familyname: person.familyname,
      gender: person.gender,
      dob: person.dob,
      dod: person.dod,
      image: person.image // Support for future image field
    },
    type: "custom",
    position: { x: 0, y: 0 },
  }));
  
  const edges = [];
  data.forEach((person) => {
    if (person.parent1) {
      const parent1 = personMap.get(person.parent1);
      const isFather = parent1?.gender?.toLowerCase() === 'm';
      const isMotherRelationship = parent1?.gender?.toLowerCase() === 'f';
      
      edges.push({ 
        id: `${person.parent1}->${person.id}`, 
        source: person.parent1, 
        target: person.id,
        style: {
          stroke: isFather ? settings.colors.male : (isMotherRelationship ? settings.colors.female : settings.colors.neutral),
          strokeWidth: 3,
          strokeLinecap: 'round'
        },
        type: settings.edgeStyle || 'bezier',
        pathOptions: {
          curvature: settings.curveIntensity || 1.2
        }
      });
    }
    if (person.parent2) {
      const parent2 = personMap.get(person.parent2);
      const isFather = parent2?.gender?.toLowerCase() === 'm';
      const isMotherRelationship = parent2?.gender?.toLowerCase() === 'f';
      
      edges.push({ 
        id: `${person.parent2}->${person.id}`, 
        source: person.parent2, 
        target: person.id,
        style: {
          stroke: isFather ? settings.colors.male : (isMotherRelationship ? settings.colors.female : settings.colors.neutral),
          strokeWidth: 3,
          strokeLinecap: 'round'
        },
        type: settings.edgeStyle || 'bezier',
        pathOptions: {
          curvature: settings.curveIntensity || 1.2
        }
      });
    }
  });
  
  const layoutedNodes = getLayoutedElements(nodes, edges);
  return { nodes: layoutedNodes, edges };
}

export default function FamilyTree({ data, settings = {} }) {
  // Default settings
  const defaultSettings = {
    colors: {
      male: '#2196F3',
      female: '#E91E63',
      neutral: '#9E9E9E'
    },
    showDeathIcons: true,
    showBirthIcons: true,
    showDeceasedBanner: true,
    fontSize: 14,
    edgeStyle: 'bezier',
    curveIntensity: 1.2
  };
  
  const mergedSettings = { ...defaultSettings, ...settings };
  
  const { nodes, edges } = useMemo(() => buildGraph(data, mergedSettings), [data, mergedSettings]);
  
  // Create a custom node component that receives settings
  const CustomNodeWithSettings = (props) => (
    <CustomNode {...props} settings={mergedSettings} />
  );
  
  // Define custom node types
  const nodeTypes = {
    custom: CustomNodeWithSettings
  };
  
  if (!data.length) return null;
  
  return (
    <div style={{ width: "100%", height: "600px", background: "#f9f9f9" }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        minZoom={0.1}
        maxZoom={2}
      >
        <MiniMap 
          nodeColor={(node) => {
            const gender = node.data.gender?.toLowerCase();
            switch (gender) {
              case 'm': return mergedSettings.colors.male;
              case 'f': return mergedSettings.colors.female;
              default: return mergedSettings.colors.neutral;
            }
          }}
        />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}
