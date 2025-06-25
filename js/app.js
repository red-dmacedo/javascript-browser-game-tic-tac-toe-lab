/*-------------------------------- Constants --------------------------------*/
const playerSymbols = ['🥸','👾'];
const winningCombos = [
  // 0 1 2
  // 3 4 5
  // 6 7 8
  [0,1,2], [3,4,5], [6,7,8], // Rows
  [0,3,6], [1,4,7], [2,5,8], // Columns
  [0,4,8], [2,4,6] // cross
];
/*---------------------------- Variables (state) ----------------------------*/
let board = ['','','','','','','','',''];
let turn = playerSymbols[0];
let winner = false;
let tie = false;
let disabled = false;
let comPlayer = true;
/*------------------------ Cached Element References ------------------------*/
const squareEls = document.querySelectorAll('.sqr');
const messageEl = document.querySelector('#message');
const boardEl = document.querySelector('.board');
const resetBtnEl = document.querySelector('#reset');
const comBtn = document.querySelector('#com-button');
const titleEl = document.querySelector('body h1');
/*-------------------------------- Functions --------------------------------*/
function init(){
  titleEl.textContent = `${playerSymbols[0]} vs. ${playerSymbols[1]}`;
  tie = false;
  winner = false;
  disabled = false;
  turn = playerSymbols[0];
  board = ['','','','','','','','',''];
  for (i of squareEls){ i.removeAttribute('style') };
  render();
};

function render(){
  updateBoard();
  updateMessage();
};

function updateBoard(){
  for( i=0; i<board.length; i++ ){
    squareEls[i].textContent = board[i];
    // set color of corresponding square according to the player who selected it
    switch( squareEls[i].textContent ){
      case playerSymbols[0]:
        squareEls[i].style.backgroundColor = "lightblue";
        break;

      case playerSymbols[1]:
        squareEls[i].style.backgroundColor = "pink";
        break;

      default:
        break;
    };
  };
};

function updateMessage(){
  if( !(winner) && !(tie) ){ msg = `${turn}'s turn` }
  else if( !(winner) && tie ){ msg = 'Tie' }
  else { msg = `${turn} Wins!` };
  messageEl.textContent = msg;
};

function handleClick(e, t){ // events and targets may be passed in (assists with comChoice)
  if( !t ){ t = e.target }; // set target if it was not passed (allows use of elements from quereySelector)
  
  if( // Every condition that will exit this function early
    t.textContent === playerSymbols[0] || // space is taken
    t.textContent === playerSymbols[1] || // space is taken
    disabled || // game is over
    t.className !== 'sqr' // incorrect selection
  ){ return; };
  const squareIndex = t.id;
  placePiece(squareIndex);
  updateBoard();
  checkForWinner();
  checkForTie();
  switchPlayerTurn();
  updateMessage();
  if( comPlayer && turn === playerSymbols[1] ){ setTimeout(comMove, 500); }; // com to makes a move
};

function placePiece(idx){ board[idx] = turn; };

function checkForWinner(){
  for(i of playerSymbols){
    for ( j of winningCombos ){
      if(
        board[ j[0] ] === i &&
        board[ j[1] ] === i &&
        board[ j[2] ] === i
      ){
        winner = true;
        disabled = true;
        return;
      };
    }
  };
};

function checkForTie(){ if( !(board.includes('')) ){ tie = true } };

function switchPlayerTurn(){
  if( winner ){ return };
  ( turn === playerSymbols[0] ) ? turn = playerSymbols[1] : turn = playerSymbols[0];
};

function randomNumGen() { return Math.floor(Math.random() * board.length); };

function comMove() {
  let num = 0;
  if ( board.includes('') && !(disabled) ){ // prevent the following from running if the game is complete
    
    do{ num = randomNumGen(); } while ( board[num] !== '' ); // find an open position on the board
    let comChoice = squareEls[num];
    handleClick('', comChoice);
  }
};

function handleComBtn(e){
  const comText = ['Com Player On', 'Com Player Off'];
  if(e.target.textContent === comText[0]){
    e.target.textContent = comText[1];
    comPlayer = false;
  } else {
    e.target.textContent = comText[0];
    if( !disabled && turn === playerSymbols[1] ) { comMove(); };
    comPlayer = true;
  };
};
/*----------------------------- Event Listeners -----------------------------*/
resetBtnEl.addEventListener('click', init);
boardEl.addEventListener('click', handleClick);
comBtn.addEventListener('click', handleComBtn)
/*---------------------------------- Script ---------------------------------*/
init();
// ===== Minimum Requirements ===== \\
// Display an empty tic-tac-toe board when the page is initially displayed.
// A player can click on the nine cells to make a move.
// Every click will alternate between marking an X and O.
// Display whose turn it is (X or O).
// The cell cannot be played again once occupied with an X or O.
// Provide win logic and display a winning message.
// Provide logic for a cat’s game (tie), also displaying a message.
// Provide a Reset Game button that will clear the contents of the board.
