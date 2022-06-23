// Will contain 9 cell containers, each with 9 cells containing a value.
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

export function generateInitialGame(): SudokuGame {
  const initialGame = generateCellContainers();
  return initialGame;
}

function generateCellContainers(): CellContainer[] {
  const generatedCellContainers: CellContainer[] = [];

  for (let i = 0; i <= 8; i++) {
    const containerXAxis = [0, 3, 6].includes(i)
      ? 0
      : [1, 4, 7].includes(i)
      ? 1
      : 2;
    const containerYAxis = i >= 6 ? 2 : i >= 3 ? 1 : 0;
    const cellContainer: CellContainer = {
      x: containerXAxis,
      y: containerYAxis,
      containerIndex: i,
      cells: generateSingleCellContainer({
        containerIndex: i,
      }),
    };
    generatedCellContainers.push(cellContainer);
    cellContainers.push(cellContainer);
  }

  return generatedCellContainers;
}

function generateSingleCellContainer({
  containerIndex,
}: {
  containerIndex: number;
}): Cell[] {
  const cells = [];

  let possibleCellValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i <= 8; i++) {
    const cellXAxis = [0, 3, 6].includes(i) ? 0 : [1, 4, 7].includes(i) ? 1 : 2;
    const cellYAxis = i >= 6 ? 2 : i >= 3 ? 1 : 0;
    const generatedValue = generateCellValue({
      cellIndex: i,
      possibleCellValues,
      containerIndex,
      cellXAxis,
      cellYAxis,
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
  cellIndex,
  containerIndex,
  possibleCellValues,
  cellXAxis,
  cellYAxis,
}: {
  cellIndex: number;
  containerIndex: number;
  possibleCellValues: number[];
  cellXAxis: number;
  cellYAxis: number;
}) {
  console.log("props", {
    cellIndex,
    possibleCellValues,
    cellXAxis,
    cellYAxis,
    cellContainers,
  });

  // const validCellOptions = cellContainers.filter((cellContainer) => {
  //   if (cellContainer.x === 0) {
  //   }
  //   if (cellContainer.x === 1) {
  //   }
  //   if (cellContainer.x === 2) {
  //   }
  // });

  // console.log("validCellOptions", validCellOptions);

  return possibleCellValues[
    Math.floor(Math.random() * possibleCellValues.length)
  ];
}
