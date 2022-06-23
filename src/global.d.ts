interface CellLocation {
  x: number;
  y: number;
  containerIndex: number;
}

interface Cell {
  // the location of each cell will be determined by its x & y cooridnates
  location: CellLocation;

  // the value provided by the game engine's initilaziation
  correctValue: number;

  // the users input value, checks against the correctValue
  // set to optional because it is initally undefined
  userValue?: number | null;
}

interface CellContainer {
  x: number;
  y: number;
  containerIndex: number;
  cells: Cell[];
}

type SudokuGame = CellContainer[];
