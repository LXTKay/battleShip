const Gameboard = require("./scripts").Gameboard;
const Player = require("./scripts").Player;

test("crete gameboard", ()=>{
  expect((new Gameboard).field).toEqual([
    [{isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null},],
    [{isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null},],
    [{isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null},],
    [{isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null},],
    [{isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null},],
    [{isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null},],
    [{isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null},],
    [{isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null}, {isHit : false, containingShip : null},]
  ])
});

const board = new Gameboard();
board.placeShip(3, 0, 2);

test("Make Shipt", ()=>{
  expect(board.ships[0]).toBe(board.field[0][2].containingShip);
});

test("Not fitting", ()=>{
  expect(board.placeShip(8, 7, 7)).toBe("Does not fit!");
});

board.receiveAttack(0,2);

test("Hitting", ()=>{
  expect(board.ships[0].damage).toBe(1);
});

test("Are all Sunk", ()=>{
  expect(board.allSunk()).toBe(false);
});

test("is Hit", ()=>{
  expect(board.field[0][2].isHit).toBe(true);
});

test("Does Player import work", ()=>{
  expect(new Player).toHaveProperty("aim");
});

test("ai Move", ()=>{
  expect((()=>{
    let res = (new Player).aiMove(new Player);
    if(res[0] < 8 && res[0] >= 0
    && res[1] < 8 && res[1] >= 0) return true;
    return false;
  })()).toEqual(true)
});