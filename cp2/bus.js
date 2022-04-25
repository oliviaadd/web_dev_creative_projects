/**
 * Olivia Addington
 * CS 132
 * Date: April 24th, 2022
 * A JavaScript file to configure interactivity for the web page for my creative project 2.
 * This website implements a  popular card game called Ride the Bus, which consists of simply
 * guessing whether a card has a Red or Black suit until you can get 5 cards correctly in a row.
 * This file allows the user to switch between available screens and enables them to flip cards
 * by submitting their guess for whether the card is Red or black
 */

(function () {
  "use strict";
  // MODULE GLOBAL CONSTANTS

  // arrays to define a standard 52 card deck
  const CARD_NUMBERS = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
  const CARD_SUITS = ["H", "D", "S", "C"];
  const TOTAL_CARDS = 52;

  // constant to define number of cards user must guess correctly (# of cards on board)
  const NUM_CARDS = 5;

  // variables to keep track of user play
  let cardsFlipped = 0;
  let cardsUsed = [];

  // messages displayed based on game outcome
  const OPEN_MESSAGE = "Welcome Aboard"; // displayed at game start
  const LOSE_MESSAGE = "Look's like you're stuck for another round."; // displayed when loss occurs
  const WIN_MESSAGE = "Well aren't you a lucky duck ?"; // displayed when whin occurs

  // MAIN FUNCTION

  /**
   * Creates event Listeners for all buttons used to navigate between available views on the page
   * @param   - None
   * @return  - None */

  function init() {
    console.log("init entered");

    id("yes-btn").addEventListener("click", startGame);
    id("fine-btn").addEventListener("click", startGame);
    id("no-btn").addEventListener("click", attemptConvince);
    id("mercy-btn").addEventListener("click", concede);

    id("forfeit-btn").addEventListener("click", returnHome);
    id("home-btn").addEventListener("click", returnHome);
    id("replay-btn").addEventListener("click", startGame);

    id("fear-form").addEventListener("submit", saveFear);
  }

  // HELPER FUNCTIONS

  /**
   * Changes the contents of the page to display the game board and initializes the board
   * with NUM_CARDS face down
   * @param   - None
   * @return  - None */
  function startGame() {
    console.log("start game");

    resetBoard(); // initializes boarads to NUM_CARDS face down

    // change views
    id("game-view").classList.remove("hidden");
    id("menu-view").classList.add("hidden");
    id("single-no-view").classList.add("hidden");
  }

  /**
   * Changes the contents of the page upon receving an intial decline from user to play the game.
   * New screen asks the user again if they would like to play.
   * @param   - None
   * @return  - None */
  function attemptConvince() {
    console.log("attmepting to convince");

    // change views
    id("single-no-view").classList.remove("hidden");
    id("menu-view").classList.add("hidden");
  }

  /**
   * Changes the contents of the page upon receving an second decline from user to play the game.
   * New screen asks the user to enter input text in response to a question.
   * @param   - None
   * @return  - None */
  function concede() {
    console.log("attmepting to convince");

    // change views
    id("single-no-view").classList.add("hidden");
    id("double-no-view").classList.remove("hidden");
  }

  /**
   * Changes the contents of the page to restore the starting home page for the website,
   * which prompts the user with a first request to play the game. Restores relevant
   * module global variables to their default values.
   * @param   - None
   * @return  - None */
  function returnHome() {
    console.log("return home");

    // change views
    id("menu-view").classList.remove("hidden");
    id("game-view").classList.add("hidden");
    id("fear-revealed-view").classList.add("hidden");

    cardsFlipped = 0;
    id("fear-revealed").textContent = "";
  }

  /**
   * Intializes game board and relevant module global variables for a new game.
   * Game board display shows NUM_CARDS face down and the opening message is displayed above the
   * board. Event listeners are added to the gameplay buttons which allow the user to submit a
   * guess for whether the face card is red or black.
   * @param   - None
   * @return  - None */
  function resetBoard() {
    id("board").innerHTML = ""; // clear the board
    // define the board so that there are NUM_CARDS face down
    for (let i = 0; i < NUM_CARDS; i++) {
      const card = gen("div"); // card element
      card.classList.add("card-back");

      const cardImg = gen("img"); // image elment for back of card
      cardImg.src = "imgs/bus.png"; // image on the back of the cards is a school bus
      cardImg.alt = "School Bus";

      card.appendChild(cardImg); // attach image to the card element
      id("board").appendChild(card); // attach card to board
    }
    cardsFlipped = 0; // initialize module global variable tracking progress of user play

    // display opning message above the board
    qs("#game-view > h2").textContent = OPEN_MESSAGE;
    qs("#game-view > h2").className = "";

    // set up event listeners for game play buttons
    let smokeButton = id("smoke-guess");
    let fireButton = id("fire-guess");

    smokeButton.addEventListener("click", makeGuess);
    smokeButton.classList.remove("hidden");

    fireButton.addEventListener("click", makeGuess);
    fireButton.classList.remove("hidden");

    // hide buttons for end of game
    id("replay-btn").classList.add("hidden");
    id("forfeit-btn").classList.add("hidden");
  }

  /**
   * Callback function for game play buttons. Chooses a card from the remaining cards in the 52
   * card deck, flips the card face up on the board, and checks whether the user guessed
   * correctly or incorrectly.
   * @param {event} evt - event triggering call back function (click on Smoke or Fire buttons)
   * @return            - None */
  function makeGuess(evt) {
    console.log("guess made");

    // store guess by client
    const guess = evt.currentTarget.id;

    let [cardNum, cardSuit] = chooseCard(); // choose card randomly from deck
    flipCard(cardNum, cardSuit); // display chosen card face up

    const flipped = qsa(".card-front"); // all cards face up
    const currCard = flipped[flipped.length - 1]; // card flipped this turn

    const guessCorrect = checkGuess(guess, cardSuit); // compare guess to card Suits
    // if guess is correct
    if (guessCorrect) {
      currCard.classList.add("correct"); // change display of card to correct settings
      // if all cards have been guessed correctly, initiate win display
      if (cardsFlipped == 5) {
        qs("#game-view > h2").textContent = WIN_MESSAGE;
        qs("#game-view > h2").classList.add("winning_message");
        gameOver();
      }
    } else {
      // if the guess is incorrect, game is lost
      currCard.classList.add("incorrect"); // change display of card to incorrect settings
      qs("#game-view > h2").textContent = LOSE_MESSAGE; // initate lose display
      qs("#game-view > h2").classList.add("losing_message");
      gameOver();
    }
    console.log(guessCorrect);
  }

  /**
   * Removes event listeners from game play buttons and adjusts page display to show buttons
   * allowing the user to play again or return howme
   * @param   - None
   * @return  - None */
  function gameOver() {
    console.log("game Over");

    // remove game play buttons
    let smokeButton = id("smoke-guess");
    let fireButton = id("fire-guess");
    smokeButton.removeEventListener("click", makeGuess);
    smokeButton.classList.add("hidden");
    fireButton.removeEventListener("click", makeGuess);
    fireButton.classList.add("hidden");

    // show return home or replay buttons
    id("replay-btn").classList.remove("hidden");
    id("forfeit-btn").classList.remove("hidden");
  }

  /**
   * Chooses a card at random from remaining cards in the deck, as defined by the module
   * global variables. If all available cards have been dealt, function resets the deck (i.e.
   * shuffles and beings to dealing again) Returns chosen card as a 2 element string array
   * @param                                     - None
   * @return {String Array} [cardNum, cardSut]  - 2 element string array defining card number
   *                                              and suit */
  function chooseCard() {
    let cardPicked = false;
    let cardNum = "";
    let cardSuit = "";

    // if all cards have been dealt, shuffle and begin dealing again form a full deck
    if (cardsUsed.length == TOTAL_CARDS) {
      cardsUsed = []; // clear module global storing used cards
    }

    // continue picking until reach card that hasn't been used yet
    while (!cardPicked) {
      cardNum = CARD_NUMBERS[Math.floor(Math.random() * CARD_NUMBERS.length)];
      cardSuit = CARD_SUITS[Math.floor(Math.random() * CARD_SUITS.length)];

      if (!cardsUsed.includes(cardNum + cardSuit)) {
        cardPicked = true; // if find card that is still available, stop picking
      }
    }
    cardsUsed.push(cardNum + cardSuit); // add card to module global variable storing used cards

    return [cardNum, cardSuit]; // return card
  }

  /**
   * Checks whether previous guess by user is incorrect or correct based on card flipped during
   * current turn
   * @param {String} guess            - String representing id of button clicked by user
   * @param {String} cardSuit         - String representing suit of flipped card
   * @return {boolean} guessCorrect   - Boolean indiciating whether guess is correct
   *                                    (True implies correct, False implies incorreect) */
  function checkGuess(guess, cardSuit) {
    if (guess === "smoke-guess" && cardSuit === "C") {
      return true;
    } else if (guess === "smoke-guess" && cardSuit === "S") {
      return true;
    } else if (guess === "fire-guess" && cardSuit === "D") {
      return true;
    } else if (guess === "fire-guess" && cardSuit === "H") {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Updates the board view to show an additional card face-up. Suit and number of card are
   * displayed based on the input parameters. Updates module global variable tracking
   * number of face up cards currently on the board.
   * @param {String} cardNum    - String representing number of flipped card
   * @param {String} cardSuit   - String representing suit of flipped card
   * @return                    - None */
  function flipCard(cardNum, cardSuit) {
    const card = gen("div"); // create card element
    card.classList.add("card-front"); // define as front of card
    card.classList.add(cardNum); // set suit and number display settings
    card.classList.add(cardSuit);
    card.textContent = cardNum + " of " + cardSuit;

    const cardImg = gen("img"); // create image element
    cardImg.alt = cardNum + " of " + cardSuit;
    cardImg.src = "imgs/" + cardSuit + ".png"; // choose image elemnt based on suit
    card.appendChild(cardImg); // attatch image to card element

    qsa(".card-back")[0].remove(); // remove next face down card
    const board = id("board");
    board.insertBefore(card, board.children[cardsFlipped]); // attatch face up card to board
    cardsFlipped++; // update module global variable tracking face up cards
  }

  /**
   * Callback function to handle text input in response to question displayed on page view
   * after user has delcined to play two consecutive times. Page view is changed
   * to display response to user input and to provide user a button to return home.
   * @param {event} evt - submit event triggering call back function
   * @return            - None */
  function saveFear(evt) {
    id("fear-revealed").textContent += evt.target[0].value + "?";
    evt.preventDefault();

    id("fear-revealed-view").classList.remove("hidden");
    id("double-no-view").classList.add("hidden");
  }

  // CALL TO MAIN FUNCTION
  init();
})();
