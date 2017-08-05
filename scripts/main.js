// John Brock
// Snake.js
// https://www.theodinproject.com/courses/javascript-and-jquery/lessons/jquery-and-the-dom?ref=lc-pb
// TODO: Add date finished.

const gridHeight = 40;
const gridWidth = 40;
let turnCycle;
// change incrementSpeed to approach 0 but never reach it
// TODO: change speed incrementing
const turnDuration = {
  baseSpeed: 25,
  speedModifier: 200,
  incrementSpeed() {
    this.speedModifier /= 1.05;
    console.log(this.baseSpeed + this.speedModifier);
  },
};

// returns grid object
const gridFactory = function (width, height) {
  // validate inputs
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    console.log("Grid's arguments weren't integers");
    return false;
  }
  if (width < 1) {
    console.log('Grid width to small.');
    return false;
  }
  if (height < 1) {
    console.log('Grid height to small.');
    return false;
  }

  // create empty grid and row
  const newGrid = function () {
    const grid = [];
    const row = [];
    // populate row with spaces
    for (let i = 0; i < width; i += 1) {
      row.push(' ');
    }
    // populate grid with rows
    for (let i = 0; i < height; i += 1) {
      const rowCopy = [...row];
      grid.push(rowCopy);
    }
    return grid;
  };
  return {
    gameGrid: newGrid(width, height),
    foodCoordinate: false,
    height() { return this.gameGrid.length; },
    width() { return this.gameGrid[0].length; },

    validateGrid(callerName) {
      if (!Array.isArray(this.gameGrid)) {
        console.log(`Invalid gameGrid at ${callerName}. Not an array.`);
        return false;
      }
      if (!this.gameGrid.every(Array.isArray)) {
        console.log(`Invalid gameGrid at ${callerName}. Not a two dimensional array.`);
        return false;
      }
      if (this.height() < 1) {
        console.log(`Invalid gameGrid at ${callerName}. Height less than 1`);
        return false;
      }
      if (this.width() < 1) {
        console.log(`Invalid gameGrid at ${callerName}. Width less than 1`);
        return false;
      }
      // is every row same length?
      for (let i = 1; i < this.gameGrid.length; i += 1) {
        if (this.gameGrid[0].length !== this.gameGrid[i].length) {
          console.log(`Invalid gameGrid at ${callerName}. Row ${i} different length.`);
          return false;
        }
      }
      return true;
    },
    clearGrid() {
      this.gameGrid = newGrid(width, height);
    },
    // outputs HTML representation of grid
    parseGrid() {
      if (!this.validateGrid('parseGrid')) {
        return false;
      }
      let html = '';
      for (let i = 0; i < this.height(); i += 1) {
        html = `${html} <div class="grid-row">`;
        for (let j = 0; j < this.width(); j += 1) {
          switch (this.gameGrid[i][j]) {
            case 'O':
              html = `${html} <div class="grid-square snake-head"></div>`;
              console.log('added snake head');
              break;
            case 'o':
              html = `${html} <div class="grid-square snake-body"></div>`;
              console.log('added snake body');
              break;
            case 'X':
              html = `${html} <div class="grid-square food"></div>`;
              console.log('added food');
              break;
            default:
              html = `${html} <div class="grid-square"></div>`;
          }
        }
        html = `${html} </div>`;
      }
      return html;
    },
    // adds the snake to the game area
    insertSnake(snake) {
      for (let i = 0; i < snake.length(); i += 1) {
        const x = snake.coordinates[i][0];
        const y = snake.coordinates[i][1];
        if (i === 0) {
          this.gameGrid[y][x] = 'O';
        } else {
          this.gameGrid[y][x] = 'o';
        }
      }
      return true;
    },
    // return false if no food needs to be spawned
    // else add food to random, non-snake, location and return true
    // TODO: food is spawning on top of snake.
    spawnFood(snake) {
      if (!this.validateGrid('spawnFood')) {
        return false;
      }
      // food already exists and snake hasn't eaten it.
      if (this.foodCoordinate && snake.coordinates[0] !== this.foodCoordinate) {
        return false;
      }
      if (!snake.validateSnake('spawnFood')) {
        return false;
      }
      // pick random point for the food
      this.foodCoordinate = [Math.floor(Math.random() * gridWidth), Math.floor(Math.random() * gridHeight)];
      return true;
    },
    removeFood() {
      this.foodCoordinate = false;
    },
    // adds food to grid
    insertFood() {
      if (!this.validateGrid('insertFood')) {
        return false;
      }
      if (!this.foodCoordinate) {
        return false;
      }
      const x = this.foodCoordinate[0];
      const y = this.foodCoordinate[1];
      this.gameGrid[y][x] = 'X';
      return true;
    },
    // clear and then set the game area
    setGameArea(snake) {
      if (!this.validateGrid('setGameArea')) {
        return false;
      }
      this.clearGrid();
      this.insertSnake(snake);
      this.spawnFood(snake);
      this.insertFood();
      $('#game-area').html(this.parseGrid());
      return true;
    },
  };
};

// returns snake object
const snakeFactory = function () {
  return {
    direction: 'r',
    lastMovedInDirection: 'r',
    coordinates: [[20, 20], [19, 20], [18, 20], [17, 20]],
    growing: false,
    length() { return this.coordinates.length; },
    validateSnake(callerName) {
      if (!Array.isArray(this.coordinates)) {
        console.log(`Invalid snake at ${callerName}. Not an array.`);
        return false;
      }
      if (!this.coordinates.every(Array.isArray)) {
        console.log(`Invalid snake at ${callerName}. Not an array of coordinates.`);
        return false;
      }
      // is every row same length?
      if (!this.direction === 'l' || !this.direction === 'r' || !this.direction === 'u' || !this.direction === 'd') {
        console.log(`Invalid snake at ${callerName}. ${this.direction} is not a valid direction.`);
        return false;
      }
      return true;
    },
    grow() {
      this.growing = true;
    },
    setDirection(dir) { this.direction = dir; },
    // adds new coordinate to front of snake in direction it's facing.
    addHead() {
      const newHead = {
        l: [this.coordinates[0][0] - 1, this.coordinates[0][1]],
        r: [this.coordinates[0][0] + 1, this.coordinates[0][1]],
        u: [this.coordinates[0][0], this.coordinates[0][1] - 1],
        d: [this.coordinates[0][0], this.coordinates[0][1] + 1],
      };
      this.coordinates.unshift(newHead[this.direction]);
    },
    // removes last coordinate in snake unless snake ate last turn.
    removeTail() {
      if (this.growing) {
        this.growing = false;
      } else {
        this.coordinates.pop();
      }
      return true;
    },
    move() {
      this.lastMovedInDirection = this.direction;
      this.addHead();
      this.removeTail();
    },
  };
};

// watches for arrow key presses
// Sets snake's in appropriate direction
const watchForArrowKeys = function (snake) {
  const left  = 37;
  const up    = 38;
  const right = 39;
  const down  = 40;
    $(document).keydown(function (event) {
    switch (event.which) {
      case left:
        console.log('Player pressed left');
        if (snake.lastMovedInDirection !== 'r') { snake.setDirection('l'); }
        break;
      case up:
        console.log('Player pressed up');
        if (snake.lastMovedInDirection !== 'd') { snake.setDirection('u'); }
        break;
      case right:
        console.log('Player pressed right');
        if (snake.lastMovedInDirection !== 'l') { snake.setDirection('r'); }
        break;
      case down:
        console.log('Player pressed down');
        if (snake.lastMovedInDirection !== 'u') { snake.setDirection('d'); }
        break;
      default:
    }
  });
};

// does the snake's head have same coordinates as the food 
const isSnakeEatingFood = function (grid, snake) {
  const xFood = grid.foodCoordinate[0];
  const xSnakeHead = snake.coordinates[0][0];
  const yFood = grid.foodCoordinate[1];
  const ySnakeHead = snake.coordinates[0][1];
  if (xFood === xSnakeHead && yFood === ySnakeHead) {
    return true;
  }
  return false;
};

// did the player win?
const playerWon = function (grid, snake) {
  if (snake.coordinates.length > (gridWidth * gridHeight) / 20) {
    return true;
  }
  return false;
};

//  returns true if player loses
const playerLost = function (grid, snake) {
  // coordinates of the snake's head
  const xHead = snake.coordinates[0][0];
  const yHead = snake.coordinates[0][1];
  const isArrayEqual = function (arr1, arr2) {
    if (arr1.length !== arr2.length || !Array.isArray(arr1) || !Array.isArray(arr2)) {
      return false;
    }
    for (let i = 0; i < arr1.length; i += 1) {
      if (arr1[i] !== arr2[i]) { return false; }
    }
    return true;
  };
  if (xHead < 0 || xHead >= gridHeight || yHead < 0 || yHead >= gridWidth) {
    return true;
  }
  for (let i = 1; i < snake.coordinates.length; i += 1) {
    if (isArrayEqual(snake.coordinates[0], snake.coordinates[i])) {
      return true;
    }
  }
  return false;
};


// cycles the game
const turn = function (grid, snake) {
  snake.move();
  if (playerWon(grid, snake)) {
    clearInterval(turnCycle);
    $('#game-area').html('<h1>YOU WON THE GAME!</h1>');
    return true;
  }
  if (playerLost(grid, snake)) {
    clearInterval(turnCycle);
    $('#game-area').html('<h1>YOU LOST THE GAME!</h1>');
    return false;
  }
  if (isSnakeEatingFood(grid, snake)) {
    console.log('The snake ate the food');
    turnDuration.incrementSpeed();
    grid.removeFood();
    snake.grow();
    clearInterval(turnCycle);
    turnCycle = setInterval(turn, turnDuration.baseSpeed + turnDuration.speedModifier, grid, snake);
  }
  grid.setGameArea(snake);
};

const newGame = function () {
  const grid = gridFactory(gridWidth, gridHeight);
  const snake = snakeFactory();
  // control snake
  watchForArrowKeys(snake);
  // let's wait a second
  turnCycle = setInterval(turn, turnDuration.baseSpeed + turnDuration.speedModifier, grid, snake);
};

$(document).ready(function () {
  $("button").click(function (event) {
    clearInterval(turnCycle);
    newGame();
    });
});
