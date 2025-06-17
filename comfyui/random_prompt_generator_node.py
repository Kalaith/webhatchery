# Random Prompt Generator Node for ComfyUI
# Place this in ComfyUI/custom_nodes/random_prompt_generator.py

import random
import json

class RandomPromptGenerator:
    """
    A ComfyUI custom node that generates random prompts for image generation
    """
    
    def __init__(self):
        self.prompt_categories = {
            "landscape": [
                "majestic mountain range with snow-capped peaks, golden hour lighting",
                "serene lake surrounded by autumn trees, misty morning atmosphere",
                "desert landscape with sand dunes, star-filled night sky, milky way visible",
                "coastal cliff overlooking turbulent ocean waves, dramatic storm clouds",
                "rolling green hills with wildflowers, soft afternoon sunlight",
                "canyon with red rock formations, warm desert lighting",
                "forest clearing with sunbeams filtering through tall trees",
                "alpine meadow with colorful wildflowers, mountain backdrop",
                "rocky coastline with crashing waves, lighthouse in distance",
                "volcanic landscape with lava flows, dramatic red and orange sky"
            ],
            
            "nature": [
                "ancient oak tree with sprawling branches, ethereal morning mist",
                "waterfall cascading into crystal clear pool, rainbow in spray",
                "field of sunflowers under bright blue sky, puffy white clouds",
                "bamboo forest with filtered green light, zen atmosphere",
                "cherry blossom tree in full bloom, petals falling gently",
                "redwood forest with towering trees, dappled sunlight",
                "tropical rainforest with lush vegetation, exotic birds",
                "winter forest with snow-covered evergreens, peaceful silence",
                "meadow with butterflies and wildflowers, warm summer day",
                "coral reef with colorful fish, underwater paradise"
            ],
            
            "fantasy": [
                "floating islands in the sky, connected by rainbow bridges",
                "ancient wizard tower surrounded by swirling magical energy",
                "enchanted forest with glowing mushrooms and fairy lights",
                "dragon perched on mountain peak, breathing colorful flames",
                "crystal cave with luminescent gems, mystical atmosphere",
                "medieval castle on a hill, full moon and stars overhead",
                "phoenix rising from flames, brilliant orange and gold feathers",
                "underwater city with mermaids and glowing coral",
                "magical library with floating books and glowing orbs",
                "unicorn in moonlit glade, silver horn gleaming"
            ],
            
            "space": [
                "nebula with swirling colors of purple, blue, and pink",
                "alien planet with multiple moons, exotic landscape",
                "space station orbiting ringed planet, stars in background",
                "galaxy spiral with billions of stars, cosmic dust clouds",
                "astronaut floating in space, Earth visible in distance",
                "binary star system with twin suns, planetary rings",
                "asteroid field with mining ships, distant sun",
                "black hole warping space-time, gravitational lensing effect",
                "alien civilization with crystalline structures, bioluminescence",
                "comet with brilliant tail streaking across starfield"
            ],
            
            "abstract": [
                "fluid dynamics with liquid metal, chrome reflections",
                "geometric patterns in vibrant neon colors, 80s aesthetic",
                "fractal art with infinite recursive patterns, mathematical beauty",
                "color explosion with paint splatters, dynamic movement",
                "minimalist design with simple shapes, negative space",
                "optical illusion with impossible geometry, mind-bending",
                "digital glitch art with corrupted pixels, cyberpunk vibes",
                "flowing fabric in wind, graceful curves and folds",
                "light trails through darkness, long exposure effect",
                "crystalline structures with prismatic light refraction"
            ],
            
            "animal": [
                "majestic lion with flowing mane, golden savanna backdrop",
                "wise owl perched on branch, large amber eyes, moonlight",
                "playful dolphins jumping through ocean waves, splash",
                "colorful tropical parrot in rainforest canopy, vibrant plumage",
                "arctic fox in winter landscape, white fur, snow falling",
                "butterfly with intricate wing patterns, flower garden",
                "whale breaching ocean surface, dramatic water spray",
                "tiger stalking through jungle, dappled sunlight, stealth",
                "eagle soaring over mountain range, wings spread wide",
                "panda eating bamboo in peaceful grove, black and white"
            ],
            
            "cityscape": [
                "futuristic cyberpunk city at night, neon lights, rain-slicked streets",
                "New York skyline at golden hour, urban photography, iconic buildings",
                "Tokyo street scene with cherry blossoms, urban spring, modern Japan",
                "Venice canals at sunset, romantic atmosphere, historic architecture",
                "Dubai skyline with modern skyscrapers, desert metropolis",
                "London bridge in fog, atmospheric mood, classic British architecture",
                "San Francisco Golden Gate Bridge, iconic landmark, coastal city",
                "Paris rooftops at twilight, romantic city, European architecture",
                "Hong Kong harbor at night, city lights reflection, Asian metropolis",
                "Chicago architecture along river, urban canyon, modern design"
            ],
            
            "seasonal": [
                "winter wonderland with snow-covered trees, Christmas atmosphere",
                "spring garden with blooming flowers, fresh growth, renewal theme",
                "summer beach sunset, warm colors, vacation vibes, tropical paradise",
                "autumn maple trees with red leaves, fall colors, seasonal transition",
                "winter mountain cabin with smoke from chimney, cozy atmosphere",
                "spring rain on flower petals, fresh and clean, nature's renewal",
                "summer thunderstorm over prairie, dramatic weather, power of nature",
                "autumn harvest scene with pumpkins, thanksgiving theme, rural setting",
                "winter aurora over frozen lake, ice formations, arctic beauty",
                "spring waterfall with melting snow, seasonal flow, mountain runoff"
            ]
        }
        
        self.quality_modifiers = [
            "8K ultra high resolution",
            "professional photography", 
            "award winning photograph",
            "masterpiece quality",
            "highly detailed",
            "cinematic composition",
            "photorealistic",
            "studio lighting",
            "sharp focus",
            "vivid colors"
        ]
        
        self.style_modifiers = [
            "dramatic lighting",
            "golden hour",
            "soft ambient light",
            "volumetric lighting",
            "natural lighting",
            "perfect lighting",
            "moody atmosphere",
            "ethereal glow",
            "rim lighting",
            "chiaroscuro"
        ]

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "category": (["all", "landscape", "nature", "fantasy", "space", "abstract", "animal", "cityscape", "seasonal"], {
                    "default": "all"
                }),
                "add_quality_modifiers": ("BOOLEAN", {
                    "default": True
                }),
                "seed": ("INT", {
                    "default": 42,
                    "min": 0,
                    "max": 999999
                })
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("prompt",)
    FUNCTION = "generate_random_prompt"
    CATEGORY = "text"

    def generate_random_prompt(self, category, add_quality_modifiers, seed):
        # Set random seed for reproducible results
        random.seed(seed)
        
        # Select category
        if category == "all":
            # Pick a random category
            available_categories = list(self.prompt_categories.keys())
            selected_category = random.choice(available_categories)
        else:
            selected_category = category
            
        # Get base prompt from selected category
        base_prompts = self.prompt_categories[selected_category]
        base_prompt = random.choice(base_prompts)
        
        # Add quality and style modifiers if requested
        if add_quality_modifiers:
            quality_mod = random.choice(self.quality_modifiers)
            style_mod = random.choice(self.style_modifiers)
            
            final_prompt = f"{base_prompt}, {quality_mod}, {style_mod}"
        else:
            final_prompt = base_prompt
            
        return (final_prompt,)

# ComfyUI Node Registration
NODE_CLASS_MAPPINGS = {
    "RandomPromptGenerator": RandomPromptGenerator
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "RandomPromptGenerator": "Random Prompt Generator"
}
