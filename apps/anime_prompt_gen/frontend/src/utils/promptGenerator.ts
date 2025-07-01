import { speciesData } from '../utils/speciesData';

const hairColors = ["black", "brown", "blonde", "red", "silver", "grey", "white", "orange", "blue", "green", "yellow", "emerald", "chestnut", "ash-blonde"];
const hairStyles = ["short", "long", "shoulder-length", "medium-length", "twin-tails", "ponytail", "tied back", "cropped", "fluffy", "messy", "shaggy"];
const eyeColors = ["brown", "blue", "green", "yellow", "golden", "silver", "glowing"];
const clothingItems = ["plain shirt", "simple dress", "hoodie", "tank top", "tunic", "utility vest", "t-shirt", "short-sleeve shirt", "sleeveless top"];
const backgrounds = ["neutral background", "light gradient background", "clean background", "minimal background", "soft background"];

export const generatePrompts = (count: number, species: string | null) => {
  const prompts = [];
  for (let i = 0; i < count; i++) {
    const selectedSpecies = species === 'random' ? getRandomSpecies() : species;

    if (!selectedSpecies) {
      throw new Error('Selected species is null or undefined');
    }

    const speciesInfo = speciesData[selectedSpecies as keyof typeof speciesData];

    const hairColor = getRandomElement(hairColors);
    const hairStyle = getRandomElement(hairStyles);
    const eyeColor = getRandomElement(eyeColors);
    const clothing = getRandomElement(clothingItems);
    const background = getRandomElement(backgrounds);
    const personality = getRandomElements(speciesInfo.personality, Math.floor(Math.random() * 2) + 1);
    const features = getRandomElements(speciesInfo.features, Math.floor(Math.random() * speciesInfo.features.length) + 1);

    const prompt = {
      id: generateUniqueId(),
      title: `${selectedSpecies} Character`,
      description: `An anime-style portrait of a ${personality.join(' and ')} ${selectedSpecies.toLowerCase()} girl with ${hairColor} ${hairStyle} hair and ${eyeColor} eyes. She has ${speciesInfo.ears} and ${features.join(', ')}. She's wearing a ${clothing} against a ${background}. The art style is clean and modern anime with soft lighting and detailed character design.`,
      negative_prompt: speciesInfo.negative_prompt,
      tags: [selectedSpecies, ...speciesInfo.personality],
    };
    prompts.push(prompt);
  }
  return prompts;
};

const getRandomElement = (array: string[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomElements = (array: string[], count: number) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomSpecies = () => {
  const speciesKeys = Object.keys(speciesData);
  return speciesKeys[Math.floor(Math.random() * speciesKeys.length)];
};

let promptIdCounter = 1000;
const generateUniqueId = () => {
  return promptIdCounter++;
};
