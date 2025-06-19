// Enhanced Name Generation Algorithms
// Separated from main app.js for better code organization

class NameGenerators {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Phonetic patterns for different cultures
        this.phoneticPatterns = {
            western: {
                vowels: ['a', 'e', 'i', 'o', 'u'],
                consonants: ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'y', 'z'],
                patterns: ['CVC', 'CVCV', 'CVCCV', 'VCCV'],
                endings: ['son', 'ton', 'field', 'berg', 'ing']
            },
            nordic: {
                vowels: ['a', 'e', 'i', 'o', 'u', 'å', 'ä', 'ö'],
                consonants: ['b', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'],
                patterns: ['CVC', 'CVCC', 'CCVC'],
                endings: ['son', 'sen', 'sson', 'dottir', 'berg', 'ström']
            },
            eastern: {
                vowels: ['a', 'i', 'u', 'e', 'o'],
                consonants: ['k', 't', 's', 'n', 'h', 'm', 'r', 'w', 'g', 'z', 'b', 'd', 'p'],
                patterns: ['CVCV', 'CVCVCV', 'CVCCV'],
                endings: ['ro', 'ko', 'to', 'ki', 'shi']
            },
            arabic: {
                vowels: ['a', 'i', 'u'],
                consonants: ['b', 'd', 'f', 'h', 'j', 'k', 'l', 'm', 'n', 'q', 'r', 's', 't', 'w', 'y', 'z'],
                patterns: ['CvCvC', 'CvCCvC', 'CvCvCv'],
                prefixes: ['al-', 'abd-', 'abu-'],
                endings: ['ah', 'in', 'an']
            }
        };

        // Syllable banks for syllable-based generation
        this.syllableBanks = {
            western: {
                first: ['Al', 'An', 'Ar', 'Ben', 'Bri', 'Char', 'Dan', 'Ed', 'Eli', 'Fra', 'Geo', 'Hen', 'Ja', 'Jo', 'Ke', 'Lu', 'Ma', 'Ni', 'Pa', 'Ri', 'Sa', 'Th', 'Wi'],
                middle: ['a', 'an', 'ar', 'bert', 'der', 'er', 'la', 'le', 'li', 'lo', 'na', 'ne', 'ri', 'ro', 'sa', 'ta', 'the', 'ti', 'to', 'ward'],
                last: ['ander', 'bert', 'son', 'ton', 'ward', 'wood', 'worth', 'field', 'ham', 'ley', 'ford', 'well', 'hill', 'dale', 'brook', 'stone', 'land', 'burg']
            },
            fantasy: {
                first: ['Aer', 'Aeth', 'Bel', 'Cel', 'Dae', 'Eld', 'Fae', 'Gal', 'Hal', 'Ith', 'Kal', 'Lyr', 'Mor', 'Nal', 'Orl', 'Pha', 'Quin', 'Rae', 'Syl', 'Thal', 'Vel', 'Wyn', 'Xar', 'Zeph'],
                middle: ['a', 'an', 'ar', 'dor', 'eth', 'ia', 'iel', 'ion', 'ith', 'las', 'len', 'mor', 'oth', 'ris', 'tar', 'ven', 'win', 'wyn', 'ior', 'ael'],
                last: ['aeth', 'andor', 'arion', 'dain', 'dorian', 'elian', 'fin', 'gorn', 'heron', 'iel', 'ion', 'las', 'mir', 'nor', 'oth', 'quan', 'rion', 'thar', 'ven', 'win']
            }
        };

        // Cultural name components
        this.culturalComponents = {
            western: {
                firstMale: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher'],
                firstFemale: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen'],
                surnames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
            },
            nordic: {
                firstMale: ['Erik', 'Lars', 'Magnus', 'Nils', 'Olaf', 'Bjorn', 'Gunnar', 'Ragnar', 'Sven', 'Thor'],
                firstFemale: ['Astrid', 'Ingrid', 'Sigrid', 'Freya', 'Saga', 'Liv', 'Maja', 'Elsa', 'Anja', 'Karin'],
                surnames: ['Eriksson', 'Andersson', 'Johansson', 'Petersson', 'Nilsson', 'Lindgren', 'Bergström', 'Nordström', 'Svensson', 'Karlsson']
            }
        };

        // Initialize Markov chains
        this.markovChains = {};
        this.initializeMarkovChains();
    }

    initializeMarkovChains() {
        // Build Markov chains for each culture
        Object.keys(this.culturalComponents).forEach(culture => {
            this.markovChains[culture] = {
                male: this.buildMarkovChain(this.culturalComponents[culture].firstMale),
                female: this.buildMarkovChain(this.culturalComponents[culture].firstFemale),
                surname: this.buildMarkovChain(this.culturalComponents[culture].surnames)
            };
        });
    }

    buildMarkovChain(names, order = 2) {
        const chain = {};
        
        names.forEach(name => {
            const normalizedName = name.toLowerCase();
            
            // Add start tokens
            for (let i = 0; i < order; i++) {
                const key = '^'.repeat(order - i) + normalizedName.substring(0, i);
                const nextChar = normalizedName[i] || '$';
                
                if (!chain[key]) chain[key] = [];
                chain[key].push(nextChar);
            }
            
            // Add character transitions
            for (let i = 0; i <= normalizedName.length - order; i++) {
                const key = normalizedName.substring(i, i + order);
                const nextChar = normalizedName[i + order] || '$';
                
                if (!chain[key]) chain[key] = [];
                chain[key].push(nextChar);
            }
        });
        
        return chain;
    }

    generateMarkovName(culture, gender, minLength = 3, maxLength = 12) {
        const chain = this.markovChains[culture]?.[gender];
        if (!chain) return this.generatePhoneticName(culture, gender);

        let name = '';
        let current = '^^'; // Start token
        let attempts = 0;
        const maxAttempts = 100;

        while (attempts < maxAttempts) {
            const possibleNext = chain[current];
            if (!possibleNext || possibleNext.length === 0) break;

            const nextChar = possibleNext[Math.floor(Math.random() * possibleNext.length)];
            
            if (nextChar === '$') {
                if (name.length >= minLength) break;
                // Restart if too short
                name = '';
                current = '^^';
                attempts++;
                continue;
            }

            name += nextChar;
            if (name.length >= maxLength) break;

            current = current.substring(1) + nextChar;
            attempts++;
        }

        return name ? this.capitalizeFirst(name) : this.generatePhoneticName(culture, gender);
    }

    generatePhoneticName(culture, gender) {
        const patterns = this.phoneticPatterns[culture] || this.phoneticPatterns.western;
        const pattern = this.randomChoice(patterns.patterns);
        
        let name = '';
        for (const char of pattern) {
            if (char === 'C') {
                name += this.randomChoice(patterns.consonants);
            } else if (char === 'V' || char === 'v') {
                name += this.randomChoice(patterns.vowels);
            }
        }

        // Add cultural endings for surnames
        if (patterns.endings && Math.random() > 0.5) {
            name += this.randomChoice(patterns.endings);
        }

        return this.capitalizeFirst(name);
    }

    generateSyllableName(culture, type = 'first') {
        const syllables = this.syllableBanks[culture] || this.syllableBanks.western;
        const numSyllables = Math.floor(Math.random() * 3) + 2; // 2-4 syllables
        
        let name = '';
        for (let i = 0; i < numSyllables; i++) {
            if (i === 0 && syllables.first) {
                name += this.randomChoice(syllables.first);
            } else if (i === numSyllables - 1 && syllables.last && type === 'surname') {
                name += this.randomChoice(syllables.last);
            } else if (syllables.middle) {
                name += this.randomChoice(syllables.middle);
            } else {
                name += this.randomChoice(syllables.first);
            }
        }

        return this.capitalizeFirst(name);
    }

    generateHistoricalName(culture, period, gender) {
        // Historical modifications based on period
        const periodModifiers = {
            ancient: { suffix: ['us', 'ius', 'anus'], prefix: ['Gaius', 'Marcus', 'Lucius'] },
            medieval: { suffix: ['wine', 'bert', 'wald'], prefix: ['Aethel', 'God', 'Wil'] },
            victorian: { suffix: ['ington', 'worth', 'ley'], formal: true }
        };

        let baseName = this.generateMarkovName(culture, gender);
        const modifier = periodModifiers[period];

        if (modifier) {
            if (modifier.suffix && Math.random() > 0.6) {
                baseName += this.randomChoice(modifier.suffix);
            }
            if (modifier.prefix && Math.random() > 0.7) {
                baseName = this.randomChoice(modifier.prefix) + baseName.toLowerCase();
            }
            if (modifier.formal) {
                baseName = this.formalizeVictorianName(baseName);
            }
        }

        return this.capitalizeFirst(baseName);
    }

    generatePlaceName(type, style, method) {
        switch (method) {
            case 'markov_chain':
                return this.generateMarkovPlace(type, style);
            case 'syllable_based':
                return this.generateSyllablePlace(type, style);
            case 'phonetic_pattern':
                return this.generatePhoneticPlace(type, style);
            case 'historical_pattern':
                return this.generateHistoricalPlace(type, style);
            default:
                return this.generateProceduralPlace(type, style);
        }
    }

    generateMarkovPlace(type, style) {
        // Use place name components for Markov chain
        const placeComponents = {
            city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
            landmark: ['Mount Everest', 'Grand Canyon', 'Niagara Falls', 'Yellowstone', 'Yosemite', 'Glacier Bay', 'Death Valley', 'Crater Lake'],
            country: ['United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'United Kingdom', 'France', 'Germany', 'Italy', 'Spain']
        };

        const chain = this.buildMarkovChain(placeComponents[type] || placeComponents.city, 2);
        return this.generateFromMarkovChain(chain, 4, 15) || this.generateSyllablePlace(type, style);
    }

    generateSyllablePlace(type, style) {
        const placeSyllables = {
            fantasy: {
                prefixes: ['Eld', 'Myst', 'Sil', 'Gol', 'Crim', 'Shad', 'Brigh', 'Stor', 'Iron', 'Crys'],
                suffixes: ['heim', 'garde', 'burg', 'haven', 'ford', 'wald', 'moor', 'hall', 'hold', 'vale']
            },
            realistic: {
                prefixes: ['New', 'Old', 'North', 'South', 'East', 'West', 'Green', 'Blue', 'Red', 'White'],
                suffixes: ['ton', 'ville', 'field', 'wood', 'brook', 'ridge', 'hill', 'dale', 'port', 'burg']
            }
        };

        const syllableSet = placeSyllables[style] || placeSyllables.realistic;
        const prefix = this.randomChoice(syllableSet.prefixes);
        const suffix = this.randomChoice(syllableSet.suffixes);

        return prefix + suffix;
    }

    generatePhoneticPlace(type, style) {
        const patterns = this.phoneticPatterns.western;
        const pattern = this.randomChoice(['CVCVC', 'CVCCVC', 'CVCVCV']);
        
        let name = '';
        for (const char of pattern) {
            if (char === 'C') {
                name += this.randomChoice(patterns.consonants);
            } else if (char === 'V') {
                name += this.randomChoice(patterns.vowels);
            }
        }

        // Add geographical suffix
        const geoSuffixes = ['ton', 'ville', 'burg', 'field', 'wood', 'haven', 'ridge', 'vale', 'ford', 'hill'];
        name += this.randomChoice(geoSuffixes);

        return this.capitalizeFirst(name);
    }

    generateFromMarkovChain(chain, minLength, maxLength) {
        let name = '';
        let current = '^^';
        let attempts = 0;

        while (attempts < 100) {
            const possibleNext = chain[current];
            if (!possibleNext) break;

            const nextChar = possibleNext[Math.floor(Math.random() * possibleNext.length)];
            
            if (nextChar === '$') {
                if (name.length >= minLength) break;
                name = '';
                current = '^^';
                attempts++;
                continue;
            }

            name += nextChar;
            if (name.length >= maxLength) break;

            current = current.substring(1) + nextChar;
            attempts++;
        }

        return name;
    }

    // Utility methods
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    formalizeVictorianName(name) {
        const victorianPrefixes = ['Lord', 'Lady', 'Sir', 'Dame'];
        const formalSuffixes = ['ington', 'worth', 'shire', 'ford'];
        
        if (Math.random() > 0.7) {
            name = this.randomChoice(victorianPrefixes) + ' ' + name;
        }
        
        if (Math.random() > 0.5) {
            name += this.randomChoice(formalSuffixes);
        }
        
        return name;
    }

    generateHistoricalPlace(type, style) {
        const historicalPatterns = {
            ancient: { prefixes: ['Aqua', 'Terra', 'Magnus', 'Novus'], suffixes: ['polis', 'burg', 'stad', 'haven'] },
            medieval: { prefixes: ['Castle', 'Fort', 'Saint', 'Holy'], suffixes: ['shire', 'wick', 'thorpe', 'by'] },
            modern: { prefixes: ['New', 'Central', 'Metro', 'Grand'], suffixes: ['City', 'Heights', 'Plaza', 'Center'] }
        };

        const pattern = historicalPatterns.ancient; // Default to ancient
        const prefix = this.randomChoice(pattern.prefixes);
        const suffix = this.randomChoice(pattern.suffixes);

        return prefix + suffix;
    }

    generateProceduralPlace(type, style) {
        // Simple procedural generation
        const baseWords = ['River', 'Mountain', 'Valley', 'Lake', 'Forest', 'Desert', 'Ocean', 'Island'];
        const descriptors = ['Blue', 'Green', 'Silent', 'Hidden', 'Ancient', 'Mystic', 'Golden', 'Silver'];
        
        const descriptor = this.randomChoice(descriptors);
        const base = this.randomChoice(baseWords);
        
        return `${descriptor} ${base}`;
    }
}

// Export for use in main app
window.NameGenerators = NameGenerators;
