"use strict";

const hitIcon = "🔥";
const missIcon = "💧";
const shipIcon = "🚢";
const sunkIcon = "🌊";

function createGrid(gridCanvas){
  for(let i = 0; i < 8; i++){
    for(let j = 0; j < 8; j++){
      let item = document.createElement("div");
      item.style.backgroundColor = "blue";
      item.setAttribute("x", i);
      item.setAttribute("y", j);
      item.style.width = "4rem";
      item.style.height = "4rem";
      gridCanvas.append(item);
    };
  };
}

export function initalizeDOM(){
  let leftgrid = document.querySelector(".leftgrid");
  let rightgrid = document.querySelector(".rightgrid");
  leftgrid.innerHTML = "";
  rightgrid.innerHTML = "";
  createGrid(leftgrid);
  createGrid(rightgrid);
  // leftgrid.addEventListener();
  // rightgrid.addEventListener();
};

function displayIcon(x,y,status,grid){
  let field = document.querySelector(`${grid} [y="${y}"][x="${x}"]`);
  if(status == "hit") field.innerText = hitIcon;
  if(status == "missed") field.innerText = missIcon;
  if(status == "ship") field.innerText = shipIcon;
  if(status == "sunk") field.innerText = sunkIcon;
  if(status == "none") field.innerText = "";
}

export function updateFieldIcons(field, player){
  let selectedGrid;
  if(player == "CPU") selectedGrid = ".leftgrid";
  if(player == "player") selectedGrid = ".rightgrid";

  let x = 0;
  field.forEach(i => {
    let y = 0;
    i.forEach(j =>{
      displayIcon(x,y,"none",selectedGrid);
      if(j.isHit && j.containingShip !== null
      && !(j.containingShip.isSunk())) displayIcon(x,y,"hit",selectedGrid);
      if(j.isHit && j.containingShip !== null
      && j.containingShip.isSunk()) displayIcon(x,y,"sunk",selectedGrid);
      if(j.isHit && j.containingShip == null) displayIcon(x,y,"missed",selectedGrid);
      if(!j.isHit && j.containingShip !== null && player != "CPU") displayIcon(x,y,"ship",selectedGrid);
      y++;
    });
  x++;
  });
};

function showMessageBoard(msg){
  let board = document.createElement("div");
  board.innerText = msg;
  board.style.fontSize = "8rem";
  board.style.position = "absolute";
  board.style.backgroundColor = "green";
  document.body.prepend(board);
}

export function showWinMsg(){
  let msg = "You won!"
  showMessageBoard(msg);
};

export function showLoseMsg(){
  let msg = "You lose!"
  showMessageBoard(msg);
};

export function createShipIcons(count, vertical){
  let container = document.createElement("div");
  for(let i = 0; i < count; i++){
    let item = document.createElement("div");
    item.innerText = shipIcon;
    item.style.width = document.querySelector(".rightgrid").firstChild.style.width;
    item.style.height = document.querySelector(".rightgrid").firstChild.style.height;
    container.append(item);
  };
  container.style.display = "flex";
  container.style.flexDirection = "row";
  if(vertical) container.style.flexDirection = "column";
  container.style.fontSize = "3rem";
  container.style.position = "absolute";
  container.style.zIndex = 1000;
  container.style.pointerEvents = "none";
  document.body.append(container);
  return container;
};

export function moveShipIcons(container){
  document.onmousemove = function(e){
    container.style.left = (e.pageX - 30) + "px";
    container.style.top = (e.pageY - 30) + "px";
  };
};