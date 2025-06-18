// State Management System
class MemeState {
    constructor() {
        this.state = {
            image: null,
            textOverlays: [],
            selectedTextOverlay: null,
            isDragging: false,
            dragOffset: { x: 0, y: 0 },
            textCounter: 0,
            isLoading: false,
            error: null
        };
        
        this.listeners = new Map();
    }

    // Get current state
    getState() {
        return { ...this.state };
    }    // Update state and notify listeners
    setState(updates) {
        const prevState = { ...this.state };
        this.state = { ...this.state, ...updates };
        
        // Notify all listeners of state change
        for (const [key, callback] of this.listeners) {
            callback(this.state, prevState);
        }
    }

    // Alias for setState to maintain compatibility
    update(updates) {
        this.setState(updates);
    }

    // Subscribe to state changes
    subscribe(key, callback) {
        this.listeners.set(key, callback);
        return () => this.listeners.delete(key);
    }    // Specific state getters
    getImage() {
        return this.state.image;
    }

    getTextOverlays() {
        return [...this.state.textOverlays];
    }

    getSelectedTextOverlay() {
        return this.state.selectedTextOverlay;
    }

    isDraggingText() {
        return this.state.isDragging;
    }    // Specific state setters
    setImage(image) {
        this.setState({ image });
    }

    addTextOverlay(overlay) {
        const textOverlays = [...this.state.textOverlays, overlay];
        this.setState({ 
            textOverlays, 
            textCounter: this.state.textCounter + 1,
            selectedTextOverlay: overlay 
        });
    }

    removeTextOverlay(overlay) {
        const textOverlays = this.state.textOverlays.filter(item => item !== overlay);
        const selectedTextOverlay = this.state.selectedTextOverlay === overlay ? null : this.state.selectedTextOverlay;
        this.setState({ textOverlays, selectedTextOverlay });
    }

    selectTextOverlay(overlay) {
        this.setState({ selectedTextOverlay: overlay });
    }

    clearAllTextOverlays() {
        this.setState({ 
            textOverlays: [], 
            selectedTextOverlay: null,
            textCounter: 0 
        });
    }

    setDragging(isDragging, dragOffset = { x: 0, y: 0 }) {
        this.setState({ isDragging, dragOffset });
    }

    setLoading(isLoading) {
        this.setState({ isLoading });
    }

    setError(error) {
        this.setState({ error });
    }    clearError() {
        this.setState({ error: null });
    }
}

// Export singleton instance
window.memeState = window.memeState || new MemeState();
export default window.memeState;
