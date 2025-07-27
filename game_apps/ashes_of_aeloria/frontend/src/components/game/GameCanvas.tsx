import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { GAME_DATA } from '../../data/gameData';
import type { GameNode, Owner } from '../../types/game';

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const nodes = useGameStore(state => state.nodes);
  const selectedNode = useGameStore(state => state.selectedNode);
  const selectNode = useGameStore(state => state.selectNode);

  // Update canvas size based on container
  const updateCanvasSize = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;
      setCanvasSize({ width, height });
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

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
    
    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scale to fit nodes in canvas
    const padding = 50;
    const maxX = Math.max(...nodes.map(n => n.x)) + padding;
    const maxY = Math.max(...nodes.map(n => n.y)) + padding;
    const minX = Math.min(...nodes.map(n => n.x)) - padding;
    const minY = Math.min(...nodes.map(n => n.y)) - padding;
    
    const scaleX = canvas.width / (maxX - minX);
    const scaleY = canvas.height / (maxY - minY);
    const calculatedScale = Math.min(scaleX, scaleY, 1) * scale;
    
    // Center the map
    const offsetX = (canvas.width - (maxX - minX) * calculatedScale) / 2 - minX * calculatedScale;
    const offsetY = (canvas.height - (maxY - minY) * calculatedScale) / 2 - minY * calculatedScale;
    
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(calculatedScale, calculatedScale);
    
    // Draw connections first (so they appear behind nodes)
    drawConnections(ctx);
    
    // Draw nodes
    drawNodes(ctx);
    
    ctx.restore();
  }, [drawConnections, drawNodes, canvasSize, scale, nodes]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = event.clientX - rect.left;
    const clientY = event.clientY - rect.top;
    
    // Calculate the same scale and offset as used in render
    const padding = 50;
    const maxX = Math.max(...nodes.map(n => n.x)) + padding;
    const maxY = Math.max(...nodes.map(n => n.y)) + padding;
    const minX = Math.min(...nodes.map(n => n.x)) - padding;
    const minY = Math.min(...nodes.map(n => n.y)) - padding;
    
    const scaleX = canvas.width / (maxX - minX);
    const scaleY = canvas.height / (maxY - minY);
    const calculatedScale = Math.min(scaleX, scaleY, 1) * scale;
    
    const offsetX = (canvas.width - (maxX - minX) * calculatedScale) / 2 - minX * calculatedScale;
    const offsetY = (canvas.height - (maxY - minY) * calculatedScale) / 2 - minY * calculatedScale;
    
    // Transform click coordinates back to world space
    const worldX = (clientX - offsetX) / calculatedScale;
    const worldY = (clientY - offsetY) / calculatedScale;
    
    // Find clicked node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(worldX - node.x, 2) + Math.pow(worldY - node.y, 2));
      return distance <= 25; // Node radius + selection buffer
    });
    
    if (clickedNode) {
      selectNode(selectedNode === clickedNode.id ? null : clickedNode.id);
    } else {
      selectNode(null);
    }
  }, [nodes, selectedNode, selectNode, scale]);

  useEffect(() => {
    render();
  }, [render]);

  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.3));
  const handleResetZoom = () => setScale(1);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700"
    >
      <canvas 
        ref={canvasRef}
        className="w-full h-full cursor-pointer touch-manipulation"
        onClick={handleCanvasClick}
        style={{ display: 'block' }}
      />
      
      {/* Mobile-friendly zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 lg:flex-row lg:gap-2">
        <button 
          onClick={handleZoomOut}
          className="bg-black bg-opacity-70 text-white p-2 lg:p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-lg lg:text-xl"
          aria-label="Zoom out"
        >
          🔍-
        </button>
        <button 
          onClick={handleResetZoom}
          className="bg-black bg-opacity-70 text-white p-2 lg:p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-sm lg:text-base"
          aria-label="Reset zoom"
        >
          ⌂
        </button>
        <button 
          onClick={handleZoomIn}
          className="bg-black bg-opacity-70 text-white p-2 lg:p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-lg lg:text-xl"
          aria-label="Zoom in"
        >
          🔍+
        </button>
      </div>
      
      {/* Map legend for mobile */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg shadow-lg lg:hidden">
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Player</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Enemy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Neutral</span>
          </div>
        </div>
      </div>
    </div>
  );
};
