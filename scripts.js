"use strict"

import { initalizeDOM, updateFieldIcons, showLoseMsg, showWinMsg, createShipIcons, moveShipIcons } from "./DOMmanipulation.js";

class Ship {
  constructor(length){
    this.length = length;
  };
  damage = 0;
  hit(){
    this.damage++
  };
  isSunk(){
    if(this.damage >= this.length) return true;
    return false;
  };
};

class FieldObject {
  isHit = false;
  containingShip = null;
};

class Gameboard {
  constructor(){
    this.field = this.createFields();
  }
  ships = [];
  createFields(){
    let field = [];
    for(let i = 0; i < 8; i++){
      field.push([]);
      for(let j = 0; j < 8; j++){
        field[i].push(new FieldObject());
      };
    };
    return field;
  };
  checkForInterference(length,x,y, vertical = false){
    if(!vertical && y + length > 8) return true;
    if(vertical && x + length > 8) return true;


    if(vertical){
      for(let i = 0; i < length; i++){
        if(this.field[x + i][y].containingShip !== null) return true
      }
      return false;
    }
    for(let i = 0; i < length; i++){
      if(this.field[x][y + i].containingShip !== null) return true
    }
    return false;
  }
  placeShip(length, x, y, vertical = false){
    // if(x - 1 + length >= this.field.length && vertical) return "Does not fit!";
    // if(y - 1 + length >= this.field[x].length && !vertical) return "Does not fit!";
    let ship = new Ship(length);
    this.ships.push(ship);

    if(vertical){
      for(let i = 0; i < length; i++){
        this.field[x + i][y].containingShip = ship;
      };
      return;
    }
    for(let i = 0; i < length; i++){
      this.field[x][y + i].containingShip = ship;
    };
  };
  receiveAttack(x,y){
    if(this.field[x][y].containingShip !== null){
      this.field[x][y].containingShip.hit();
      this.lastHitCoords = [x,y];
    };
    this.field[x][y].isHit = true;
  };
  allSunk(){
    let areAllSunk = this.ships.every((e)=>{
      return e.isSunk();
    });
    return areAllSunk;
  };
  lastHitCoords = null;
  autoSetup(){
    let y = randomNumberBetween(0,3);
    let x = randomNumberBetween(0,7);
    this.placeShip(5, x, y, false);

    do{
      y = randomNumberBetween(0,7);
      x = randomNumberBetween(0,3);
    } while(this.checkForInterference(5,x,y,true));
    this.placeShip(5,x,y,true);

    do{
      y = randomNumberBetween(0,4);
      x = randomNumberBetween(0,7);
    } while(this.checkForInterference(4,x,y,false));
    this.placeShip(4,x,y,false);

    do{
      y = randomNumberBetween(0,7);
      x = randomNumberBetween(0,4);
    } while(this.checkForInterference(4,x,y,true));
    this.placeShip(4,x,y,true);

    do{
      y = randomNumberBetween(0,5);
      x = randomNumberBetween(0,7);
    } while(this.checkForInterference(3,x,y,false));
    this.placeShip(3,x,y,false);

    do{
      y = randomNumberBetween(0,7);
      x = randomNumberBetween(0,5);
    } while(this.checkForInterference(3,x,y,true));
    this.placeShip(3,x,y,true);
  }
};

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
};

class Player {
  constructor(){
    this.gameboard = new Gameboard;
  };
  aim(){
    return [randomNumberBetween(0,this.gameboard.field.length - 1), randomNumberBetween(0,this.gameboard.field.length -1)];
  };
  aiMove(){
    let f = this.gameboard.field;
    let aimedField = this.aim();

    if(this.gameboard.lastHitCoords !== null
    && this.gameboard.field[this.gameboard.lastHitCoords[0]][this.gameboard.lastHitCoords[1]].isHit
    && this.gameboard.field[this.gameboard.lastHitCoords[0]][this.gameboard.lastHitCoords[1]].containingShip !== null){
      let counter = 10;
      do{
        aimedField = this.gameboard.lastHitCoords;
        let n = randomNumberBetween(1,4);
        if(n == 1 && this.gameboard.lastHitCoords[0] > 0) aimedField[0] -= 1;
        if(n == 2 && this.gameboard.lastHitCoords[0] < 7) aimedField[0] += 1;
        if(n == 3 && this.gameboard.lastHitCoords[1] > 0) aimedField[1] -= 1;
        if(n == 4 && this.gameboard.lastHitCoords[1] < 7) aimedField[1] += 1;
        counter--;
        if(counter <= 0) break;
      }while(this.gameboard.field[aimedField[0]][aimedField[1]].isHit
      || this.gameboard.field[aimedField[0]][aimedField[1]] == undefined);
    };
    while(this.gameboard.field[aimedField[0]][aimedField[1]].isHit){
      aimedField = this.aim();
    };
    return aimedField;
  };
};

function setUpInitBoats(player){ //provisional
  player.gameboard.placeShip(5, 1, randomNumberBetween(0,3));
  player.gameboard.placeShip(4, 3, randomNumberBetween(0,3));
  player.gameboard.placeShip(3, 5, randomNumberBetween(0,3));
};

function checkGamesEnd(player,CPU){
  if(CPU.gameboard.allSunk()) showWinMsg();
  if(player.gameboard.allSunk()) showLoseMsg();
  if(CPU.gameboard.allSunk() || player.gameboard.allSunk()){
    STOP = true;

  }
};

function selectionPhase(player, CPU, length, vertical = false) {
  let container = createShipIcons(length, vertical);
  moveShipIcons(container);
  document.querySelector(".rightgrid").onclick = (e) => {
    if(player.gameboard.checkForInterference(length,
      +(e.target.getAttribute("x")),
      +(e.target.getAttribute("y")),
      vertical)) return;
    player.gameboard.placeShip(length, 
      +(e.target.getAttribute("x")), 
      +(e.target.getAttribute("y")),
      vertical);
    updateFieldIcons(player.gameboard.field, "player");
    container.remove();

    if(length <= 3 && vertical) {
      document.querySelector(".rightgrid").onclick = null;
      document.querySelector(".leftgrid").addEventListener("click", event =>{
        gameloop(event, player, CPU);
      });
      return;
    };
    if(!vertical){
      vertical = true;
      selectionPhase(player, CPU, length, vertical);
      return;
    };
    selectionPhase(player, CPU, length-1);
  };
};

function initalize(){
  initalizeDOM();
  let CPU = new Player();
  let player = new Player();

  CPU.gameboard.autoSetup();
  selectionPhase(player, CPU, 5);
  updateFieldIcons(CPU.gameboard.field, "CPU");
  updateFieldIcons(player.gameboard.field, "player");
};

function gameloop(event, player, CPU){
  if(CPU.gameboard.field[event.target.getAttribute("x")][event.target.getAttribute("y")].isHit) return;
  CPU.gameboard.receiveAttack(event.target.getAttribute("x"),event.target.getAttribute("y"));
  player.gameboard.receiveAttack(...player.aiMove());

  //render Board
  updateFieldIcons(CPU.gameboard.field, "CPU");
  updateFieldIcons(player.gameboard.field, "player");

  checkGamesEnd(player, CPU);
};

initalize();

module.exports.Gameboard = Gameboard;
module.exports.Player = Player;