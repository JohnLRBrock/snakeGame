// John Brock
// Snake.js
// https://www.theodinproject.com/courses/javascript-and-jquery/lessons/jquery-and-the-dom?ref=lc-pb
// TODO: Add date finished.

// Creates width X height grids filled with ' '
var grid = function(width, height) {
  // validate inputs
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    console.log("Grid's arguments weren't integers")
    return false;
  }
  if (width < 1) {
    console.log("Grid width to small. Set to 1.");
    width = 1;
  }
  if (height < 1) {
    console.log("Grid height to small. Set to 1.")
    height = 1;
  }

  // create empty grid and row
  let grid = [];
  let row = [];
  // populate row with spaces
  for (let i = 0; i < width; i++ ) { 
    row.push(' ');
  };
  // populate grid with rows
  for (let i = 0; i < height; i++) {
    let rowCopy = [...row]
    grid.push(rowCopy);
  };
  return grid;
};

var validateGrid = function(grid, callerName) {
  if (Array.isArray(grid) && grid.every(Array.isArray)) {
    return true;
  } else {
    console.log(`invalid grid at ${callerName}`);
    return false;
  }
};

// accepts a two dimension grid of string and returns html
var parseGrid = function(grid) {
  if (!validateGrid(grid, 'parseGrid')){
    console.log("Can't parse grid.");
    return false;
  }
  let html = '';
  for (let i = 0; i < grid.length; i++) {
    html = `${html} <div class="grid-row">`;
    for (let j = 0; j < grid[i].length; j++) {
      html = `${html} <div class="grid-square">${grid[i][j]}</div>`;
    }
    html = `${html} </div>`;
  }
  return html;
};

// set the content of the game area
var setGameArea = function(grid) {
  if (!validateGrid(grid, 'setGameArea')) {
    console.log("Can't set game area");
    return false;
  }
  $( '#game-area' ).html(parseGrid(grid));
  return true;
};

// adds a grid of divs on the in the #game-area
var render = function(grid) {
  validateGrid(grid, 'render');
  if (setGameArea(grid)) {
    console.log('Game area rendered');
  }
};

var snakeFactory = function() {
  console.log("We make snake.");
  return {
    snakeCoordinates: [[20,20]],
    direction: 'r',
    setDirection: function(dir) {
      this.direction = dir;
    },
  };
};

// TODO: remove
// spawns a snake at (x,y)
var spawnSnake = function(grid, x, y) {
  if (!validateGrid(grid, 'parseGrid')){
    console.log("Can't spawn snake.");
    return false;
  }
  grid[grid.length - y - 1][x] = "O";
  return grid;
};

var watchForArrowKeys = function(snake) {
    $( document ).keydown(function( event ) {
    // left = 37
    // up = 38
    // right = 39
    // down = 40
    switch (event.which) {
    case 37:
      console.log('Player pressed left');
      snake.setDirection('l');
      console.log(snake.direction)
      break;
    case 38:
      console.log('Player pressed up');
      snake.setDirection('u');
      break;
    case 39:
      console.log('Player pressed right');
      snake.setDirection('r');
      break;
    case 40:
      console.log('Player pressed down');
      snake.setDirection('d');
      break;
    }
  });
};

$( document ).ready(function() {
  // instantiate grid
  let gameGrid = grid(40,40);
  render(gameGrid);
  let snake = snakeFactory();
  watchForArrowKeys(snake);
  setTimeout(3000);
});