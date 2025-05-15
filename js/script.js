// CONFIG
const TIME_LIMIT = 60;
const CLICKS_TO_LEVEL_UP = 3;
const MAX_LEVEL = 7;
const MIN_CELL_SIZE = 30; // Taille minimale tactile

// ÉLÉMENTS
const elements = {
    grid: document.getElementById("game-board"),
    score: document.getElementById("score"),
    timer: document.getElementById("timer"),
    overlay: document.getElementById("game-overlay"),
    finalScore: document.getElementById("final-score"),
    restartBtn: document.getElementById("restart-btn")
};

// ÉTAT DU JEU
const gameState = {
    score: 0,
    level: 1,
    clicksInLevel: 0,
    timeLeft: TIME_LIMIT,
    isGameOver: false,
    timer: null,
    colors: getRandomColors(),
    darkerIndex: null
};

// INITIALISATION
function init() {
    setupEventListeners();
    resetGame();
}

// ÉVÉNEMENTS
function setupEventListeners() {
    elements.restartBtn.addEventListener("click", resetGame);
    window.addEventListener("resize", debounce(createGrid, 100));
}

// FONCTIONS PRINCIPALES
function createGrid() {
    elements.grid.innerHTML = "";
    
    const gridSize = gameState.level + 3;
    const availableWidth = Math.min(
        window.innerWidth - 40, // Marge sécurité
        window.innerHeight - 200 // Espace pour infos
    );
    const cellSize = Math.max(
        MIN_CELL_SIZE,
        Math.floor(availableWidth / (gridSize + 1)) // +1 pour l'espacement
    );
    
    gameState.darkerIndex = Math.floor(Math.random() * (gridSize * gridSize));
    elements.grid.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
    
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.style.backgroundColor = i === gameState.darkerIndex 
            ? gameState.colors.darker 
            : gameState.colors.base;
        cell.addEventListener("click", () => handleCellClick(i));
        elements.grid.appendChild(cell);
    }
}

function handleCellClick(index) {
    if (gameState.isGameOver || index !== gameState.darkerIndex) return;

    gameState.score++;
    gameState.clicksInLevel++;
    elements.score.textContent = gameState.score;

    if (gameState.clicksInLevel >= CLICKS_TO_LEVEL_UP) {
        gameState.level = Math.min(gameState.level + 1, MAX_LEVEL);
        gameState.clicksInLevel = 0;
        gameState.colors = getRandomColors();
    }
    createGrid();
}

// UTILITAIRES
function getRandomColors() {
    const hue = Math.floor(Math.random() * 360);
    return {
        base: `hsl(${hue}, 80%, 65%)`,
        darker: `hsl(${hue}, 80%, 45%)`
    };
}

function debounce(func, wait) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
    };
}

// GESTION DU TEMPS
function startTimer() {
    clearInterval(gameState.timer);
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        
        const mins = String(Math.floor(gameState.timeLeft / 60)).padStart(2, '0');
        const secs = String(gameState.timeLeft % 60).padStart(2, '0');
        elements.timer.textContent = `${mins}:${secs}`;

        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(gameState.timer);
    gameState.isGameOver = true;
    elements.finalScore.textContent = `Score : ${gameState.score}`;
    elements.overlay.classList.remove("hidden");
}

function resetGame() {
    gameState.score = 0;
    gameState.level = 1;
    gameState.clicksInLevel = 0;
    gameState.timeLeft = TIME_LIMIT;
    gameState.isGameOver = false;
    gameState.colors = getRandomColors();
    
    elements.score.textContent = "0";
    elements.timer.textContent = "03:00";
    elements.overlay.classList.add("hidden");
    
    createGrid();
    startTimer();
}

// LANCEMENT
init();