// Will contain 9 cell containers, each with 9 cells containing a value. Keeps the global context of the game during initial generation
const cellContainers: CellContainer[] = [];

export function generateCellBackgroundColor({
  cellIndex,
  containerIndex,
}: {
  cellIndex: number;
  containerIndex: number;
}) {
  if (containerIndex % 2 === 0) {
    return cellIndex % 2 === 0 ? "gray.300" : "gray.400";
  }
  return cellIndex % 2 === 0 ? "gray.400" : "gray.300";
}

// Kicks off the process
export function generateInitialGame(): SudokuGame {
  const initialGame = generateCellContainers();
  return initialGame;
}

// generate 9 containers
function generateCellContainers(): CellContainer[] {
  const generatedCellContainers: CellContainer[] = [];

  // to create 9 containers we loop 8 times and generate 1 container each tie
  for (let i = 0; i <= 8; i++) {
    // generate an X axis based looping index
    const containerXAxis = [0, 3, 6].includes(i)
      ? 0
      : [1, 4, 7].includes(i)
      ? 1
      : 2;

    // generate an Y axis based looping index
    const containerYAxis = i >= 6 ? 2 : i >= 3 ? 1 : 0;

    const cellContainer: CellContainer = {
      x: containerXAxis,
      y: containerYAxis,
      containerIndex: i,
      // generate 9 cells for the container
      cells: generateSingleCellContainer({
        containerIndex: i,
        containerXAxis,
        containerYAxis,
      }),
    };

    generatedCellContainers.push(cellContainer);

    // push to the global variable
    cellContainers.push(cellContainer);
  }

  return generatedCellContainers;
}

function generateSingleCellContainer({
  containerIndex,
  containerXAxis,
  containerYAxis,
}: {
  containerIndex: number;
  containerXAxis: number;
  containerYAxis: number;
}): Cell[] {
  const cells = [];

  let possibleCellValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i <= 8; i++) {
    // Same method of generating axis locations as before
    const cellXAxis = [0, 3, 6].includes(i) ? 0 : [1, 4, 7].includes(i) ? 1 : 2;
    const cellYAxis = i >= 6 ? 2 : i >= 3 ? 1 : 0;

    // generate the cells value by using the location of the currently rendering cell and its respective container
    // check against all cells with a value in the same x or y spot
    const generatedValue: number = generateCellValue({
      possibleCellValues,
      cellXAxis,
      cellYAxis,
      containerXAxis,
      containerYAxis,
    });

    possibleCellValues = possibleCellValues.filter((v) => v !== generatedValue);

    const generatedCell = {
      location: {
        x: i,
        y: cellYAxis,
        containerIndex,
      },
      correctValue: generatedValue,
      userValue: null,
    };

    cells.push(generatedCell);
  }

  return cells;
}

function generateCellValue({
  possibleCellValues,
  cellXAxis,
  cellYAxis,
  containerXAxis,
  containerYAxis,
}: {
  possibleCellValues: number[];
  cellXAxis: number;
  cellYAxis: number;
  containerXAxis: number;
  containerYAxis: number;
}): number {
  // get matching vertical and horizontal containers of the current cell's container
  const matchingVertContainers: CellContainer[] = cellContainers.filter(
    (container) => container.y === containerYAxis
  );
  const matchingHorizContainers: CellContainer[] = cellContainers.filter(
    (container) => container.x === containerXAxis
  );

  // get the cell values of the cells in the matching containers that have the same x & y cooridants
  const matchingVertCellValues: number[] = matchingVertContainers
    .map((container) =>
      container.cells.filter((cell) => cell.location.y === cellYAxis)
    )
    .flat()
    .map((cell) => cell.correctValue);

  const matchingHorizCellValues: number[] = matchingHorizContainers
    .map((container) =>
      container.cells.filter((cell) => cell.location.x === cellXAxis)
    )
    .flat()
    .map((cell) => cell.correctValue);

  const invalidCellOptions = [
    ...matchingHorizCellValues,
    ...matchingVertCellValues,
  ];

  console.log("containers", { matchingHorizCellValues });

  console.log("invalidCellOptions", invalidCellOptions);
  console.log("possibleCellValues", possibleCellValues);

  const cellOptions = possibleCellValues.filter(
    (val) => invalidCellOptions.indexOf(val) === -1
  );

  console.log("cellOption", cellOptions);

  const cellValue = cellOptions[Math.floor(Math.random() * cellOptions.length)];

  console.log("renderedCellValue", cellValue);

  return cellValue;
}
