// Name Generator API Application
class NameGeneratorApp {
    constructor() {
        this.statistics = {
            totalGenerated: 0,
            favorites: new Set(),
            methodUsage: {}
        };
        
        // Initialize enhanced generators
        this.generators = new NameGenerators();
        
        this.mockData = {
            people: {
                western: {
                    male: ['Alexander Thompson', 'James Mitchell', 'Robert Wilson', 'William Anderson', 'Michael Johnson', 'David Brown', 'Christopher Davis', 'Matthew Miller', 'Anthony Wilson', 'Mark Johnson'],
                    female: ['Elizabeth Johnson', 'Mary Davis', 'Sarah Williams', 'Jennifer Brown', 'Lisa Miller', 'Michelle Wilson', 'Amanda Davis', 'Stephanie Anderson', 'Rebecca Thompson', 'Rachel Johnson']
                },
                nordic: {
                    male: ['Björn Eriksson', 'Magnus Andersson', 'Lars Johansson', 'Nils Bergström', 'Erik Lindqvist', 'Gunnar Petersson', 'Axel Nordström', 'Oskar Lundberg', 'Viktor Svensson', 'Henrik Karlsson'],
                    female: ['Astrid Larsson', 'Ingrid Nilsson', 'Sigrid Olsen', 'Freya Hansen', 'Maja Andersson', 'Saga Eriksson', 'Elsa Johansson', 'Liv Petersson', 'Anja Lindgren', 'Karin Bergman']
                },
                eastern: {
                    male: ['Hiroshi Tanaka', 'Kenji Sato', 'Akira Yamamoto', 'Takeshi Suzuki', 'Masato Watanabe', 'Ryouta Ito', 'Daichi Nakamura', 'Shouji Kobayashi'],
                    female: ['Yuki Tanaka', 'Akiko Sato', 'Michiko Yamamoto', 'Tomoko Suzuki', 'Naomi Watanabe', 'Emi Ito', 'Sakura Nakamura', 'Ayumi Kobayashi']
                }
            },
            places: [
                'Northwind Valley', 'Crimson Falls', 'Silverbrook', 'Ironhold', 'Misty Hollow', 'Golden Ridge', 'Stormhaven', 'Brightwood',
                'Shadowmere', 'Crystalline Bay', 'Thornfield', 'Ravenspire', 'Moonhaven', 'Starfall Ridge', 'Emberstone', 'Frostholm',
                'Verdant Springs', 'Cobalt Heights', 'Ashenmoor', 'Willowbrook', 'Serpentine Gorge', 'Twilight Harbor', 'Cedar Point', 'Granite Falls'
            ],
            events: [
                'Summit of Innovation', 'Harmony Festival', 'Digital Frontiers Conference', 'Artisan\'s Gathering', 'Future Leaders Summit',
                'Creative Convergence', 'Tech Horizons Expo', 'Mindful Living Retreat', 'Global Impact Forum', 'Visionary Voices',
                'Connection Catalyst', 'Breakthrough Assembly', 'Inspire & Transform', 'Excellence Exchange', 'Pioneer\'s Path'
            ],
            titles: [
                'The Quantum Paradox', 'Whispers in the Wind', 'Beyond the Digital Horizon', 'Echoes of Tomorrow', 'The Art of Innovation',
                'Shadows of the Past', 'Journey to the Stars', 'The Silent Revolution', 'Colors of Change', 'Dreams Unbound',
                'The Hidden Path', 'Fragments of Light', 'The Eternal Quest', 'Voices from Within', 'The Last Guardian'
            ]
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSliderDisplays();
        this.loadStatistics();
        this.setupThemeToggle();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Form submissions
        document.getElementById('people-form').addEventListener('submit', (e) => this.handlePeopleForm(e));
        document.getElementById('places-form').addEventListener('submit', (e) => this.handlePlacesForm(e));
        document.getElementById('events-form').addEventListener('submit', (e) => this.handleEventsForm(e));
        document.getElementById('titles-form').addEventListener('submit', (e) => this.handleTitlesForm(e));
        document.getElementById('batch-form').addEventListener('submit', (e) => this.handleBatchForm(e));

        // Slider updates
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.addEventListener('input', this.updateSliderDisplay);
        });

        // Export buttons
        document.getElementById('export-people').addEventListener('click', () => this.exportResults('people'));
        document.getElementById('export-places').addEventListener('click', () => this.exportResults('places'));
        document.getElementById('export-events').addEventListener('click', () => this.exportResults('events'));
        document.getElementById('export-titles').addEventListener('click', () => this.exportResults('titles'));
        document.getElementById('export-batch').addEventListener('click', () => this.exportResults('batch'));

        // Clear buttons
        document.getElementById('clear-people').addEventListener('click', () => this.clearResults('people'));
        document.getElementById('clear-places').addEventListener('click', () => this.clearResults('places'));
        document.getElementById('clear-events').addEventListener('click', () => this.clearResults('events'));
        document.getElementById('clear-titles').addEventListener('click', () => this.clearResults('titles'));
        document.getElementById('clear-batch').addEventListener('click', () => this.clearResults('batch'));
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-color-scheme', currentTheme);
        themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
        
        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-color-scheme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-color-scheme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    updateSliderDisplay(e) {
        const slider = e.target;
        const displayId = slider.id + '-display';
        const display = document.getElementById(displayId);
        if (display) {
            display.textContent = slider.value;
        }
    }

    updateSliderDisplays() {
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            const displayId = slider.id + '-display';
            const display = document.getElementById(displayId);
            if (display) {
                display.textContent = slider.value;
            }
        });
    }

    handlePeopleForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const params = {
            count: parseInt(document.getElementById('people-count').value),
            gender: document.getElementById('people-gender').value,
            culture: document.getElementById('people-culture').value,
            method: document.getElementById('people-method').value,
            type: document.getElementById('people-type').value,
            period: document.getElementById('people-period').value,
            excludeReal: document.getElementById('people-exclude-real').checked
        };

        this.showLoading('people-results');
        // Map UI method to API method
        const methodMap = {
            'markov_chain': 'markov_chain',
            'syllable_based': 'syllable',
            'phonetic_pattern': 'phonetic',
            'historical_pattern': 'historical',
            'fantasy_generated': 'fantasy'
        };
        const apiMethod = methodMap[params.method] || 'markov_chain';
        // Only use API for supported methods
        if (["markov_chain","syllable_based","phonetic_pattern","historical_pattern","fantasy_generated"].includes(params.method)) {
            // Build API URL
            const url = `api/generate_name.php?culture=${encodeURIComponent(params.culture)}&gender=${encodeURIComponent(params.gender)}&count=${params.count}&method=${apiMethod}&period=${encodeURIComponent(params.period)}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (data.names) {
                        this.displayPeopleResults(data.names);
                        this.updateStatistics(data.names.length, params.method);
                    } else {
                        // fallback to mock data
                        const results = this.generatePeopleNames(params);
                        this.displayPeopleResults(results);
                        this.updateStatistics(results.length, params.method);
                    }
                })
                .catch(() => {
                    // fallback to mock data
                    const results = this.generatePeopleNames(params);
                    this.displayPeopleResults(results);
                    this.updateStatistics(results.length, params.method);
                });
        } else {
            // fallback to mock data for other methods
            setTimeout(() => {
                const results = this.generatePeopleNames(params);
                this.displayPeopleResults(results);
                this.updateStatistics(results.length, params.method);
            }, 500);
        }
    }

    handlePlacesForm(e) {
        e.preventDefault();
        const params = {
            count: parseInt(document.getElementById('places-count').value),
            type: document.getElementById('places-type').value,
            style: document.getElementById('places-style').value,
            method: document.getElementById('places-method').value
        };

        this.showLoading('places-results');
        setTimeout(() => {
            const results = this.generatePlaceNames(params);
            this.displayPlacesResults(results);
            this.updateStatistics(results.length, params.method);
        }, 500);
    }

    handleEventsForm(e) {
        e.preventDefault();
        const params = {
            count: parseInt(document.getElementById('events-count').value),
            type: document.getElementById('events-type').value,
            theme: document.getElementById('events-theme').value,
            tone: document.getElementById('events-tone').value
        };

        this.showLoading('events-results');
        setTimeout(() => {
            const results = this.generateEventNames(params);
            this.displayEventsResults(results);
            this.updateStatistics(results.length, 'traditional_pattern');
        }, 500);
    }

    handleTitlesForm(e) {
        e.preventDefault();
        const params = {
            count: parseInt(document.getElementById('titles-count').value),
            type: document.getElementById('titles-type').value,
            genre: document.getElementById('titles-genre').value,
            tone: document.getElementById('titles-tone').value,
            keywords: document.getElementById('titles-keywords').value
        };

        this.showLoading('titles-results');
        setTimeout(() => {
            const results = this.generateTitleNames(params);
            this.displayTitlesResults(results);
            this.updateStatistics(results.length, 'traditional_pattern');
        }, 500);
    }

    handleBatchForm(e) {
        e.preventDefault();
        const selectedTypes = Array.from(document.querySelectorAll('#batch-form input[type="checkbox"]:checked')).map(cb => cb.value);
        const count = parseInt(document.getElementById('batch-count').value);

        this.showLoading('batch-results');
        setTimeout(() => {
            const results = this.generateBatchResults(selectedTypes, count);
            this.displayBatchResults(results);
            this.updateStatistics(results.totalCount, 'mixed');
        }, 800);
    }

    generatePeopleNames(params) {
        const results = [];
        const culture = params.culture === 'any' ? this.getRandomCulture() : params.culture;
        const gender = params.gender === 'any' ? this.getRandomGender() : params.gender;

        for (let i = 0; i < params.count; i++) {
            const name = this.generatePersonName(culture, gender, params);
            results.push({
                name: name.full,
                firstName: name.first,
                lastName: name.last,
                culture: culture,
                gender: gender,
                method: params.method,
                origin: this.getNameOrigin(culture),
                meaning: this.getNameMeaning(),
                pronunciation: this.generatePronunciation(name.full),
                period: params.period
            });
        }

        return results;
    }

    generatePlaceNames(params) {
        const results = [];

        for (let i = 0; i < params.count; i++) {
            // Use enhanced place name generation
            const name = this.generators.generatePlaceName(params.type, params.style, params.method);
            
            results.push({
                name: name,
                type: params.type,
                style: params.style,
                method: params.method,
                description: this.generatePlaceDescription(name, params.type),
                location: this.generateLocation(params.style),
                established: this.generateEstablishedDate(),
                population: this.generatePopulation(params.type),
                climate: this.generateClimate(params.style)
            });
        }

        return results;
    }

    generateEventNames(params) {
        const results = [];
        const baseEvents = this.mockData.events;

        for (let i = 0; i < params.count; i++) {
            const baseName = baseEvents[Math.floor(Math.random() * baseEvents.length)];
            const name = this.modifyEventName(baseName, params);
            results.push({
                name: name,
                type: params.type,
                theme: params.theme,
                tone: params.tone,
                tagline: this.generateTagline(params.theme, params.tone),
                duration: this.generateDuration(params.type),
                audience: this.generateAudience(params.theme)
            });
        }

        return results;
    }

    generateTitleNames(params) {
        const results = [];
        const baseTitles = this.mockData.titles;

        for (let i = 0; i < params.count; i++) {
            const baseTitle = baseTitles[Math.floor(Math.random() * baseTitles.length)];
            const title = this.modifyTitle(baseTitle, params);
            results.push({
                title: title,
                type: params.type,
                genre: params.genre,
                tone: params.tone,
                subtitle: this.generateSubtitle(params.genre, params.tone),
                description: this.generateDescription(params.genre),
                keywords: params.keywords || this.generateKeywords(params.genre)
            });
        }

        return results;
    }

    generateBatchResults(types, count) {
        const results = {};
        let totalCount = 0;

        if (types.includes('people')) {
            results.people = this.generatePeopleNames({
                count, gender: 'any', culture: 'any', method: 'traditional_pattern',
                type: 'full_name', period: 'modern', excludeReal: false
            });
            totalCount += results.people.length;
        }

        if (types.includes('places')) {
            results.places = this.generatePlaceNames({
                count, type: 'city', style: 'english', method: 'traditional_pattern'
            });
            totalCount += results.places.length;
        }

        if (types.includes('events')) {
            results.events = this.generateEventNames({
                count, type: 'conference', theme: 'technology', tone: 'professional'
            });
            totalCount += results.events.length;
        }

        if (types.includes('titles')) {
            results.titles = this.generateTitleNames({
                count, type: 'book', genre: 'fiction', tone: 'mysterious', keywords: ''
            });
            totalCount += results.titles.length;
        }

        results.totalCount = totalCount;
        return results;
    }

    generatePersonName(culture, gender, params) {
        let firstName = '';
        let lastName = '';

        // Use enhanced generation algorithms based on method
        switch (params.method) {
            case 'markov_chain':
                firstName = this.generators.generateMarkovName(culture, gender);
                lastName = this.generators.generateMarkovName(culture, 'surname');
                break;
                
            case 'syllable_based':
                firstName = this.generators.generateSyllableName(culture, 'first');
                lastName = this.generators.generateSyllableName(culture, 'surname');
                break;
                
            case 'phonetic_pattern':
                firstName = this.generators.generatePhoneticName(culture, gender);
                lastName = this.generators.generatePhoneticName(culture, 'surname');
                break;
                
            case 'historical_pattern':
                firstName = this.generators.generateHistoricalName(culture, params.period, gender);
                lastName = this.generators.generateHistoricalName(culture, params.period, 'surname');
                break;
                
            case 'fantasy_generated':
                firstName = this.generators.generateSyllableName('fantasy', 'first');
                lastName = this.generators.generateSyllableName('fantasy', 'surname');
                break;
                
            default:
                // Fallback to enhanced markov generation or mock data
                if (this.generators.markovChains[culture]) {
                    firstName = this.generators.generateMarkovName(culture, gender);
                    lastName = this.generators.generateMarkovName(culture, 'surname');
                } else {
                    // Use mock data as fallback
                    const cultureData = this.mockData.people[culture] || this.mockData.people.western;
                    const genderData = cultureData[gender] || cultureData.male;
                    const fullName = genderData[Math.floor(Math.random() * genderData.length)];
                    const parts = fullName.split(' ');
                    firstName = parts[0];
                    lastName = parts[parts.length - 1];
                }
        }

        // Apply type modifications
        switch (params.type) {
            case 'first_only':
                return { 
                    full: firstName, 
                    first: firstName, 
                    last: '',
                    culture: this.getNameOrigin(culture),
                    meaning: this.enhancedGetNameMeaning(),
                    pronunciation: this.enhancedGeneratePronunciation(firstName)
                };
            case 'last_only':
                return { 
                    full: lastName, 
                    first: '', 
                    last: lastName,
                    culture: this.getNameOrigin(culture),
                    meaning: this.enhancedGetNameMeaning(),
                    pronunciation: this.enhancedGeneratePronunciation(lastName)
                };
            case 'nickname':
                const nickname = this.generateNickname(firstName);
                return { 
                    full: nickname, 
                    first: firstName, 
                    last: lastName,
                    nickname: nickname,
                    culture: this.getNameOrigin(culture),
                    meaning: this.enhancedGetNameMeaning(),
                    pronunciation: this.enhancedGeneratePronunciation(nickname)
                };
            case 'formal':
                return { 
                    full: `${lastName}, ${firstName}`, 
                    first: firstName, 
                    last: lastName,
                    culture: this.getNameOrigin(culture),
                    meaning: this.enhancedGetNameMeaning(),
                    pronunciation: this.enhancedGeneratePronunciation(`${firstName} ${lastName}`)
                };
            default:
                const fullName = `${firstName} ${lastName}`;
                return { 
                    full: fullName, 
                    first: firstName, 
                    last: lastName,
                    culture: this.getNameOrigin(culture),
                    meaning: this.enhancedGetNameMeaning(),
                    pronunciation: this.enhancedGeneratePronunciation(fullName)
                };
        }
    }

    modifyPlaceName(baseName, params) {
        const prefixes = {
            english: ['New', 'Old', 'Great', 'Little', 'Upper', 'Lower'],
            gaelic: ['Glen', 'Loch', 'Ben', 'Dun', 'Kil', 'Bal'],
            norse: ['Nord', 'Sund', 'Berg', 'Vik', 'Heim', 'Fjord'],
            fantasy: ['Drak', 'Myth', 'Elven', 'Shadow', 'Crystal', 'Storm']
        };

        const suffixes = {
            city: ['City', 'Town', 'burg', 'ville', 'ton', 'ford'],
            mountain: ['Peak', 'Summit', 'Ridge', 'Heights', 'Mount', 'Hill'],
            river: ['River', 'Creek', 'Stream', 'Brook', 'Run', 'Flow']
        };

        if (Math.random() < 0.3) {
            const stylePrefixes = prefixes[params.style] || prefixes.english;
            const prefix = stylePrefixes[Math.floor(Math.random() * stylePrefixes.length)];
            return `${prefix} ${baseName}`;
        }

        if (Math.random() < 0.3) {
            const typeSuffixes = suffixes[params.type] || [''];
            const suffix = typeSuffixes[Math.floor(Math.random() * typeSuffixes.length)];
            return suffix ? `${baseName} ${suffix}` : baseName;
        }

        return baseName;
    }

    modifyEventName(baseName, params) {
        const toneModifiers = {
            professional: ['Summit', 'Conference', 'Forum', 'Symposium'],
            casual: ['Meetup', 'Gathering', 'Social', 'Hangout'],
            inspiring: ['Vision', 'Journey', 'Quest', 'Mission'],
            elegant: ['Gala', 'Soirée', 'Celebration', 'Affair']
        };

        const themeWords = {
            technology: ['Digital', 'Tech', 'Innovation', 'Future', 'Cyber', 'AI'],
            arts: ['Creative', 'Artistic', 'Cultural', 'Visual', 'Expressive'],
            business: ['Enterprise', 'Strategic', 'Leadership', 'Growth', 'Success']
        };

        if (Math.random() < 0.4) {
            const themes = themeWords[params.theme] || themeWords.technology;
            const theme = themes[Math.floor(Math.random() * themes.length)];
            return `${theme} ${baseName}`;
        }

        return baseName;
    }

    modifyTitle(baseTitle, params) {
        const genreModifiers = {
            mystery: ['The Secret of', 'Mystery of', 'The Case of', 'Hidden'],
            romance: ['Love in', 'Hearts of', 'Passion in', 'Romance of'],
            sci_fi: ['Beyond', 'Future', 'Galaxy of', 'Quantum'],
            fantasy: ['The Chronicles of', 'Legend of', 'The Realm of', 'Magic of']
        };

        if (Math.random() < 0.3) {
            const modifiers = genreModifiers[params.genre] || [];
            if (modifiers.length > 0) {
                const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
                return `${modifier} ${baseTitle}`;
            }
        }

        return baseTitle;
    }

    showLoading(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '<div class="loading">Generating names...</div>';
    }

    displayPeopleResults(results) {
        const container = document.getElementById('people-results');
        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = '<div class="empty-state"><h4>No results</h4><p>Try adjusting your parameters</p></div>';
            return;
        }

        results.forEach(person => {
            const card = this.createPersonCard(person);
            container.appendChild(card);
        });
    }

    displayPlacesResults(results) {
        const container = document.getElementById('places-results');
        container.innerHTML = '';

        results.forEach(place => {
            const card = this.createPlaceCard(place);
            container.appendChild(card);
        });
    }

    displayEventsResults(results) {
        const container = document.getElementById('events-results');
        container.innerHTML = '';

        results.forEach(event => {
            const card = this.createEventCard(event);
            container.appendChild(card);
        });
    }

    displayTitlesResults(results) {
        const container = document.getElementById('titles-results');
        container.innerHTML = '';

        results.forEach(title => {
            const card = this.createTitleCard(title);
            container.appendChild(card);
        });
    }

    displayBatchResults(results) {
        const container = document.getElementById('batch-results');
        container.innerHTML = '';

        Object.keys(results).forEach(type => {
            if (type === 'totalCount') return;

            const section = document.createElement('div');
            section.className = 'batch-section';
            section.innerHTML = `<h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>`;

            const grid = document.createElement('div');
            grid.className = 'batch-grid';

            results[type].forEach(item => {
                let card;
                switch (type) {
                    case 'people':
                        card = this.createPersonCard(item);
                        break;
                    case 'places':
                        card = this.createPlaceCard(item);
                        break;
                    case 'events':
                        card = this.createEventCard(item);
                        break;
                    case 'titles':
                        card = this.createTitleCard(item);
                        break;
                }
                if (card) grid.appendChild(card);
            });

            section.appendChild(grid);
            container.appendChild(section);
        });
    }

    createPersonCard(person) {
        const card = document.createElement('div');
        card.className = 'name-card';
        card.innerHTML = `
            <div class="name-main">${person.name}</div>
            <div class="name-details">
                <div class="name-detail"><strong>Culture:</strong> ${person.culture}</div>
                <div class="name-detail"><strong>Origin:</strong> ${person.origin}</div>
                <div class="name-detail"><strong>Meaning:</strong> ${person.meaning}</div>
                <div class="name-detail"><strong>Pronunciation:</strong> ${person.pronunciation}</div>
                <div class="name-detail"><strong>Method:</strong> ${person.method.replace('_', ' ')}</div>
            </div>
            <div class="name-actions">
                <button class="copy-btn" onclick="app.copyToClipboard('${person.name}', this)">Copy</button>
                <button class="favorite-btn" onclick="app.toggleFavorite('${person.name}', this)">★</button>
            </div>
        `;
        return card;
    }

    createPlaceCard(place) {
        const card = document.createElement('div');
        card.className = 'name-card';
        card.innerHTML = `
            <div class="name-main">${place.name}</div>
            <div class="name-details">
                <div class="name-detail"><strong>Type:</strong> ${place.type}</div>
                <div class="name-detail"><strong>Style:</strong> ${place.style}</div>
                <div class="name-detail"><strong>Location:</strong> ${place.location}</div>
                <div class="name-detail"><strong>Description:</strong> ${place.description}</div>
                <div class="name-detail"><strong>Established:</strong> ${place.established}</div>
            </div>
            <div class="name-actions">
                <button class="copy-btn" onclick="app.copyToClipboard('${place.name}', this)">Copy</button>
                <button class="favorite-btn" onclick="app.toggleFavorite('${place.name}', this)">★</button>
            </div>
        `;
        return card;
    }

    createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'name-card';
        card.innerHTML = `
            <div class="name-main">${event.name}</div>
            <div class="name-details">
                <div class="name-detail"><strong>Type:</strong> ${event.type}</div>
                <div class="name-detail"><strong>Theme:</strong> ${event.theme}</div>
                <div class="name-detail"><strong>Tagline:</strong> ${event.tagline}</div>
                <div class="name-detail"><strong>Duration:</strong> ${event.duration}</div>
                <div class="name-detail"><strong>Audience:</strong> ${event.audience}</div>
            </div>
            <div class="name-actions">
                <button class="copy-btn" onclick="app.copyToClipboard('${event.name}', this)">Copy</button>
                <button class="favorite-btn" onclick="app.toggleFavorite('${event.name}', this)">★</button>
            </div>
        `;
        return card;
    }

    createTitleCard(title) {
        const card = document.createElement('div');
        card.className = 'name-card';
        card.innerHTML = `
            <div class="name-main">${title.title}</div>
            <div class="name-details">
                <div class="name-detail"><strong>Type:</strong> ${title.type.replace('_', ' ')}</div>
                <div class="name-detail"><strong>Genre:</strong> ${title.genre.replace('_', ' ')}</div>
                <div class="name-detail"><strong>Subtitle:</strong> ${title.subtitle}</div>
                <div class="name-detail"><strong>Description:</strong> ${title.description}</div>
                <div class="name-detail"><strong>Keywords:</strong> ${title.keywords}</div>
            </div>
            <div class="name-actions">
                <button class="copy-btn" onclick="app.copyToClipboard('${title.title}', this)">Copy</button>
                <button class="favorite-btn" onclick="app.toggleFavorite('${title.title}', this)">★</button>
            </div>
        `;
        return card;
    }

    copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            button.textContent = 'Copied!';
            button.classList.add('copied');
            setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.textContent = 'Copied!';
            button.classList.add('copied');
            setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('copied');
            }, 2000);
        });
    }

    toggleFavorite(name, button) {
        if (this.statistics.favorites.has(name)) {
            this.statistics.favorites.delete(name);
            button.classList.remove('favorited');
        } else {
            this.statistics.favorites.add(name);
            button.classList.add('favorited');
        }
        this.updateStatisticsDisplay();
        this.saveStatistics();
    }

    exportResults(type) {
        const containers = {
            people: 'people-results',
            places: 'places-results',
            events: 'events-results',
            titles: 'titles-results',
            batch: 'batch-results'
        };

        const container = document.getElementById(containers[type]);
        const cards = container.querySelectorAll('.name-card');
        
        if (cards.length === 0) {
            alert('No results to export');
            return;
        }

        const data = [];
        cards.forEach(card => {
            const name = card.querySelector('.name-main').textContent;
            const details = {};
            card.querySelectorAll('.name-detail').forEach(detail => {
                const parts = detail.textContent.split(': ');
                if (parts.length === 2) {
                    details[parts[0]] = parts[1];
                }
            });
            data.push({ name, ...details });
        });

        this.downloadJSON(data, `${type}-results.json`);
    }

    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clearResults(type) {
        const containers = {
            people: 'people-results',
            places: 'places-results',
            events: 'events-results',
            titles: 'titles-results',
            batch: 'batch-results'
        };

        const container = document.getElementById(containers[type]);
        container.innerHTML = '<div class="empty-state"><h4>No results</h4><p>Use the form to generate names</p></div>';
    }

    updateStatistics(count, method) {
        this.statistics.totalGenerated += count;
        this.statistics.methodUsage[method] = (this.statistics.methodUsage[method] || 0) + count;
        this.updateStatisticsDisplay();
        this.saveStatistics();
    }

    updateStatisticsDisplay() {
        document.getElementById('total-generated').textContent = this.statistics.totalGenerated;
        document.getElementById('total-favorites').textContent = this.statistics.favorites.size;
        
        const mostUsedMethod = Object.keys(this.statistics.methodUsage).reduce((a, b) => 
            this.statistics.methodUsage[a] > this.statistics.methodUsage[b] ? a : b, 
            Object.keys(this.statistics.methodUsage)[0] || 'none'
        );
        
        document.getElementById('most-used-method').textContent = 
            mostUsedMethod ? mostUsedMethod.replace('_', ' ') : '-';
    }

    saveStatistics() {
        localStorage.setItem('nameGeneratorStats', JSON.stringify({
            ...this.statistics,
            favorites: Array.from(this.statistics.favorites)
        }));
    }

    loadStatistics() {
        const saved = localStorage.getItem('nameGeneratorStats');
        if (saved) {
            const data = JSON.parse(saved);
            this.statistics.totalGenerated = data.totalGenerated || 0;
            this.statistics.methodUsage = data.methodUsage || {};
            this.statistics.favorites = new Set(data.favorites || []);
            this.updateStatisticsDisplay();
        }
    }

    // Helper methods
    getRandomCulture() {
        const cultures = ['western', 'nordic', 'eastern'];
        return cultures[Math.floor(Math.random() * cultures.length)];
    }

    getRandomGender() {
        const genders = ['male', 'female'];
        return genders[Math.floor(Math.random() * genders.length)];
    }

    getNameOrigin(culture) {
        const origins = {
            western: 'Anglo-Saxon, Germanic',
            nordic: 'Old Norse, Scandinavian',
            eastern: 'Japanese, Chinese origins'
        };
        return origins[culture] || 'Mixed origins';
    }

    getNameMeaning() {
        const meanings = [
            'Strong warrior', 'Noble born', 'Wise counselor', 'Bright light',
            'Peaceful ruler', 'Divine gift', 'Forest dweller', 'Mountain peak',
            'Ocean wave', 'Golden dawn', 'Silver moon', 'Ancient wisdom'
        ];
        return meanings[Math.floor(Math.random() * meanings.length)];
    }

    generatePronunciation(name) {
        // Simplified pronunciation generation
        return name.split('').map(char => {
            const pronunciations = {
                'ä': 'AH', 'ö': 'UR', 'ü': 'OO', 'ß': 'SS',
                'é': 'AY', 'è': 'EH', 'ç': 'S'
            };
            return pronunciations[char] || char;
        }).join('').replace(/(.{2})/g, '$1-').replace(/-$/, '');
    }

    generateNickname(firstName) {
        const nicknames = {
            'Alexander': 'Alex', 'Elizabeth': 'Liz', 'Michael': 'Mike',
            'William': 'Will', 'Jennifer': 'Jen', 'Christopher': 'Chris'
        };
        return nicknames[firstName] || firstName.substring(0, 4);
    }

    generatePlaceDescription(name, type) {
        const descriptions = {
            city: `A bustling urban center known for its cultural diversity`,
            town: `A charming community with rich historical heritage`,
            village: `A peaceful settlement nestled in scenic countryside`,
            mountain: `A majestic peak offering breathtaking panoramic views`,
            river: `A flowing waterway that has shaped the local landscape`
        };
        return descriptions[type] || 'A remarkable location with unique character';
    }

    generateLocation(style) {
        const locations = {
            english: 'Southern England',
            gaelic: 'Scottish Highlands',
            norse: 'Scandinavian Peninsula',
            fantasy: 'Mystical Realm'
        };
        return locations[style] || 'Geographic Region';
    }

    generateEstablishedDate() {
        return Math.floor(Math.random() * 1000) + 1000;
    }

    generateTagline(theme, tone) {
        const taglines = {
            technology: 'Innovating Tomorrow, Today',
            arts: 'Where Creativity Knows No Bounds',
            business: 'Driving Success Through Excellence'
        };
        return taglines[theme] || 'Join Us for an Unforgettable Experience';
    }

    generateDuration(type) {
        const durations = {
            conference: '3 days',
            festival: '5 days',
            workshop: '2 hours',
            gala: 'One evening'
        };
        return durations[type] || '1 day';
    }

    generateAudience(theme) {
        const audiences = {
            technology: 'Tech professionals and innovators',
            arts: 'Artists, creatives, and art enthusiasts',
            business: 'Business leaders and entrepreneurs'
        };
        return audiences[theme] || 'General public';
    }

    generateSubtitle(genre, tone) {
        const subtitles = {
            fiction: 'A Tale of Adventure and Discovery',
            mystery: 'Unraveling the Truth Behind the Secrets',
            romance: 'A Story of Love Against All Odds'
        };
        return subtitles[genre] || 'An Engaging Story';
    }

    generateDescription(genre) {
        const descriptions = {
            fiction: 'An imaginative story that transports readers to new worlds',
            mystery: 'A gripping tale filled with suspense and unexpected twists',
            romance: 'A heartwarming story about love, relationships, and human connection'
        };
        return descriptions[genre] || 'A compelling narrative';
    }

    generateKeywords(genre) {
        const keywords = {
            fiction: 'adventure, imagination, storytelling',
            mystery: 'suspense, investigation, secrets',
            romance: 'love, relationships, emotion'
        };
        return keywords[genre] || 'story, narrative, character';
    }

    // Additional helper methods for enhanced generation
    generatePopulation(type) {
        const populations = {
            city: Math.floor(Math.random() * 1000000) + 50000,
            town: Math.floor(Math.random() * 50000) + 1000,
            village: Math.floor(Math.random() * 1000) + 100,
            landmark: 'N/A'
        };
        return populations[type] || Math.floor(Math.random() * 10000) + 500;
    }

    generateClimate(style) {
        const climates = {
            fantasy: ['Magical temperate', 'Mystical highland', 'Enchanted tropical', 'Arcane tundra'],
            realistic: ['Temperate', 'Continental', 'Mediterranean', 'Subtropical', 'Highland'],
            historical: ['Ancient temperate', 'Classical warm', 'Medieval continental']
        };
        const climateList = climates[style] || climates.realistic;
        return climateList[Math.floor(Math.random() * climateList.length)];
    }

    enhancedGetNameMeaning() {
        const meanings = [
            'Noble warrior', 'Peaceful soul', 'Wise ruler', 'Bright light', 'Strong defender',
            'Gentle heart', 'Bold spirit', 'Faithful friend', 'Pure essence', 'Divine blessing',
            'Mountain strength', 'River flow', 'Ocean depth', 'Sky wanderer', 'Earth guardian',
            'Fire bearer', 'Wind dancer', 'Star seeker', 'Moon blessed', 'Sun touched'
        ];
        return meanings[Math.floor(Math.random() * meanings.length)];
    }

    enhancedGeneratePronunciation(name) {
        // Simple phonetic approximation
        const phonetics = {
            'a': 'ah', 'e': 'eh', 'i': 'ee', 'o': 'oh', 'u': 'oo',
            'y': 'ee', 'c': 'k', 'ph': 'f', 'th': 'th', 'ch': 'ch'
        };
        
        let pronunciation = name.toLowerCase();
        Object.keys(phonetics).forEach(letter => {
            pronunciation = pronunciation.replace(new RegExp(letter, 'g'), phonetics[letter]);
        });
        
        return `/${pronunciation}/`;
    }
}

// Initialize the app
const app = new NameGeneratorApp();