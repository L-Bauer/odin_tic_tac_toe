
const gameBoard = (() => {

  const board = Array(9);
  const conditions = [
    // Horizontal conditions
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    // Vertical conditions
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    // Diagonal conditions
    [0, 4, 8], [6, 4, 2]];


  // This will be the method of getting the entire board that our
  // UI will eventually need to render it.
  const getBoard = () => {
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


  // This method will be used to print our board to the console.
  // It is helpful to see what the board looks like after each turn as we play,
  // but we won't need it after we build our UI
  const printBoard = () => {
    console.log(board);
  };

  const checkBoard = (placement) => {
    // Look a players placement
    // Based on the players placement, only check the conditions that could
    // win the game. DO not loop through every winning condition
    let possibleConditions = conditions.filter(condition => condition.includes(placement));
    for (let condition of possibleConditions) {
      let p1 = condition[0];
      let p2 = condition[1];
      let p3 = condition[2];
      if (board[p1] == null) continue
      else if (board[p1] == board[p2] && board[p2] == board[p3]) {
        console.log("Winner");
      }
    }
    console.log(possibleConditions);
  };

  const placeToken = (placement, playerToken) => {
    if (board[placement] == null) {
      board[placement] = playerToken;
      return true;
    } else {
    console.warn("This spot is not available.");
    return false;
    }
  }

  // Here, we provide an interface for the rest of our
  // application to interact with the board
  return { printBoard, getBoard, placeToken, checkBoard };
})();

const Player = (name, token) => {
  const getName = () => name;
  const getToken = () => token;

  return { getName, getToken }
}


const gameLogic = (() => {

  const players = [Player("Tim", "X"), Player("Bob", "O")]
  let currentPlayer = players[0];

  const switchStatus = () => {
    if (currentPlayer == players[0]) {
      currentPlayer = players[1];
    } else {
      currentPlayer = players[0];
    }
  };

  const playRound = (placement) => {
    console.log(currentPlayer.getName());
    if (gameBoard.placeToken(placement, currentPlayer.getToken())) {
      // Check game status. If there is a winner
      gameBoard.checkBoard(placement);
      switchStatus();
      printNewRound();
    } else return
  };

  const printNewRound = () => {
    gameBoard.printBoard();
    gameBoard.getBoard();
  };

  const showBoard = () => {
    // Brings up the board before the first round
    gameBoard.getBoard();
  }

  return { playRound, showBoard };
})();

gameLogic.showBoard();

const boardSpots = document.querySelectorAll(".spot")

boardSpots.forEach(gameLogic.playRound())

