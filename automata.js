// Get HTML elements
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton');

// Simulation settings
const gridSize = 50; // 50x50 grid
const cellSize = 10; // 10px per cell
canvas.width = gridSize * cellSize;
canvas.height = gridSize * cellSize;

// State variables
let grid = createInitialGrid(); // Function to create a 2D array
let isPlaying = false;
let simulationInterval; // To store the interval ID

// --- Core Functions ---

// Creates and returns a new 2D array filled with zeros (dead cells)
function createInitialGrid() {
    return Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => 0)
    );
}

// Draws the current state of the grid to the canvas
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            // Set fill style based on cell state
            ctx.fillStyle = grid[row][col] === 1 ? 'black' : 'white';
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            // Optional: Draw a border around the cell
            ctx.strokeStyle = '#00e5ffff';
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
}

// Toggles the state of a clicked cell
function handleCanvasClick(event) {
    if (isPlaying) return; // Don't allow clicking while playing

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    // Toggle the cell's state
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        grid[row][col] = grid[row][col] === 1 ? 0 : 1;
        drawGrid(); // Redraw the grid to show the change
    }
}



// --- Event Handlers ---

function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playButton.textContent = 'Pause';
        simulationInterval = setInterval(() => {
            // 1. Update the grid based on the rules
            grid = predict(grid);
            // 2. Draw the new grid
            drawGrid();
        }, 500); // Updates every 500 milliseconds
    } else {
        playButton.textContent = 'Play';
        clearInterval(simulationInterval);
    }
}

function resetSimulation() {
    clearInterval(simulationInterval);
    isPlaying = false;
    playButton.textContent = 'Play';
    grid = createInitialGrid();
    drawGrid();
}

// --- Add Listeners ---

canvas.addEventListener('click', handleCanvasClick);
playButton.addEventListener('click', togglePlay);
document.getElementById('resetButton').addEventListener('click', resetSimulation);
canvas.addEventListener('click', () => {
    console.log('clicked');
});

// --- Initial setup ---

drawGrid(); // Draw the initial, empty grid

function predict(grid) {
  let new_grid = structuredClone(grid);
    for (let r = 0; r < grid.length; r++){
      for (let c =0; c < grid[r].length; c++){
        let n = countNeighbors(grid, r, c);
        if (grid[r][c] == 1){
          if (n == 2 || n == 3){
            new_grid[r][c] = 1;
          }else {
            new_grid[r][c] = 0;
          }
        }else {
          if (n == 3){
            new_grid[r][c] = 1;
          }else {
            new_grid[r][c] = 0;
          }
        }
      }
    }
  return new_grid;
}

function countNeighbors(grid, r, c){
  let sum = 0;
  if (r - 1 >= 0 && c - 1 >= 0 && r - 1 < grid.length && c - 1 < grid.length){
    if (grid[r - 1][c - 1]){
      sum++;
    }
  }
  if (r - 0 >= 0 && c - 1 >= 0 && r - 0 < grid.length && c - 1 < grid.length){
    if (grid[r - 0][c - 1]){
      sum++;
    }
  }
  if (r + 1 >= 0 && c - 1 >= 0 && r + 1 < grid.length && c - 1 < grid.length){
    if (grid[r + 1][c - 1]){
      sum++;
    }
  }
  
  if (r - 1 >= 0 && c - 0 >= 0 && r - 1 < grid.length && c - 0 < grid.length){
    if (grid[r - 1][c - 0]){
      sum++;
    }
  }
    if (r + 1 >= 0 && c - 0 >= 0 && r + 1 < grid.length && c - 0 < grid.length){
    if (grid[r + 1][c - 0]){
      sum++;
    }
  }
  if (r - 1 >= 0 && c + 1 >= 0 && r - 1 < grid.length && c + 1 < grid.length){
    if (grid[r - 1][c + 1]){
      sum++;
    }
  }
  if (r - 0 >= 0 && c + 1 >= 0 && r - 0 < grid.length && c + 1 < grid.length){
    if (grid[r - 0][c + 1]){
      sum++;
    }
  }
  if (r + 1 >= 0 && c + 1 >= 0 && r + 1 < grid.length && c + 1 < grid.length){
    if (grid[r + 1][c + 1]){
      sum++;
    }
  }
  return sum;
}
