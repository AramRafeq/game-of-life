/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import './App.css';

const gridSize = 20;
const rowSize = gridSize;
const colSize = gridSize;
const emptyBoard = new Array(gridSize).fill(null).map(() => new Array(gridSize).fill(null));

function App() {
  const [board, setBoard] = useState(emptyBoard);
  const initialState = (b) => {
    // Blinker;
    b[0][1] = true;
    b[1][1] = true;
    b[2][1] = true;
    // // block
    // b[0][4] = true;
    // b[0][5] = true;
    // b[1][4] = true;
    // b[1][5] = true;
    // // Toad
    // b[3][3] = true;
    // b[3][4] = true;
    // b[3][5] = true;
    // b[4][4] = true;
    // b[4][3] = true;
    // b[4][2] = true;

    //  glider
    // b[9][0] = true;
    // b[10][2] = true;
    // b[9][2] = true;
    // b[8][2] = true;
    // b[10][1] = true;
  };
  const countLiveNeighbors = (row = gridSize, col = gridSize) => {
    let liveNeighbors = 0;
    if (row - 1 > -1 && board[row - 1][col] === true) {
      liveNeighbors += 1;
    }
    if (row + 1 < rowSize && board[row + 1][col] === true) {
      liveNeighbors += 1;
    }
    if (col + 1 < colSize && board[row][col + 1] === true) {
      liveNeighbors += 1;
    }
    if (col - 1 > -1 && board[row][col - 1] === true) {
      liveNeighbors += 1;
    }

    if (col - 1 > -1 && row - 1 > -1 && board[row - 1][col - 1] === true) {
      liveNeighbors += 1;
    }

    if (col + 1 < colSize && row + 1 < rowSize && board[row + 1][col + 1] === true) {
      liveNeighbors += 1;
    }

    if (col + 1 < colSize && row - 1 > -1 && board[row - 1][col + 1] === true) {
      liveNeighbors += 1;
    }

    if (col - 1 > -1 && row + 1 < rowSize && board[row + 1][col - 1] === true) {
      liveNeighbors += 1;
    }

    return liveNeighbors;
  };
  const getCellLifeState = (row = gridSize, col = gridSize) => {
    const neighbors = countLiveNeighbors(row, col);
    // null = dead
    // true = alive
    let lifeState = null;
    if (board[row][col] === true) {
      // live cell
      if (neighbors < 2) {
        lifeState = null;
      }
      if (neighbors === 2 || neighbors === 3) {
        lifeState = true;
      }
      if (neighbors > 3) {
        lifeState = null;
      }
    } else if (neighbors === 3) {
      //  a dead cell
      lifeState = true;
    }
    return lifeState;
  };
  const getNextGeneration = () => {
    const newBoard = _.cloneDeep(board);
    for (let row = 0; row < rowSize; row += 1) {
      for (let col = 0; col < colSize; col += 1) {
        newBoard[row][col] = getCellLifeState(row, col);
      }
    }
    return newBoard;
  };
  useEffect(() => {
    const newBoard = _.cloneDeep(board);
    initialState(newBoard);
    setBoard(newBoard);
  }, []);
  const handleStart = () => {
    setInterval(() => {
      const nextGen = getNextGeneration();
      setBoard(nextGen);
    }, 1500);
  };
  return (
    <div className="container">
      <div className="grid-area">
        <div className="grid">
          {
            board.map((row, rowIndex) => (
              <div className="row" key={`row-${rowIndex + 1}`}>
                {
                  row.map((col, columnIndex) => {
                    let cellState = 'dead';
                    if (board[rowIndex][columnIndex] === true) {
                      cellState = 'alive';
                    }
                    return (
                      <div className={`cell ${cellState}`} key={`cell-${rowIndex + 1}${columnIndex + 1}`} />
                    );
                  })
                }
              </div>
            ))
          }

        </div>
        <div className="controls">
          <button type="button" onClick={handleStart}>start</button>
        </div>
      </div>
      {/* <div className="initial-state-area">
        <h1>initial states</h1>
      </div> */}
    </div>
  );
}

export default App;
