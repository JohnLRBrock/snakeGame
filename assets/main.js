// John Brock
// Snake.js
// https://www.theodinproject.com/courses/javascript-and-jquery/lessons/jquery-and-the-dom?ref=lc-pb
// TODO: Add date finished.

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
  return {
    gameGrid: grid,
    emptyGrid: [...grid],
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
      this.gameGrid = [...this.emptyGrid];
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
          html = `${html} <div class="grid-square">${this.gameGrid[i][j]}</div>`;
        }
        html = `${html} </div>`;
      }
      return html;
    },
    // adds the snake to the game area
    insertSnake(snake) {
      for (let i = 0; i < snake.length(); i += 1) {
        const x = snake.coordinates[i][0] - 1;
        const y = this.height() - snake.coordinates[i][1] - 1;
        this.gameGrid[y][x] = 'O';
      }
      return grid;
    },
    // return false if no food needs to be spawned
    // else add food to random, non-snake, location and return true
    spawnFood(snake) {
      if (!this.validateGrid('spawnFood')) {
        return false;
      }
      // food already exists and snake hasn't eaten it.
      if (this.foodCoordinate && snake.coordinates[0] !== this.foodCoordinate) {
        console.log('Food not spawned. Food already exists.');
        return false;
      }
      if (!snake.validateSnake('spawnFood')) {
        console.log('Food not spawned. Invalid snake.');
        return false;
      }
      // define array of points that isn't the snake
      const notSnake = [];
      for (let i = 0; i < this.height(); i += 1) {
        for (let j = 0; j < this.width(); j += 1) {
          if (!snake.coordinates.includes([i, j])) {
            notSnake.push([i, j]);
          }
        }
      }
      // pick random point that isn't a snake
      const coordinate = notSnake[Math.floor(Math.random() * notSnake.length)];
      this.foodCoordinate = coordinate;
      console.log(`Food coordinates set to ${coordinate}.`);
      return true;
    },
    // adds food to grid
    insertFood() {
      if (!this.validateGrid('insertFood')) {
        return false;
      }
      if (!this.foodCoordinate) {
        console.log(`Invalid food coordinate: ${this.foodCoordinate}`);
        return false;
      }
      const x = this.foodCoordinate[0];
      const y = this.foodCoordinate[1];
      this.gameGrid[x][y] = 'x';
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
  console.log('We make snake.');
  return {
    direction: 'r',
    coordinates: [[20, 20]],
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
        console.log(`Invalid snake at ${callerName}. ${self.direction} is not a valid direction.`);
        return false;
      }
      return true;
    },
    setDirection(dir) { this.direction = dir; },
    moveRight() { this.coordinates[0][0] = this.coordinates[0][0] + 1; },
    moveLeft()  { this.coordinates[0][0] = this.coordinates[0][0] - 1; },
    moveUp()    { this.coordinates[0][1] = this.coordinates[0][1] - 1; },
    moveDown()  { this.coordinates[0][1] = this.coordinates[0][1] - 1; },
    move() {
      switch (this.direction) {
        case ('l'):
          this.moveLeft();
          break;
        case ('r'):
          this.moveRight();
          break;
        case ('u'):
          this.moveUp();
          break;
        case ('d'):
          this.moveDown();
          break;
        default:
          console.log('Invalid movement direction');
      }
    },
  };
};

// watches for arrow key presses
// Sets snake's in appropriate direction
// TODO: don't allow snake to move in direction opposite the one it is facing
const watchForArrowKeys = function (snake) {
  const left  = 37;
  const up    = 38;
  const right = 39;
  const down  = 40;
    $(document).keydown(function (event) {
    switch (event.which) {
      case left:
        console.log('Player pressed left');
        snake.setDirection('l');
        break;
      case up:
        console.log('Player pressed up');
        snake.setDirection('u');
        break;
      case right:
        console.log('Player pressed right');
        snake.setDirection('r');
        break;
      case down:
        console.log('Player pressed down');
        snake.setDirection('d');
        break;
      default:
    }
  });
};

// cycles the game
const turn = function (grid, snake) {
  grid.setGameArea(snake);
};

$(document).ready(function () {
  // make snake
  const grid = gridFactory(40, 40);
  const snake = snakeFactory();
  // TODO: Make game wait for command to start
  // control snake
  watchForArrowKeys(snake);
  // let's wait a second
  turn(grid, snake);
});
