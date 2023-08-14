'use strict';

const allCards = document.querySelectorAll('.cards');
const score = document.querySelector('.score');
const gameStatus = document.querySelector('.status');
const gameHighscore = document.querySelector('.highscore');
const againBtn = document.querySelector('.again');

let firstFLippedCard;
let secondFLippedCard;
let anyHasFlippend;
let lockBoard;

let curScore;
let matchedCards;
let highscore;
let winStatus;

// Initializing
const init = function (high) {
  firstFLippedCard = null;
  secondFLippedCard = null;

  anyHasFlippend = false;
  lockBoard = false;

  curScore = 20;
  matchedCards = 0;
  highscore = high;

  winStatus = '';

  score.textContent = curScore;
  gameStatus.textContent = 'Play !';
};
init(0);

// Disable Cards-> no more flipping
const disableCard = function (card) {
  card.removeEventListener('click', flipCards);
};

// Unflip Card -> back-face
const unflipCard = function (card) {
  card.classList.remove('flip');
};

// Checking -> if the cards match
const checkIsMatching = function (first, second) {
  return first.dataset.group === second.dataset.group;
};

// UpdateScore
const updateScore = function (point) {
  curScore += point;
  score.textContent = curScore;
};

// Checking -> if the player won or lost
const winnerCheck = function () {
  if (matchedCards === 8 && curScore > 0) {
    gameStatus.textContent = 'You won !';
    if (curScore > highscore) {
      highscore = curScore;
      gameHighscore.textContent = highscore;
    }
  } else if (curScore <= 0) {
    gameStatus.textContent = 'You Lost !';
    winStatus = 'Lost';
  }
};

// Flipping Cards
const flipCards = function () {
  if (lockBoard || winStatus === 'Lost') return;
  if (this === firstFLippedCard) return;

  this.classList.add('flip');

  if (!anyHasFlippend) {
    firstFLippedCard = this;
    anyHasFlippend = true;
    return;
  }

  if (anyHasFlippend) {
    secondFLippedCard = this;

    if (checkIsMatching(firstFLippedCard, secondFLippedCard)) {
      disableCard(firstFLippedCard);
      disableCard(secondFLippedCard);
      updateScore(4);
      matchedCards++;
    } else {
      lockBoard = true;

      setTimeout(() => {
        unflipCard(firstFLippedCard);
        unflipCard(secondFLippedCard);
        updateScore(-2);

        lockBoard = false;
      }, 1300);
    }

    anyHasFlippend = false;
    winnerCheck();
  }
};

allCards.forEach(card => {
  card.addEventListener('click', flipCards);
});

// Generate Random Numbers
const randGenerator = function (max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Shuffle Cards -> change the positioin of the cards
const shuffleCards = function () {
  const chosenPos = [];

  for (let i = 0; i < 16; i++) {
    let randPos;
    while (true) {
      randPos = randGenerator(16, 1);
      if (!chosenPos.includes(randPos)) {
        chosenPos.push(randPos);
        break;
      }
    }

    document.querySelector(`.card-${i + 1}`).style.gridRow = `${Math.floor(
      randPos % 4 === 0 ? randPos / 4 : randPos / 4 + 1
    )}`;

    document.querySelector(`.card-${i + 1}`).style.gridColumn = `${Math.floor(
      randPos % 4 === 0 ? 4 : randPos % 4
    )}`;
  }
};
shuffleCards();

// Reseting the game
const resetGame = function () {
  allCards.forEach(card => unflipCard(card));

  setTimeout(shuffleCards, 500);

  init(highscore);

  allCards.forEach(card => {
    card.addEventListener('click', flipCards);
  });
};
againBtn.addEventListener('click', resetGame);
