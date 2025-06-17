// Breeding Lab Module
import { visualTraits, defaultSelections } from '../data/visual-traits-data.js';

let breedingSuccessChart;

export function initBreedingLab() {
    const selectors = [
        'kaiju-name', 'title', 'body-shape', 'size-scale', 'skin-texture', 
        'appendages', 'head-type', 'tail-type', 'special-feature', 
        'battle-damage', 'color-palette', 'dynamic-pose', 'environment',
        'camera-angle', 'frame-composition'
    ];
    selectors.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', updatePrompt);
            if (element.tagName === 'INPUT') {
                element.addEventListener('input', updatePrompt);
            }
        }
    });
      const generateButton = document.getElementById('generate-button');
    if (generateButton) {
        generateButton.addEventListener('click', generateImage);
    }
    
    const randomizeButton = document.getElementById('randomize-button');
    if (randomizeButton) {
        randomizeButton.addEventListener('click', randomizeTraits);
    }
      // Setup breeding tab functionality
    setupBreedingTabs();
    
    // Populate dropdowns with trait data
    populateVisualTraits();
    
    updatePrompt();
    
    // Initialize breeding simulator
    const simulateButton = document.getElementById('simulate-breeding');
    const parentA = document.getElementById('parent-a');
    const parentB = document.getElementById('parent-b');
    
    if (simulateButton) simulateButton.addEventListener('click', simulateBreeding);
    if (parentA) parentA.addEventListener('change', updateBreedingSimulator);
    if (parentB) parentB.addEventListener('change', updateBreedingSimulator);
    
    updateBreedingSimulator();
}

function setupBreedingTabs() {
    const tabButtons = document.querySelectorAll('.breeding-tab-btn');
    const tabContents = document.querySelectorAll('.breeding-tab-content');
    
    // Initialize the first tab as active
    const firstTab = tabButtons[0];
    const firstTabContent = document.getElementById(`${firstTab.getAttribute('data-tab')}-tab`);
    
    if (firstTabContent) {
        firstTabContent.classList.add('active');
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update button states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update content visibility
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                }
            });
            
            // Initialize charts when costs tab is opened
            if (targetTab === 'costs' && !breedingSuccessChart) {
                setTimeout(() => createBreedingSuccessChart(), 100);
            }
        });
    });
}

function createBreedingSuccessChart() {
    const ctx = document.getElementById('breedingSuccessChart');
    if (!ctx) return;
    
    breedingSuccessChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Successful Breed', 'Failed Breed', 'Mutation Chance'],
            datasets: [{
                data: [75, 20, 5],
                backgroundColor: ['#10B981', '#EF4444', '#8B5CF6'],
                borderWidth: 2,
                borderColor: '#FFFFFF'
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

function updatePrompt() {
    const getValue = (id) => {
        const element = document.getElementById(id);
        return element ? element.value : '';
    };
    
    const kaijuName = getValue('kaiju-name') || 'Titanclaw';
    const title = getValue('title') || 'the Volcanic Behemoth';
    const bodyShape = getValue('body-shape') || 'Bulky, quadrupedal with tank-like stance';
    const sizeScale = getValue('size-scale') || 'Massive (50-100 meters) - Building crusher';
    const skinTexture = getValue('skin-texture') || 'Fractured rocky plates with glowing cracks';
    const appendages = getValue('appendages') || 'Massive clawed fists and obsidian spikes';
    const headType = getValue('head-type') || 'Dinosaur-like with reinforced skull, molten eyes';
    const tailType = getValue('tail-type') || 'Thick, segmented with spiked club end';
    const specialFeature = getValue('special-feature') || 'Glowing magma veins with volcanic emissions';
    const battleDamage = getValue('battle-damage') || 'Asymmetrical damage, shattered spikes, scarred eye';
    const colorPalette = getValue('color-palette') || 'Charcoal black, volcanic orange, deep reds';
    const dynamicPose = getValue('dynamic-pose') || 'Mid-roar, ground fracturing under weight';
    const environment = getValue('environment') || 'Destroyed cityscape with smoke and fire';

    // Generate detailed prompt
    const prompt = `"${kaijuName}, ${title}"

Core Concept:
${generateCoreConcept(kaijuName, title, bodyShape, specialFeature, sizeScale)}

Physical Description:

Body Shape & Size: ${bodyShape.toLowerCase()} - ${sizeScale.toLowerCase()}

Skin & Surface: ${skinTexture}, ${getTextureDetails(skinTexture)}

Distinctive Features: ${appendages}, ${getAppendageDetails(appendages)}

Head Design: ${headType}, ${getHeadDetails(headType)}

Tail Configuration: ${tailType}, ${getTailDetails(tailType)}

Key Features for Distinction:
${generateKeyFeatures(specialFeature, battleDamage)}

Mood & Atmosphere:

Color Palette: ${colorPalette} - ${getColorMood(colorPalette)}

Dynamic Pose: ${dynamicPose}, ${getPoseDetails(dynamicPose)}

Environment: ${environment}, ${getEnvironmentDetails(environment)}

Lighting & Effects: ${getLightingDescription(specialFeature, colorPalette)}

Art Direction Notes:
• High detail, cinematic quality
• Emphasis on scale and power
• Dramatic lighting and shadows
• Photorealistic with fantastical elements
• 4K resolution, professional concept art style`;

    const outputElement = document.getElementById('prompt-output');
    if (outputElement) {
        outputElement.textContent = prompt;
    }
}

function generateImage() {
    const imageResult = document.getElementById('image-result');
    const loadingSpinner = document.getElementById('loading-spinner');
    const imageContainer = document.getElementById('generated-image-container');
    
    imageResult.classList.remove('hidden');
    loadingSpinner.classList.remove('hidden');
    imageContainer.classList.add('hidden');

    setTimeout(() => {
        loadingSpinner.classList.add('hidden');
        imageContainer.classList.remove('hidden');
    }, 1500);
}

function updateBreedingSimulator() {
    const parentA = document.getElementById('parent-a').value;
    const parentB = document.getElementById('parent-b').value;
    
    // Basic compatibility check (element type must match)
    const isCompatible = parentA !== parentB; // Allow different types for interesting combinations
    document.getElementById('simulate-breeding').disabled = !isCompatible;
    
    const resultsContainer = document.getElementById('offspring-list');
    resultsContainer.innerHTML = ''; // Clear previous results
    
    if (isCompatible) {
        // Show preview message
        const previewItem = document.createElement('div');
        previewItem.className = 'p-2 bg-blue-100 rounded-lg text-blue-800';
        previewItem.innerText = 'Click "Simulate Breeding" to see possible offspring combinations.';
        resultsContainer.appendChild(previewItem);
    } else {
        const resultItem = document.createElement('div');
        resultItem.className = 'p-2 bg-red-100 rounded-lg text-red-800';
        resultItem.innerText = 'Cannot breed a Kaiju with itself. Please select different parents.';
        resultsContainer.appendChild(resultItem);
    }
}

function simulateBreeding() {
    const parentA = document.getElementById('parent-a').value;
    const parentB = document.getElementById('parent-b').value;
    
    const resultsContainer = document.getElementById('offspring-list');
    resultsContainer.innerHTML = ''; // Clear previous results
    
    // Simulate possible offspring
    for (let i = 0; i < 3; i++) {
        const offspringType = simulateOffspringType(parentA, parentB);
        const resultItem = document.createElement('div');
        resultItem.className = 'p-2 bg-gray-100 rounded-lg';
        resultItem.innerHTML = `
            <strong>Offspring ${i + 1}:</strong> ${offspringType.emoji} ${offspringType.type}<br>
            <small class="text-gray-600">HP: ${offspringType.hp}, Attack: ${offspringType.attack}, Defense: ${offspringType.defense}, Speed: ${offspringType.speed}</small>
        `;
        resultsContainer.appendChild(resultItem);
    }
}

function simulateOffspringType(parentA, parentB) {
    const kaijuTypes = [
        { type: 'Fire', emoji: '🔥' },
        { type: 'Water', emoji: '💧' },
        { type: 'Earth', emoji: '🌍' },
        { type: 'Electric', emoji: '⚡' },
        { type: 'Air', emoji: '💨' },
        { type: 'Ice', emoji: '❄️' },
        { type: 'Dark', emoji: '🌑' },
        { type: 'Light', emoji: '☀️' },
        { type: 'Poison', emoji: '☠️' },
        { type: 'Metal', emoji: '🔩' }
    ];
    
    // Basic random stats for offspring (50-150 range for variety)
    const baseStats = {
        hp: Math.floor(Math.random() * 100) + 50,
        attack: Math.floor(Math.random() * 100) + 50,
        defense: Math.floor(Math.random() * 100) + 50,
        speed: Math.floor(Math.random() * 100) + 50
    };
    
    // Inherit element type from parents (75% chance for one of the parent's types, 25% for hybrid/mutation)
    const parentAType = parentA;
    const parentBType = parentB;
    
    let inheritedType;
    const mutationChance = Math.random();
    
    if (mutationChance < 0.05) {
        // 5% chance for completely random mutation
        const randomType = kaijuTypes[Math.floor(Math.random() * kaijuTypes.length)];
        inheritedType = randomType;
    } else if (mutationChance < 0.25) {
        // 20% chance for hybrid naming
        const typeA = kaijuTypes.find(t => t.type.toLowerCase() === parentAType);
        const typeB = kaijuTypes.find(t => t.type.toLowerCase() === parentBType);
        inheritedType = {
            type: `${typeA.type}-${typeB.type} Hybrid`,
            emoji: `${typeA.emoji}${typeB.emoji}`
        };
    } else {
        // 75% chance to inherit from one parent
        const inheritFromA = Math.random() < 0.5;
        const parentType = inheritFromA ? parentAType : parentBType;
        inheritedType = kaijuTypes.find(t => t.type.toLowerCase() === parentType);
    }
    
    return {
        emoji: inheritedType.emoji,
        type: inheritedType.type,
        ...baseStats
    };
}

function generateCoreConcept(name, title, bodyShape, specialFeature, sizeScale) {
    const concepts = {
        'Glowing magma veins with volcanic emissions': 'A massive, armor-plated kaiju with a volcanic rocky hide, glowing magma veins, and jagged obsidian spikes. It embodies raw power and tectonic fury, standing like a living mountain ready to erupt.',
        'Crackling electrical aura and storm clouds': 'A towering storm-bringer wreathed in crackling electricity, with metallic conductors and storm clouds swirling around its form. Lightning dances across its surface as it commands the very forces of nature.',
        'Aquatic adaptations with water manipulation': 'A leviathan from the deepest ocean trenches, with bioluminescent patterns and flowing adaptations. Water bends to its will as it moves with fluid grace despite its massive size.',
        'Crystalline growths that resonate with sound': 'A living geological formation of crystal and stone, with resonant formations that sing with harmonic frequencies. Light refracts through its crystalline body creating rainbow displays.',
        'Psychic energy manifestations': 'A being of pure psychic power made manifest, with reality bending around its presence. Ethereal energy flows from its form as it manipulates matter with thought alone.',
        'Toxic gas clouds and corrosive secretions': 'A walking chemical disaster, its hide weeping toxic substances that corrode everything in its path. Noxious clouds follow in its wake as nature itself recoils from its presence.',
        'Bioluminescent patterns pulse with heartbeat': 'A living beacon in the darkness, its bioluminescent patterns pulsing with alien life. Each heartbeat sends waves of light across its organic surface like a living constellation.'
    };
    
    return concepts[specialFeature] || `A ${sizeScale.toLowerCase().split(' - ')[0]} kaiju with ${bodyShape.toLowerCase()}, representing the perfect fusion of biological evolution and supernatural power.`;
}

function getTextureDetails(texture) {
    const details = {
        'Fractured rocky plates with glowing cracks': 'like cooled lava with molten energy visible through the fissures',
        'Metallic, chrome-like armor plating': 'polished to a mirror finish with battle-worn scratches',
        'Crystalline, translucent formations': 'refracting light into prismatic displays',
        'Scaly, reptilian hide': 'each scale the size of a shield, overlapping for maximum protection',
        'Smooth, bioluminescent membrane': 'pulsing with alien patterns and soft inner light',
        'Organic, plant-like bark texture': 'rough and woody with moss and lichen growing in the crevices',
        'Ethereal, semi-transparent energy': 'shifting between solid matter and pure energy'
    };
    return details[texture] || 'with a unique surface texture that defies conventional description';
}

function getAppendageDetails(appendages) {
    const details = {
        'Massive clawed fists and obsidian spikes': 'fists capable of crushing buildings, spikes running along the spine like a mountain ridge',
        'Feathered wings spanning city blocks': 'each feather the size of a tree, creating hurricane-force winds with each beat',
        'Multiple writhing tentacles': 'dozens of muscular appendages that move with alien intelligence',
        'Sharp crystalline protrusions': 'faceted growths that slice through air and matter with surgical precision',
        'Mechanical joints and pistons': 'hydraulic systems that enhance strength beyond biological limits',
        'Vine-like grasping limbs': 'organic tendrils that can extend and constrict with surprising speed',
        'Energy tendrils crackling with power': 'pure force given semi-physical form, constantly sparking with potential'
    };
    return details[appendages] || 'unique appendages adapted for both combat and environmental manipulation';
}

function getHeadDetails(headType) {
    const details = {
        'Dinosaur-like with reinforced skull, molten eyes': 'eye sockets glowing like forge fires, jaw capable of splitting open to reveal a furnace-like gullet',
        'Insectoid with compound eyes and mandibles': 'thousands of faceted eyes reflecting the world in fragments, mandibles that can shear through steel',
        'Draconic with elongated snout and horns': 'noble and ancient, with horns that spiral like cathedral spires',
        'Humanoid with intelligent, piercing gaze': 'disturbingly familiar yet utterly alien, intelligence that spans eons',
        'Alien with multiple sensory organs': 'sensory apparatus beyond human comprehension, perceiving dimensions unknown to earthly life',
        'Skeletal with exposed bone structure': 'death given form, with empty sockets that burn with unlife',
        'Featureless with shifting facial patterns': 'a blank canvas that occasionally reveals glimpses of terrible purpose'
    };
    return details[headType] || 'a head design that speaks to both intelligence and predatory instinct';
}

function getTailDetails(tailType) {
    const details = {
        'Thick, segmented with spiked club end': 'each segment armored like a tank, the club end studded with bone-crushing spikes',
        'Long, whip-like for sweeping attacks': 'incredibly flexible yet strong enough to topple skyscrapers with a single sweep',
        'Split into multiple smaller tails': 'a hydra-like arrangement allowing for complex grappling maneuvers',
        'Blade-tipped for slashing': 'ending in a razor-sharp point capable of piercing the strongest armor',
        'No tail, stumped or vestigial': 'evolution has deemed it unnecessary, compensating with other adaptations',
        'Energy construct, not physical': 'a tail of pure force that can phase between states of matter'
    };
    return details[tailType] || 'a tail design perfectly adapted to its combat style';
}

function generateKeyFeatures(specialFeature, battleDamage) {
    let features = ['✅ Imposing scale that dwarfs human constructions'];
    
    if (specialFeature !== 'None') {
        const featureDescriptions = {
            'Glowing magma veins with volcanic emissions': '✅ Glowing Magma Veins – Pulsing with heat, especially along joints and cracks\n✅ Volcanic Emissions – Smoke/steam rising from its back, with occasional ember bursts when enraged',
            'Crackling electrical aura and storm clouds': '✅ Electrical Aura – Constant crackling of electricity across metallic surfaces\n✅ Storm Formation – Dark clouds gathering overhead wherever it moves',
            'Aquatic adaptations with water manipulation': '✅ Hydro-Dynamic Design – Fins and gills adapted for both land and sea\n✅ Water Control – Moisture in the air bending to its will',
            'Crystalline growths that resonate with sound': '✅ Harmonic Resonance – Crystal formations creating haunting melodies\n✅ Light Refraction – Rainbow patterns dancing across crystalline surfaces',
            'Psychic energy manifestations': '✅ Reality Distortion – Space bending slightly around its presence\n✅ Telekinetic Aura – Objects floating in its proximity without contact',
            'Toxic gas clouds and corrosive secretions': '✅ Chemical Hazards – Visible toxic vapors emanating from pores\n✅ Corrosive Trail – Ground smoking and dissolving where it has passed',
            'Bioluminescent patterns pulse with heartbeat': '✅ Living Light Show – Patterns flowing across its surface like circuits\n✅ Rhythmic Pulsing – Light intensity matching its vital signs'
        };
        features.push(featureDescriptions[specialFeature] || '✅ Unique supernatural manifestations that defy natural law');
    }
    
    if (battleDamage !== 'Pristine, unmarked by conflict') {
        features.push('✅ Battle-Scarred Veteran – Visible signs of countless conflicts, each mark telling a story of survival');
    }
    
    return features.join('\n');
}

function getColorMood(colorPalette) {
    const moods = {
        'Charcoal black, volcanic orange, deep reds': 'like a walking eruption, radiating heat and primal fury',
        'Electric blue, silver, crackling white': 'cool metallics charged with explosive energy',
        'Deep ocean blue, seafoam green, pearl white': 'mysterious depths brought to the surface world',
        'Crystal clear, rainbow refractions, brilliant white': 'pure light made manifest in physical form',
        'Gunmetal gray, chrome silver, neon accents': 'industrial precision with technological enhancement',
        'Forest green, bark brown, golden highlights': 'nature\'s majesty elevated to mythic proportions',
        'Void black, purple energy, ethereal glow': 'darkness given form, touched by otherworldly power',
        'Toxic green, sickly yellow, corroded metal': 'corruption and decay made beautiful through terrible power'
    };
    return moods[colorPalette] || 'a unique color story that reflects its inner nature';
}

function getPoseDetails(pose) {
    const details = {
        'Mid-roar, ground fracturing under weight': 'the very earth splits beneath its feet as it announces its presence',
        'Charging forward with devastating intent': 'unstoppable momentum that promises destruction',
        'Rearing up to full intimidating height': 'displaying its true scale in a show of dominance',
        'Unleashing signature ability/attack': 'power building to a crescendo of supernatural force',
        'Surveying territory from elevated position': 'the calm before the storm, intelligence assessing threats',
        'In defensive stance, protecting something': 'fierce loyalty and protective instincts on full display'
    };
    return details[pose] || 'frozen in a moment that captures its essential nature';
}

function getEnvironmentDetails(environment) {
    const details = {
        'Destroyed cityscape with smoke and fire': 'twisted metal and concrete bearing witness to its power',
        'Ocean depths with bioluminescent creatures': 'alien beauty in the crushing darkness of the deep',
        'Mountain peaks shrouded in storm clouds': 'where earth meets sky in primal grandeur',
        'Crystal caverns with ethereal lighting': 'underground palace of natural geometric perfection',
        'Industrial complex with machinery': 'man\'s greatest works dwarfed by nature\'s evolution',
        'Ancient forest with massive trees': 'primordial woodland where time moves differently',
        'Volcanic wasteland with lava flows': 'the raw fury of the earth made visible',
        'Cosmic void with stellar phenomena': 'the infinite darkness punctuated by celestial light'
    };
    return details[environment] || 'a setting that amplifies its mythic presence';
}

function getLightingDescription(specialFeature, colorPalette) {
    if (specialFeature.includes('magma') || specialFeature.includes('volcanic')) {
        return 'Dramatic underglow from molten cracks, casting an eerie orange glow on nearby rubble and smoke';
    } else if (specialFeature.includes('electrical') || specialFeature.includes('storm')) {
        return 'Sharp, electric blue lighting with stark shadows and intermittent lightning flashes';
    } else if (specialFeature.includes('bioluminescent')) {
        return 'Soft, organic glow emanating from within, creating an otherworldly ambiance';
    } else if (specialFeature.includes('crystalline')) {
        return 'Prismatic light refractions creating rainbow patterns on surrounding surfaces';
    } else {
        return 'Cinematic lighting that emphasizes scale and power, with dramatic shadows and highlights';
    }
}

function populateVisualTraits() {
    // Populate all dropdowns with data from visual-traits-data.js
    const dropdownMappings = {
        'title': visualTraits.titles,
        'body-shape': visualTraits.bodyShapes,
        'size-scale': visualTraits.sizeScales,
        'skin-texture': visualTraits.skinTextures,
        'appendages': visualTraits.appendages,
        'head-type': visualTraits.headTypes,
        'tail-type': visualTraits.tailTypes,
        'special-feature': visualTraits.specialFeatures,
        'battle-damage': visualTraits.battleDamage,
        'color-palette': visualTraits.colorPalettes,
        'dynamic-pose': visualTraits.dynamicPoses,
        'environment': visualTraits.environments
    };    // Populate each dropdown
    Object.entries(dropdownMappings).forEach(([selectId, options]) => {
        const selectElement = document.getElementById(selectId);
        if (selectElement && options) {
            // Clear existing options
            selectElement.innerHTML = '';
            
            // Add options from data
            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                
                // Set default selections based on mapping
                const defaultKey = selectId.replace(/-/g, '');
                const camelCaseKey = defaultKey.replace(/([A-Z])/g, (match, offset) => offset === 0 ? match.toLowerCase() : match);
                if (defaultSelections[camelCaseKey] === option) {
                    optionElement.selected = true;
                }
                
                selectElement.appendChild(optionElement);
            });
        }
    });    // Set default values for text inputs
    const nameInput = document.getElementById('kaiju-name');
    if (nameInput) {
        nameInput.value = defaultSelections.kaijuname;
    }
}

function randomizeTraits() {
    // Get all dropdown elements (excluding name input)
    const dropdownMappings = {
        'title': visualTraits.titles,
        'body-shape': visualTraits.bodyShapes,
        'size-scale': visualTraits.sizeScales,
        'skin-texture': visualTraits.skinTextures,
        'appendages': visualTraits.appendages,
        'head-type': visualTraits.headTypes,
        'tail-type': visualTraits.tailTypes,
        'special-feature': visualTraits.specialFeatures,
        'battle-damage': visualTraits.battleDamage,
        'color-palette': visualTraits.colorPalettes,
        'dynamic-pose': visualTraits.dynamicPoses,
        'environment': visualTraits.environments
    };
    
    // Randomize each dropdown selection
    Object.entries(dropdownMappings).forEach(([selectId, options]) => {
        const selectElement = document.getElementById(selectId);
        if (selectElement && options && options.length > 0) {
            // Select a random option
            const randomIndex = Math.floor(Math.random() * options.length);
            selectElement.value = options[randomIndex];
        }
    });
    
    // Trigger prompt update after randomizing
    updatePrompt();
}
