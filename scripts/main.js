// John Brock
// Snake.js
// https://www.theodinproject.com/courses/javascript-and-jquery/lessons/jquery-and-the-dom?ref=lc-pb
// 2017-08-08

// TODO: add score
// TODO: Crib style from https://afuh.github.io/snake-game/
// TODO: mess with speed function
// TODO: Use preventDefault() to stop arrow keys from moving screen up and down.
// TODO: Change to flex Grid
// TODO: Check how it looks on different screen sizes, especially 1200X800
// TODO: add support for internet explorer.
// TODO: Game start on click instead of button press.
// TODO: Create testing suite and remove console.logs

const gridHeight = 40;
const gridWidth = 40;
let turnCycle;
// change incrementSpeed to approach 0 but never reach it
const turnDuration = {
  incrementSpeed() {
    this.speedModifier /= 1.05;
  },
  reset() {
    this.baseSpeed = 25;
    this.speedModifier = 200;
  },
};

// returns grid object
const gridFactory = (width, height) => {
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
    // when food is on grid this variable will be an array containing an x and y coordinate.
    foodCoordinate: false,
    height() { return this.gameGrid.length; },
    width() { return this.gameGrid[0].length; },

    // prints error message and returns false if called from an invalid grid
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
              break;
            case 'o':
              html = `${html} <div class="grid-square snake-body"></div>`;
              break;
            case 'X':
              html = `${html} <div class="grid-square food"></div>`;
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

    // food related methods

    // A grid object, in this project, is an array of rows.
    // Each row, representing a Y value, is an array of x values.
    // This function accepts a value for it's origin and it's dimensions.
    // It's origin is the point furthest to the bottom left. (Y axis is flipped)
    // The returned grid is a square.
    newArrayGrid(xOrigin, yOrigin, n) {
      if (!Number.isInteger(xOrigin)) {
        console.log(`xOrigin in newArrayGrid is not an integer: ${xOrigin}`);
        return false;
      }
      if (!Number.isInteger(yOrigin)) {
        console.log(`yOrigin in newArrayGrid is not an integer: ${yOrigin}`);
        return false;
      }
      if (!n) {
        console.log(`n in newArrayGrid is not an integer: ${n}`);
        return false;
      }
      const foodGrid = [];
      const distance = (2 * n);
      for (let x = xOrigin; x < xOrigin + distance; x += 1) {
        for (let y = yOrigin; y < yOrigin + distance; y += 1) {
          if (x > this.width() - 1 || x < 0) {
            console.log(`newArrayGrid tried to make grid with the illegal x coordinate: ${x}`);
            console.log(`Origin coordinates were [${xOrigin},${yOrigin}]`);
            return false;
          }
          if (y > this.height() - 1 || y < 0) {
            console.log(`newArrayGrid tried to make grid with an illegal y coordinate: ${y}`);
            console.log(`Origin coordinates were [${xOrigin},${yOrigin}]`);
            return false;
          }
          foodGrid.push([x, y]);
        }
      }
      return foodGrid;
    },

    // is the snake too close to any edge to draw a grid from its position?
    // is x too close to the min value
    isCloseToLeft(xSnakeHead, n) {
      if (xSnakeHead - n < 0) {
        return true;
      }
      return false;
    },
    // is x too close to the max value
    isCloseToRight(xSnakeHead, n) {
      if (xSnakeHead + (n * 2) > this.width() - 1) {
        return true;
      }
      return false;
    },
    // is y too close to the min value
    isCloseToTop(ySnakeHead, n) {
      if (ySnakeHead - n < 0) {
        return true;
      }
      return false;
    },
    // is y too close to the max value
    isCloseToBot(ySnakeHead, n) {
      if (ySnakeHead + (2 * n) > this.height() - 1) {
        return true;
      }
      return false;
    },

    // returns array of coordinates n units around snake
    nUnitsAroundSnake(xSnakeHead, ySnakeHead, n) {
      // top left corner is (0,0)
      if (this.isCloseToTop(ySnakeHead, n)) {
        if (this.isCloseToLeft(xSnakeHead, n)) {
          return this.newArrayGrid(0, 0, n);
        }
        if (this.isCloseToRight(xSnakeHead, n)) {
          return this.newArrayGrid(this.width() - (n * 2), 0, n);
        }
        return this.newArrayGrid(0, ySnakeHead, n);
      }

      if (this.isCloseToBot(ySnakeHead, n)) {
        if (this.isCloseToLeft(xSnakeHead, n)) {
          return this.newArrayGrid(0, this.height() - (n * 2), n);
        }
        if (this.isCloseToRight(xSnakeHead, n)) {
          return this.newArrayGrid(this.width() - (n * 2), this.height() - (n * 2), n);
        }
        return this.newArrayGrid(xSnakeHead, this.height() - (n * 2), n);
      }

      if (this.isCloseToLeft(xSnakeHead, n)) {
        return this.newArrayGrid(0, ySnakeHead - n, n);
      }
      if (this.isCloseToRight(xSnakeHead, n)) {
        return this.newArrayGrid(this.width() - (n * 2), ySnakeHead, n);
      }
      // default condition
      return this.newArrayGrid(xSnakeHead - n, ySnakeHead - n, n);
    },

    sameCoordinates(coord1, coord2) {
      for (let i = 0; i < coord1.length; i += 1) {
        if (coord1[i] !== coord2[i]) {
          return false;
        }
      }
      return true;
    },

    // accepts an array of arrays of coordinate points and a snake
    // removes all coordinates from the arrays that also belong to the snake
    noStepOnSnek(arrGrid, snakeCoordinates) {
      if (!Array.isArray(arrGrid)) {
        console.log(`arrGrid in noStepOnSnek is not an array: ${arrGrid}`);
        return false;
      }
      if (!Array.isArray(snakeCoordinates)) {
        console.log(`snakeCoordinates in noStepOnSnek is not an array: ${snakeCoordinates}`);
        return false;
      }
      const returnGrid = [];
      for (let i = 0; i < arrGrid.length; i += 1) {
        let inSnake = false;
        for (let j = 0; j < snakeCoordinates.length; j += 1) {
          if (this.sameCoordinates(arrGrid[i], snakeCoordinates[j])) {
            inSnake = true;
          }
        }
        // if coordinates are in grid but not in snake add to new grid
        if (!inSnake) {
          returnGrid.push([arrGrid[i][0], arrGrid[i][1]]);
          inSnake = false;
        }
      }
      return returnGrid;
    },

    // return false if no food needs to be spawned
    // else add food to random, non-snake, location and return true
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

      const averageGameGridDimension = Math.floor((this.width() + this.height()) / 2);
      let arrGrid;
      if (snake.length() * 2 < this.width()) {
        arrGrid = this.nUnitsAroundSnake(snake.coordinates[0][0], snake.coordinates[0][1],
          snake.length());
      } else {
        arrGrid = this.newArrayGrid(0, 0, averageGameGridDimension / 2);
      }
      const snakelessGrid = this.noStepOnSnek(arrGrid, snake.coordinates);
      // pick random point for the food
      this.foodCoordinate = [...snakelessGrid[Math.floor(Math.random() * snakelessGrid.length)]];
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
    direction: 'rightArrow',
    lastMovedInDirection: 'rightArrow',
    directionInstructions: [],
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
      if (!this.direction === 'leftArrow' || !this.direction === 'rightArrow' || !this.direction === 'upArrow' || !this.direction === 'downArrow' ||
          !this.direction === 'leftA' || !this.direction === 'RightD' || !this.direction === 'upW' || !this.direction === 'downS') {
        console.log(`Invalid snake at ${callerName}. ${this.direction} is not a valid direction.`);
        return false;
      }
      return true;
    },
    grow() {
      this.growing = true;
    },
    setDirection() {
      if (this.directionInstructions.length > 0) {
        switch (this.lastMovedInDirection) {
          // change this to use a loop to check through all instructions
          case 'leftArrow':
          case 'leftA':
            for (let i = 0; i < this.directionInstructions.length; i += 1) {
              if (this.directionInstructions[i] !== 'rightArrow' && this.directionInstructions[i] !== 'RightD') {
                this.direction = this.directionInstructions[i];
                break;
              }
            }
            break;
          case 'rightArrow':
          case 'RightD':
            for (let i = 0; i < this.directionInstructions.length; i += 1) {
              if (this.directionInstructions[i] !== 'leftArrow' && this.directionInstructions[i] !== 'leftA') {
                this.direction = this.directionInstructions[i];
                break;
              }
            }
            break;
          case 'upArrow':
          case 'upW':
            for (let i = 0; i < this.directionInstructions.length; i += 1) {
              if (this.directionInstructions[i] !== 'downArrow' && this.directionInstructions[i] !== 'downS') {
                this.direction = this.directionInstructions[i];
                break;
              }
            }
            break;
          case 'downArrow':
          case 'downS':
            for (let i = 0; i < this.directionInstructions.length; i += 1) {
              if (this.directionInstructions[i] !== 'upArrow' && this.directionInstructions[i] !== 'upW') {
                this.direction = this.directionInstructions[i];
                break;
              }
            }
            break;
          default:
        }
      }
    },
    addDirectionInstruction(dir) {
      if (this.directionInstructions.includes(dir)) {
        return false;
      }
      this.directionInstructions.unshift(dir);
      this.setDirection();
      return true;
    },
    removeDirectionInstuciton(dir) {
      const index = this.directionInstructions.indexOf(dir);
      this.directionInstructions.splice(index, 1);
      this.setDirection();
    },
    // adds new coordinate to front of snake in direction it's facing.
    addHead() {
      let newHead;
      switch (this.direction) {
        case 'leftA':
        case 'leftArrow':
          newHead = [this.coordinates[0][0] - 1, this.coordinates[0][1]];
          break;
        case 'RightD':
        case 'rightArrow':
          newHead = [this.coordinates[0][0] + 1, this.coordinates[0][1]];
          break;
        case 'upW':
        case 'upArrow':
          newHead = [this.coordinates[0][0], this.coordinates[0][1] - 1];
          break;
        case 'downS':
        case 'downArrow':
          newHead = [this.coordinates[0][0], this.coordinates[0][1] + 1];
          break;
        default:
      }
      this.coordinates.unshift(newHead);
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
const watchForArrowKeys = (snake) => {
  const left = 37;
  const up = 38;
  const right = 39;
  const down = 40;
  const w = 87;
  const a = 65;
  const s = 83;
  const d = 68;

  $(document).keydown((event) => {
    switch (event.which) {
      case left:
        snake.addDirectionInstruction('leftArrow');
        break;
      case up:
        snake.addDirectionInstruction('upArrow');
        break;
      case right:
        snake.addDirectionInstruction('rightArrow');
        break;
      case down:
        snake.addDirectionInstruction('downArrow');
        break;
      case a:
        snake.addDirectionInstruction('leftA');
        break;
      case w:
        snake.addDirectionInstruction('upW');
        break;
      case d:
        snake.addDirectionInstruction('RightD');
        break;
      case s:
        snake.addDirectionInstruction('downS');
        break;
      default:
    }
  });
  $(document).keyup((event) => {
    switch (event.which) {
      case left:
        snake.removeDirectionInstuciton('leftArrow');
        break;
      case up:
        snake.removeDirectionInstuciton('upArrow');
        break;
      case right:
        snake.removeDirectionInstuciton('rightArrow');
        break;
      case down:
        snake.removeDirectionInstuciton('downArrow');
        break;
      case a:
        snake.removeDirectionInstuciton('leftA');
        break;
      case w:
        snake.removeDirectionInstuciton('upW');
        break;
      case d:
        snake.removeDirectionInstuciton('RightD');
        break;
      case s:
        snake.removeDirectionInstuciton('downS');
        break;
      default:
    }
  });
};

// does the snake's head have same coordinates as the food 
const isSnakeEatingFood = (grid, snake) => {
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
const playerWon = (grid, snake) => {
  if (snake.coordinates.length > (gridWidth * gridHeight) / 20) {
    return true;
  }
  return false;
};

//  returns true if player loses
const playerLost = (grid, snake) => {
  // coordinates of the snake's head
  const xHead = snake.coordinates[0][0];
  const yHead = snake.coordinates[0][1];
  const isArrayEqual = (arr1, arr2) => {
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
const turn = (grid, snake) => {
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
    turnDuration.incrementSpeed();
    grid.removeFood();
    snake.grow();
    clearInterval(turnCycle);
    turnCycle = setInterval(turn, turnDuration.baseSpeed + turnDuration.speedModifier, grid, snake);
  }
  return grid.setGameArea(snake);
};

const newGame = () => {
  const grid = gridFactory(gridWidth, gridHeight);
  const snake = snakeFactory();
  // control snake
  watchForArrowKeys(snake);
  // let's wait a second
  turnCycle = setInterval(turn, turnDuration.baseSpeed + turnDuration.speedModifier, grid, snake);
};

$(document).ready(() => {
  $('button').click(() => {
    clearInterval(turnCycle);
    turnDuration.reset();
    newGame();
  });
});
