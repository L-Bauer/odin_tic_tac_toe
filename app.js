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
const Player = (name, token) => {
  const getName = () => name;
  const getToken = () => token;

  return { getName, getToken };
};

const gameLogic = (() => {
  const players = [Player("Player 1", "X"), Player("Player 2", "O")];
  let currentPlayer = players[0];
  let otherPlayer = players[1];

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
    console.log(boardSpots);
    if (boardSpots.length === 0) {
      alert("Draw");
    }
    boardSpots.forEach((value) => {
      if (Object.keys(value).length === 3) {
        alert(`${currentPlayer.getName()} is the winner.`);
      }
    });
  };

  const switchStatus = () => {
    if (currentPlayer === players[0]) {
      currentPlayer = players[1];
      otherPlayer = players[0];
    } else {
      currentPlayer = players[0];
      otherPlayer = players[1];
    }
  };

  const playRound = (placement) => {
    if (gameBoard.placeToken(placement, currentPlayer.getToken())) {
      // Check game status. If there is a winner
      checkBoard();
      switchStatus();
    }
  };

  const showBoard = () => {
    // Brings up the board before the first round
    gameBoard.buildBoard();
  };

  return { playRound, showBoard };
})();

window.onload = gameLogic.showBoard();

const boardSpots = document.querySelectorAll(".spot");
const resetBtn = document.getElementById("reset");

boardSpots.forEach((spot) => {
  spot.addEventListener("click", () => {
    gameLogic.playRound(spot.id);
  });
});

// Clears the Board
resetBtn.addEventListener("click", () => {
  gameBoard.clearBoard();
});
