import React, { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { GAME_DATA } from '../../data/gameData';
import type { GameNode, Owner } from '../../types/game';

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { nodes, selectedNode, selectNode } = useGameStore(state => ({
    nodes: state.nodes,
    selectedNode: state.selectedNode,
    selectNode: state.selectNode
  }));

  const getNodeColor = (node: GameNode): string => {
    const ownerColors: Record<Owner, string> = {
      player: '#4CAF50',
      enemy: '#F44336', 
      neutral: '#9E9E9E'
    };
    return ownerColors[node.owner];
  };

  const drawConnections = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    nodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const connectedNode = nodes.find(n => n.id === connectionId);
        if (connectedNode) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.stroke();
        }
      });
    });
  }, [nodes]);

  const drawNodes = useCallback((ctx: CanvasRenderingContext2D) => {
    nodes.forEach(node => {
      const nodeData = GAME_DATA.nodeTypes[node.type];
      const isSelected = selectedNode === node.id;
      
      // Draw node circle
      ctx.fillStyle = getNodeColor(node);
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw selection ring
      if (isSelected) {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
        ctx.stroke();
      }
      
      // Draw node icon
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(nodeData.icon, node.x, node.y);
      
      // Draw star level
      ctx.font = '12px Arial';
      ctx.fillStyle = '#FFD700';
      const stars = '★'.repeat(node.starLevel);
      ctx.fillText(stars, node.x, node.y - 35);
      
      // Draw garrison value
      ctx.font = '10px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(node.garrison.toString(), node.x, node.y + 35);
    });
  }, [nodes, selectedNode]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections first (so they appear behind nodes)
    drawConnections(ctx);
    
    // Draw nodes
    drawNodes(ctx);
  }, [drawConnections, drawNodes]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Find clicked node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      return distance <= 25; // Node radius + selection buffer
    });
    
    if (clickedNode) {
      selectNode(selectedNode === clickedNode.id ? null : clickedNode.id);
    } else {
      selectNode(null);
    }
  }, [nodes, selectedNode, selectNode]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className="map-container">
      <canvas 
        ref={canvasRef}
        width={800} 
        height={600}
        className="game-canvas"
        onClick={handleCanvasClick}
      />
      <div className="map-controls">
        <button className="btn btn--sm">🔍+</button>
        <button className="btn btn--sm">🔍-</button>
      </div>
    </div>
  );
};
