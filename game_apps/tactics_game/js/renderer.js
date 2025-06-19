// Rendering System - Handles all canvas drawing operations
import { CONFIG } from './config.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Set canvas size based on config
        this.canvas.width = CONFIG.gridWidth * CONFIG.cellSize;
        this.canvas.height = CONFIG.gridHeight * CONFIG.cellSize;
    }
    
    render(gameState) {
        this.clearCanvas();
        this.drawGrid();
        this.drawHighlights(gameState);
        this.drawUnits(gameState.units);
        if (gameState.selectedUnit) {
            this.drawSelection(gameState.selectedUnit);
        }
    }
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= CONFIG.gridWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * CONFIG.cellSize, 0);
            this.ctx.lineTo(x * CONFIG.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= CONFIG.gridHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * CONFIG.cellSize);
            this.ctx.lineTo(this.canvas.width, y * CONFIG.cellSize);
            this.ctx.stroke();
        }
    }
    
    drawHighlights(gameState) {
        // Movement highlights
        gameState.movementHighlights.forEach(pos => {
            const x = pos.x * CONFIG.cellSize;
            const y = pos.y * CONFIG.cellSize;
            
            this.ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';
            this.ctx.fillRect(x, y, CONFIG.cellSize, CONFIG.cellSize);
            
            this.ctx.strokeStyle = '#0096FF';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x + 1, y + 1, CONFIG.cellSize - 2, CONFIG.cellSize - 2);
        });
        
        // Attack highlights
        gameState.attackHighlights.forEach(pos => {
            const x = pos.x * CONFIG.cellSize;
            const y = pos.y * CONFIG.cellSize;
            
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            this.ctx.fillRect(x, y, CONFIG.cellSize, CONFIG.cellSize);
            
            this.ctx.strokeStyle = '#FF4444';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x + 1, y + 1, CONFIG.cellSize - 2, CONFIG.cellSize - 2);
        });
    }
    
    drawUnits(units) {
        units.forEach(unit => {
            if (unit.hp <= 0) return;
            
            const x = unit.x * CONFIG.cellSize;
            const y = unit.y * CONFIG.cellSize;
            
            // Unit background
            this.ctx.fillStyle = unit.color;
            this.ctx.fillRect(x + 4, y + 4, CONFIG.cellSize - 8, CONFIG.cellSize - 8);
            
            // Unit border
            this.ctx.strokeStyle = unit.faction === 'player' ? '#333' : '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x + 4, y + 4, CONFIG.cellSize - 8, CONFIG.cellSize - 8);
            
            // Weapon symbol
            this.ctx.fillStyle = 'white';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            let symbol = '?';
            if (unit.weapon === 'Sword') symbol = '⚔️';
            else if (unit.weapon === 'Axe') symbol = '🪓';
            else if (unit.weapon === 'Lance') symbol = '🗡️';
            
            this.ctx.fillText(symbol, x + CONFIG.cellSize / 2, y + CONFIG.cellSize / 2);
            
            // HP bar
            this.drawHealthBar(unit, x, y);
            
            // Action indicators
            if (unit.moved || unit.acted) {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                this.ctx.fillRect(x, y, CONFIG.cellSize, CONFIG.cellSize);
            }
        });
    }
    
    drawHealthBar(unit, x, y) {
        const hpPercent = unit.hp / unit.maxHp;
        const barWidth = CONFIG.cellSize - 16;
        const barHeight = 4;
        
        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(x + 8, y + CONFIG.cellSize - 12, barWidth, barHeight);
        
        // Health bar
        this.ctx.fillStyle = hpPercent > 0.5 ? '#2ECC71' : hpPercent > 0.25 ? '#F39C12' : '#E74C3C';
        this.ctx.fillRect(x + 8, y + CONFIG.cellSize - 12, barWidth * hpPercent, barHeight);
    }
    
    drawSelection(unit) {
        const x = unit.x * CONFIG.cellSize;
        const y = unit.y * CONFIG.cellSize;
        
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(x + 2, y + 2, CONFIG.cellSize - 4, CONFIG.cellSize - 4);
        this.ctx.setLineDash([]);
    }
    
    getCanvasPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CONFIG.cellSize);
        const y = Math.floor((e.clientY - rect.top) / CONFIG.cellSize);
        return { x, y };
    }
}
