// --- Game State Variables ---
let chiliCount = 0;
let chilisPerSecond = 0;
let chilisPerClick = 1;

// --- DOM Element References ---
const mainClickArea = document.getElementById('main-click-background');
const mainChiliSoup = document.getElementById('main-chili-soup');
const chiliCountDisplay = document.getElementById('chili-count');
const cpsDisplay = document.getElementById('chilis-per-second');
const gameNewsSpan = document.getElementById('game-news');
const buildingList = document.getElementById('building-list');
const upgradeList = document.getElementById('upgrade-list'); // Add a reference for upgrades
const statsDisplay = document.getElementById('stats-display'); // Add a reference for stats

// --- Game Data: Buildings and Upgrades ---
const buildings = [
    { id: 'salsa-stand', name: 'Salsa Stand', cost: 15, cps: 0.1, owned: 0, image: 'https://via.placeholder.com/64x64.png?text=Salsa' },
    { id: 'taco-truck', name: 'Taco Truck', cost: 100, cps: 1, owned: 0, image: 'https://via.placeholder.com/64x64.png?text=Truck' },
    { id: 'chili-farm', name: 'Chili Farm', cost: 1100, cps: 8, owned: 0, image: 'https://via.placeholder.com/64x64.png?text=Farm' }
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

function handleChiliClick() {
    chiliCount += chilisPerClick;
    updateChiliCountDisplay();
    updateNewsTicker(); // Update ticker on click too, just for fun
    
    // Create floating number feedback
    const floatingNumber = document.createElement('div');
    floatingNumber.className = 'floating-number';
    floatingNumber.textContent = `+${chilisPerClick}`;
    mainClickArea.appendChild(floatingNumber);
    
    // Position floating number at click location
    floatingNumber.style.left = `${event.offsetX}px`;
    floatingNumber.style.top = `${event.offsetY}px`;
    
    // Remove after animation completes
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
        // Merge with existing buildings to avoid errors if new ones are added
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
}

// --- Tab Switching Logic ---
function showTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Deactivate all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab content and activate its button
    const selectedContent = document.getElementById(`${tabId}-content`);
    const selectedButton = document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`);

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
    showTab('store'); // Set initial active tab on load
});
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', (event) => {
        showTab(event.target.dataset.tab);
    });
});

// --- Initialization ---
// Start game loops
setInterval(updateNewsTicker, 5000);
setInterval(gameLoop, 1000);

// Initialize display and state
updateChiliCountDisplay();
renderBuildings();
loadGame();
