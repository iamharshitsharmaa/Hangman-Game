const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");

let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
    correctLetters = new Set();
    wrongGuessCount = 0;
    hangmanImage.src = "images/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = "";
    [...currentWord].forEach(() => wordDisplay.innerHTML += `<li class="letter"></li>`);
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
};

const getRandomWord = () => {
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
};

const gameOver = (isVictory) => {
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${isVictory ? 'You found the word:' : 'The correct word was:'} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
};

const initGame = (clickedLetter) => {
    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter && !correctLetters.has(letter)) {
                correctLetters.add(letter);
                const letters = wordDisplay.querySelectorAll(".letter");
                letters[index].innerText = letter;
                letters[index].classList.add("guessed");
            }
        });
    } else {
        hangmanImage.src = `images/hangman-${++wrongGuessCount}.svg`;
    }
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if ([...correctLetters].length === new Set(currentWord).size) return gameOver(true);
};

document.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.closest(".keyboard")) {
        e.target.disabled = true;
        initGame(e.target.dataset.letter);
    }
});

keyboardDiv.innerHTML = Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(97 + i);
    return `<button data-letter="${letter}">${letter}</button>`;
}).join("");

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
