// John Brock
// Snake.js
// https://www.theodinproject.com/courses/javascript-and-jquery/lessons/jquery-and-the-dom?ref=lc-pb
// TODO: Add date finished.

// Creates width X height grids filled with ' '
const gridFactory = function (width, height) {
  // validate inputs
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    console.log("Grid's arguments weren't integers");
    return false;
  }
  if (width < 1) {
    console.log('Grid width to small. Set to 1.');
    width = 1;
  }
  if (height < 1) {
    console.log('Grid height to small. Set to 1.');
    height = 1;
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
  return grid;
};

const validateGrid = function (grid, callerName) {
  if (Array.isArray(grid) && grid.every(Array.isArray)) {
    return true;
  }
  console.log(`invalid grid at ${callerName}`);
  return false;
};

// accepts a two dimension grid of string and returns html
const parseGrid = function (grid) {
  if (!validateGrid(grid, 'parseGrid')) {
    console.log("Can't parse grid.");
    return false;
  }
  let html = '';
  for (let i = 0; i < grid.length; i += 1) {
    html = `${html} <div class="grid-row">`;
    for (let j = 0; j < grid[i].length; j += 1) {
      html = `${html} <div class="grid-square">${grid[i][j]}</div>`;
    }
    html = `${html} </div>`;
  }
  return html;
};

// add snake to grid
const insertSnake = function (grid, snake) {
  for (let i = 0; i < snake.length(); i += 1) {
    const x = snake.coordinates[i][0] - 1;
    const y = grid.length - snake.coordinates[i][1] - 1;
    grid[y][x] = 'O';
  }
  return grid;
};

const insertFood = function (grid) {
  return grid;
};

// set the content of the game area
const setGameArea = function (grid, snake) {
  if (!validateGrid(grid, 'setGameArea')) {
    console.log("Can't set game area");
    return false;
  }
  grid = insertSnake(grid, snake);
  grid = insertFood(grid);
  $('#game-area').html(parseGrid(grid));
  return true;
};

// adds a grid of divs on the in the #game-area
const render = function (snake) {
  const grid = gridFactory(40, 40);
  validateGrid(grid, 'render');
  if (setGameArea(grid, snake)) {
    console.log('Game area rendered');
  }
};

const snakeFactory = function () {
  console.log('We make snake.');
  return {
    direction: 'r',
    coordinates: [[20, 20]],
    length() {
      return this.coordinates.length;
    },
    setDirection(dir) { this.direction = dir; },
    moveRight() { this.coordinates[0][0] = this.coordinates[0][0] + 1; },
    moveLeft()  { this.coordinates[0][0] = this.coordinates[0][0] - 1; },
    moveUp()    { this.coordinates[0][1] = this.coordinates[0][1] - 1; },
    moveDown()  { this.coordinates[0][1] = this.coordinates[0][1] - 1; },
    move() {
      switch(this.direction) {
      case('l'):
        this.moveLeft();
        break;
      case('r'):
        this.moveRight();
        break;
      case('u'):
        this.moveUp();
        break;
      case('d'):
        this.moveDown();
        break;
      }
    },
  };
};

// watches for arrow key presses
// if there is one sets the snake's direction
var watchForArrowKeys = function(snake) {
  const left  = 37;
  const up    = 38;
  const right = 39;
  const down  = 40;
    $( document ).keydown(function( event ) {
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
    }
  });
};

// cycles the game
var turn = function(snake) {
  let i = 0 
  while (i < 10) {

    setTimeout(function(){     
      render(snake);
      snake.move(); }
      , 3000);
    i++;
  }
};

$( document ).ready(function() {
  // make snake
  let snake = snakeFactory();
  // control snake
  watchForArrowKeys(snake);
  // let's wait a second
  turn(snake);
});