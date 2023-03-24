
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
    board[placement] = playerToken;
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

  // const player1 = Player("Tim", "X");
  // const player2 = Player("Bob", "0");
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
    gameBoard.placeToken(placement, currentPlayer.getToken());
    switchStatus();
    printNewRound();
  };

  const printNewRound = () => {
    gameBoard.printBoard();
  };

  return { playRound };
})();