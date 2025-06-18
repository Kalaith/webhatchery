// Progression System Module
import { progressionData, xpData, levelLabels } from '../data/progression-data.js';

let xpCurveChart;

export function initProgression() {
    const container = document.getElementById('progression-steps');
    progressionData.forEach((step, index) => {
        const isLast = index === progressionData.length - 1;
        const stepEl = document.createElement('div');
        stepEl.className = 'step flex items-start';
        stepEl.dataset.level = step.level;
        stepEl.innerHTML = `
            <div class="flex flex-col items-center mr-4">
                <div class="step-circle w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center font-bold bg-white">${step.level}</div>
                ${!isLast ? '<div class="step-line w-0.5 h-16 bg-gray-300"></div>' : ''}
            </div>
            <div class="pt-1.5 pb-8">
                <p class="font-semibold text-lg">Level ${step.level}</p>
                <p class="text-sm text-gray-500">${step.features}</p>
            </div>
        `;
        stepEl.addEventListener('click', () => selectProgressionStep(step.level));
        container.appendChild(stepEl);
    });
    createXpChart();
    selectProgressionStep(1);
}

function selectProgressionStep(level) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    const stepEl = document.querySelector(`.step[data-level="${level}"]`);
    if (stepEl) stepEl.classList.add('active');

    const detailsContainer = document.getElementById('progression-details');
    const step = progressionData.find(s => s.level === level);
    if(step) {
        detailsContainer.innerHTML = `
            <h4 class="text-xl font-bold mb-2">Unlocks at Level ${step.level}</h4>
            <ul class="list-disc list-inside space-y-1 text-gray-700">
                <li><strong>Feature:</strong> ${step.features}</li>
                <li><strong>Max Kaiju Slots:</strong> ${step.slots}</li>
                <li><strong>Breeding Slots:</strong> ${step.breeding}</li>
            </ul>
        `;
    }
}

function createXpChart() {
     const xpCtx = document.getElementById('xpCurveChart').getContext('2d');
     xpCurveChart = new Chart(xpCtx, {
        type: 'line',
        data: {
            labels: levelLabels,
            datasets: [{
                label: 'Total XP Required',
                data: xpData,
                fill: true,
                borderColor: '#4A5568',
                backgroundColor: 'rgba(74, 85, 104, 0.1)',
                tension: 0.1
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        }
    });
}
