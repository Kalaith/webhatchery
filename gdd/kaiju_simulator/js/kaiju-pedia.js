// Kaiju-pedia Module
import { kaijuData } from '../data/kaiju-data.js';

let kaijuStatsChart, kaijuCompareChart;

export function initKaijuPedia() {
    const grid = document.getElementById('kaiju-type-grid');
    kaijuData.forEach(kaiju => {
        const card = document.createElement('div');
        card.className = 'kaiju-card bg-gray-100 p-4 rounded-lg text-center cursor-pointer border-2 border-transparent';
        card.dataset.type = kaiju.type;
        card.innerHTML = `<div class="text-4xl mb-2">${kaiju.icon}</div><div class="font-semibold">${kaiju.type}</div>`;
        card.addEventListener('click', () => selectKaiju(kaiju.type));
        grid.appendChild(card);    });
    createKaijuCharts();
    selectKaiju(kaijuData[0].type);
}

function createKaijuCharts() {
    const statsCtx = document.getElementById('kaijuStatsChart').getContext('2d');
    kaijuStatsChart = new Chart(statsCtx, {
        type: 'radar',
        data: {
            labels: ['HP', 'Attack', 'Defense', 'Speed'],
            datasets: [{
                label: 'Base Stats',
                data: [0,0,0,0],
                backgroundColor: 'rgba(74, 85, 104, 0.2)',
                borderColor: 'rgba(74, 85, 104, 1)',
                pointBackgroundColor: 'rgba(74, 85, 104, 1)',
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { display: true },
                    suggestedMin: 40,
                    suggestedMax: 100,
                    pointLabels: { font: { size: 14 } }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    kaijuCompareChart = new Chart(compareCtx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: kaijuData.map(k => k.type),
            datasets: [{
                label: 'HP', data: kaijuData.map(k => k.hp), backgroundColor: '#A0AEC0',
            },{
                label: 'Attack', data: kaijuData.map(k => k.attack), backgroundColor: '#A0AEC0',
            },{
                label: 'Defense', data: kaijuData.map(k => k.defense), backgroundColor: '#A0AEC0',
            },{
                label: 'Speed', data: kaijuData.map(k => k.speed), backgroundColor: '#A0AEC0',
            }]
        },
        options: {
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            },
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed.x !== null) {
                                label += context.parsed.x;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function selectKaiju(type) {
    const kaiju = kaijuData.find(k => k.type === type);
    if (!kaiju) return;

    document.querySelectorAll('.kaiju-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.kaiju-card[data-type="${type}"]`).classList.add('selected');

    document.getElementById('kaiju-details-name').innerText = `${kaiju.icon} ${kaiju.type}`;

    kaijuStatsChart.data.datasets[0].data = [kaiju.hp, kaiju.attack, kaiju.defense, kaiju.speed];
    kaijuStatsChart.update();
    
    kaijuCompareChart.data.datasets.forEach(dataset => {
        dataset.backgroundColor = kaijuData.map(k => k.type === type ? '#4A5568' : '#A0AEC0');
    });
    kaijuCompareChart.update();

    const detailsInfo = document.getElementById('kaiju-details-info');
    detailsInfo.innerHTML = `
        <p class="text-gray-700"><strong class="font-semibold">Special Ability:</strong> ${kaiju.special_ability}</p>
        <p class="text-green-600"><strong class="font-semibold">Strong vs:</strong> ${kaiju.strength}</p>
        <p class="text-red-600"><strong class="font-semibold">Weak vs:</strong> ${kaiju.weakness}</p>
    `;
}
