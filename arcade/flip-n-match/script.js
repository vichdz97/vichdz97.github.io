// LOAD SOUND FX
const firstFlipSfx = new Audio("sounds/flip.mp3");
const secondFlipSfx = new Audio("sounds/flip.mp3");
const matchSfx = new Audio("sounds/correct.mp3");
const errorSfx = new Audio("sounds/error.mp3");

// LOAD BG MUSIC
const music = new Audio("sounds/To the Gateway - Super Mario Galaxy.mp3");
music.volume = 0.5;
var firstPlay = true;

// FADE OUT FX
function fadeOut(audio) {
    const fade = setInterval(() => {
        if (audio.volume > 0) {
            audio.volume -= 0.1;
        }
        else {
            clearInterval(fade);
        }
    }, 50);
}

// MUTE/PLAY BG MUSIC
const volumeIcon = document.getElementById('volume');
volumeIcon.addEventListener('click', (e) => {
    const splitFile = e.target.src.split("/");
    let oldFileName = splitFile[splitFile.length - 1];
    let newFileName = oldFileName === "volume.svg" ? "mute.svg" : "volume.svg";
    if (newFileName === "volume.svg") {
        if (firstPlay) {
            music.play();
            firstPlay = false;
        }
        else {
            music.muted = false;
        }
    }
    else {
        music.muted = true;
    }
    e.target.src = e.target.src.replace(oldFileName, newFileName);
});

// RESET BUTTON
const reset = document.getElementById('resetBtn');
reset.addEventListener('click', () => location.reload());

// TIMER
const timer = document.getElementById('timer');
let seconds = 59;
const countdown = setInterval(() => {
    if (seconds == -1 && cardsMatched != 8) {
        alert("GAME OVER! YOU RAN OUT OF TIME :(");
        clearInterval(countdown);
        fadeOut(music);
        cards.forEach(card => card.classList.add('flipped'));
    }
    else if (seconds < 10)
        timer.innerText = `Time: 0:0${seconds--}`;
    else
        timer.innerText = `Time: 0:${seconds--}`;
}, 1000);

// RANDOMIZE SHAPE ORDER
const shapes = ['circle', 'triangle', 'square', 'star', 'rhombus', 'heart', 'trapezoid', 'hexagon'];
let shapePairs = createShapePairs();

function createShapePairs() {
    // Create 8 pairs from your shapes array
    let pairs = shapes.concat(shapes); 
    shuffle(pairs);  // Implement a shuffle function, see: https://stackoverflow.com/a/2450976
    return pairs;
}

function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

// POPULATE GRID
const grid = document.getElementById('cards-container');
for (let i = 0; i < 16; i++) {
    const card = document.createElement('div');
    card.classList.add('card')
    card.dataset.shape = shapePairs.pop(); // Assign a random shape from the pair

    const img = document.createElement('img');
    img.src = `images/${card.dataset.shape}.png`;
    
    card.appendChild(img);
    grid.appendChild(card);
}

// GAME SETUP
const cards = document.querySelectorAll('.card');
const matches = document.getElementById('matches');
const turns = document.getElementById('turns');
let flippedCard = null;
let cardsMatched = 0;
let numTurns = 0;
let bothCardsAreFlipped = false;

cards.forEach(card => card.addEventListener('click', flipCard));

function flipCard() {
    if (this === flippedCard || this.classList.contains('flipped')) return;

    if (!bothCardsAreFlipped) {
        this.classList.add('flipped');

        if (!flippedCard) { // first card flip
            firstFlipSfx.play();
            flippedCard = this;
        } 
        else { // second card flip
            secondFlipSfx.play();
            bothCardsAreFlipped = true;
            setTimeout(() => {
                checkForMatch(this);
            }, 500);
        }
    }
}

function checkForMatch(card) {
    // Check if dataset exists before accessing shape
    if (!flippedCard.dataset || !card.dataset) return;

    // Get shape names from data-shape attribute
    let card1Shape = flippedCard.dataset.shape;
    let card2Shape = card.dataset.shape;

    if (card1Shape === card2Shape) {
        matchSfx.play();
        matches.innerText = `Matches: ${++cardsMatched}`;
        flippedCard.innerText = '';
        card.innerText = '';
        addClass('matched', flippedCard, card);
        disableFlips(flippedCard, card);
        if (cardsMatched === 8) {
            setTimeout(() => alert('YOU WIN!'), 250);
            clearInterval(countdown);
            fadeOut(music);
        }
    } 
    else {
        errorSfx.play();
        removeClass('flipped', flippedCard, card);
    }
    turns.innerText = `# of Turns: ${++numTurns}`;
    flippedCard = null;
    bothCardsAreFlipped = false;
}

// HELPER FUNCTIONS
function disableFlips(...cards) {
    cards.forEach(card => card.removeEventListener('click', flipCard));
}

function addClass(className, ...cards) {
    cards.forEach(card => card.classList.add(className));
}

function removeClass(className, ...cards) {
    cards.forEach(card => card.classList.remove(className));
}