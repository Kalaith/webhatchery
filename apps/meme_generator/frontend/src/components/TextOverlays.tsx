import React from 'react';
import { TextOverlaysProps } from '../types';

const TextOverlays: React.FC<TextOverlaysProps> = ({
  overlays,
  onSelectOverlay,
  onUpdateOverlay,
  selectedOverlayId
}) => {  const handleMouseDown = (e: React.MouseEvent, id: number): void => {
    onSelectOverlay(id);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const overlay = overlays.find(o => o.id === id);
    
    if (!overlay) return;
    
    const startTop = overlay.position.top;
    const startLeft = overlay.position.left;

    // Get the container dimensions for percentage calculations
    const container = (e.target as Element).closest('.text-overlays')?.parentElement;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent): void => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      // Convert pixel deltas to percentage deltas
      const containerRect = container.getBoundingClientRect();
      const deltaXPercent = (deltaX / containerRect.width) * 100;
      const deltaYPercent = (deltaY / containerRect.height) * 100;
      
      onUpdateOverlay(id, {
        position: {
          top: Math.max(0, Math.min(100, startTop + deltaYPercent)),
          left: Math.max(0, Math.min(100, startLeft + deltaXPercent))
        }
      });
    };

    const handleMouseUp = (): void => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  return (
    <div className="text-overlays">
      {overlays.map((overlay) => (
        <div
          key={overlay.id}
          className={`text-overlay ${
            selectedOverlayId === overlay.id ? 'selected' : ''
          }`}          style={{
            top: `${overlay.position.top}%`,
            left: `${overlay.position.left}%`,
            fontFamily: overlay.font,
            fontSize: `${overlay.fontSize}px`,
            color: overlay.color,
          }}
          onMouseDown={(e) => handleMouseDown(e, overlay.id)}
          onClick={() => onSelectOverlay(overlay.id)}
        >
          {overlay.text}
        </div>
      ))}
    </div>
  );
};

export default TextOverlays;
