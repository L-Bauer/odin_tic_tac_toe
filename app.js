
const gameBoard = (() => {

  const board = Array(9);


  // This will be the method of getting the entire board that our
  // UI will eventually need to render it.
  const getBoard = () => board;


  // This method will be used to print our board to the console.
  // It is helpful to see what the board looks like after each turn as we play,
  // but we won't need it after we build our UI
  const printBoard = () => {
    console.log(board);
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
  return { printBoard, getBoard, placeToken };
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
      switchStatus();
      printNewRound();
    } else return
  };

  const printNewRound = () => {
    gameBoard.printBoard();
  };

  return { playRound };
})();