
const gameBoard = (() => {

  const board = Array(9);

  // Build the board on load
  const buildBoard = () => {
    let boardPlace = document.getElementById("board");
    let i = 0;
    while (i < board.length) {
      let spot = document.createElement("div");
      spot.id = i;
      spot.className = "spot"
      if (board[i] == undefined){
        spot.innerText = null;
      } else {
        spot.innerText = board[i];
      }
      boardPlace.appendChild(spot);
      i++;
    }
  };


  const placeToken = (placement, playerToken) => {
    let spot = document.getElementById(placement);
    if (board[placement] == null) {
      board[placement] = playerToken;
      spot.innerText = playerToken;
      return true;
    } else {
    console.warn("This spot is not available.");
    return false;
    }
  }

  // Here, we provide an interface for the rest of our
  // application to interact with the board
  return { buildBoard, placeToken, board };
})();

// Player factory
const Player = (name, token) => {
  const getName = () => name;
  const getToken = () => token;

  return { getName, getToken }
}


const gameLogic = (() => {

  const players = [Player("Player 1", "X"), Player("Player 2", "O")]
  let currentPlayer = players[0];

  const conditions = [
    // Horizontal conditions
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    // Vertical conditions
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    // Diagonal conditions
    [0, 4, 8], [6, 4, 2]];

    const checkBoard = (placement) => {
      // Look a players placement
      // Based on the players placement, only check the conditions that could
      // win the game. DO not loop through every winning condition
  
      let possibleConditions = conditions.filter(condition => condition.includes(Number(placement)));
      console.log(possibleConditions);
      for (let condition of possibleConditions) {
        let p1 = condition[0];
        let p2 = condition[1];
        let p3 = condition[2];
        if (gameBoard.board[p1] == null) continue
        else if (gameBoard.board[p1] == gameBoard.board[p2] && gameBoard.board[p2] == gameBoard.board[p3]) {
          console.log("Winner");
        }
      }
    };  

  const switchStatus = () => {
    if (currentPlayer == players[0]) {
      currentPlayer = players[1];
    } else {
      currentPlayer = players[0];
    }
  };

  const playRound = (placement) => {
    // console.log(currentPlayer.getName());
    if (gameBoard.placeToken(placement, currentPlayer.getToken())) {
      // Check game status. If there is a winner
      checkBoard(placement);
      switchStatus();
    } else return
  };

  const showBoard = () => {
    // Brings up the board before the first round
    gameBoard.buildBoard();
  }

  return { playRound, showBoard };
})();

window.onload = gameLogic.showBoard();


const boardSpots = document.querySelectorAll(".spot")

boardSpots.forEach((spot) => {
  spot.addEventListener('click', () => {
    gameLogic.playRound(spot.id);
  });
});