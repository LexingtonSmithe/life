
let grid;
let next;
let columns;
let rows;
let healthy = 0;
let infected = 0;
let dying = 0;
const resolution = 10;
const speed = 30;
const infectionRate = 2;

function setup() {
  // put setup code here
  // console.log(windowWidth, windowHeight);
  // console.log(windowWidth - (windowWidth % resolution))
  // console.log(windowHeight - (windowHeight % resolution))
  let adjustedWidth = windowWidth - 5;
  let adjustedHeight = windowHeight - 5;
  createCanvas(adjustedWidth, adjustedHeight);
  columns = (adjustedWidth - (adjustedWidth % resolution)) / resolution;
  rows = (adjustedHeight - (adjustedHeight % resolution)) / resolution;
  grid = make2DArray(columns,rows);
  for(let i = 0; i < columns; i++){
    for (let j = 0; j < rows; j++){
      grid[i][j] = {
        "value" : floor(random(2)),
        "colour" : 0,
        "team" : floor(random(2))
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
function mouseDragged(){
  let x1 = floor(mouseX / resolution);
  let y1 = floor(mouseY / resolution);
  grid[x1][y1].value = 1;
  grid[x1][y1].colour = 6;
  gridv[x1][y1].team = 0;
}


function draw() {
  let colourBackground = color(10, 10, 10);
  let colourCell = color(255, 0, 0);
  // let colourGrid = color(255, 0, 0);
  background(colourBackground)
  frameRate(speed);
  healthy = 0;
  infected = 0;
  dying = 0;
  for(let i = 0; i < columns; i++){
    for (let j = 0; j < rows; j++){
      let x = i * resolution;
      let y = j * resolution;
      switch(grid[i][j].team){
        case 0:
          if(grid[i][j].colour==6){
            healthy ++;
          } else {
            dying ++;
          }
        break;
        case 1:
          infected ++;
        break;
        case 2:
          dying ++;
        break;
      }
      if(grid[i][j].value == 1){
        grid[i][j].colour = 6;
      }
      colourCell = getColour(grid[i][j].colour, grid[i][j].team);
      if(grid[i][j].colour > 0){
        grid[i][j].colour --;
      } else {
        grid[i][j].team = 0;
      }
      fill(colourCell);
      stroke(0); // grid lines
      rect(x,y,resolution,resolution);
    }
  }

  next = make2DArray(columns, rows);
  // Compute next based on grid

  for(let i = 0 ; i < columns; i++){
    for(let j = 0; j < rows; j++){
      let state = grid[i][j].value;
      let infectedState = grid[i][j].team;
      // Count live neighbours
      let neighbours = countNeighbours(grid, i, j);
      // Reproduction
      if(state == 0 && neighbours.total == 3){
        next[i][j].value = 1;
        next[i][j].colour = 6;
        if(neighbours.infected > infectionRate || infectedState == 1){
          next[i][j].team = 1;
        } else {
          next[i][j].team = 0;
        }
      } else if(state == 1 && (neighbours.total < 2 || neighbours.total > 3)) {
        next[i][j].value = 0;
        next[i][j].colour = 5;
        next[i][j].team = 2;
      } else {
        next[i][j].value = grid[i][j].value;
        next[i][j].colour = grid[i][j].colour;
        if(neighbours.infected > infectionRate || infectedState == 1){
          next[i][j].team = 1;
        } else {
          next[i][j].team = grid[i][j].team;
        }
      }
    }
  }
  textSize(28);
  fill(255);
  text('Alive: ' + healthy + '   ' + 'Infected: ' + infected, 10, screenHeight - 30);

  grid = next;
}

function countNeighbours(grid, x, y){
  let sum = {
    "total": 0,
    "infected": 0
  }
  for(let i = -1; i < 2; i++){
    for(let j = -1; j < 2; j++){
      let col = (x + i + columns) % columns;
      let row = (y + j + rows) % rows;
      sum.total += grid[col][row].value;
      if(grid[col][row].team == 1){
        sum.infected ++;
      }
    }
  }
  sum.total -= grid[x][y].value;
  return sum;
}


function getColour(value, team){
  let colour;
  switch(team){
    // 0 health
    // 1 infected
    // 2 dying
    case 0:
      switch(value){
        case 0:
          colour = color(10);
        break;
        case 1:
          colour = color(0, 43, 0);
        break;
        case 2:
          colour = color(0, 80, 0);
        break;
        case 3:
          colour = color(0, 115, 0);
        break;
        case 4:
          colour = color(0, 130, 0);
        break;
        case 5:
          colour = color(0, 150, 0);
        break;
        case 6:
          colour = color(50, 200, 50);
        break;
      }
    break;
    case 1:
      switch(value){
        case 0:
          colour = color(10);
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
          colour = color(130, 0, 0);
        break;
        case 5:
          colour = color(150, 0, 0);
        break;
        case 6:
          colour = color(200, 50, 50);
        break;
      }
    break;
    case 2:
      switch(value){
        case 0:
          colour = color(10);
        break;
        case 1:
          colour = color(30);
        break;
        case 2:
          colour = color(60);
        break;
        case 3:
          colour = color(90);
        break;
        case 4:
          colour = color(120);
        break;
        case 5:
          colour = color(150);
        break;
        case 6:
          colour = color(180);
        break;
      }
    break;
  }
  return colour;
}
