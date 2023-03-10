

const Board = (() => {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Create a 2d array that will represent the state of the game board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(0);
    }
  }

  // This will be the method of getting the entire board that our
  // UI will eventually need to render it.
  const getBoard = () => board;

  const placeToken = (spot, player) => {
    
  }

  // This method will be used to print our board to the console.
  // It is helpful to see what the board looks like after each turn as we play,
  // but we won't need it after we build our UI
  const printBoard = () => {
    console.log(board);
  };

  // Here, we provide an interface for the rest of our
  // application to interact with the board
  return { printBoard, getBoard };
})();


const Player = (name, token) => {

  const getName = () => name;
  const getToken = () => token;

  return { getName, getToken }
};

console.log(Board.getBoard())