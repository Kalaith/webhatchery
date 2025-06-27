import { randomItem } from '../game/useGame';

export const fetchGameData = async () => {
  try {
    const [planetTypes, alienSpecies, terraformingTools, planetNames, alienSpeciesTypes] = await Promise.all([
      fetch('/mocks/planet_types.json').then(r => r.json()),
      fetch('/mocks/alien_species.json').then(r => r.json()),
      fetch('/mocks/terraforming_tools.json').then(r => r.json()),
      fetch('/mocks/planet_names.json').then(r => r.json()),
      fetch('/mocks/alien_species_types.json').then(r => r.json()),
    ]);

    const mappedAlienSpeciesTypes = alienSpeciesTypes.map((species: any) => ({
      name: `${randomItem(species.prefixes)} ${randomItem(species.suffixes)}`,
      description: species.desc,
      tempRange: species.temp,
      atmoRange: species.atmo,
      waterRange: species.water,
      gravRange: species.grav,
      radRange: species.rad,
      basePrice: Math.floor(Math.random() * 1000 + 500),
      color: randomItem(species.colors),
    }));

    return { planetTypes, alienSpecies, terraformingTools, planetNames, alienSpeciesTypes: mappedAlienSpeciesTypes };
  } catch (error) {
    console.error('Failed to fetch game data:', error);
    throw error;
  }
};
