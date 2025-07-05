<?php

class NameGenerators {
    private $phoneticPatterns;
    private $syllableBanks;
    private $markovChains;

    public function __construct() {
        $this->initializeData();
    }

    private function initializeData() {
        $this->phoneticPatterns = [
            'western' => [
                'vowels' => ['a', 'e', 'i', 'o', 'u'],
                'consonants' => ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'y', 'z'],
                'patterns' => ['CVC', 'CVCV', 'CVCCV'],
                'endings' => ['son', 'ton', 'field', 'berg', 'ing']
            ],
            'nordic' => [
                'vowels' => ['a', 'e', 'i', 'o', 'u', 'å', 'ä', 'ö'],
                'consonants' => ['b', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'],
                'patterns' => ['CVC', 'CVCC', 'CCVC'],
                'endings' => ['son', 'sen', 'sson', 'dottir', 'berg', 'ström']
            ]
        ];

        $this->syllableBanks = [
            'western' => [
                'first' => ['Al', 'An', 'Ar', 'Ben', 'Bri', 'Char', 'Dan', 'Ed', 'Eli', 'Fra'],
                'middle' => ['a', 'an', 'ar', 'bert', 'der', 'er', 'la', 'le', 'li', 'lo'],
                'last' => ['ander', 'bert', 'son', 'ton', 'ward', 'wood', 'worth', 'field', 'ham']
            ]
        ];

        $this->markovChains = [];
        $this->initializeMarkovChains();
    }

    private function initializeMarkovChains() {
        $this->markovChains['western'] = [
            'male' => $this->buildMarkovChain([
                'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
                'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
                'Kenneth', 'Kevin', 'Brian', 'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan',
                'Jacob', 'Gary', 'Nicholas', 'Eric', 'Stephen', 'Jonathan', 'Larry', 'Justin', 'Scott', 'Brandon',
                'Benjamin', 'Samuel', 'Gregory', 'Frank', 'Alexander', 'Raymond', 'Patrick', 'Jack', 'Dennis', 'Jerry',
                'Tyler', 'Aaron', 'Jose', 'Henry', 'Adam', 'Douglas', 'Nathan', 'Peter', 'Zachary', 'Kyle', 'Walter',
                'Harold', 'Jeremy', 'Ethan', 'Carl', 'Keith', 'Roger', 'Gerald', 'Christian', 'Terry', 'Sean',
                'Arthur', 'Austin', 'Noah', 'Lawrence', 'Jesse', 'Joe', 'Bryan', 'Billy', 'Jordan', 'Albert',
                'Dylan', 'Bruce', 'Willie', 'Gabriel', 'Alan', 'Juan', 'Logan', 'Wayne', 'Ralph', 'Roy',
                'Eugene', 'Randy', 'Vincent', 'Russell', 'Louis', 'Philip', 'Bobby', 'Johnny', 'Bradley', 'Mary',
            ]),
            'female' => $this->buildMarkovChain([
                'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
                'Nancy', 'Lisa', 'Margaret', 'Betty', 'Sandra', 'Ashley', 'Dorothy', 'Kimberly', 'Emily', 'Donna',
                'Michelle', 'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Laura', 'Sharon', 'Cynthia',
                'Kathleen', 'Helen', 'Amy', 'Shirley', 'Angela', 'Anna', 'Brenda', 'Pamela', 'Nicole', 'Emma',
                'Samantha', 'Katherine', 'Christine', 'Debra', 'Rachel', 'Catherine', 'Carolyn', 'Janet', 'Ruth', 'Maria',
                'Heather', 'Diane', 'Virginia', 'Julie', 'Joyce', 'Victoria', 'Olivia', 'Kelly', 'Christina', 'Lauren',
                'Joan', 'Evelyn', 'Judith', 'Megan', 'Cheryl', 'Andrea', 'Hannah', 'Martha', 'Jacqueline', 'Frances',
                'Gloria', 'Ann', 'Teresa', 'Kathryn', 'Sara', 'Janice', 'Jean', 'Alice', 'Madison', 'Doris',
                'Abigail', 'Julia', 'Judy', 'Grace', 'Denise', 'Amber', 'Marilyn', 'Beverly', 'Danielle', 'Theresa',
                'Sophia', 'Marie', 'Diana', 'Brittany', 'Natalie', 'Isabella', 'Charlotte', 'Rose', 'Alexis', 'Kayla',
            ]),
            'surname' => $this->buildMarkovChain([
                'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
                'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
                'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
                'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
            ])
        ];
    }

    private function buildMarkovChain($names, $order = 2) {
        $chain = [];
        foreach ($names as $name) {
            $normalizedName = strtolower($name);
            for ($i = 0; $i <= strlen($normalizedName) - $order; $i++) {
                $key = substr($normalizedName, $i, $order);
                $nextChar = $normalizedName[$i + $order] ?? '$';
                $chain[$key][] = $nextChar;
            }
        }
        return $chain;
    }

    public function generateMarkovName($culture, $gender) {
        // If culture is 'any', pick a random available culture
        if ($culture === 'any' || !isset($this->markovChains[$culture])) {
            $cultureKeys = array_keys($this->markovChains);
            if (empty($cultureKeys)) return "Invalid culture or gender";
            $culture = $cultureKeys[array_rand($cultureKeys)];
        }
        // If gender is 'any', pick a random available gender for this culture
        if ($gender === 'any' || !isset($this->markovChains[$culture][$gender])) {
            $genderKeys = array_keys($this->markovChains[$culture]);
            if (empty($genderKeys)) return "Invalid culture or gender";
            $gender = $genderKeys[array_rand($genderKeys)];
        }
        $chain = $this->markovChains[$culture][$gender] ?? null;
        if (!$chain) return "Invalid culture or gender";

        $attempts = 0;
        $minLength = 2;
        $maxLength = 10;
        while ($attempts < 20) {
            $name = '';
            $current = array_rand($chain);
            $endCount = 0;
            while (true) {
                $nextChar = $chain[$current][array_rand($chain[$current])];
                if ($nextChar === '$') {
                    $endCount++;
                    // Allow up to 2 end tokens to be skipped to encourage longer names
                    if ($endCount > 2 || strlen($name) >= $maxLength) break;
                    // Otherwise, pick a new random key and continue
                    $current = array_rand($chain);
                    continue;
                }
                $name .= $nextChar;
                $current = substr($current, 1) . $nextChar;
                if (strlen($name) >= $maxLength) break;
            }
            if (strlen($name) >= $minLength && strlen($name) <= $maxLength) {
                return ucfirst($name);
            }
            $attempts++;
        }
        return "No name generated";
    }

    public function generateSyllableName($culture) {
        $syllables = $this->syllableBanks[$culture] ?? $this->syllableBanks['western'];
        $name = $syllables['first'][array_rand($syllables['first'])] .
                $syllables['middle'][array_rand($syllables['middle'])] .
                $syllables['last'][array_rand($syllables['last'])];
        return ucfirst($name);
    }

    public function generatePhoneticName($culture, $gender) {
        $patterns = $this->phoneticPatterns[$culture] ?? $this->phoneticPatterns['western'];
        $pattern = $patterns['patterns'][array_rand($patterns['patterns'])];
        $name = '';
        foreach (str_split($pattern) as $char) {
            $name .= $char === 'C' ? $patterns['consonants'][array_rand($patterns['consonants'])] : $patterns['vowels'][array_rand($patterns['vowels'])];
        }
        return ucfirst($name);
    }

    public function generateHistoricalName($culture, $period, $gender) {
        $periodModifiers = [
            'ancient' => ['suffix' => ['us', 'ius', 'anus'], 'prefix' => ['Gaius', 'Marcus', 'Lucius']],
            'medieval' => ['suffix' => ['wine', 'bert', 'wald'], 'prefix' => ['Aethel', 'God', 'Wil']],
            'victorian' => ['suffix' => ['ington', 'worth', 'ley'], 'formal' => true]
        ];

        $baseName = $this->generateMarkovName($culture, $gender);
        $modifier = $periodModifiers[$period] ?? null;

        if ($modifier) {
            if (isset($modifier['suffix']) && rand(0, 100) > 60) {
                $baseName .= $modifier['suffix'][array_rand($modifier['suffix'])];
            }
            if (isset($modifier['prefix']) && rand(0, 100) > 70) {
                $baseName = $modifier['prefix'][array_rand($modifier['prefix'])] . strtolower($baseName);
            }
            if (isset($modifier['formal'])) {
                $baseName = $this->formalizeVictorianName($baseName);
            }
        }

        return ucfirst($baseName);
    }

    private function formalizeVictorianName($name) {
        $victorianPrefixes = ['Lord', 'Lady', 'Sir', 'Dame'];
        $formalSuffixes = ['ington', 'worth', 'shire', 'ford'];

        if (rand(0, 100) > 70) {
            $name = $victorianPrefixes[array_rand($victorianPrefixes)] . ' ' . $name;
        }

        if (rand(0, 100) > 50) {
            $name .= $formalSuffixes[array_rand($formalSuffixes)];
        }

        return $name;
    }

    public function generatePlaceName($type, $style, $method) {
        switch ($method) {
            case 'markov_chain':
                return $this->generateMarkovPlace($type, $style);
            case 'syllable_based':
                return $this->generateSyllablePlace($type, $style);
            case 'phonetic_pattern':
                return $this->generatePhoneticPlace($type, $style);
            case 'historical_pattern':
                return $this->generateHistoricalPlace($type, $style);
            default:
                return $this->generateProceduralPlace($type, $style);
        }
    }

    private function generateMarkovPlace($type, $style) {
        $placeComponents = [
            'city' => ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
            'landmark' => ['Mount Everest', 'Grand Canyon', 'Niagara Falls'],
            'country' => ['United States', 'Canada', 'Mexico']
        ];

        $chain = $this->buildMarkovChain($placeComponents[$type] ?? $placeComponents['city'], 2);
        return $this->generateFromMarkovChain($chain, 4, 15) ?? $this->generateSyllablePlace($type, $style);
    }

    private function generateSyllablePlace($type, $style) {
        $placeSyllables = [
            'fantasy' => [
                'prefixes' => ['Eld', 'Myst', 'Sil'],
                'suffixes' => ['heim', 'garde', 'burg']
            ],
            'realistic' => [
                'prefixes' => ['New', 'Old', 'North'],
                'suffixes' => ['ton', 'ville', 'field']
            ]
        ];

        $syllableSet = $placeSyllables[$style] ?? $placeSyllables['realistic'];
        $prefix = $syllableSet['prefixes'][array_rand($syllableSet['prefixes'])];
        $suffix = $syllableSet['suffixes'][array_rand($syllableSet['suffixes'])];

        return $prefix . $suffix;
    }

    private function generatePhoneticPlace($type, $style) {
        $patterns = $this->phoneticPatterns['western'];
        $pattern = ['CVCVC', 'CVCCVC', 'CVCVCV'][array_rand(['CVCVC', 'CVCCVC', 'CVCVCV'])];

        $name = '';
        foreach (str_split($pattern) as $char) {
            $name .= $char === 'C' ? $patterns['consonants'][array_rand($patterns['consonants'])] : $patterns['vowels'][array_rand($patterns['vowels'])];
        }

        $geoSuffixes = ['ton', 'ville', 'burg', 'field'];
        $name .= $geoSuffixes[array_rand($geoSuffixes)];

        return ucfirst($name);
    }

    private function generateHistoricalPlace($type, $style) {
        $historicalPatterns = [
            'ancient' => ['prefixes' => ['Aqua', 'Terra'], 'suffixes' => ['polis', 'burg']],
            'medieval' => ['prefixes' => ['Castle', 'Fort'], 'suffixes' => ['shire', 'wick']]
        ];

        $pattern = $historicalPatterns['ancient'];
        $prefix = $pattern['prefixes'][array_rand($pattern['prefixes'])];
        $suffix = $pattern['suffixes'][array_rand($pattern['suffixes'])];

        return $prefix . $suffix;
    }

    private function generateProceduralPlace($type, $style) {
        $baseWords = ['River', 'Mountain', 'Valley'];
        $descriptors = ['Blue', 'Green', 'Silent'];

        $descriptor = $descriptors[array_rand($descriptors)];
        $base = $baseWords[array_rand($baseWords)];

        return "$descriptor $base";
    }

    private function generateFromMarkovChain($chain, $minLength, $maxLength) {
        $name = '';
        $current = array_rand($chain);
        $attempts = 0;

        while ($attempts < 100) {
            $possibleNext = $chain[$current] ?? null;
            if (!$possibleNext) break;

            $nextChar = $possibleNext[array_rand($possibleNext)];
            if ($nextChar === '$') {
                if (strlen($name) >= $minLength) break;
                $name = '';
                $current = array_rand($chain);
                $attempts++;
                continue;
            }

            $name .= $nextChar;
            if (strlen($name) >= $maxLength) break;

            $current = substr($current, 1) . $nextChar;
            $attempts++;
        }

        return $name;
    }
}

?>
