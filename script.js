// --- Game State Variables ---
let chiliCount = 0;
let chilisPerSecond = 0;

// --- DOM Element References ---
const mainChiliSoup = document.getElementById('main-chili-soup'); // Listen for clicks on the soup image
const chiliCountDisplay = document.getElementById('chili-count');
const cpsDisplay = document.getElementById('chilis-per-second');
const gameNewsSpan = document.getElementById('game-news');

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
    chiliCount++;
    updateChiliCountDisplay();
    updateNewsTicker();
}

function updateChiliCountDisplay() {
    chiliCountDisplay.textContent = `${Math.floor(chiliCount)} Chilies`;
}

function showTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    const selectedContent = document.getElementById(`${tabId}-content`);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
    const selectedButton = document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// --- Event Listeners ---
// Add a listener for the main chili soup image
mainChiliSoup.addEventListener('click', handleChiliClick);

// --- Initialization ---
updateChiliCountDisplay();
setInterval(updateNewsTicker, 5000);
