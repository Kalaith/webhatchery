export interface Stats {
  tension: number;
  morale: number;
  gold: number;
  supplies: string;
  reputation: string;
}

export async function fetchStats(): Promise<Stats> {
  const stats = await import('../../../data/stats.json');
  return stats.default as Stats;
}
