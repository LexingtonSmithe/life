
let grid;
let next;
let columns;
let rows;
const resolution = 10;
const screenWidth = 1200;
const screenHeight = 900;
const speed = 20;

function setup() {
  // put setup code here
  createCanvas(screenWidth, screenHeight);
  columns = width / resolution;
  rows = height / resolution;
  grid = make2DArray(columns,rows);
  for(let i = 0; i < columns; i++){
    for (let j = 0; j < rows; j++){
      grid[i][j] = {
        "value" : floor(random(2)),
        "colour" : 0
      }
    }
  }
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for(let i=0; i < arr.length; i++){
    arr[i] = new Array(rows);
  }
  for(let k = 0; k < columns; k++){
    for (let j = 0; j < rows; j++){
      arr[k][j] = {}
    }
  }
  return arr;
}
function mouseClicked(){
  let x1 = floor(mouseX / resolution);
  let y1 = floor(mouseY / resolution);
  grid[x1][y1].value = 1;
  grid[x1][y1].colour = 6;
}


function draw() {
  let colourBackground = 0;
  let colourCell = color(255, 0, 0);
  let colourGrid = color(0);
  background(colourBackground)
  frameRate(speed);
  for(let i = 0; i < columns; i++){
    for (let j = 0; j < rows; j++){
      let x = i * resolution;
      let y = j * resolution;
      if(grid[i][j].value == 1){
        grid[i][j].colour = 6;
      }
      colourCell = getColour(grid[i][j].colour);
      if(grid[i][j].colour > 0){
        grid[i][j].colour --;
      }

      fill(colourCell);
      stroke(colourGrid); // grid lines
      rect(x,y,resolution,resolution);
    }
  }

  next = make2DArray(columns, rows);
  // Compute next based on grid

  for(let i = 0 ; i < columns; i++){
    for(let j = 0; j < rows; j++){
      let state = grid[i][j].value
      // Count live neighbours
      let neighbours = countNeighbours(grid, i, j);
      // Reproduction
      if(state == 0 && neighbours == 3){
        next[i][j].value = 1;
        next[i][j].colour = 6;
      // Underpopulation and Overpopulation
      } else if(state == 1 && (neighbours < 2 || neighbours > 3)) {
        next[i][j].value = 0;
        next[i][j].colour = 5;
      } else {
        next[i][j].value = grid[i][j].value;
        next[i][j].colour = grid[i][j].colour;
      }
    }
  }
  grid = next;
}

function countNeighbours(grid, x, y){
  let sum = 0;
  for(let i = -1; i < 2; i++){
    for(let j = -1; j < 2; j++){
      let col = (x + i + columns) % columns;
      let row = (y + j + rows) % rows;

      sum += grid[col][row].value;
    }
  }
  sum -= grid[x][y].value;
  return sum;
}


function getColour(value){
  let colour;
  switch(value){
    case 0:
      colour = color(0);
    break;
    case 1:
      colour = color(43, 0, 0);
    break;
    case 2:
      colour = color(80, 0, 0);
    break;
    case 3:
      colour = color(115, 0, 0);
    break;
    case 4:
      colour = color(160, 0, 0);
    break;
    case 5:
      colour = color(203, 0, 0);
    break;
    case 6:
      colour = color(255, 0, 0);
    break;
  }
  return colour;
}
