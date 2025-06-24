import React, { useState, useEffect } from 'react';
import { TextOverlayControlsProps, TextOverlay } from '../types';

const TextOverlayControls: React.FC<TextOverlayControlsProps> = ({ 
  onAddText, 
  onDeleteText, 
  selectedOverlay, 
  onUpdateSelectedText 
}) => {
  const [text, setText] = useState<string>('');
  const [font, setFont] = useState<string>('Impact, Arial Black, sans-serif');
  const [fontSize, setFontSize] = useState<number>(32);
  const [color, setColor] = useState<string>('#ffffff');

  const handleAddText = (): void => {
    if (text.trim()) {
      onAddText({ text, font, fontSize, color });
      setText('');
    }
  };

  const handleTextChange = (newText: string): void => {
    setText(newText);
    if (selectedOverlay && onUpdateSelectedText) {
      onUpdateSelectedText({ text: newText });
    }
  };

  const handleFontChange = (newFont: string): void => {
    setFont(newFont);
    if (selectedOverlay && onUpdateSelectedText) {
      onUpdateSelectedText({ font: newFont });
    }
  };

  const handleFontSizeChange = (newSize: number): void => {
    setFontSize(newSize);
    if (selectedOverlay && onUpdateSelectedText) {
      onUpdateSelectedText({ fontSize: newSize });
    }
  };

  const handleColorChange = (newColor: string): void => {
    setColor(newColor);
    if (selectedOverlay && onUpdateSelectedText) {
      onUpdateSelectedText({ color: newColor });
    }
  };

  useEffect(() => {
    if (selectedOverlay) {
      setText(selectedOverlay.text || '');
      setFont(selectedOverlay.font || 'Impact, Arial Black, sans-serif');
      setFontSize(selectedOverlay.fontSize || 32);
      setColor(selectedOverlay.color || '#ffffff');
    }
  }, [selectedOverlay]);

  return (
    <div className="tool-section">
      <h3 className="tool-title">✨ Text Overlay</h3>
      <button className="btn btn--primary btn--full-width" onClick={handleAddText}>
        Add Text
      </button>
      <div className="text-controls">
        <div className="form-group">
          <label className="form-label">Text Content</label>
          <input
            type="text"
            className="form-control"
            value={text}
            onChange={e => handleTextChange(e.target.value)}
            placeholder="Enter your meme text..."
          />
        </div>
        <div className="form-group">
          <label className="form-label">Font Style</label>
          <select
            className="form-control"
            value={font}
            onChange={e => handleFontChange(e.target.value)}
          >
            <option value="Impact, Arial Black, sans-serif">Impact (Classic)</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="Comic Sans MS, cursive">Comic Sans</option>
            <option value="Montserrat, sans-serif">Montserrat</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">
            Font Size: <span>{fontSize}px</span>
          </label>
          <input
            type="range"
            className="form-control"
            min="16"
            max="72"
            value={fontSize}
            onChange={e => handleFontSizeChange(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Text Color</label>
          <input
            type="color"
            className="form-control"
            value={color}
            onChange={e => handleColorChange(e.target.value)}
          />
        </div>
        {selectedOverlay && (
          <div className="form-group">
            <button className="btn btn--secondary btn--full-width" onClick={onDeleteText}>
              Delete Selected Text
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextOverlayControls;
