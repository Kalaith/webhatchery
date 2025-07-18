import type { 
  GameStateResponse, 
  PlaceMonsterRequest, 
  PlaceMonsterResponse,
  UnlockMonsterSpeciesRequest,
  UnlockMonsterSpeciesResponse,
  GainMonsterExperienceRequest,
  GainMonsterExperienceResponse,
  GetAvailableMonstersResponse,
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

  async unlockMonsterSpecies(request: UnlockMonsterSpeciesRequest): Promise<UnlockMonsterSpeciesResponse> {
    return this.request<UnlockMonsterSpeciesResponse>('/game/unlock-species', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async gainMonsterExperience(request: GainMonsterExperienceRequest): Promise<GainMonsterExperienceResponse> {
    return this.request<GainMonsterExperienceResponse>('/game/gain-experience', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getAvailableMonsters(): Promise<GetAvailableMonstersResponse> {
    return this.request<GetAvailableMonstersResponse>('/game/available-monsters');
  }

  // Data endpoints
  async getGameConstants(): Promise<any> {
    return this.request<any>('/data/game-constants');
  }

  async getMonsterTypes(): Promise<any> {
    return this.request<any>('/data/monster-types');
  }

  async getMonsterTraits(): Promise<any> {
    return this.request<any>('/data/monster-traits');
  }

  async getEquipmentData(): Promise<any> {
    return this.request<any>('/data/equipment');
  }

  async getFloorScaling(): Promise<any> {
    return this.request<any>('/data/floor-scaling');
  }
}

export const apiClient = new ApiClient();