# Random Wallpaper Generator for ComfyUI
# Generates random prompts and creates wallpapers automatically
# Usage: .\random-wallpaper.ps1 [-Category landscape|animal|fantasy|space|nature|abstract] [-Count 1]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("landscape", "animal", "fantasy", "space", "nature", "abstract", "cityscape", "seasonal", "all")]
    [string]$Category = "all",
    
    [Parameter(Mandatory=$false)]
    [int]$Count = 1,
    
    [Parameter(Mandatory=$false)]
    [string]$Model = "juggernautXL_v8Rundiffusion.safetensors",
    
    [Parameter(Mandatory=$false)]
    [int]$DelayBetween = 5,
    
    [Parameter(Mandatory=$false)]
    [switch]$PreviewOnly = $false
)

# Prompt categories with variations
$PromptCategories = @{
    "landscape" = @(
        "breathtaking mountain landscape at sunset, dramatic clouds, golden hour lighting, photorealistic",
        "serene lake reflection with snow-capped mountains, crystal clear water, morning mist",
        "rolling green hills with wildflowers, pastoral countryside, soft natural lighting",
        "dramatic coastal cliffs with crashing waves, stormy sky, cinematic composition",
        "ancient forest with towering trees, dappled sunlight, mysterious atmosphere",
        "desert landscape with sand dunes, star-filled night sky, milky way visible",
        "alpine meadow with colorful wildflowers, snow-capped peaks in background",
        "autumn forest with vibrant fall colors, golden leaves, warm lighting",
        "tropical beach with turquoise water, palm trees, perfect weather",
        "canyon landscape with red rock formations, dramatic shadows, western scenery",
        "ancient ruins in misty valley, overgrown with vines, dramatic morning light, hidden history",
        "volcanic landscape with flowing lava and ash clouds, fiery tones, destructive beauty",
        "glacier valley with deep blue ice crevasses, harsh arctic winds, survival scene",
        "storm brewing over endless savanna, golden grass bending in wind, raw natural power",
        "mystical northern fjord with steep cliffs and low fog, glowing twilight, untouched wilderness",
        "serene rice terraces in morning haze, village in the distance, peaceful agrarian life",
        "wind-swept plateau with monolithic rock formations, dusty hues, ancient presence",
        "sunrise over ancient terraced vineyards, rich colors, peaceful countryside rhythm",
        "windswept moor with scattered standing stones, mysterious and wild, Celtic atmosphere",
        "sunlight breaking through canyon ridge, dramatic light play, southwestern desert magic"
    )

    "animal" = @(
        "majestic lion in African savanna, golden hour lighting, wildlife photography style",
        "colorful tropical bird in lush rainforest, vibrant plumage, natural habitat",
        "graceful deer in morning forest, soft lighting, peaceful atmosphere",
        "powerful eagle soaring over mountain peaks, dramatic sky, freedom concept",
        "playful dolphins jumping in ocean waves, splashing water, joyful moment",
        "wise old elephant in African landscape, sunset lighting, gentle giant",
        "beautiful butterfly on blooming flowers, macro photography, spring garden",
        "arctic fox in snowy landscape, white fur, winter wonderland",
        "colorful tropical fish in coral reef, underwater photography, marine life",
        "magnificent tiger in jungle setting, intense gaze, wild nature",
        "glowing eyes of a panther in dense jungle under moonlight, stealth and power",
        "herd of wild horses running across open plains, dust in the air, freedom captured",
        "colorful poison dart frogs on wet leaves, vivid and dangerous, rainforest detail",
        "baby penguins huddled on icy cliff, arctic winds, survival in unity",
        "giant whale breaching in open ocean, misty spray, awe-inspiring scale",
        "raccoon peering out from tree hollow, mischievous gaze, nocturnal creature",
        "chameleon camouflaging on a leaf, adaptive texture, nature's illusionist",
        "barn owl mid-flight in twilight field, silent wings, predatory grace",
        "red panda climbing bamboo, playful charm, rare forest dweller",
        "wolf howling at full moon in snowy forest, pack loyalty, primal energy"
    )

    "fantasy" = @(
        "mystical floating islands in the sky, magical waterfalls, fantasy realm",
        "enchanted forest with glowing mushrooms, fairy lights, magical atmosphere",
        "ancient dragon flying over medieval castle, epic fantasy scene",
        "crystal cave with bioluminescent plants, ethereal lighting, otherworldly",
        "magical portal in ancient ruins, swirling energy, mystical gateway",
        "unicorn in enchanted meadow, rainbow lighting, pure fantasy",
        "floating city in the clouds, steampunk architecture, sky kingdom",
        "phoenix rising from flames, rebirth symbolism, fiery wings",
        "underwater palace with mermaids, coral architecture, aquatic fantasy",
        "wizard tower under starry sky, magical energy, spell casting",
        "crystal spires in moonlit elven city, glowing lights, ethereal elegance",
        "giant tree city with rope bridges and hanging lanterns, ancient forest kingdom",
        "necromancer summoning spirits in ruined cathedral, dark energy, gothic fantasy",
        "sky whales drifting between clouds, tranquil and surreal, dreamscape realm",
        "griffin perched on cliff overlooking battlefield, guardian beast, noble power",
        "glowing magical runes on ancient monoliths, mystery and forgotten magic",
        "ethereal ghost ship sailing through the fog, cursed crew, haunted seas",
        "fae circle of mushrooms glowing in night forest, whispering spirits",
        "battle-scarred paladin standing before shattered portal, heroic defiance",
        "luminous crystal dragon curled around mountain peak, ancient guardian spirit"
    )

    "space" = @(
        "breathtaking nebula with colorful gas clouds, deep space photography",
        "alien planet with multiple moons, sci-fi landscape, otherworldly terrain",
        "space station orbiting Earth, futuristic design, cosmic view",
        "galaxy spiral arms with countless stars, astronomical beauty",
        "asteroid field with spacecraft, space exploration, adventure theme",
        "solar eclipse from space perspective, celestial alignment, dramatic",
        "futuristic city on Mars, red planet colonization, sci-fi architecture",
        "comet approaching Earth, tail of ice and dust, celestial phenomenon",
        "binary star system, twin suns, exotic solar system",
        "black hole event horizon, gravitational lensing, cosmic mystery",
        "massive Dyson sphere around alien star, mega-engineering, sci-fi wonder",
        "abandoned alien outpost on icy moon, distant galaxy in sky, eerie silence",
        "terraforming operation on exoplanet, green domes in red desert, future vision",
        "lone astronaut walking across asteroid, Earth visible behind, introspective mood",
        "nebula storm with lightning flashes in space dust, chaotic beauty",
        "alien jungle on tidally locked planet, glowing plants, surreal ecology",
        "quantum satellite array orbiting neutron star, gravity distortions visible",
        "deep space anomaly bending starlight, dark mystery, scientific enigma",
        "spaceship graveyard drifting near galactic core, ancient wrecks, lost technology",
        "colonial outpost in Saturn’s rings, dust trails glowing in sunlight"
    )

    "nature" = @(
        "morning dew on spider web, macro photography, natural art",
        "waterfall cascading into emerald pool, tropical paradise, pristine nature",
        "field of sunflowers under blue sky, summer countryside, natural beauty",
        "cherry blossoms in full bloom, spring festival, pink petals",
        "northern lights dancing over snowy landscape, aurora borealis, magical",
        "cactus flowers blooming in desert, resilient beauty, dry landscape",
        "moss-covered rocks in stream, forest creek, peaceful water flow",
        "lavender fields in Provence, purple waves, aromatic landscape",
        "bioluminescent plankton glowing in ocean waves, night shoreline, natural magic",
        "tree branches coated in ice after freezing rain, sparkling in dawn light",
        "hidden waterfall inside jungle cavern, soft mist, secret paradise",
        "wildflower-covered mountain trail, butterflies fluttering, serene journey",
        "prairie grasses swaying under vast open sky, timeless nature, wind-touched",
        "close-up of frost crystals on pine needles, early morning chill, winter textures",
        "honeybee in flight approaching vibrant blossom, ecosystem in motion",
        "forest fire regenerating saplings, new growth from ashes, cycle of life",
        "sunlight through morning fog on meadow, golden beams, tranquil harmony"
    )

    "abstract" = @(
        "flowing liquid metal with rainbow reflections, abstract art, fluid dynamics",
        "geometric patterns with vibrant colors, modern art, mathematical beauty",
        "paint splash explosion in slow motion, colorful chaos, artistic expression",
        "crystal formations with prismatic light, geometric nature, rainbow spectrum",
        "smoke patterns in neon colors, abstract photography, flowing forms",
        "fractal mandala with infinite detail, sacred geometry, hypnotic patterns",
        "oil and water mixing, fluid art, organic shapes and colors",
        "light trails through city at night, long exposure, urban abstract",
        "paper cut art with layered shadows, minimalist design, depth illusion",
        "kaleidoscope patterns with natural elements, symmetrical beauty, visual harmony",
        "liquid galaxy swirl, cosmic patterns in motion, abstract universe",
        "exploding crystals in mid-air, shattered symmetry, sharp brilliance",
        "folded fabric in high contrast lighting, textile abstraction, moody shadows",
        "multicolored ink swirling in water, surreal harmony, organic abstraction",
        "hexagonal grid overlay on fluid cloudscape, blending sci-fi and surrealism",
        "mirror fractals reflecting endless copies, recursive complexity, visual recursion",
        "blended watercolor streaks over crumpled paper, expressive modern chaos",
        "neon wireframe shapes in motion, 80s retrofuture, digital abstraction",
        "animated brushstrokes on blank canvas, creating something from nothing",
        "spatial anomaly distortions, bending reality and perspective, perception glitch"
    )

    "cityscape" = @(
        "futuristic cyberpunk city at night, neon lights, rain-slicked streets",
        "New York skyline at golden hour, urban photography, iconic buildings",
        "Tokyo street scene with cherry blossoms, urban spring, modern Japan",
        "Venice canals at sunset, romantic atmosphere, historic architecture",
        "Dubai skyline with modern skyscrapers, desert metropolis, architectural marvels",
        "London bridge in fog, atmospheric mood, classic British architecture",
        "San Francisco Golden Gate Bridge, iconic landmark, coastal city",
        "Paris rooftops at twilight, romantic city, historic European architecture",
        "Hong Kong harbor at night, city lights reflection, Asian metropolis",
        "Chicago architecture along river, urban canyon, modern city design",
        "post-apocalyptic city overrun by nature, vines on skyscrapers, silence after collapse",
        "vibrant Moroccan market street at dusk, colorful lanterns and textiles, cultural texture",
        "underground metro station with art nouveau architecture, forgotten beauty",
        "industrial harbor at blue hour, cranes and ships silhouetted, working world",
        "rooftop garden atop high-rise in bustling metropolis, modern green living",
        "ancient walled city at sunset, golden rooftops and old stone, timeless charm",
        "rainy alleyway in Seoul lit by neon signs, umbrellas, cinematic noir feel",
        "skyline reflected in glassy river at night, blurred lights, urban romance",
        "futuristic floating market with drones and lights, cyberpunk culture blend",
        "old European town square during festival, hanging lights and crowd energy"
    )

    "seasonal" = @(
        "winter wonderland with snow-covered trees, Christmas atmosphere, peaceful",
        "spring garden with blooming flowers, fresh growth, renewal theme",
        "summer beach sunset, warm colors, vacation vibes, tropical paradise",
        "autumn maple trees with red leaves, fall colors, seasonal transition",
        "winter mountain cabin with smoke from chimney, cozy atmosphere",
        "spring rain on flower petals, fresh and clean, nature's renewal",
        "summer thunderstorm over prairie, dramatic weather, power of nature",
        "autumn harvest scene with pumpkins, thanksgiving theme, rural setting",
        "winter aurora over frozen lake, ice formations, arctic beauty",
        "spring waterfall with melting snow, seasonal flow, mountain runoff",
        "ice crystals forming on glass window at dawn, cozy contrast indoors",
        "sun-drenched summer vineyard with ripe grapes, golden hour harvest",
        "cherry trees shedding petals in spring breeze, ephemeral moment",
        "stormy autumn night with howling wind and swirling leaves, moody and wild",
        "sunset casting long shadows on snowfield, winter stillness",
        "late spring meadow buzzing with bees, fresh bloom everywhere",
        "early autumn forest trail with crunching leaves, warm and nostalgic",
        "sizzling summer picnic in countryside meadow, joy of simplicity",
        "festive winter village with warm lights, snow falling gently, holiday scene",
        "first frost on field, seasonal change, early morning silence"
    )
}


function Get-RandomPrompt {
    param([string]$SelectedCategory)
    
    if ($SelectedCategory -eq "all") {
        # Pick a random category first
        $categories = $PromptCategories.Keys | Where-Object { $_ -ne "all" }
        $randomCategory = $categories | Get-Random
        $prompts = $PromptCategories[$randomCategory]
    } else {
        $prompts = $PromptCategories[$SelectedCategory]
    }
    
    return $prompts | Get-Random
}

function Add-StyleModifiers {
    param([string]$BasePrompt)
    
    $qualityModifiers = @(
        "8K ultra high resolution",
        "professional photography",
        "award winning photograph",
        "masterpiece quality",
        "highly detailed",
        "cinematic composition"
    )
    
    $lightingModifiers = @(
        "perfect lighting",
        "dramatic lighting",
        "natural lighting",
        "golden hour",
        "soft ambient light",
        "volumetric lighting"
    )
    
    $cameraModifiers = @(
        "shot with Canon EOS R5",
        "wide angle lens",
        "macro photography",
        "landscape photography",
        "nature photography",
        "fine art photography"
    )
    
    $selectedQuality = $qualityModifiers | Get-Random
    $selectedLighting = $lightingModifiers | Get-Random
    $selectedCamera = $cameraModifiers | Get-Random
    
    return "$BasePrompt, $selectedQuality, $selectedLighting, $selectedCamera"
}

function Generate-WallpaperFilename {
    param([string]$Category, [int]$Index)
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $sanitizedCategory = $Category -replace "[^a-zA-Z0-9]", ""
    
    if ($Count -gt 1) {
        return "wallpaper_${sanitizedCategory}_${timestamp}_${Index}.png"
    } else {
        return "wallpaper_${sanitizedCategory}_${timestamp}.png"
    }
}

# Main execution
Write-Host "Random Wallpaper Generator for ComfyUI" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Category: $Category" -ForegroundColor Yellow
Write-Host "Count: $Count" -ForegroundColor Yellow
Write-Host "Model: $Model" -ForegroundColor Yellow

if ($PreviewOnly) {
    Write-Host "Preview Mode: ON (prompts only)" -ForegroundColor Magenta
}

Write-Host ""

# Check if ComfyUI generator script exists
$generatorScript = Join-Path $PSScriptRoot "comfyui-generate.ps1"
if (-not (Test-Path $generatorScript)) {
    Write-Error "ComfyUI generator script not found at: $generatorScript"
    exit 1
}

for ($i = 1; $i -le $Count; $i++) {
    Write-Host "Generating wallpaper $i of $Count..." -ForegroundColor Green
    
    # Generate random prompt
    $basePrompt = Get-RandomPrompt -SelectedCategory $Category
    $enhancedPrompt = Add-StyleModifiers -BasePrompt $basePrompt
    
    Write-Host "Prompt: $enhancedPrompt" -ForegroundColor Yellow
    
    if ($PreviewOnly) {
        Write-Host "Preview: Would generate with this prompt" -ForegroundColor Gray
        Write-Host ""
        continue
    }
    
    # Generate filename
    $outputFile = Generate-WallpaperFilename -Category $Category -Index $i
    $outputPath = Join-Path $PSScriptRoot $outputFile
    
    Write-Host "Output: $outputFile" -ForegroundColor Cyan
    Write-Host ""
    
    try {
        # Call the ComfyUI generator with wallpaper setting enabled
        & $generatorScript -Prompt $enhancedPrompt -UseScreenResolution -SetAsWallpaper -OutputPath $outputPath -Model $Model
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Wallpaper $i generated successfully!" -ForegroundColor Green
        } else {
            Write-Warning "Failed to generate wallpaper $i"
        }
    }
    catch {
        Write-Error "Error generating wallpaper $($_.Exception.Message)"
    }
    
    # Delay between generations if multiple wallpapers
    if ($i -lt $Count -and $DelayBetween -gt 0) {
        Write-Host "Waiting $DelayBetween seconds before next generation..." -ForegroundColor Gray
        Start-Sleep -Seconds $DelayBetween
    }
    
    Write-Host ""
}

Write-Host "Random wallpaper generation complete!" -ForegroundColor Magenta

# Display summary
if (-not $PreviewOnly) {
    Write-Host "Summary:" -ForegroundColor Cyan
    Write-Host "- Generated $Count wallpaper(s)" -ForegroundColor Green
    Write-Host "- Category: $Category" -ForegroundColor Green
    Write-Host "- Model: $Model" -ForegroundColor Green
    Write-Host "- All images set as desktop wallpaper" -ForegroundColor Green
}
