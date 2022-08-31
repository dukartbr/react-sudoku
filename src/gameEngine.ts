// Will contain 9 cell containers, each with 9 cells containing a value. Keeps the global context of the game during initial generation
const cellContainers: CellContainer[] = [];
let renderCount = 0;

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

function renderedCellContainer({
  containerIndex,
  containerXIndex,
  containerYIndex,
}: {
  containerIndex: number;
  containerXIndex: number;
  containerYIndex: number;
}): Cell[] {
  const cells = generateSingleCellContainer({
    containerIndex,
    containerXIndex,
    containerYIndex,
  });
  // const invalidValues = cells.filter((c) => c.correctValue === undefined);

  // console.log("invalidValues", invalidValues);

  // if (invalidValues.length > 0 && renderCount < 100) {

  //   return renderedCellContainer({
  //     containerIndex,
  //     containerXIndex,
  //     containerYIndex,
  //   });
  //   // return [];
  // }

  return cells;
}

// generate 9 containers
function generateCellContainers(): CellContainer[] {
  const generatedCellContainers: CellContainer[] = [];

  // to create 9 containers we loop 8 times and generate 1 container each tie
  for (let i = 0; i <= 8; i++) {
    // generate an X axis based looping index
    const containerXIndex = [0, 3, 6].includes(i)
      ? 0
      : [1, 4, 7].includes(i)
      ? 1
      : 2;

    // generate an Y axis based looping index
    // const containerYIndex = i >= 6 ? 2 : i >= 3 ? 1 : 0;
    const containerYIndex = [0, 1, 2].includes(i)
      ? 0
      : [3, 4, 5].includes(i)
      ? 1
      : 2;

    const cellContainer: CellContainer = {
      x: containerXIndex,
      y: containerYIndex,
      containerIndex: i,
      // generate 9 cells for the container
      cells: renderedCellContainer({
        containerIndex: i,
        containerXIndex,
        containerYIndex,
      }),
    };

    generatedCellContainers.push(cellContainer);

    // push to the global variable
    cellContainers.push(cellContainer);
  }

  // console.log("generatedCellContainers", generatedCellContainers);
  // // check for undefined values and rerun to ensure that doesn't happen
  // const errorCells = generatedCellContainers
  //   .map((container) =>
  //     container.cells.filter((cell) => cell.correctValue === undefined)
  //   )
  //   .flat();
  // if (errorCells.length > 0 && renderCount < 100) {
  //   renderCount++;
  //   return generateCellContainers();
  // }

  return generatedCellContainers;
}

function generateSingleCellContainer({
  containerIndex,
  containerXIndex,
  containerYIndex,
}: {
  containerIndex: number;
  containerXIndex: number;
  containerYIndex: number;
}): Cell[] {
  const cells = [];

  let possibleCellValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i <= 8; i++) {
    // Same method of generating axis locations as before
    const cellXIndex = [0, 3, 6].includes(i)
      ? 0
      : [1, 4, 7].includes(i)
      ? 1
      : 2;

    // generate an Y axis based looping index
    // const containerYIndex = i >= 6 ? 2 : i >= 3 ? 1 : 0;
    const cellYIndex = [0, 1, 2].includes(i)
      ? 0
      : [3, 4, 5].includes(i)
      ? 1
      : 2;

    // generate the cells value by using the location of the currently rendering cell and its respective container
    // check against all cells with a value in the same x or y spot
    const generatedValue: number = generateCellValue({
      possibleCellValues,
      cellXIndex,
      cellYIndex,
      containerXIndex,
      containerYIndex,
    });

    possibleCellValues = possibleCellValues.filter((v) => v !== generatedValue);

    const generatedCell = {
      location: {
        x: i,
        y: cellYIndex,
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
  cellXIndex,
  cellYIndex,
  containerXIndex,
  containerYIndex,
}: {
  possibleCellValues: number[];
  cellXIndex: number;
  cellYIndex: number;
  containerXIndex: number;
  containerYIndex: number;
}): number {
  // get matching vertical and horizontal containers of the current cell's container
  const matchingVertContainers: CellContainer[] = cellContainers.filter(
    (container) => container.x === containerXIndex
  );
  const matchingHorizContainers: CellContainer[] = cellContainers.filter(
    (container) => container.y === containerYIndex
  );

  // get the cell values of the cells in the matching containers that have the same x & y cooridants
  const matchingVertCellValues: number[] = matchingVertContainers
    .map((container) =>
      container.cells.filter((cell) => {
        if ([0, 3, 6].includes(cellXIndex)) {
          return [0, 3, 6].includes(cell.location.x);
        }
        if ([1, 4, 7].includes(cellXIndex)) {
          return [1, 4, 7].includes(cell.location.x);
        }
        return [2, 5, 8].includes(cell.location.x);
      })
    )
    .flat()
    .map((cell) => cell.correctValue);

  const matchingHorizCellValues: number[] = matchingHorizContainers
    .map((container) =>
      container.cells.filter((cell) => cell.location.y === cellYIndex)
    )
    .flat()
    .map((cell) => cell.correctValue);

  const invalidCellOptions = [
    ...matchingHorizCellValues,
    ...matchingVertCellValues,
  ];

  const cellOptions = possibleCellValues.filter(
    (val) => invalidCellOptions.indexOf(val) === -1
  );

  const cellValue = cellOptions[Math.floor(Math.random() * cellOptions.length)];

  // console.log(`cellInfo for cell ${cellValue}`, {
  //   possibleCellValues,
  //   cellXIndex,
  //   cellYIndex,
  //   containerXIndex,
  //   containerYIndex,
  //   cellContainers,
  //   cellValue,
  //   cellOptions,
  //   invalidCellOptions,
  //   matchingHorizCellValues,
  //   matchingVertCellValues,
  //   matchingHorizContainers,
  //   matchingVertContainers,
  // });

  return cellValue;
}
