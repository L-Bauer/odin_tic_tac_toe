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
        spot.innerText = null;
      } else {
        spot.innerText = board[i];
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
      spot.innerText = playerToken;
      return true;
    }
    console.warn("This spot is not available.");
    return false;
  };

  // Here, we provide an interface for the rest of our
  // application to interact with the board
  return {
    buildBoard, placeToken, clearBoard, board,
  };
})();

// Player factory
const CreatePlayer = (name, token, isAI, currentStatus) => {
  const getName = () => name;
  const getToken = () => token;
  const getIsAi = () => isAI;
  const getStatus = () => currentStatus;

  const changeStatus = (newStatus) => {
    currentStatus = newStatus;
  };

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
      const easyCpuSpot = getRandom(0, 9);
      valid = gameBoard.placeToken(easyCpuSpot, token);
    }
    return valid;
  };

  return {
    getName, getToken, getIsAi, setToken, getStatus, changeStatus,
  };
};

const playerOne = CreatePlayer("Tim", "X", false, 1);
const playerTwo = CreatePlayer("Sue", "O", true, 2);

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
      console.log("Draw");
      boolSpots = 1;
    }
    boardSpots.some((value) => {
      if (Object.keys(value).length === 3) {
        console.log(`${currentPlayer.getName()} is the winner.`);
        boolSpots = 2;
      }
    });
    return boolSpots;
  };

  const switchStatus = () => {
    if (currentPlayer === playerOne) {
      currentPlayer = playerTwo;
      otherPlayer = playerOne;
      playerOne.changeStatus(2);
      playerTwo.changeStatus(1);
    } else {
      currentPlayer = playerOne;
      otherPlayer = playerTwo;
      playerOne.changeStatus(1);
      playerTwo.changeStatus(2);
    }
  };

  const playRound = (placement) => {
    if (checkBool === 0) {
      const validPlace = currentPlayer.setToken(placement);
      if (validPlace) {
        // Check game status. If there is a winner
        checkBool = checkBoard();
        if (checkBool) {
          switchStatus();
        } else {
          switchStatus();
        }
      }
    }
  };

  const resetGame = () => {
    checkBool = 0;
    gameBoard.clearBoard();
  };

  return { playRound, resetGame };
})();

window.onload = gameBoard.buildBoard();

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
