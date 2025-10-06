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
    // Increment the chili count by one
    chiliCount++;
    // Update the on-screen display
    updateChiliCountDisplay();
    // After clicking, check if we should update the news ticker
    // This makes it more dynamic based on your actions
    updateNewsTicker();
}

// Function to update the chili count display
function updateChiliCountDisplay() {
    chiliCountDisplay.textContent = `${Math.floor(chiliCount)} Chilies`;
}

// Function to handle the tab navigation
function showTab(tabId) {
    // Get all tab content elements
    const tabContents = document.querySelectorAll('.tab-content');
    // Hide all tab content
    tabContents.forEach(content => {
        content.style.display = 'none';
    });

    // Get all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    // Remove 'active' class from all buttons
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Display the selected tab content
    const selectedContent = document.getElementById(`${tabId}-content`);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }

    // Add 'active' class to the clicked button
    const selectedButton = document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// --- Event Listeners ---
// Add a listener for the main chili click
mainChili.addEventListener('click', handleChiliClick);

// --- Initialization ---
// Update the display when the page first loads
updateChiliCountDisplay();
// Start the news ticker loop
setInterval(updateNewsTicker, 5000); // 5000 milliseconds = 5 seconds
