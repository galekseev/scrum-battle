const letters = require("./GameController/letters.js");
const position = require("./GameController/position.js");

var fixedFleets = [
 [
  [new position(letters.A, 1), new position(letters.A, 2), new position(letters.A, 3), new position(letters.A, 4), new position(letters.A, 5)],
  [new position(letters.B, 1), new position(letters.B, 2), new position(letters.B, 3), new position(letters.B, 4)],
  [new position(letters.C, 1), new position(letters.C, 2), new position(letters.C, 3)],
  [new position(letters.E, 1), new position(letters.E, 2), new position(letters.E, 3)],
  [new position(letters.D, 1), new position(letters.D, 2)],
 ],
 [
    [new position(letters.F, 3), new position(letters.F, 4), new position(letters.F, 5), new position(letters.F, 6), new position(letters.F, 7)], // корабль длиной 5
    [new position(letters.B, 7), new position(letters.C, 7), new position(letters.D, 7), new position(letters.E, 7)], // корабль длиной 4
    [new position(letters.A, 8), new position(letters.B, 8), new position(letters.C, 8)], // корабль длиной 3
    [new position(letters.G, 2), new position(letters.G, 3), new position(letters.G, 4)], // корабль длиной 3
    [new position(letters.H, 1), new position(letters.H, 2)], // корабль длиной 2
],
// Флот 3
[
    [new position(letters.E, 5), new position(letters.E, 6), new position(letters.E, 7), new position(letters.E, 8), new position(letters.E, 4)], // корабль длиной 5
    [new position(letters.G, 1), new position(letters.G, 2), new position(letters.G, 3), new position(letters.G, 4)], // корабль длиной 4
    [new position(letters.B, 3), new position(letters.C, 3), new position(letters.D, 3)], // корабль длиной 3
    [new position(letters.C, 5), new position(letters.C, 6), new position(letters.C, 7)], // корабль длиной 3
    [new position(letters.A, 2), new position(letters.A, 3)], // корабль длиной 2
],
// Флот 4
[
    [new position(letters.A, 5), new position(letters.A, 6), new position(letters.A, 7), new position(letters.A, 8), new position(letters.A, 4)], // корабль длиной 5
    [new position(letters.B, 2), new position(letters.B, 3), new position(letters.B, 4), new position(letters.B, 5)], // корабль длиной 4
    [new position(letters.D, 6), new position(letters.D, 7), new position(letters.D, 8)], // корабль длиной 3
    [new position(letters.F, 1), new position(letters.F, 2), new position(letters.F, 3)], // корабль длиной 3
    [new position(letters.H, 7), new position(letters.H, 8)], // корабль длиной 2
],
// Флот 5
[
    [new position(letters.F, 5), new position(letters.F, 6), new position(letters.F, 7), new position(letters.F, 8), new position(letters.F, 4)], // корабль длиной 5
    [new position(letters.A, 1), new position(letters.B, 1), new position(letters.C, 1), new position(letters.D, 1)], // корабль длиной 4
    [new position(letters.C, 6), new position(letters.C, 7), new position(letters.C, 8)], // корабль длиной 3
    [new position(letters.D, 3), new position(letters.E, 3), new position(letters.F, 3)], // корабль длиной 3
    [new position(letters.H, 2), new position(letters.H, 3)], // корабль длиной 2
],
];

module.exports = fixedFleets;