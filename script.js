// --- Game State Variables ---
let chiliCount = 0;
let chilisPerSecond = 0;
let chilisPerClick = 1;

// --- DOM Element References ---
const mainClickArea = document.getElementById('main-click-background');
const chiliCountDisplay = document.getElementById('chili-count');
const cpsDisplay = document.getElementById('chilis-per-second');
const gameNewsSpan = document.getElementById('game-news');
const buildingList = document.getElementById('building-list');
const upgradeList = document.getElementById('upgrade-list');
const statsDisplay = document.getElementById('stats-display');

// --- Game Data: Buildings and Upgrades ---
const buildings = [
    { id: 'cursor', name: 'Cursor', cost: 15, cps: 0.1, owned: 0, image: 'https://via.placeholder.com/64x64.png?text=Cursor' },
    { id: 'salsa-stand', name: 'Salsa Stand', cost: 100, cps: 1, owned: 0, image: 'https://via.placeholder.com/64x64.png?text=Salsa' },
    { id: 'taco-truck', name: 'Taco Truck', cost: 1100, cps: 8, owned: 0, image: 'https://via.placeholder.com/64x64.png?text=Truck' },
    { id: 'chili-farm', name: 'Chili Farm', cost: 12000, cps: 47, owned: 0, image: 'https://via.placeholder.com/64x64.png?text=Farm' }
];

// --- News Ticker Messages ---
const badNews = [
    "Your first batch ends in the trash.",
    "Even the raccoons are avoiding your chili.",
    "Chili might have to be put into a virus lab."
];

const generalNews = [
    "The chili is feeling spicy!",
    "A new chili farm has been founded!",
    "The chili market is heating up!",
    "Rumors of golden chilis surface.",
    "A new chili variety has been discovered."
];

let newsIndex = 0;

// --- Game Logic Functions ---
function updateNewsTicker() {
    let newsSource = [];
    if (chiliCount < 500) {
        newsSource = badNews;
    } else {
        newsSource = generalNews;
    }
    const currentNews = newsSource[newsIndex];
    gameNewsSpan.textContent = currentNews;
    newsIndex = (newsIndex + 1) % newsSource.length;
}

function handleChiliClick(event) {
    chiliCount += chilisPerClick;
    updateChiliCountDisplay();
    updateNewsTicker();
    
    // Create floating number feedback
    const floatingNumber = document.createElement('div');
    floatingNumber.className = 'floating-number';
    floatingNumber.textContent = `+${chilisPerClick}`;
    mainClickArea.appendChild(floatingNumber);
    
    // Position floating number at click location relative to the clickable area
    floatingNumber.style.left = `${event.offsetX}px`;
    floatingNumber.style.top = `${event.offsetY}px`;
    
    // Remove after animation completes (1 second duration set in CSS)
    floatingNumber.addEventListener('animationend', () => {
        floatingNumber.remove();
    });
}

function updateChiliCountDisplay() {
    chiliCountDisplay.textContent = `${Math.floor(chiliCount)} Chilies`;
    updateCpsDisplay();
}

function updateCpsDisplay() {
    cpsDisplay.textContent = `${chilisPerSecond.toFixed(1)} chilies per second`;
}

function renderBuildings() {
    buildingList.innerHTML = ''; // Clear previous buildings
    buildings.forEach(building => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'upgrade-item';
        itemDiv.innerHTML = `
            <img src="${building.image}" alt="${building.name}">
            <div class="item-info">
                <span class="item-name">${building.name}</span>
                <span class="item-cost">Cost: ${building.cost} Chilies</span>
                <span class="item-owned">Owned: ${building.owned}</span>
            </div>
        `;
        itemDiv.addEventListener('click', () => buyBuilding(building.id));
        buildingList.appendChild(itemDiv);
    });
}

function buyBuilding(buildingId) {
    const building = buildings.find(b => b.id === buildingId);
    if (building && chiliCount >= building.cost) {
        chiliCount -= building.cost;
        building.owned++;
        chilisPerSecond += building.cps;
        building.cost = Math.floor(building.cost * 1.15); // Increase cost for next purchase
        updateChiliCountDisplay();
        renderBuildings();
        saveGame();
    }
}

let cursorInterval; // Store the interval ID for the auto-clicker

function startCursorAutoclick() {
    // Clear any existing interval to prevent duplicates
    if (cursorInterval) {
        clearInterval(cursorInterval);
    }

    const cursorBuilding = buildings.find(b => b.id === 'cursor');
    if (cursorBuilding && cursorBuilding.owned > 0) {
        const clickRate = 1000 / cursorBuilding.owned; // Adjust speed based on number of cursors
        cursorInterval = setInterval(() => {
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            mainClickArea.dispatchEvent(clickEvent);
        }, clickRate);
    }
}

function gameLoop() {
    chiliCount += chilisPerSecond;
    updateChiliCountDisplay();
}

function saveGame() {
    const gameState = {
        chiliCount,
        chilisPerSecond,
        chilisPerClick,
        buildings
    };
    localStorage.setItem('chiliClickerSave', JSON.stringify(gameState));
}

function loadGame() {
    const savedGame = localStorage.getItem('chiliClickerSave');
    if (savedGame) {
        const gameState = JSON.parse(savedGame);
        chiliCount = gameState.chiliCount;
        chilisPerSecond = gameState.chilisPerSecond;
        chilisPerClick = gameState.chilisPerClick;
        // Merge with existing buildings
        gameState.buildings.forEach(savedBuilding => {
            const building = buildings.find(b => b.id === savedBuilding.id);
            if (building) {
                building.owned = savedBuilding.owned;
                building.cost = savedBuilding.cost;
            }
        });
    }
    updateChiliCountDisplay();
    renderBuildings();
    startCursorAutoclick(); // Start autoclicker on load
}

// --- Tab Switching Logic ---
function showTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    const selectedContent = document.getElementById(`${tabId}-content`);
    const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);

    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// --- Event Listeners ---
mainClickArea.addEventListener('click', handleChiliClick);

document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    showTab('upgrades'); // Set initial active tab
});

document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', (event) => {
        showTab(event.target.dataset.tab);
    });
});

// --- Initialization ---
setInterval(updateNewsTicker, 4000);
setInterval(gameLoop, 1000);
