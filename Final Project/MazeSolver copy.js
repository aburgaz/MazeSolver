// Burgaz Arturo PD1
// 220ADM067

// to change the numbers file just change the name of the constant named 'fileText', the file should be in the same folder as the .js file

const fs = require('fs');

// Read the maze from a text file
function readMazeFromFile(fileText) {
    let file = fs.readFileSync(fileText, 'utf-8');
    mazeText = file.toString ('UTF8');
    let mazeRows = mazeText.split('\n');
    let maze = mazeRows.map(row => row.split(''));
    return maze;
}

// Check if a cell is valid (within maze boundaries)
function isValidCell(maze, row, col) {
  const numRows = maze.length;
  const numCols = maze[0].length;
  return row >= 0 && row < numRows - 1 && col >= 0 && col < numCols - 1;
}

// Check if a cell is a passage (not a wall or lava)
function isPassage(maze, row, col) {
  const cell = maze[row][col];
  return cell !== 'X' && cell !== 'L';
}

// Recursive function to find the path with the least number of coins
function findPath(maze, row, col, coinsCollected) {
  if (!isValidCell(maze, row, col) || !isPassage(maze, row, col)) {
    return 10000000; // Invalid or blocked cell, return a high cost
  }

  const cell = maze[row][col];
  if (cell === 'G') {
    return coinsCollected; // Reached the goal, return the total coins collected
  }

  let minCoins = 100000000; // Initialize with high cost
  maze[row][col] = 'L'; // Mark the current cell as visited (lava) to avoid revisiting

  // Explore all possible directions (up, down, left, right)
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;
    const newCoinsCollected = coinsCollected + (cell !== 'S' ? Number(cell) : 0);

    const pathCost = findPath(maze, newRow, newCol, newCoinsCollected);
    minCoins = Math.min(minCoins, pathCost);
  }

  maze[row][col] = cell; // Restore the original cell value

  return minCoins;
}
function printMaze(maze){
    for (let i = 0; i < maze.length; i++){
        console.log(maze[i].join(''));
    }
}   
// Solve the maze and find the path with the least number of coins collected
function solveMaze(filename) {
  const maze = readMazeFromFile(filename);
  const numRows = maze.length;
  const numCols = maze[0].length;

  let startRow = -1;
  let startCol = -1;

  // Find the starting point
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (maze[row][col] === 'S') {
        startRow = row;
        startCol = col;
        break;
      }
    }
    if (startRow !== -1 && startCol !== -1) {
      break;
    }
  }

  const coinsCollected = findPath(maze, startRow, startCol, 0);
  return coinsCollected;
}

// Example usage
const mazeFilename = 'maze_11x11.txt';
const coinsCollected = solveMaze(mazeFilename);
console.log('Coins collected:', coinsCollected);