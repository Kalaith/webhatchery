// Species and generation data
const speciesData = {
  "Nekomimi": {
    "ears": "feline ears",
    "features": ["whiskers", "cat-like eyes"],
    "personality": ["curious", "playful", "agile"],
    "negative_prompt": "extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces"
  },
  "Inumimi": {
    "ears": "floppy ears",
    "features": ["loyal eyes", "dog-like features"],
    "personality": ["loyal", "dependable", "brave", "confident"],
    "negative_prompt": "extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces"
  },
  "Kitsunemimi": {
    "ears": "fox ears",
    "features": ["intelligent eyes", "fox-like features"],
    "personality": ["intelligent", "cunning", "scholarly", "thoughtful"],
    "negative_prompt": "multiple tails, kimono, fantasy effects, ornate style, glitch effects, malformed anatomy"
  },
  "Usagimimi": {
    "ears": "long rabbit ears",
    "features": ["large eyes", "rabbit-like features"],
    "personality": ["shy", "alert", "cautious", "timid", "focused"],
    "negative_prompt": "extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces"
  },
  "Ookami": {
    "ears": "wolf ears",
    "features": ["strong jawline", "wolf-like features"],
    "personality": ["strong", "confident", "assertive", "bold", "determined"],
    "negative_prompt": "extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces"
  },
  "Nezumimi": {
    "ears": "round mouse ears",
    "features": ["small frame", "mouse-like features"],
    "personality": ["resourceful", "sly", "serious", "clever"],
    "negative_prompt": "extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces"
  },
  "Ryūjin": {
    "ears": "small horns",
    "features": ["scales on cheeks", "dragon features", "faint scales"],
    "personality": ["calm", "mysterious", "powerful"],
    "negative_prompt": "extra limbs, wings, tails, surreal features, blurry textures, ornate armor, fantasy background, glitch effects, malformed faces"
  },
  "Tanukimimi": {
    "ears": "rounded tanuki ears",
    "features": ["fluffy features", "tanuki-like traits"],
    "personality": ["playful", "mischievous", "cheerful"],
    "negative_prompt": "extra limbs, exaggerated tail, ornate clothing, fantasy elements, glitch effects, malformed faces"
  },
  "Torimimi": {
    "ears": "feathered ear tufts",
    "features": ["sharp eyes", "feathery bangs", "bird-like features"],
    "personality": ["sharp", "alert", "focused"],
    "negative_prompt": "wings, flying pose, feathers on arms, fantasy background, glitch effects, malformed faces"
  },
  "Kumamimi": {
    "ears": "round bear ears",
    "features": ["strong build", "bear-like features"],
    "personality": ["reliable", "calm", "strong", "steady"],
    "negative_prompt": "hulking build, bear paws, fur coat, fantasy setting, glitch effects, malformed faces"
  },
  "Caprimimi": {
    "ears": "small curved horns",
    "features": ["goat-like features", "spiraling horns"],
    "personality": ["calm", "clever", "thoughtful"],
    "negative_prompt": "extra limbs, ornate horn patterns, fantasy background, glitch effects, malformed faces"
  },
  "Ushimimi": {
    "ears": "small cow horns",
    "features": ["cow-like features", "curved horns"],
    "personality": ["calm", "steady", "reliable"],
    "negative_prompt": "udder, tail, cow spots on skin, fantasy setting, glitch effects, malformed faces"
  },
  "Hebimimi": {
    "ears": "no visible ears",
    "features": ["slitted eyes", "snake scale patterns", "serpentine features"],
    "personality": ["mysterious", "calm", "elegant"],
    "negative_prompt": "snakes instead of hair, full body snake tail, fantasy background, ornate clothing, glitch effects, malformed anatomy"
  },
  "Shikamimi": {
    "ears": "small antlers",
    "features": ["deer-like features", "gentle eyes"],
    "personality": ["gentle", "shy", "graceful"],
    "negative_prompt": "deer legs, fantasy setting, elaborate clothing, glitch effects, malformed anatomy"
  },
  "Koumori": {
    "ears": "pointed bat ears",
    "features": ["wide eyes", "bat-like features"],
    "personality": ["mysterious", "alert", "nocturnal"],
    "negative_prompt": "bat wings, oversized ears, full fantasy costume, glitch effects, malformed anatomy"
  },
  "Umamimi": {
    "ears": "upright horse ears",
    "features": ["horse-like features", "steady eyes"],
    "personality": ["calm", "steady", "reliable"],
    "negative_prompt": "horse nose, tail in frame, racing outfit, glitch effects, malformed anatomy"
  }
};

const hairColors = ["black", "brown", "blonde", "red", "silver", "grey", "white", "orange", "blue", "green", "yellow", "emerald", "chestnut", "ash-blonde"];
const hairStyles = ["short", "long", "shoulder-length", "medium-length", "twin-tails", "ponytail", "tied back", "cropped", "fluffy", "messy", "shaggy"];
const eyeColors = ["brown", "blue", "green", "yellow", "golden", "silver", "glowing"];
const clothingItems = ["plain shirt", "simple dress", "hoodie", "tank top", "tunic", "utility vest", "t-shirt", "short-sleeve shirt", "sleeveless top"];
const backgrounds = ["neutral background", "light gradient background", "clean background", "minimal background", "soft background"];

// Global counter for unique IDs
let promptIdCounter = 1000;

// DOM elements
let speciesSelect, promptCountSelect, generateBtn, jsonOutput, copyBtn, clearBtn, btnText, loadingSpinner, copyFeedback;

// Initialize DOM elements
function initializeElements() {
  speciesSelect = document.getElementById('species-select');
  promptCountSelect = document.getElementById('prompt-count');
  generateBtn = document.getElementById('generate-btn');
  jsonOutput = document.getElementById('json-output');
  copyBtn = document.getElementById('copy-btn');
  clearBtn = document.getElementById('clear-btn');
  btnText = document.getElementById('btn-text');
  loadingSpinner = document.getElementById('loading-spinner');
  copyFeedback = document.getElementById('copy-feedback');
}

// Utility functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateUniqueId() {
  return promptIdCounter++;
}

function getRandomSpecies() {
  const speciesKeys = Object.keys(speciesData);
  return getRandomElement(speciesKeys);
}

// Main generation function
function generatePrompt(selectedSpecies = null) {
  try {
    const species = selectedSpecies === 'random' || !selectedSpecies ? getRandomSpecies() : selectedSpecies;
    const speciesInfo = speciesData[species];
    
    if (!speciesInfo) {
      throw new Error(`Unknown species: ${species}`);
    }
    
    // Generate random characteristics
    const hairColor = getRandomElement(hairColors);
    const hairStyle = getRandomElement(hairStyles);
    const eyeColor = getRandomElement(eyeColors);
    const clothing = getRandomElement(clothingItems);
    const background = getRandomElement(backgrounds);
    const personality = getRandomElements(speciesInfo.personality, Math.floor(Math.random() * 2) + 1);
    const features = getRandomElements(speciesInfo.features, Math.floor(Math.random() * speciesInfo.features.length) + 1);
    
    // Create unique ID and title
    const id = generateUniqueId();
    const title = `${species} Girl ${id - 999}`;
    
    // Build description
    const personalityStr = personality.join(' and ');
    const featuresStr = features.join(', ');
    
    const description = `An anime-style portrait of a ${personalityStr} ${species.toLowerCase()} girl with ${hairColor} ${hairStyle} hair and ${eyeColor} eyes. She has ${speciesInfo.ears} and ${featuresStr}. She's wearing a ${clothing} against a ${background}. The art style is clean and modern anime with soft lighting and detailed character design.`;
    
    return {
      id: id,
      title: title,
      description: description,
      negative_prompt: speciesInfo.negative_prompt,
      tags: ["animals", "portrait", "anime"]
    };
  } catch (error) {
    console.error('Error in generatePrompt:', error);
    throw error;
  }
}

// Generate multiple prompts
function generatePrompts(count, species) {
  try {
    const prompts = [];
    for (let i = 0; i < count; i++) {
      prompts.push(generatePrompt(species));
    }
    return {
      image_prompts: prompts
    };
  } catch (error) {
    console.error('Error in generatePrompts:', error);
    throw error;
  }
}

// Show loading state
function showLoading() {
  if (btnText && loadingSpinner && generateBtn) {
    btnText.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');
    generateBtn.disabled = true;
  }
}

// Hide loading state
function hideLoading() {
  if (btnText && loadingSpinner && generateBtn) {
    btnText.classList.remove('hidden');
    loadingSpinner.classList.add('hidden');
    generateBtn.disabled = false;
  }
}

// Update button states
function updateButtonStates() {
  if (jsonOutput && copyBtn && clearBtn) {
    const hasContent = jsonOutput.value.trim() !== '';
    copyBtn.disabled = !hasContent;
    clearBtn.disabled = !hasContent;
  }
}

// Copy to clipboard
async function copyToClipboard() {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(jsonOutput.value);
    } else {
      // Fallback for older browsers
      jsonOutput.select();
      document.execCommand('copy');
    }
    showCopyFeedback();
  } catch (err) {
    console.error('Copy failed:', err);
    // Try fallback method
    try {
      jsonOutput.select();
      document.execCommand('copy');
      showCopyFeedback();
    } catch (fallbackErr) {
      console.error('Fallback copy also failed:', fallbackErr);
    }
  }
}

// Show copy feedback
function showCopyFeedback() {
  if (copyFeedback) {
    copyFeedback.classList.remove('hidden');
    setTimeout(() => {
      copyFeedback.classList.add('hidden');
    }, 2000);
  }
}

// Clear output
function clearOutput() {
  if (jsonOutput) {
    jsonOutput.value = '';
    updateButtonStates();
  }
}

// Main generate function
function handleGenerate() {
  if (!speciesSelect || !promptCountSelect || !jsonOutput) {
    console.error('Required elements not found');
    return;
  }

  const selectedSpecies = speciesSelect.value;
  const promptCount = parseInt(promptCountSelect.value);
  
  showLoading();
  
  // Use setTimeout to ensure loading state is visible
  setTimeout(() => {
    try {
      const result = generatePrompts(promptCount, selectedSpecies);
      const formattedJson = JSON.stringify(result, null, 2);
      
      jsonOutput.value = formattedJson;
      updateButtonStates();
    } catch (error) {
      console.error('Error generating prompts:', error);
      jsonOutput.value = `Error generating prompts: ${error.message}`;
      updateButtonStates();
    } finally {
      hideLoading();
    }
  }, 300);
}

// Initialize the application
function initializeApp() {
  initializeElements();
  
  // Event listeners
  if (generateBtn) {
    generateBtn.addEventListener('click', handleGenerate);
  }
  
  if (copyBtn) {
    copyBtn.addEventListener('click', copyToClipboard);
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', clearOutput);
  }

  // Handle Enter key in selects
  if (speciesSelect) {
    speciesSelect.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleGenerate();
      }
    });
  }

  if (promptCountSelect) {
    promptCountSelect.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleGenerate();
      }
    });
  }

  // Initialize button states
  updateButtonStates();
  
  console.log('Anime Animal Girl Prompt Generator initialized successfully!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM is already loaded
  initializeApp();
}