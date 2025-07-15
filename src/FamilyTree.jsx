import React, { useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import CustomNode from "./CustomNode";

const nodeWidth = 220;
const nodeHeight = 140;

// Minimum spacing between nodes to prevent overlaps
const minHorizontalSpacing = 30;
const minVerticalSpacing = 20;

function detectCollisions(nodes) {
  const collisions = [];
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const node1 = nodes[i];
      const node2 = nodes[j];
      
      const dx = Math.abs(node1.position.x - node2.position.x);
      const dy = Math.abs(node1.position.y - node2.position.y);
      
      const minDistanceX = nodeWidth + minHorizontalSpacing;
      const minDistanceY = nodeHeight + minVerticalSpacing;
      
      if (dx < minDistanceX && dy < minDistanceY) {
        collisions.push([i, j]);
      }
    }
  }
  
  return collisions;
}

function resolveCollisions(nodes) {
  const resolvedNodes = [...nodes];
  let maxIterations = 50;
  let iterations = 0;
  
  while (iterations < maxIterations) {
    const collisions = detectCollisions(resolvedNodes);
    
    if (collisions.length === 0) break;
    
    // Group nodes by their year-based Y position to maintain generational layout
    const nodesByYear = {};
    resolvedNodes.forEach((node, index) => {
      const yearKey = Math.round(node.position.y / 50) * 50; // Group by 50px increments
      if (!nodesByYear[yearKey]) {
        nodesByYear[yearKey] = [];
      }
      nodesByYear[yearKey].push({ node, index });
    });
    
    // Resolve collisions within each year group
    Object.values(nodesByYear).forEach(yearGroup => {
      if (yearGroup.length > 1) {
        // Sort by X position
        yearGroup.sort((a, b) => a.node.position.x - b.node.position.x);
        
        // Adjust X positions to prevent overlaps
        let currentX = yearGroup[0].node.position.x;
        for (let i = 1; i < yearGroup.length; i++) {
          const prevNode = yearGroup[i - 1];
          const currentNode = yearGroup[i];
          const minRequiredX = prevNode.node.position.x + nodeWidth + minHorizontalSpacing;
          
          if (currentNode.node.position.x < minRequiredX) {
            resolvedNodes[currentNode.index] = {
              ...currentNode.node,
              position: {
                ...currentNode.node.position,
                x: minRequiredX
              }
            };
          }
        }
      }
    });
    
    iterations++;
  }
  
  return resolvedNodes;
}

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

  const layoutedNodes = nodes.map((node) => {
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

  // Resolve any overlapping nodes
  const resolvedNodes = resolveCollisions(layoutedNodes);
  
  return resolvedNodes;
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
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
        },
        type: settings.edgeStyle || 'bezier',
        pathOptions: {
          curvature: settings.curveIntensity || 1.5
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
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
        },
        type: settings.edgeStyle || 'bezier',
        pathOptions: {
          curvature: settings.curveIntensity || 1.5
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
    curveIntensity: 1.5
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
