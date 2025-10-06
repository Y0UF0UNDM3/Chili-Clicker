// --- Game State Variables ---
let chiliCount = 0;
let chilisPerSecond = 0;

// --- DOM Element References ---
const mainChili = document.getElementById('main-chili');
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

// Function to update the news ticker
function updateNewsTicker() {
    let newsSource = [];
    if (chiliCount < 500) {
        newsSource = badNews;
    } else {
        newsSource = generalNews;
    }

    // Cycle through the selected news source
    const currentNews = newsSource[newsIndex];
    gameNewsSpan.textContent = currentNews;
    newsIndex = (newsIndex + 1) % newsSource.length;
}

// Function to handle the chili click
function handleChiliClick() {
    chiliCount++;
    updateChiliCountDisplay();
}

// Function to update the chili count display
function updateChiliCountDisplay() {
    chiliCountDisplay.textContent = `${chiliCount} Chilies`;
}

// --- Event Listeners ---
mainChili.addEventListener('click', handleChiliClick);

// --- Initialization ---
updateChiliCountDisplay();

// Update the news ticker every 5 seconds
setInterval(updateNewsTicker, 5000);
