 // ========== CONFIGURATION ========== //
 const TIME_LIMIT = 60; // 3 minutes en secondes
 const CLICKS_TO_LEVEL_UP = 3; // Clics nécessaires pour monter de niveau
 const MAX_LEVEL = 7; // Niveau max (10x10)
 
 // ========== ÉLÉMENTS DU DOM ========== //
 const grid = document.getElementById("game-board");
 const scoreDisplay = document.getElementById("score");
 const timerDisplay = document.getElementById("timer");
 const gameOverDisplay = document.getElementById("game-over");
 const gameOverlay = document.getElementById("game-overlay");
 const finalScoreDisplay = document.getElementById("final-score");
 const restartBtn = document.getElementById("restart-btn");
 
 
 // ========== VARIABLES DU JEU ========== //
 let score = 0;
 let level = 1;
 let clicksInLevel = 0;
 let baseColor = getRandomColor();
 let darkerCellIndex;
 let timeLeft = TIME_LIMIT;
 let timerInterval;
 let isGameOver = false;
 
 // ========== FONCTIONS PRINCIPALES ========== //
 
 /** Génère une couleur aléatoire + sa version foncée */
 function getRandomColor() {
     const hue = Math.floor(Math.random() * 360);
     return {
         base: `hsl(${hue}, 80%, 65%)`,
         darker: `hsl(${hue}, 80%, 45%)`
     };
 }
 
 /** Crée la grille adaptée au niveau */
 function createGrid() {
     grid.innerHTML = "";
     
     // Détermine la taille de la grille (4x4 → 10x10)
     const gridSize = level + 3; 
     // Calcule la taille des cases (décroissante)
     const cellSize = Math.max(36, 80 - (level * 6)); 
     
     darkerCellIndex = Math.floor(Math.random() * (gridSize * gridSize));
     
     // Applique la taille dynamique
     grid.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
     
     // Crée les cases
     for (let i = 0; i < gridSize * gridSize; i++) {
         const cell = document.createElement("div");
         cell.className = "cell";
         cell.style.backgroundColor = i === darkerCellIndex ? baseColor.darker : baseColor.base;
         cell.addEventListener("click", () => handleClick(i));
         grid.appendChild(cell);
     }
 }
 
 /** Gère le clic sur une case */
 function handleClick(index) {
     if (isGameOver || index !== darkerCellIndex) return;
 
     // Met à jour le score
     score++;
     scoreDisplay.textContent = score;
     clicksInLevel++;
 
     // Changement de niveau après 3 bonnes réponses
     if (clicksInLevel >= CLICKS_TO_LEVEL_UP) {
         level = Math.min(level + 1, MAX_LEVEL);
         clicksInLevel = 0;
         baseColor = getRandomColor();
     }
     createGrid();
 }
 // ========== FONCTION DE FIN DE JEU ========== //
 function showGameOver() {
     finalScoreDisplay.textContent = `Score final : ${score}`;
     gameOverlay.classList.remove("hidden");
 }
 
 // ========== REDÉMARRAGE ========== //
 restartBtn.addEventListener("click", () => {
     // Réinitialisation des variables
     score = 0;
     level = 1;
     clicksInLevel = 0;
     timeLeft = TIME_LIMIT;
     isGameOver = false;
     
     // Mise à jour de l'affichage
     scoreDisplay.textContent = "0";
     timerDisplay.textContent = "03:00";
     gameOverlay.classList.add("hidden");
     
     // Relance du jeu
     baseColor = getRandomColor();
     createGrid();
     startTimer();
 });
 /** Lance le compte à rebours */
 function startTimer() {
     timerInterval = setInterval(() => {
         timeLeft--;
         const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
         const seconds = (timeLeft % 60).toString().padStart(2, '0');
         timerDisplay.textContent = `${minutes}:${seconds}`;
 
         if (timeLeft <= 0) {
             clearInterval(timerInterval);
             isGameOver = true;
             showGameOver(); // Remplace l'ancien affichage
         }
     }, 1000);
 }
 
 // ========== INITIALISATION ========== //
 createGrid();
 startTimer();