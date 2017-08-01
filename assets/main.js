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
    grid.push(row);
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

// set the content of the game area
var setGameArea = function(grid) {
  validateGrid(grid, 'setGameArea');
  $( '#game-area' ).html(parseGrid(grid));
  return true;
};

// accepts a two dimension grid of string and returns html
var parseGrid = function(grid) {
  validateGrid(grid, 'parseGrid');
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

// adds a grid of divs on the in the #game-area
var render = function(grid) {
  validateGrid(grid, 'render');
    if (setGameArea(grid)) {
      console.log('Game area rendered');
    }
  } else {
    console.log("Render's argument wasn't an array of arrays");
    return false;
  }
};

$( document ).ready(function() {
  // instantiate grid
  let gameGrid = grid(40,40);
  render(gameGrid);
});