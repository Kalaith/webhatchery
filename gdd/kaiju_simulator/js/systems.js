// Systems Management Module
import { allActivities } from '../data/activities-data.js';

let currentSort = { column: 'name', direction: 'asc' };
let currentCategory = 'training';

export function initSystems() {
    setupCategoryTabs();
    renderTable();
    setupTableSorting();
}

function setupCategoryTabs() {
    const categoriesContainer = document.getElementById('categories-container');
    const categories = [
        { key: 'training', name: 'Training Activities', icon: '🏋️' },
        { key: 'discovery', name: 'Discovery & Capture', icon: '🔍' },
        { key: 'facility', name: 'Facility Management', icon: '🏗️' },
        { key: 'security', name: 'Security & Staff', icon: '🛡️' }
    ];
    
    let tabsHTML = '<div class="flex space-x-2 mb-6">';
    categories.forEach(cat => {
        const activeClass = cat.key === currentCategory ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700';
        tabsHTML += `<button class="category-tab-btn ${activeClass} px-4 py-2 rounded-lg font-medium transition-colors" data-category="${cat.key}">
            ${cat.icon} ${cat.name}
        </button>`;
    });
    tabsHTML += '</div>';
    
    categoriesContainer.innerHTML = tabsHTML;
      // Add event listeners to tabs
    document.querySelectorAll('.category-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            updateActiveTab();
            updateCategoryTitle();
            renderTable();
        });
    });
}

function updateCategoryTitle() {
    const titles = {
        training: 'Training Activities',
        discovery: 'Discovery & Capture Expeditions',
        facility: 'Facility Management & Upgrades',
        security: 'Security Systems & Staff'
    };
    
    const titleElement = document.getElementById('category-title');
    if (titleElement) {
        titleElement.textContent = titles[currentCategory];
    }
}

function updateActiveTab() {
    document.querySelectorAll('.category-tab-btn').forEach(btn => {
        btn.classList.remove('bg-gray-800', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    const activeBtn = document.querySelector(`[data-category="${currentCategory}"]`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
        activeBtn.classList.add('bg-gray-800', 'text-white');
    }
}

function setupTableSorting() {
    const table = document.getElementById('activities-table');
    table.addEventListener('click', (e) => {
        if (e.target.dataset.column) {
            const column = e.target.dataset.column;
            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = column;
                currentSort.direction = 'asc';
            }
            renderTable();
        }
    });
}

function renderTable() {
    const currentData = allActivities[currentCategory];
    const table = document.getElementById('activities-table');
    
    // Define headers based on category
    const headerConfigs = {
        training: [
            { key: 'name', name: 'Activity Name' },
            { key: 'category', name: 'Category' },
            { key: 'primary', name: 'Primary Stat' },
            { key: 'secondary', name: 'Secondary Stat' },
            { key: 'duration', name: 'Duration (H)' },
            { key: 'energy', name: 'Energy Cost' },
            { key: 'cost', name: 'Credits' },
            { key: 'level', name: 'Required Lvl' }
        ],
        discovery: [
            { key: 'name', name: 'Expedition Name' },
            { key: 'location', name: 'Location' },
            { key: 'rarity', name: 'Kaiju Rarity' },
            { key: 'duration', name: 'Duration (H)' },
            { key: 'cost', name: 'Credits' },
            { key: 'risk', name: 'Risk Level' },
            { key: 'successRate', name: 'Success %' },
            { key: 'level', name: 'Required Lvl' }
        ],
        facility: [
            { key: 'name', name: 'Facility Name' },
            { key: 'type', name: 'Type' },
            { key: 'tier', name: 'Tier' },
            { key: 'cost', name: 'Credits' },
            { key: 'duration', name: 'Build Time (H)' },
            { key: 'benefit', name: 'Benefit' },
            { key: 'level', name: 'Required Lvl' }
        ],
        security: [
            { key: 'name', name: 'Security/Staff' },
            { key: 'type', name: 'Type' },
            { key: 'cost', name: 'Initial Cost' },
            { key: 'monthlyCost', name: 'Monthly Cost' },
            { key: 'duration', name: 'Setup Time (H)' },
            { key: 'benefit', name: 'Benefit' },
            { key: 'level', name: 'Required Lvl' }
        ]
    };
    
    const headers = headerConfigs[currentCategory];
    
    // Render table headers
    let headHTML = '<tr>';
    headers.forEach(h => {
        let sortIndicator = '';
        if(h.key === currentSort.column) {
            sortIndicator = currentSort.direction === 'asc' ? ' ▲' : ' ▼';
        }
        headHTML += `<th data-column="${h.key}" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">${h.name}${sortIndicator}</th>`;
    });
    headHTML += '</tr>';
    table.querySelector('thead').innerHTML = headHTML;
    
    // Sort data
    const sortedData = [...currentData].sort((a, b) => {
        let valA = a[currentSort.column];
        let valB = b[currentSort.column];
        
        if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }
        
        if (valA === undefined) valA = '';
        if (valB === undefined) valB = '';
        
        if (currentSort.direction === 'asc') {
            return valA < valB ? -1 : valA > valB ? 1 : 0;
        } else {
            return valA > valB ? -1 : valA < valB ? 1 : 0;
        }
    });
    
    // Render table body
    let bodyHTML = '';
    sortedData.forEach(item => {
        bodyHTML += '<tr class="hover:bg-gray-50 transition-colors">';
        headers.forEach(h => {
            let value = item[h.key];
            
            // Format specific values
            if (h.key === 'cost' || h.key === 'monthlyCost') {
                value = value ? `${value.toLocaleString()}₡` : 'N/A';
            } else if (h.key === 'successRate') {
                value = `${value}%`;
            } else if (h.key === 'duration') {
                value = `${value}h`;
            } else if (value === undefined || value === null) {
                value = 'N/A';
            }
            
            bodyHTML += `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${value}</td>`;
        });
        bodyHTML += '</tr>';
    });
    
    table.querySelector('tbody').innerHTML = bodyHTML;
}
