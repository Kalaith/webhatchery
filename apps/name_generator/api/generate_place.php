<?php
header('Content-Type: application/json');

// Get parameters
$genre = $_GET['genre'] ?? 'fantasy';
$location_type = $_GET['location_type'] ?? 'city';
$tone = $_GET['tone'] ?? 'neutral';
$setting = $_GET['setting'] ?? 'medieval';
$size = $_GET['size'] ?? 'medium';
$climate = $_GET['climate'] ?? 'temperate';
$count = intval($_GET['count'] ?? 1);

class LocationGenerator {
    private $components = [
        // Reused elements from title generator
        'base_elements' => [
            'celestial' => ['Star', 'Moon', 'Sun', 'Comet', 'Nova', 'Void', 'Galaxy', 'Nebula', 'Cosmic', 'Stellar', 'Solar', 'Lunar', 'Astral', 'Celestial', 'Aurora', 'Eclipse', 'Zenith'],
            'nature' => ['Stone', 'Iron', 'Steel', 'Fire', 'Ice', 'Storm', 'Thunder', 'Lightning', 'Wind', 'Earth', 'Water', 'Shadow', 'Light', 'Crystal', 'Diamond', 'Gold', 'Silver', 'Blood', 'Bone', 'Soul', 'Spirit', 'Mist', 'Frost', 'Ember'],
            'colors' => ['Red', 'Blue', 'Green', 'Black', 'White', 'Gold', 'Silver', 'Crimson', 'Azure', 'Emerald', 'Obsidian', 'Ivory', 'Scarlet', 'Violet', 'Amber', 'Copper', 'Bronze', 'Platinum'],
            'mythical' => ['Dragon', 'Phoenix', 'Griffin', 'Unicorn', 'Pegasus', 'Wyvern', 'Basilisk', 'Kraken', 'Leviathan', 'Sphinx', 'Chimera', 'Hydra', 'Gargoyle', 'Golem'],
            'emotions' => ['Rage', 'Fury', 'Wrath', 'Sorrow', 'Joy', 'Hope', 'Fear', 'Despair', 'Love', 'Hate', 'Pride', 'Shame', 'Honor', 'Glory', 'Peace', 'Serenity', 'Chaos'],
            'directions' => ['North', 'South', 'East', 'West', 'Upper', 'Lower', 'High', 'Deep', 'Far', 'Near', 'Beyond', 'Under', 'Over', 'Inner', 'Outer', 'Central', 'Remote']
        ],
        
        // Location-specific elements
        'location_descriptors' => [
            'size' => [
                'tiny' => ['Little', 'Small', 'Minor', 'Lesser', 'Tiny', 'Mini', 'Micro', 'Pocket'],
                'small' => ['Small', 'Lesser', 'Minor', 'Lower', 'Short', 'Brief', 'Compact'],
                'medium' => ['Mid', 'Middle', 'Central', 'Main', 'Core', 'Heart', 'Center'],
                'large' => ['Great', 'Grand', 'Major', 'Big', 'Vast', 'Wide', 'Broad', 'Massive'],
                'huge' => ['Giant', 'Enormous', 'Colossal', 'Titan', 'Mega', 'Ultra', 'Super', 'Hyper']
            ],
            'climate' => [
                'cold' => ['Frozen', 'Ice', 'Snow', 'Winter', 'Frost', 'Blizzard', 'Glacier', 'Arctic', 'Polar', 'Tundra'],
                'hot' => ['Burning', 'Flame', 'Fire', 'Desert', 'Scorching', 'Blazing', 'Searing', 'Molten', 'Volcanic'],
                'temperate' => ['Green', 'Pleasant', 'Mild', 'Gentle', 'Calm', 'Peaceful', 'Serene', 'Balanced'],
                'tropical' => ['Paradise', 'Palm', 'Coral', 'Tropical', 'Exotic', 'Lush', 'Verdant', 'Jungle'],
                'arid' => ['Dry', 'Dust', 'Sand', 'Barren', 'Harsh', 'Rugged', 'Weathered', 'Parched']
            ]
        ],
        
        // Geographic feature types
        'geographic_features' => [
            'fantasy' => [
                'water' => ['Falls', 'River', 'Lake', 'Bay', 'Creek', 'Stream', 'Rapids', 'Spring', 'Pool', 'Cascade', 'Waterfall', 'Fjord', 'Lagoon', 'Pond', 'Well', 'Fountain'],
                'land' => ['Hill', 'Mountain', 'Valley', 'Ridge', 'Peak', 'Canyon', 'Gorge', 'Mesa', 'Plateau', 'Cliff', 'Bluff', 'Ravine', 'Gulch', 'Pass', 'Gap', 'Hollow'],
                'forest' => ['Wood', 'Woods', 'Forest', 'Grove', 'Thicket', 'Copse', 'Glade', 'Clearing', 'Wilderness', 'Timberland', 'Woodland', 'Jungle', 'Rainforest'],
                'mystical' => ['Gate', 'Portal', 'Sanctum', 'Shrine', 'Temple', 'Altar', 'Circle', 'Nexus', 'Vortex', 'Rift', 'Breach', 'Crossing', 'Threshold', 'Convergence']
            ],
            'modern' => [
                'urban' => ['City', 'Town', 'Village', 'Borough', 'District', 'Quarter', 'Suburb', 'Township', 'Municipality', 'Metro', 'Downtown', 'Uptown', 'Midtown'],
                'infrastructure' => ['Bridge', 'Plaza', 'Square', 'Park', 'Avenue', 'Boulevard', 'Street', 'Road', 'Highway', 'Terminal', 'Station', 'Complex', 'Center', 'Hub'],
                'commercial' => ['Mall', 'Market', 'Plaza', 'Center', 'Complex', 'District', 'Zone', 'Strip', 'Corner', 'Block', 'Building', 'Tower', 'Offices'],
                'natural' => ['Falls', 'River', 'Lake', 'Bay', 'Creek', 'Stream', 'Park', 'Reserve', 'Preserve', 'Gardens', 'Beach', 'Shore', 'Coast', 'Island']
            ]
        ],
        
        // Settlement types
        'settlement_types' => [
            'fantasy' => [
                'small' => ['Village', 'Hamlet', 'Settlement', 'Outpost', 'Crossing', 'Haven', 'Refuge', 'Sanctuary'],
                'medium' => ['Town', 'Borough', 'Keep', 'Hold', 'Fort', 'Stronghold', 'Trading Post', 'Market Town'],
                'large' => ['City', 'Capital', 'Metropolis', 'Fortress', 'Citadel', 'Bastion', 'Stronghold', 'Empire']
            ],
            'modern' => [
                'small' => ['Village', 'Town', 'Township', 'Borough', 'Hamlet', 'Settlement', 'Community', 'Neighborhood'],
                'medium' => ['City', 'Municipality', 'Metro', 'District', 'County', 'Province', 'Region', 'Zone'],
                'large' => ['Metropolis', 'Megalopolis', 'Capital', 'Metropolitan Area', 'Urban Center', 'Megacity']
            ]
        ],
        
        // Prefixes and suffixes for variety
        'prefixes' => [
            'fantasy' => ['Old', 'New', 'Ancient', 'Lost', 'Hidden', 'Sacred', 'Cursed', 'Blessed', 'Forgotten', 'Eternal', 'Mystic', 'Elder', 'Prime', 'True', 'False'],
            'modern' => ['New', 'Old', 'Greater', 'Lesser', 'Upper', 'Lower', 'North', 'South', 'East', 'West', 'Central', 'Metro', 'Downtown', 'Uptown', 'Suburban']
        ],
        
        'suffixes' => [
            'fantasy' => ['heim', 'burg', 'haven', 'garde', 'wald', 'holt', 'mere', 'shire', 'dale', 'fell', 'moor', 'thorpe', 'by', 'ton', 'ford', 'worth'],
            'modern' => ['ville', 'ton', 'burg', 'field', 'wood', 'land', 'view', 'side', 'port', 'ford', 'bridge', 'hill', 'dale', 'grove', 'heights', 'springs']
        ]
    ];
    
    public function generateLocation($genre, $location_type, $tone, $setting, $size, $climate) {
        // Different generation patterns
        $patterns = [
            'element_feature' => 0.35,      // "Crystal Falls", "Iron Mountain"
            'descriptor_feature' => 0.25,   // "Great Lake", "Deep Canyon"
            'prefix_element_feature' => 0.2, // "Old Stone Bridge", "New Silver City"
            'compound_settlement' => 0.1,   // "Ironwood", "Goldenhaven"
            'suffix_settlement' => 0.1      // "Riverton", "Mountainville"
        ];
        
        $rand = rand(1, 100) / 100;
        $cumulative = 0;
        $chosen_pattern = 'element_feature';
        
        foreach ($patterns as $pattern => $probability) {
            $cumulative += $probability;
            if ($rand <= $cumulative) {
                $chosen_pattern = $pattern;
                break;
            }
        }
        
        switch ($chosen_pattern) {
            case 'element_feature':
                return $this->generateElementFeature($genre, $location_type, $tone, $climate);
            case 'descriptor_feature':
                return $this->generateDescriptorFeature($genre, $location_type, $size, $climate);
            case 'prefix_element_feature':
                return $this->generatePrefixElementFeature($genre, $location_type, $tone, $climate);
            case 'compound_settlement':
                return $this->generateCompoundSettlement($genre, $location_type, $tone, $climate);
            case 'suffix_settlement':
                return $this->generateSuffixSettlement($genre, $location_type, $tone, $climate);
        }
        
        return $this->generateElementFeature($genre, $location_type, $tone, $climate);
    }
    
    private function generateElementFeature($genre, $location_type, $tone, $climate) {
        $element = $this->selectElement($tone, $climate);
        $feature = $this->selectFeature($genre, $location_type);
        
        return $element . ' ' . $feature;
    }
    
    private function generateDescriptorFeature($genre, $location_type, $size, $climate) {
        $descriptor = $this->selectDescriptor($size, $climate);
        $feature = $this->selectFeature($genre, $location_type);
        
        return $descriptor . ' ' . $feature;
    }
    
    private function generatePrefixElementFeature($genre, $location_type, $tone, $climate) {
        $prefix = $this->components['prefixes'][$genre][array_rand($this->components['prefixes'][$genre])];
        $element = $this->selectElement($tone, $climate);
        $feature = $this->selectFeature($genre, $location_type);
        
        return $prefix . ' ' . $element . ' ' . $feature;
    }
    
    private function generateCompoundSettlement($genre, $location_type, $tone, $climate) {
        $element1 = $this->selectElement($tone, $climate);
        $element2 = $this->selectElement($tone, $climate);
        
        // Ensure different elements
        $attempts = 0;
        while ($element1 === $element2 && $attempts < 5) {
            $element2 = $this->selectElement($tone, $climate);
            $attempts++;
        }
        
        // Sometimes add a suffix for settlement feel
        if ($location_type === 'settlement' && rand(1, 100) <= 60) {
            $suffix = $this->components['suffixes'][$genre][array_rand($this->components['suffixes'][$genre])];
            return $element1 . strtolower($element2) . $suffix;
        }
        
        return $element1 . strtolower($element2);
    }
    
    private function generateSuffixSettlement($genre, $location_type, $tone, $climate) {
        $element = $this->selectElement($tone, $climate);
        $suffix = $this->components['suffixes'][$genre][array_rand($this->components['suffixes'][$genre])];
        
        return $element . $suffix;
    }
    
    private function selectElement($tone, $climate) {
        $categories = ['celestial', 'nature', 'colors', 'mythical', 'emotions', 'directions'];
        
        // Weight categories based on tone and climate
        $weights = [
            'celestial' => ($tone === 'mystical' || $tone === 'heroic') ? 0.25 : 0.15,
            'nature' => 0.3,
            'colors' => 0.2,
            'mythical' => ($tone === 'mystical' || $tone === 'dark') ? 0.25 : 0.1,
            'emotions' => ($tone === 'dark' || $tone === 'heroic') ? 0.2 : 0.1,
            'directions' => 0.15
        ];
        
        // Adjust for climate
        if ($climate === 'cold') {
            $cold_elements = ['Ice', 'Snow', 'Frost', 'Winter', 'Crystal', 'Silver', 'White', 'Azure'];
            return $cold_elements[array_rand($cold_elements)];
        } elseif ($climate === 'hot') {
            $hot_elements = ['Fire', 'Flame', 'Sun', 'Gold', 'Ember', 'Crimson', 'Scarlet', 'Bronze'];
            return $hot_elements[array_rand($hot_elements)];
        }
        
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
                return $this->components['base_elements'][$category][array_rand($this->components['base_elements'][$category])];
            }
        }
        
        return $this->components['base_elements']['nature'][array_rand($this->components['base_elements']['nature'])];
    }
    
    private function selectDescriptor($size, $climate) {
        // First try size-based descriptors
        if (isset($this->components['location_descriptors']['size'][$size])) {
            if (rand(1, 100) <= 60) {
                return $this->components['location_descriptors']['size'][$size][array_rand($this->components['location_descriptors']['size'][$size])];
            }
        }
        
        // Then try climate-based descriptors
        if (isset($this->components['location_descriptors']['climate'][$climate])) {
            return $this->components['location_descriptors']['climate'][$climate][array_rand($this->components['location_descriptors']['climate'][$climate])];
        }
        
        // Fallback to size descriptors
        $all_sizes = array_merge(...array_values($this->components['location_descriptors']['size']));
        return $all_sizes[array_rand($all_sizes)];
    }
    
    private function selectFeature($genre, $location_type) {
        $features = [];
        
        if ($location_type === 'settlement') {
            $settlement_types = $this->components['settlement_types'][$genre];
            $features = array_merge(...array_values($settlement_types));
        } else {
            // For geographic features, select based on location_type
            if (isset($this->components['geographic_features'][$genre][$location_type])) {
                $features = $this->components['geographic_features'][$genre][$location_type];
            } else {
                // Fallback to all geographic features
                $all_features = $this->components['geographic_features'][$genre];
                $features = array_merge(...array_values($all_features));
            }
        }
        
        return $features[array_rand($features)];
    }
}

// Generate locations
$generator = new LocationGenerator();
$locations = [];

for ($i = 0; $i < $count; $i++) {
    $locations[] = $generator->generateLocation($genre, $location_type, $tone, $setting, $size, $climate);
}

// Return JSON response
echo json_encode([
    'locations' => $locations,
    'parameters' => [
        'genre' => $genre,
        'location_type' => $location_type,
        'tone' => $tone,
        'setting' => $setting,
        'size' => $size,
        'climate' => $climate,
        'count' => $count
    ]
]);
?>