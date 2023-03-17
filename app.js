
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

  // Switch the players status
  let status = 0;
  if (token == 'X') {
    status = 1;
  }

  return { getName, getToken, status }
};

const activePlayer = (name, token) => {
  const {getName, getToken} = Player(name, token);
  return {getName, getToken}
}

const gameLogic = (() => {


  const player1 = Player("Tim", "O");
  const player2 = Player("Bob", "X");
  let currentPlayer = activePlayer(player1.getName(), player1.getToken());

  const switchStatus = () => {
    if (player1.status == 1) {
      player1.status = 0;
      player2.status = 1;
      currentPlayer = activePlayer(player2.getName(), player2.getToken());
    } else {
      player1.status = 1;
      player2.status = 0;
      currentPlayer = activePlayer(player1.getName(), player1.getToken());
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