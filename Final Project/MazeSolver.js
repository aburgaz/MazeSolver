// Burgaz Arturo PD1
// 220ADM067

// to change the numbers file just change the name of the constant named 'fileText', the file should be in the same folder as the .js file

let fs = require('fs');

const fileText = 'maze_11x11.txt';

function readFile(fileText){    // This function reads the file and save the numbers in a new 2D array, I used the same approach in the mid term assignment

    let file = fs.readFileSync(fileText, 'utf-8');
    mazeText = file.toString ('UTF8');
    let mazeRows = mazeText.trim().split('\n');        // This splits the text into rows and ignores the empty spaces
    let maze = mazeRows.map(row => row.split(''));      // This splits the rows into columns for each nalue in the row and saves them in a new 2D array
    return maze;
}

function printMaze(maze){       // This function prints the maze
    for (let i = 0; i < maze.length; i++){      //  For each row it returns a string with the elements of the row
        console.log(maze[i].join(''));
    }
}       // This function is not used in the final code, it was usefull in the testing process

function findStart(maze){   // This function finds the start of the maze
    let startRow = -1;
    let startCol = -1;
    
    for (let i = 0; i < maze.length; i++){
        for (let j = 0; j < maze[i].length; j++){   // This for loop goes through each element of the maze
            if (maze[i][j] === 'S'){    // If the element is 'S' then it saves the position to start the maze
                startRow = i;
                startCol = j;
                break;      // This break is to stop the loop once the start is found to avoid unnecessary comparisons
            }
        }
        if (startRow !== -1){
            break;      // same break here
        }
    }
    return [startRow , startCol];       // This returns the position of the start
}

function isValidPath(maze, row, col){       // This function checks if actual position of the maze is lava or not
    if (row < 0 || row >= maze.length){         // To do so it checks if the position is out of the maze
        return false;
    }
    if (col < 0 || col >= maze[row].length - 1){        // This also checks if the position is out of the maze
        return false;
    }
    return true;
}

function isPassage(maze, row, col){       // This function checks if in the actual position is possible to pass
    cell = maze[row][col];
    return cell !== 'X' && cell !== 'P';    // 'X' for walls and 'P' already visited paths
}

function findPath(maze, row, col, coinsCollected){      // This function finds the path to the end of the maze
    
    if (!isValidPath(maze, row, col) || !isPassage(maze, row, col)){    // First checks if the path is valid
        return 1000000000;      // If not it returns a big number
    }

    let cell = maze[row][col];      // This saves the actual position of the maze to operate later

    if (cell === 'S'){      // If the actual position is the start it changes the cell to '0' to avoid counting it as a coin
        cell = '0';      // Is a string to avoid problems with the Number() function later
    }

    if (cell === 'G'){
        return coinsCollected;    // If the actual position is the end it returns the number of coins collected
    }

    maze[row][col] = 'P';       // This changes the actual position to 'P' to avoid visiting it again, 
                                // could be changed to 'X' to avoid some extracomparisons but in this way is easier to understand

    let minCoins = 1000000000;      // This is the variable that saves the minimum number of coins collected, starting with a huge number

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];      // This is an array with all the possible directions to move inside the maze
    for (const [dx, dy] of directions) {        // This for loop goes through each direction, 
        const newRow = row + dx;        // I asked GPT to find a way to move through the maze, as my first approach was to use a lot of if statements and was not working properly/efficiently
        const newCol = col + dy;
        const newCoinsCollected = coinsCollected + Number(cell);       // This adds the actual value to the number of coins collected, 
                                                                       // the Number() function is to sum the actual value as a number and not as a string
        const coins = findPath(maze, newRow, newCol, newCoinsCollected);        // This is a recursive approach that calls itself to find the path to the end of the maze
        if (coins < minCoins){      // This checks if the number of coins collected is less than the minimum number of coins stored
            minCoins = coins;
        }
    }   

    maze[row][col] = cell;      // This changes the actual position to the original value to avoid problems with the next recursive calls
    
    return minCoins;    // This returns the minimum number of coins collected
}


function solveMaze(maze){       // This is the main function that calls all the other functions
    let position = findStart(maze);     // This function finds the start of the maze and stores it in an array

    let startingRow = position[0];
    let startingCol = position[1];
    //console.log(startingRow, startingCol);        // This is to check where the start is

    totalCoins = findPath(maze, startingRow, startingCol, 0);       // This calls the recursive function that finds the path to the end of the maze
    return totalCoins;          // This returns the total number of coins collected
}

let maze = readFile(fileText);      
console.log(solveMaze(maze));   