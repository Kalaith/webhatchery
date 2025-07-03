import type { PersonNameResult, PeopleParams, Option } from '../types';

export type { PeopleParams };

export async function fetchPeopleNames(params: PeopleParams): Promise<PersonNameResult[]> {
  const query = new URLSearchParams({
    count: params.count.toString(),
    gender: params.gender,
    culture: params.culture,
    method: params.method,
    type: params.type,
    period: params.period,
    excludeReal: params.excludeReal ? '1' : '0',
  });
  const res = await fetch(`api/generate_name.php?${query.toString()}`);
  if (!res.ok) throw new Error('API error');
  const data = await res.json();

  return data.names;

}

export interface PlaceParams {
  count: number;
  genre: string;
  location_type: string;
  tone: string;
  climate: string;
  size: string;
}

export async function fetchPlaceNames(params: PlaceParams): Promise<string[]> {
  const query = new URLSearchParams({
    count: params.count.toString(),
    genre: params.genre,
    location_type: params.location_type,
    tone: params.tone,
    climate: params.climate,
    size: params.size,
  });
  const res = await fetch(`api/generate_place.php?${query.toString()}`);
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  return data.names || [];
}

export async function fetchEventNames(params: { count: number; type: string; theme: string; tone: string; }): Promise<string[]> {
  const query = new URLSearchParams({
    count: params.count.toString(),
    type: params.type,
    theme: params.theme,
    tone: params.tone,
  });
  const res = await fetch(`api/generate_event.php?${query.toString()}`);
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  return data.names || [];
}

export interface TitleParams {
  count: number;
  type: string;
  genre: string;
  tone: string;
  keywords: string;
  setting: string;
  gender: string;
  race: string;
  species: string;
}

export async function fetchTitleNames(params: TitleParams): Promise<string[]> {
  const query = new URLSearchParams({
    count: params.count.toString(),
    type: params.type,
    genre: params.genre,
    tone: params.tone,
    keywords: params.keywords,
    setting: params.setting,
    gender: params.gender,
    race: params.race,
    species: params.species,
  });
  const res = await fetch(`api/generate_title.php?${query.toString()}`);
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  return data.titles || [];
}

export async function fetchBatchResults(params: { count: number; types: string[]; }): Promise<Record<string, string[]>> {
  const query = new URLSearchParams({
    count: params.count.toString(),
  });
  params.types.forEach(type => query.append('types[]', type));
  const res = await fetch(`api/generate_batch.php?${query.toString()}`);
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function fetchSelectOptions(field: string): Promise<Option[]> {
  const res = await fetch(`api/options.php?field=${encodeURIComponent(field)}`);
  if (!res.ok) throw new Error('Failed to fetch options');
  return res.json();
} 