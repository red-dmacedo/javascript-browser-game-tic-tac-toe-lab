// -------------------------------- Constants --------------------------------
const game = {};
game.moves = [];
// 0 1 2
// 3 4 5
// 6 7 8
const winConditions = [
  [0,1,2], [3,4,5], [6,7,8], // Rows
  [0,3,6], [1,4,7], [2,5,8], // Columns
  [0,4,8], [2,4,6] // cross
];
// ---------------------------- Variables (state) ----------------------------
game.firstTurn = 'X';
messageContentOld = '';
game.disabled = false;

// ------------------------ Cached Element References ------------------------
const messageEl = document.querySelector('#message');
const sqrsEl = document.querySelectorAll('.sqr');
const boardEl = document.querySelector('.board');


// -------------------------------- Functions --------------------------------
game.setMessage = function (msg='Your turn'){ messageEl.textContent = msg; }; // easily set message text
game.reset = () => {
  sqrsEl.forEach(i => {
    i.removeAttribute('style'); // remove opacity setting from all sqrs
    i.textContent = ""; // clear 'X' and 'O' selections
  });
  game.moves.length = 0; // clear moves
  game.currentTurn = game.firstTurn; // reset current player
  messageContentOld = `It is ${game.currentTurn}'s turn`;
  game.disabled = false;
  // game.setMessage(`It is ${game.currentTurn}'s turn`); // initialize message
};
game.handleBoard = (e, target) => {
  if(game.disabled){ return; }; // do nothing if the game has completed
  if(!target){target = e.target} // focus on using target instead of the event (helps with comChoice)
  if( game.moves.includes(target.id) && game.currentTurn === 'X' ){
    messageEl.textContent = 'Invalid move'; // Only show invalid moves for the user
    return;
  };
  game.moves.push(target.id); // track id's of sqrs that have been picked
  target.textContent = game.currentTurn; // Set sqr to player's symbol 'X'/'O'
  game.toggleSelection(target, false); // When a sqr is selected, reduce opacity to 50%
  game.setMessage(`It is ${game.currentTurn}'s turn`); // Update message
  if (game.currentTurn === 'X') { // swap player and com turns
    game.currentTurn = 'O';
    game.comMove(); // com to makes a move
  } else { game.currentTurn = 'X';};
  game.winCheck();
  if(game.moves.length === 9){ game.gameOver() };
};
game.toggleSelection = (target, enable=true) => {
  (enable) ? target.removeAttribute('style') : target.style.opacity = '0.5';
};
game.randomNumGen = () => { return Math.floor(Math.random() * sqrsEl.length); };
game.comMove = () => {
  let num = 0;
  if (game.moves.length < 9 && game.disabled === false){ // prevent the following from running if the game is complete
    do{ num = game.randomNumGen(); } while ( game.moves.includes(String(num)) ); // game.moves is holding string values
    comChoice = sqrsEl[num];
    game.handleBoard('', comChoice);
  }
};
function messageHover () {
  messageContentOld = messageEl.textContent; // store previous message so that it can be restored
  messageEl.textContent = 'Reset game?'; // change text when player moves mouse over the message
};
function messageHoverLeave(){ messageEl.textContent = messageContentOld; }; // restore old message
game.winCheck = () => {
  let userMoveIds = Array.from(sqrsEl).filter( i => game.moves.includes(i.id) && i.textContent === 'X' ).map(i => i.id);
  let comMovesIds = Array.from(sqrsEl).filter( i => game.moves.includes(i.id) && i.textContent === 'O' ).map(i => i.id);
  
  if( game.currentTurn === 'X' && game.isWinner(userMoveIds) ){
    game.setMessage('You Win! | Reset Game?');
    game.disabled = true;
  };
  if( game.currentTurn === 'O' && game.isWinner(comMovesIds) ){
    game.setMessage('Com Wins! | Reset Game?');
    game.disabled = true;
  };
};
game.isWinner = (moveIds) => {
  // if(game.currentTurn === 'X'){console.log(moveIds); console.log('typeof:',typeof(moveIds[0]))};
  let breakLoop = false;
  winConditions.forEach((i) => {
    // if(game.currentTurn === 'X'){console.log((i[0].toString()), i[1], i[2])};
    // if(game.currentTurn === 'X'){console.log(i);}
    console.log(moveIds.includes(i[0].toString()))
    if(
      moveIds.includes(i[0].toString()) &&
      moveIds.includes(i[1].toString()) &&
      moveIds.includes(i[2].toString())
    ) { breakLoop = true; };
  });
  return breakLoop;
};
game.gameOver = () => {
  game.setMessage('Game Over! (Tie) | Reset Game?');
  game.disabled = true;
};
// ----------------------------- Event Listeners -----------------------------
boardEl.addEventListener('click', game.handleBoard);

// --------------------------------- Script ----------------------------------
game.reset();
messageEl.addEventListener('click', game.reset);
messageEl.addEventListener('mouseenter', messageHover);
messageEl.addEventListener('mouseout', messageHoverLeave);
