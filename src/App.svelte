<script>
  import { onMount, onDestroy } from "svelte";
  import _ from "lodash";
  const gridSize = 50;
  const rowSize = gridSize;
  const colSize = gridSize;
  let board = new Array(gridSize)
    .fill(null)
    .map(() => new Array(gridSize).fill(null));

  let intervalHandler = null;
  onDestroy(async () => {
    if (intervalHandler) {
      clearInterval(intervalHandler);
    }
  });
  const getCellClass = (cell) => {
    let cellState = "dead";
    if (cell === true) {
      cellState = "alive";
    }
    return cellState;
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

    if (
      col + 1 < colSize &&
      row + 1 < rowSize &&
      board[row + 1][col + 1] === true
    ) {
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

  const calculateNextGeneration = () => {
    const newBoard = _.cloneDeep(board);
    for (let row = 0; row < rowSize; row += 1) {
      for (let col = 0; col < colSize; col += 1) {
        newBoard[row][col] = getCellLifeState(row, col);
      }
    }
    board = newBoard;
  };
  const onStartSimulation = () => {
    intervalHandler = setInterval(() => {
      calculateNextGeneration();
    }, 300);
  };
  const onStopSimulation = () => {
    if (intervalHandler) {
      clearInterval(intervalHandler);
      intervalHandler = null;
    }
  };
  const handleControlButtonClick = () => {
    if (intervalHandler !== null) {
      onStopSimulation();
    } else {
      onStartSimulation();
    }
  };
  const onResetBoard = () => {
    board = new Array(gridSize)
      .fill(null)
      .map(() => new Array(gridSize).fill(null));
  };
  const markCell = (row, col) => {
    if (board[row][col] === true) {
      board[row][col] = null;
    } else {
      board[row][col] = true;
    }
  };
</script>

<div class="container">
  <div class="grid-area">
    <span class="note"
      >Note: click on the grid for marking cells ({rowSize}x{colSize} grid)</span
    >
    <div class="grid">
      {#each board as row, rowIndex}
        <div class="row">
          {#each row as col, columnIndex}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              on:click={() => markCell(rowIndex, columnIndex)}
              class={`cell ${getCellClass(board[rowIndex][columnIndex])}`}
            />
          {/each}
        </div>
      {/each}
    </div>
    <div class="controls">
      <button
        class={`${intervalHandler !== null ? "stop-button" : "start-button"}`}
        type="button"
        on:click={handleControlButtonClick}
      >
        {#if intervalHandler !== null}
          Stop Simulation
        {/if}
        {#if intervalHandler === null}
          Start Simulation
        {/if}
      </button>
      <button
        disabled={intervalHandler !== null}
        class={`${intervalHandler !== null ? "disabled-button" : ""}`}
        type="button"
        on:click={onResetBoard}
      >
        Reset Board
      </button>
      <button
        type="button"
        on:click={() => {
          window.location = "https://github.com/AramRafeq/game-of-life";
        }}
      >
        GitHub Repo
      </button>
    </div>
  </div>
</div>
