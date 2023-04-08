const statusBar = document.getElementById("gameStatus");
statusBar.innerHTML = "Game In-Progress";

const gameBoard = (() => {
  const board = Array(9);
  board.fill(undefined);

  // Build the board on load
  const buildBoard = () => {
    const boardPlace = document.getElementById("board");
    let i = 0;
    while (i < board.length) {
      const spot = document.createElement("div");
      spot.id = i;
      spot.className = "spot";
      if (board[i] === undefined) {
        spot.innerHTML = null;
      } else {
        spot.innerHTML = board[i];
      }
      boardPlace.appendChild(spot);
      i += 1;
    }
  };

  // Clear the board of any tokens
  const clearBoard = () => {
    const boardSpots = document.getElementsByClassName("spot");
    const boardArray = Array.from(boardSpots);
    boardArray.forEach((element) => {
      const spot = element;
      spot.innerHTML = null;
    });
    board.fill(undefined);
  };

  const placeToken = (placement, playerToken) => {
    const spot = document.getElementById(placement);
    if (board[placement] == null) {
      board[placement] = playerToken;
      spot.innerHTML = playerToken;
      return true;
    }
    console.warn("This spot is not available.");
    statusBar.innerHTML = "This spot is not available.";
    return false;
  };

  const openSpots = () => {
    // Make array of open spots
    const openArray = [];
    board.forEach((value, index) => {
      if (value === undefined) {
        openArray.push(index);
      }
    });
    return openArray;
  };

  // Here, we provide an interface for the rest of our
  // application to interact with the board
  return {
    buildBoard, placeToken, clearBoard, board, openSpots,
  };
})();

// Player factory
const CreatePlayer = (name, token, isAI) => {
  const getName = () => name;
  const getToken = () => token;
  const getIsAi = () => isAI;

  const setToken = (place) => {
    let valid = false;

    const getRandom = (min, max) => {
      const RandomMin = Math.ceil(min);
      const RandomMax = Math.floor(max);
      return Math.floor(Math.random() * (RandomMax - RandomMin) + RandomMin);
      // The maximum is exclusive and the minimum is inclusive
    };
    if (!isAI) {
      valid = gameBoard.placeToken(place, token);
    } else {
      const spotsOpen = gameBoard.openSpots();
      const openSpotsLength = spotsOpen.length;
      const easyCpuSpot = getRandom(0, openSpotsLength);
      valid = gameBoard.placeToken(spotsOpen[easyCpuSpot], token);
    }
    return valid;
  };

  return {
    getName, getToken, getIsAi, setToken,
  };
};

const playerOne = CreatePlayer("Player X", "X", false, 1);
const playerTwo = CreatePlayer("Player O", "O", true, 2);

const gameLogic = (() => {
  let currentPlayer = playerOne;
  let otherPlayer = playerTwo;
  let checkBool = 0;

  const conditions = [
    // Horizontal conditions
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    // Vertical conditions
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    // Diagonal conditions
    [0, 4, 8], [6, 4, 2]];

  const winConditions = () => {
    // Create an array from conditions list all the winnable conditions left
    // on the board
    const winSpots = [];
    conditions.filter((condition) => {
      const boardCondition = gameBoard.board.filter((value, index) => {
        if (condition.includes(index)) {
          return value;
        }
      });
      if ((boardCondition.includes(currentPlayer.getToken())
      && !boardCondition.includes(otherPlayer.getToken()))
      || boardCondition.every((value) => value === undefined)) {
        winSpots.push(boardCondition);
      }
    });
    return winSpots;
  };

  const checkBoard = () => {
    // Look a players placement
    // Based on the players placement, only check the conditions that could
    // win the game. DO not loop through every winning condition
    const boardSpots = winConditions();
    let boolSpots = 0;
    if (boardSpots.length === 0) {
      statusBar.innerHTML = "Game is a Draw.";
      console.log("Draw");
      boolSpots = 1;
    }
    boardSpots.some((value) => {
      if (Object.keys(value).length === 3) {
        console.log(`${currentPlayer.getName()} is the winner.`);
        statusBar.innerHTML = `${currentPlayer.getName()} is the winner.`;

        boolSpots = 2;
      }
    });
    return boolSpots;
  };

  const showCurrentPlayer = () => {
    const showPlayer = document.getElementById("player");
    showPlayer.innerHTML = currentPlayer.getName();
  };

  const switchStatus = () => {
    if (currentPlayer === playerOne) {
      currentPlayer = playerTwo;
      otherPlayer = playerOne;
    } else {
      currentPlayer = playerOne;
      otherPlayer = playerTwo;
    }
    showCurrentPlayer();
  };

  const playRound = (placement) => {
    if (checkBool === 0) {
      const validPlace = currentPlayer.setToken(placement);
      if (validPlace) {
        // Check game status. If there is a winner
        checkBool = checkBoard();
        if (checkBool > 0) {
          switchStatus();
        } else {
          switchStatus();
          if (currentPlayer.getIsAi()) {
            setTimeout(() => playRound(), 450);
            checkBool = checkBoard();
          }
        }
      }
    }
  };

  const resetGame = () => {
    checkBool = 0;
    gameBoard.clearBoard();
    statusBar.innerHTML = "Game In-Progress";
    if (currentPlayer.getIsAi()) {
      playRound();
    }
  };

  return { playRound, resetGame, showCurrentPlayer };
})();

window.onload = gameBoard.buildBoard();
gameLogic.showCurrentPlayer();

const boardSpots = document.querySelectorAll(".spot");
const resetBtn = document.getElementById("reset");

boardSpots.forEach((spot) => {
  spot.addEventListener("click", () => {
    gameLogic.playRound(spot.id);
  });
});

// Clears the Board
resetBtn.addEventListener("click", () => {
  gameLogic.resetGame();
});
