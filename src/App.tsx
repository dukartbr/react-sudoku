import { createContext, useContext } from "react";
import {
  Box,
  Container,
  ChakraProvider,
  Center,
  Grid,
  GridItem,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { generateCellBackgroundColor, generateInitialGame } from "./gameEngine";

const SudokuGameContext = createContext<SudokuGame>([]);

function App() {
  return (
    <ChakraProvider>
      <Box w='100%' h='100vh' bg='green.200'>
        <Container maxW='2xl'>
          <Center h='100vh'>
            <Box bg='white' py={6} px={8} borderRadius={16}>
              <Heading textAlign='center' pb={4}>
                React Sudoku
              </Heading>
              <SudokuGameContext.Provider value={generateInitialGame()}>
                <SudokuGameContainer />
              </SudokuGameContext.Provider>
            </Box>
          </Center>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;

function SudokuGameContainer() {
  const initialGame = useContext(SudokuGameContext);

  return (
    <Box
      py={6}
      px={8}
      bg='gray.300'
      maxH='1200px'
      maxW='1600px'
      h='auto'
      w='auto'
    >
      <Grid templateColumns='repeat(3, 1fr)' templateRows='repeat(3, 1fr)'>
        {initialGame.map((cc) => (
          <ParentCellContainer key={cc.containerIndex}>
            {cc.cells.map((c, i) => (
              <ChildCell
                key={cc.containerIndex + i}
                cell={c}
                containerIndex={cc.containerIndex}
              />
            ))}
          </ParentCellContainer>
        ))}
      </Grid>
    </Box>
  );
}

function ParentCellContainer({ children }: { children: any }) {
  return (
    <Grid
      templateColumns='repeat(3, 1fr)'
      templateRows='repeat(3, 1fr)'
      border='2px solid'
      borderColor='blue.300'
    >
      {children}
    </Grid>
  );
}

function ChildCell({
  cell,
  containerIndex,
}: {
  cell: Cell;
  containerIndex: number;
}) {
  return (
    <GridItem
      w='100px'
      h='100px'
      bg={generateCellBackgroundColor({
        cellIndex: cell.location.x,
        containerIndex,
      })}
      border='2px solid black'
      key={cell.location.x + cell.location.y}
    >
      <Flex>
        <Center h='100px' w='100px'>
          {cell.correctValue}
          {/* <pre>{JSON.stringify(cell, null, 2)}</pre> */}
        </Center>
      </Flex>
    </GridItem>
  );
}
