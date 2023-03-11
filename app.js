

const gameBoard = (() => {
  let _board = new Array(9)

  function displayBoard () {
    console.log(_board);
  }

  function updateBoard (position, token) {
    _board[position] = token
    displayBoard();
  }

  return { displayBoard, updateBoard };
  
})();


const gameLogic = (() => {

  gameBoard.displayBoard();

})();

