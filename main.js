
let grid;
let next;
let columns;
let rows;
let resolution = 10;
let speed = 10;

let change = false;
let alpha = 255;
let msg = "Test: "

let trails = true;
let alone = true;
let maxStage = 5;

let count = 0;
let timer = 400;

let red = 255;
let green = 0;
let blue = 0;

function setup() {
  // put setup code here
  // console.log(windowWidth, windowHeight);
  // console.log(windowWidth - (windowWidth % resolution))
  // console.log(windowHeight - (windowHeight % resolution))
  let adjustedWidth = windowWidth - 5;
  let adjustedHeight = windowHeight - 5;
  updateColourWheel();
  createCanvas(adjustedWidth, adjustedHeight);
  columns = (adjustedWidth - (adjustedWidth % resolution)) / resolution;
  rows = (adjustedHeight - (adjustedHeight % resolution)) / resolution;
  grid = make2DArray(columns,rows);
  for(let i = 0; i < columns; i++){
    for (let j = 0; j < rows; j++){
      grid[i][j] = {
        "value" : floor(random(2)),
        "stage" : 0
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
      arr[k][j] = {};
    }
  }
  return arr;
}

function keyTyped() {
  if (key === 't') {
    if(trails == false){
      trails = true;
    } else {
      trails = false;
    }
    changeMessage("Trails: " + trails);
  }
  if (key === 'l') {
    if(alone == false){
      alone = true;
      change = true;
    } else {
      alone = false;
    }
    changeMessage("Die alone: " + alone);
  }
}

function mousePressed(){
  let x1 = floor(mouseX / resolution);
  let y1 = floor(mouseY / resolution);
  grid[x1][y1].value = 1;
  grid[x1][y1].stage = maxStage;
}

function mouseWheel(event){
  if(event.delta > 0){
    if(speed > 1){
      speed --;
    }
  } else {
    console.log(event.delta);
    if(speed < 30){
      speed ++;
    }
  }
  changeMessage("FPS: " + speed)
}

function draw() {
  let colourBackground = color(10, 10, 10);
  let colourCell = color(255, 0, 0);
  // let colourGrid = color(255, 0, 0);
  background(colourBackground)
  frameRate(speed);
  for(let i = 0; i < columns; i++){
    for (let j = 0; j < rows; j++){

      let x = i * resolution;
      let y = j * resolution;

      if(grid[i][j].value == 1){
        grid[i][j].stage = maxStage;
      } else {
        if(!trails){
            grid[i][j].stage = 0;
        }
      }
      count ++
      if(count > timer){
        updateColourWheel();
        count = 0;
      }
      colourCell = getColour(grid[i][j].stage);

      if(grid[i][j].stage > 0){
        grid[i][j].stage --;
      }

      fill(colourCell);
      stroke(0); // grid lines
      rect(x,y,resolution,resolution);
    }
    if(change == true && alpha > 20){
      textSize(28);
      fill(alpha);
      text(msg, 10, 30);
      alpha -= 0.1;
    } else {
      change = false;
      alpha = 255;
    }
  }

  next = make2DArray(columns, rows);
  // Compute next based on grid

  for(let i = 0 ; i < columns; i++){
    for(let j = 0; j < rows; j++){
      let state = grid[i][j].value;
      // Count live neighbours
      let neighbours = countNeighbours(grid, i, j);
      // Reproduction
      if(state == 0 && neighbours.total == 3){
        next[i][j].value = 1;
        next[i][j].stage = maxStage;
      // Death
      } else if(state == 1 && (neighbours.total < 2 || neighbours.total > 3)) {
      // No cell dies alone
        if(neighbours.total == 0 && !alone){
          next[i][j].value = 1;
          next[i][j].stage = maxStage;
        } else {
          next[i][j].value = 0;
          next[i][j].stage = maxStage - 1;
        }
      } else {
        next[i][j].value = grid[i][j].value;
        next[i][j].stage = grid[i][j].stage;
      }
    }
  }
  grid = next;
}

function countNeighbours(grid, x, y){
  let sum = {
    "total": 0
  }
  for(let i = -1; i < 2; i++){
    for(let j = -1; j < 2; j++){
      let col = (x + i + columns) % columns;
      let row = (y + j + rows) % rows;
      sum.total += grid[col][row].value;
    }
  }
  sum.total -= grid[x][y].value;
  return sum;
}


function getColour(stage){
  let colour;
  let newRed = (red / maxStage) * stage;
  let newGreen = (green / maxStage) * stage;
  let newBlue = (blue / maxStage) *  stage;
  return colour = color(newRed, newGreen, newBlue);
}


function changeMessage(string){
  change = true;
  alpha = 255;
  msg = string;
}

function updateColourWheel(){
  if(red == 255 && green < 255 && blue == 0){
    green += 1;
  }
  if(red > 0 && green == 255 && blue == 0){
    red -= 1;
  }
  if(green == 255 && blue < 255 && red == 0){
    blue += 1;
  }
  if(green > 0 && blue == 255 && red == 0){
    green -= 1;
  }
  if(blue == 255 && red < 255 && green == 0){
    red += 1;
  }
  if(blue > 0 && red == 255 && green == 0){
    blue -= 1;
  }
}
