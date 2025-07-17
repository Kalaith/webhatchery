import type { 
  GameStateResponse, 
  PlaceMonsterRequest, 
  PlaceMonsterResponse,
  AddRoomRequest,
  AddRoomResponse,
  InitializeGameResponse
} from './types';

class ApiClient {
  private baseUrl = 'http://localhost:8000/api';
  private sessionId = this.generateSessionId();

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': this.sessionId,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async initializeGame(): Promise<InitializeGameResponse> {
    return this.request<InitializeGameResponse>('/game/initialize');
  }

  async getGameState(): Promise<GameStateResponse> {
    return this.request<GameStateResponse>('/game/state');
  }

  async placeMonster(request: PlaceMonsterRequest): Promise<PlaceMonsterResponse> {
    return this.request<PlaceMonsterResponse>('/game/place-monster', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async addRoom(request: AddRoomRequest): Promise<AddRoomResponse> {
    return this.request<AddRoomResponse>('/dungeon/add-room', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export const apiClient = new ApiClient();