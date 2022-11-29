'use strict';

// random between 1 - 20
let answerKey = generateAnswerKey();

let highscore = 0;
let currentscore = 20;
let gameOver = false;

function generateAnswerKey() {
  return Math.trunc(Math.random() * 20) + 1;
} // end of generateAnswerKey

document.querySelector('.btn-check').addEventListener('click', function () {
  const input = document.querySelector('.guess').value;

  if (!gameOver) {
    if (!input) {
      updateMessageText('⛔ No Entry');
      return;
    } // end if

    const guessNumber = Number(input);
    gameOver = determineResult(guessNumber);
  } // end if
});

function determineResult(guess) {
  if (guess === answerKey) {
    winContentsStyleUpdate();

    if (highscore < currentscore) {
      highscore = currentscore;

      document.querySelector('.highscore').textContent = highscore;
      return true;
    } // end if
  } // end if

  if (guess > answerKey) {
    updateMessageText('To High');
  } else if (guess < answerKey) {
    updateMessageText('To Low');
  } // end if

  if (currentscore > 0) {
    currentscore--;
    updateScoreText(currentscore);
    return false;
  } else {
    updateMessageText('You Lost the Game!');
  } // end if
  return true;
} // end of determineResult

function updateMessageText(message) {
  document.querySelector('.message').textContent = message;
} // end of updateMessageText

function updateNumberText(numberText) {
  document.querySelector('.number').textContent = numberText;
} // end of updateNubmerText

function winContentsStyleUpdate() {
  // select the element we want to change
  updateMessageText('🤘 Correct Number');
  updateNumberText(answerKey);
  // change background to green on win
  updateBodyBackGround('#60b347');
  updateNumberWidth('30rem');
} // end of winContentsStyleUpdate

document.querySelector('.btn-again').addEventListener('click', function () {
  resetGame();
});

function resetGame() {
  // reset game flag
  gameOver = false;
  // generate new secret number
  answerKey = generateAnswerKey();

  // reset game board
  updateScoreText((currentscore = 20));
  updateMessageText('Start guessing...');
  updateBodyBackGround('#222');
  updateNumberWidth('15rem');
  updateNumberText('?');
  document.querySelector('.guess').value = '';
} // end of resetGame

function updateScoreText(score) {
  document.querySelector('.score').textContent = score;
}

function updateBodyBackGround(color) {
  document.querySelector('body').style.backgroundColor = color;
} // end of updateBodyBackGround

function updateNumberWidth(width) {
  document.querySelector('.number').style.width = width;
}
