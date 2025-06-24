import type { NPC } from '../components/NPCList';

// Simulate an API call to fetch NPCs from the local JSON file
export async function fetchNPCs(): Promise<NPC[]> {
  // Use dynamic import to load the JSON file as a module
  const npcs = await import('../../../data/npcs.json');
  return npcs.default as NPC[];
}
