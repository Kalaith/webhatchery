<?php
header('Content-Type: application/json');

// Get parameters
$type = $_GET['type'] ?? 'book';
$genre = $_GET['genre'] ?? 'fantasy';
$tone = $_GET['tone'] ?? 'mysterious';
$keywords = $_GET['keywords'] ?? '';
$count = intval($_GET['count'] ?? 1);
$setting = $_GET['setting'] ?? 'medieval';
$gender = $_GET['gender'] ?? 'neutral';
$race = $_GET['race'] ?? 'human';
$species = $_GET['species'] ?? 'humanoid';

class TitleGenerator {
    private $components = [
        // Title prefixes
        'prefixes' => [
            'fantasy' => ['The', 'Chronicles of', 'Tales of', 'Legends of', 'Song of', 'Saga of', 'Quest for', 'Rise of', 'Fall of', 'Dawn of', 'Realm of', 'Kingdom of', 'Empire of', 'Age of', 'Curse of', 'Blessing of', 'Shadow of', 'Light of', 'Crown of', 'Throne of'],
            'modern' => ['The', 'Beyond', 'Inside', 'Project', 'Operation', 'Case of', 'Secret of', 'Mystery of', 'Code', 'Signal', 'Network', 'System', 'Protocol', 'Archive', 'Files', 'Chronicles', 'Diary of', 'Journal of', 'Story of', 'Life of']
        ],
        
        // Compound title components for dynamic generation
        'compound_parts' => [
            'first_elements' => [
                'celestial' => ['Star', 'Moon', 'Sun', 'Comet', 'Nova', 'Void', 'Galaxy', 'Nebula', 'Cosmic', 'Stellar', 'Solar', 'Lunar', 'Astral', 'Celestial'],
                'nature' => ['Stone', 'Iron', 'Steel', 'Fire', 'Ice', 'Storm', 'Thunder', 'Lightning', 'Wind', 'Earth', 'Water', 'Shadow', 'Light', 'Crystal', 'Diamond', 'Gold', 'Silver', 'Blood', 'Bone', 'Soul', 'Spirit', 'Death', 'Life'],
                'colors' => ['Red', 'Blue', 'Green', 'Black', 'White', 'Gold', 'Silver', 'Crimson', 'Azure', 'Emerald', 'Obsidian', 'Ivory', 'Scarlet', 'Violet', 'Amber'],
                'mythical' => ['Dragon', 'Phoenix', 'Griffin', 'Demon', 'Angel', 'Titan', 'Giant', 'Wraith', 'Specter', 'Phantom', 'Beast', 'Monster', 'Fiend', 'Serpent'],
                'emotions' => ['Rage', 'Fury', 'Wrath', 'Sorrow', 'Joy', 'Hope', 'Fear', 'Despair', 'Love', 'Hate', 'Pride', 'Shame', 'Honor', 'Glory'],
                'weapons' => ['Sword', 'Blade', 'Axe', 'Hammer', 'Spear', 'Bow', 'Arrow', 'Shield', 'Armor', 'Gauntlet', 'Helm', 'Crown', 'Ring', 'Staff', 'Wand']
            ],
            'second_elements' => [
                'actions' => ['Slayer', 'Crusher', 'Breaker', 'Bringer', 'Seeker', 'Hunter', 'Killer', 'Destroyer', 'Creator', 'Maker', 'Forger', 'Shaper', 'Binder', 'Weaver', 'Walker', 'Runner', 'Rider', 'Caller', 'Singer', 'Whisperer', 'Screamer', 'Roarer'],
                'body_parts' => ['Fist', 'Hand', 'Claw', 'Talon', 'Foot', 'Eye', 'Heart', 'Mind', 'Soul', 'Wing', 'Tail', 'Fang', 'Tooth', 'Horn', 'Spine', 'Bone', 'Blood', 'Breath', 'Voice', 'Gaze'],
                'titles' => ['Lord', 'King', 'Queen', 'Master', 'Mistress', 'Champion', 'Hero', 'Warrior', 'Knight', 'Paladin', 'Ranger', 'Rogue', 'Mage', 'Wizard', 'Sorcerer', 'Priest', 'Monk', 'Bard', 'Scholar', 'Sage'],
                'occupations' => ['Smith', 'Forger', 'Crafter', 'Builder', 'Guard', 'Warden', 'Keeper', 'Protector', 'Defender', 'Sentinel', 'Scout', 'Spy', 'Thief', 'Assassin', 'Mercenary', 'Soldier', 'Captain', 'General']
            ],
            'enemy_types' => ['Goblin', 'Orc', 'Troll', 'Giant', 'Dragon', 'Demon', 'Undead', 'Skeleton', 'Zombie', 'Vampire', 'Werewolf', 'Beast', 'Monster', 'Fiend', 'Devil', 'Witch', 'Warlock', 'Bandit', 'Pirate', 'Cultist', 'Assassin', 'Thief', 'Spy', 'Traitor', 'Rebel', 'Heretic']
        ],
        
        // Core elements based on setting
        'core_elements' => [
            'fantasy' => [
                'medieval' => ['Dragon', 'Knight', 'Castle', 'Sword', 'Crown', 'Throne', 'Kingdom', 'Quest', 'Wizard', 'Mage', 'Prophecy', 'Artifact', 'Relic', 'Crystal', 'Stone', 'Tome', 'Grimoire', 'Scroll'],
                'magical' => ['Spell', 'Enchantment', 'Sorcery', 'Magic', 'Illusion', 'Portal', 'Dimension', 'Realm', 'Ethereal', 'Astral', 'Mystic', 'Arcane', 'Eldritch', 'Celestial', 'Divine', 'Infernal', 'Elemental'],
                'dark' => ['Shadow', 'Darkness', 'Void', 'Abyss', 'Nightmare', 'Curse', 'Blight', 'Corruption', 'Decay', 'Death', 'Doom', 'Damnation', 'Torment', 'Suffering', 'Despair', 'Anguish'],
                'forest' => ['Grove', 'Wildwood', 'Greenwood', 'Silverleaf', 'Moonbark', 'Whisperwind', 'Thornvale', 'Mistwood', 'Shadowgrove', 'Brightleaf', 'Ironwood', 'Goldenbough']
            ],
            'modern' => [
                'urban' => ['City', 'Street', 'Building', 'Tower', 'Bridge', 'Station', 'Terminal', 'Complex', 'District', 'Quarter', 'Block', 'Avenue', 'Plaza', 'Square', 'Park', 'Underground'],
                'tech' => ['Code', 'Algorithm', 'Data', 'Network', 'System', 'Protocol', 'Interface', 'Terminal', 'Server', 'Database', 'Program', 'Software', 'Hardware', 'Cyber', 'Digital', 'Virtual'],
                'corporate' => ['Corporation', 'Company', 'Enterprise', 'Industry', 'Business', 'Organization', 'Institution', 'Foundation', 'Society', 'Association', 'Alliance', 'Consortium', 'Syndicate'],
                'thriller' => ['Conspiracy', 'Plot', 'Scheme', 'Operation', 'Mission', 'Assignment', 'Target', 'Objective', 'Secret', 'Cover', 'Identity', 'Alias', 'Contact', 'Source', 'Intelligence']
            ]
        ],
        
        // Gender-specific elements
        'gender_elements' => [
            'male' => ['Lord', 'King', 'Prince', 'Duke', 'Baron', 'Sir', 'Master', 'Father', 'Brother', 'Son', 'Heir', 'Warrior', 'Knight', 'Champion', 'Hero', 'Guardian', 'Protector'],
            'female' => ['Lady', 'Queen', 'Princess', 'Duchess', 'Baroness', 'Dame', 'Mistress', 'Mother', 'Sister', 'Daughter', 'Heiress', 'Warrior', 'Paladin', 'Champion', 'Heroine', 'Guardian', 'Protector'],
            'neutral' => ['Ruler', 'Monarch', 'Noble', 'Leader', 'Commander', 'Captain', 'Guardian', 'Protector', 'Champion', 'Hero', 'Warrior', 'Sage', 'Oracle', 'Mystic', 'Wanderer', 'Seeker']
        ],
        
        // Race-specific elements
        'race_elements' => [
            'human' => ['Mortal', 'Man', 'Woman', 'Person', 'Soul', 'Heart', 'Mind', 'Spirit', 'Will', 'Courage', 'Honor', 'Destiny', 'Legacy', 'Heritage', 'Bloodline'],
            'elf' => ['Elven', 'Firstborn', 'Immortal', 'Eternal', 'Ancient', 'Wise', 'Graceful', 'Silverleaf', 'Moonlight', 'Starlight', 'Twilight', 'Dawn', 'Dusk', 'Whisper', 'Song'],
            'dwarf' => ['Dwarven', 'Stonebeard', 'Ironforge', 'Goldaxe', 'Mountainheart', 'Rockbreaker', 'Gemcutter', 'Forgemaster', 'Battleaxe', 'Warhammer', 'Stronghold', 'Clan', 'Tribe'],
            'orc' => ['Orcish', 'Bloodfang', 'Ironfist', 'Skullcrusher', 'Bonecleaver', 'Warband', 'Horde', 'Tribe', 'Clan', 'Stronghold', 'Fortress', 'Rage', 'Fury', 'Wrath', 'Vengeance'],
            'halfling' => ['Halfling', 'Hobbit', 'Smallfolk', 'Peaceful', 'Gentle', 'Homely', 'Comfortable', 'Cozy', 'Warm', 'Friendly', 'Neighbor', 'Community', 'Village', 'Garden', 'Harvest'],
            'dragonborn' => ['Dragonborn', 'Scaled', 'Wyrmkin', 'Firebreath', 'Stormscale', 'Goldscale', 'Silverscale', 'Ancientblood', 'Dragonheart', 'Wyrmclaw', 'Flameborn', 'Stormborn']
        ],
        
        // Species-specific elements
        'species_elements' => [
            'humanoid' => ['Walker', 'Dweller', 'Inhabitant', 'Citizen', 'Resident', 'Native', 'Tribesman', 'Clansman', 'Kinfolk', 'Bloodkin'],
            'feline' => ['Cat', 'Feline', 'Panther', 'Lion', 'Tiger', 'Leopard', 'Lynx', 'Puma', 'Jaguar', 'Cougar', 'Wildcat', 'Prowler', 'Hunter', 'Stalker', 'Predator'],
            'canine' => ['Wolf', 'Hound', 'Dog', 'Jackal', 'Fox', 'Coyote', 'Dire Wolf', 'Werewolf', 'Packleader', 'Alpha', 'Beta', 'Howler', 'Tracker', 'Scout'],
            'avian' => ['Bird', 'Eagle', 'Hawk', 'Falcon', 'Raven', 'Crow', 'Owl', 'Phoenix', 'Gryphon', 'Windwalker', 'Skyborn', 'Feathered', 'Winged', 'Soaring'],
            'reptilian' => ['Serpent', 'Snake', 'Lizard', 'Dragon', 'Wyrm', 'Basilisk', 'Cobra', 'Viper', 'Scaled', 'Coldblood', 'Slithering', 'Coiling'],
            'aquatic' => ['Fish', 'Shark', 'Whale', 'Dolphin', 'Octopus', 'Kraken', 'Leviathan', 'Deepdweller', 'Tidecaller', 'Wavewalker', 'Seafarer', 'Mariner'],
            'insectoid' => ['Mantis', 'Spider', 'Beetle', 'Ant', 'Wasp', 'Hornet', 'Drone', 'Hive', 'Swarm', 'Chitinous', 'Mandible', 'Carapace']
        ],
        
        // Tone-based adjectives
        'tone_adjectives' => [
            'mysterious' => ['Hidden', 'Secret', 'Forbidden', 'Lost', 'Forgotten', 'Ancient', 'Unknown', 'Veiled', 'Shrouded', 'Enigmatic', 'Cryptic', 'Arcane', 'Occult', 'Shadowy'],
            'heroic' => ['Brave', 'Noble', 'Valiant', 'Courageous', 'Mighty', 'Glorious', 'Legendary', 'Epic', 'Triumphant', 'Victorious', 'Honorable', 'Righteous', 'Just', 'Pure'],
            'dark' => ['Dark', 'Black', 'Cursed', 'Damned', 'Fallen', 'Twisted', 'Corrupted', 'Wicked', 'Evil', 'Sinister', 'Malevolent', 'Vile', 'Foul', 'Tainted'],
            'romantic' => ['Beloved', 'Desired', 'Passionate', 'Tender', 'Sweet', 'Gentle', 'Loving', 'Devoted', 'Faithful', 'True', 'Eternal', 'Undying', 'Heartfelt', 'Soulful'],
            'adventurous' => ['Bold', 'Daring', 'Wild', 'Free', 'Untamed', 'Fearless', 'Reckless', 'Wandering', 'Roaming', 'Exploring', 'Seeking', 'Questing', 'Journeying'],
            'magical' => ['Enchanted', 'Mystical', 'Magical', 'Spellbound', 'Bewitched', 'Charmed', 'Blessed', 'Divine', 'Celestial', 'Ethereal', 'Supernatural', 'Otherworldly']
        ],
        
        // Suffixes for variety
        'suffixes' => [
            'fantasy' => ['Chronicles', 'Saga', 'Tale', 'Legend', 'Song', 'Ballad', 'Epic', 'Quest', 'Journey', 'Adventure', 'War', 'Battle', 'Prophecy', 'Destiny', 'Legacy', 'Heritage'],
            'modern' => ['Files', 'Papers', 'Documents', 'Records', 'Archive', 'Database', 'Protocol', 'Project', 'Operation', 'Mission', 'Case', 'Investigation', 'Report', 'Study', 'Analysis']
        ]
    ];
    
    public function generateTitle($genre, $setting, $tone, $gender, $race, $species, $keywords = '') {
        // 60% chance for compound title (like "Starlight Crusher", "Goblin Slayer")
        if (rand(1, 100) <= 60) {
            return $this->generateCompoundTitle($genre, $setting, $tone, $gender, $race, $species, $keywords);
        }
        
        // 40% chance for traditional title structure
        return $this->generateTraditionalTitle($genre, $setting, $tone, $gender, $race, $species, $keywords);
    }
    
    private function generateCompoundTitle($genre, $setting, $tone, $gender, $race, $species, $keywords = '') {
        $patterns = [
            'element_action' => 0.3,     // "Starlight Crusher", "Shadowbane"
            'enemy_action' => 0.25,      // "Goblin Slayer", "Dragon Hunter"
            'element_bodypart' => 0.2,   // "Ironfist", "Steelclaw", "Doomfoot"
            'attribute_title' => 0.15,   // "Crimson Lord", "Shadow King"
            'simple_compound' => 0.1     // "Stormbringer", "Nightfall"
        ];
        
        $rand = rand(1, 100) / 100;
        $cumulative = 0;
        $chosen_pattern = 'element_action';
        
        foreach ($patterns as $pattern => $probability) {
            $cumulative += $probability;
            if ($rand <= $cumulative) {
                $chosen_pattern = $pattern;
                break;
            }
        }
        
        switch ($chosen_pattern) {
            case 'element_action':
                return $this->generateElementAction($tone, $race, $species);
            case 'enemy_action':
                return $this->generateEnemyAction($tone, $race, $species);
            case 'element_bodypart':
                return $this->generateElementBodypart($tone, $race, $species);
            case 'attribute_title':
                return $this->generateAttributeTitle($tone, $gender, $race);
            case 'simple_compound':
                return $this->generateSimpleCompound($tone, $race, $species);
        }
        
        return $this->generateElementAction($tone, $race, $species);
    }
    
    private function generateElementAction($tone, $race, $species) {
        $element = $this->selectElement($tone, $race, $species);
        $action = $this->selectAction($tone, $species);
        
        // Sometimes merge them into one word (like "Starlight" + "Crusher")
        if (rand(1, 100) <= 30) {
            return $element . $action;
        }
        
        return $element . ' ' . $action;
    }
    
    private function generateEnemyAction($tone, $race, $species) {
        $enemy = $this->components['compound_parts']['enemy_types'][array_rand($this->components['compound_parts']['enemy_types'])];
        $action = $this->selectAction($tone, $species);
        
        return $enemy . ' ' . $action;
    }
    
    private function generateElementBodypart($tone, $race, $species) {
        $element = $this->selectElement($tone, $race, $species);
        $bodypart = $this->components['compound_parts']['second_elements']['body_parts'][array_rand($this->components['compound_parts']['second_elements']['body_parts'])];
        
        // Always merge these (like "Ironfist", "Doomfoot")
        return $element . strtolower($bodypart);
    }
    
    private function generateAttributeTitle($tone, $gender, $race) {
        $element = $this->selectElement($tone, $race, 'humanoid');
        $title = $this->selectTitle($gender);
        
        return $element . ' ' . $title;
    }
    
    private function generateSimpleCompound($tone, $race, $species) {
        $element1 = $this->selectElement($tone, $race, $species);
        $element2 = $this->selectElement($tone, $race, $species);
        
        // Avoid duplicates
        if ($element1 === $element2) {
            $element2 = $this->components['compound_parts']['first_elements']['nature'][array_rand($this->components['compound_parts']['first_elements']['nature'])];
        }
        
        return $element1 . strtolower($element2);
    }
    
    private function selectElement($tone, $race, $species) {
        $categories = ['celestial', 'nature', 'colors', 'mythical', 'emotions', 'weapons'];
        
        // Weight categories based on tone
        $weights = [
            'celestial' => ($tone === 'heroic' || $tone === 'magical') ? 0.3 : 0.1,
            'nature' => 0.25,
            'colors' => 0.15,
            'mythical' => ($tone === 'dark' || $tone === 'mysterious') ? 0.3 : 0.1,
            'emotions' => ($tone === 'dark' || $tone === 'heroic') ? 0.25 : 0.1,
            'weapons' => ($tone === 'heroic' || $tone === 'adventurous') ? 0.25 : 0.1
        ];
        
        // Normalize weights
        $total = array_sum($weights);
        foreach ($weights as $key => $weight) {
            $weights[$key] = $weight / $total;
        }
        
        $rand = rand(1, 100) / 100;
        $cumulative = 0;
        
        foreach ($weights as $category => $weight) {
            $cumulative += $weight;
            if ($rand <= $cumulative) {
                return $this->components['compound_parts']['first_elements'][$category][array_rand($this->components['compound_parts']['first_elements'][$category])];
            }
        }
        
        return $this->components['compound_parts']['first_elements']['nature'][array_rand($this->components['compound_parts']['first_elements']['nature'])];
    }
    
    private function selectAction($tone, $species) {
        $actions = $this->components['compound_parts']['second_elements']['actions'];
        
        // Filter actions based on tone
        if ($tone === 'dark') {
            $dark_actions = ['Slayer', 'Crusher', 'Breaker', 'Destroyer', 'Killer', 'Bringer'];
            $filtered = array_intersect($actions, $dark_actions);
            if (!empty($filtered)) {
                return $filtered[array_rand($filtered)];
            }
        } elseif ($tone === 'heroic') {
            $heroic_actions = ['Bringer', 'Seeker', 'Hunter', 'Creator', 'Protector', 'Defender', 'Champion'];
            $filtered = array_intersect($actions, $heroic_actions);
            if (!empty($filtered)) {
                return $filtered[array_rand($filtered)];
            }
        }
        
        return $actions[array_rand($actions)];
    }
    
    private function selectTitle($gender) {
        $titles = $this->components['compound_parts']['second_elements']['titles'];
        
        if ($gender === 'male') {
            $male_titles = ['Lord', 'King', 'Master', 'Champion', 'Hero', 'Knight', 'Warrior'];
            $filtered = array_intersect($titles, $male_titles);
            if (!empty($filtered)) {
                return $filtered[array_rand($filtered)];
            }
        } elseif ($gender === 'female') {
            $female_titles = ['Queen', 'Mistress', 'Champion', 'Hero', 'Knight', 'Warrior'];
            $filtered = array_intersect($titles, $female_titles);
            if (!empty($filtered)) {
                return $filtered[array_rand($filtered)];
            }
        }
        
        return $titles[array_rand($titles)];
    }
    
    private function generateTraditionalTitle($genre, $setting, $tone, $gender, $race, $species, $keywords = '') {
        $title_parts = [];
        
        // Start with prefix (70% chance)
        if (rand(1, 100) <= 70) {
            $prefixes = $this->components['prefixes'][$genre] ?? $this->components['prefixes']['fantasy'];
            $title_parts[] = $prefixes[array_rand($prefixes)];
        }
        
        // Add tone adjective (60% chance)
        if (rand(1, 100) <= 60) {
            $adjectives = $this->components['tone_adjectives'][$tone] ?? $this->components['tone_adjectives']['mysterious'];
            $title_parts[] = $adjectives[array_rand($adjectives)];
        }
        
        // Add gender element (40% chance)
        if (rand(1, 100) <= 40 && $gender !== 'neutral') {
            $gender_elements = $this->components['gender_elements'][$gender] ?? [];
            if (!empty($gender_elements)) {
                $title_parts[] = $gender_elements[array_rand($gender_elements)];
            }
        }
        
        // Add race element (50% chance)
        if (rand(1, 100) <= 50) {
            $race_elements = $this->components['race_elements'][$race] ?? $this->components['race_elements']['human'];
            $title_parts[] = $race_elements[array_rand($race_elements)];
        }
        
        // Add species element (30% chance, but higher if not humanoid)
        $species_chance = ($species === 'humanoid') ? 30 : 60;
        if (rand(1, 100) <= $species_chance) {
            $species_elements = $this->components['species_elements'][$species] ?? [];
            if (!empty($species_elements)) {
                $title_parts[] = $species_elements[array_rand($species_elements)];
            }
        }
        
        // Add core element based on setting
        $core_elements = $this->components['core_elements'][$genre][$setting] ?? 
                        $this->components['core_elements'][$genre]['medieval'] ?? 
                        $this->components['core_elements']['fantasy']['medieval'];
        $title_parts[] = $core_elements[array_rand($core_elements)];
        
        // Add suffix (40% chance)
        if (rand(1, 100) <= 40) {
            $suffixes = $this->components['suffixes'][$genre] ?? $this->components['suffixes']['fantasy'];
            $title_parts[] = $suffixes[array_rand($suffixes)];
        }
        
        // Combine parts intelligently
        $title = $this->combineParts($title_parts);
        
        // Add keywords if provided
        if (!empty($keywords)) {
            $title .= ": " . ucwords($keywords);
        }
        
        return $title;
    }
    
    private function combineParts($parts) {
        if (empty($parts)) {
            return "Untitled";
        }
        
        // Remove duplicates while preserving order
        $parts = array_unique($parts);
        
        // Handle different combination patterns
        $patterns = [
            // Pattern 1: "The [Adjective] [Noun]"
            function($parts) {
                if (count($parts) >= 2) {
                    return implode(' ', array_slice($parts, 0, 3));
                }
                return implode(' ', $parts);
            },
            
            // Pattern 2: "[Noun] of [Noun]"
            function($parts) {
                if (count($parts) >= 2) {
                    return $parts[0] . ' of ' . $parts[1];
                }
                return implode(' ', $parts);
            },
            
            // Pattern 3: "[Adjective] [Noun]: [Noun]"
            function($parts) {
                if (count($parts) >= 3) {
                    return $parts[0] . ' ' . $parts[1] . ': ' . $parts[2];
                }
                return implode(' ', $parts);
            },
            
            // Pattern 4: Simple concatenation
            function($parts) {
                return implode(' ', array_slice($parts, 0, 4));
            }
        ];
        
        $pattern = $patterns[array_rand($patterns)];
        $result = $pattern($parts);
        
        // Ensure proper capitalization
        return ucwords(strtolower($result));
    }
}

// Generate titles
$generator = new TitleGenerator();
$titles = [];

for ($i = 0; $i < $count; $i++) {
    $titles[] = $generator->generateTitle($genre, $setting, $tone, $gender, $race, $species, $keywords);
}

// Return JSON response
echo json_encode([
    'titles' => $titles,
    'parameters' => [
        'type' => $type,
        'genre' => $genre,
        'setting' => $setting,
        'tone' => $tone,
        'gender' => $gender,
        'race' => $race,
        'species' => $species,
        'keywords' => $keywords,
        'count' => $count
    ]
]);
?>