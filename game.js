
import { addEntry } from './firebase.js'

// settings
let clock = 150;
let n = 18;
let N = n * n;

// DOM elements
let score_ph;
let best_score_ph;
let grid_container;
let table;
let cells;

// enum
let LEFT = -1;
let RIGHT = +1;
let UP = -n;
let DOWN = +n;


// game state
let gameLoop;
let goldLoop;
let score;
let length;
let pos;
let dir, newDir, fresh;
let tail;
let ptr;
let food;
let gold;

document.addEventListener("DOMContentLoaded", function() {
    // console.log('script started');
    init();
    start();
    // gameLoop = setInterval(update, clock);
});

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
        if ((newDir.length === 0 && dir === RIGHT) || (newDir.length > 0 && newDir[newDir.length-1] === RIGHT)) return;
        if (fresh) {
            newDir = [];
            fresh = false;
        }
        if (newDir.length < 2)
            newDir.push(LEFT);
    }
    if (event.key === "ArrowRight") {
        if ((newDir.length === 0 && dir === LEFT) || (newDir.length > 0 && newDir[newDir.length-1] === LEFT)) return;
        if (fresh) {
            newDir = [];
            fresh = false;
        }
        if (newDir.length < 2)
            newDir.push(RIGHT);
    }
    if (event.key === "ArrowUp") {
        if ((newDir.length === 0 && dir === DOWN) || (newDir.length > 0 && newDir[newDir.length-1] === DOWN)) return;
        if (fresh) {
            newDir = [];
            fresh = false;
        }
        if (newDir.length < 2)
            newDir.push(UP);
    }
    if (event.key === "ArrowDown") {
        if ((newDir.length === 0 && dir === UP) || (newDir.length > 0 && newDir[newDir.length-1] === UP)) return;
        if (fresh) {
            newDir = [];
            fresh = false;
        }
        if (newDir.length < 2)
            newDir.push(DOWN);
    }
});

function init() {

    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString);

    const sizeParam = + queryParams.get('size');
    const levelParam = queryParams.get('level');

    if (sizeParam > 3 && sizeParam < 30) {
        n = sizeParam;
    } else {
        n = 15;
    }

    N = n * n;
    LEFT = -1;
    RIGHT = +1;
    UP = -n;
    DOWN = +n;

    if (['easy', 'medium', 'hard'].includes(levelParam)) {
        if (levelParam === 'easy') clock = 200;
        if (levelParam === 'medium') clock = 150;
        if (levelParam === 'hard') clock = 100;
    } else {
        clock = 150;
    }

    score_ph = document.getElementById("score");
    best_score_ph = document.getElementById("best-score");
    grid_container = document.getElementById("grid");

    table = document.createElement("table");
    cells = [];

    for (let i = 0; i < n; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < n; j++) {
            let cell = document.createElement("td");
            row.appendChild(cell);
            cells.push(cell);
        }
        table.appendChild(row);
    }

    grid_container.appendChild(table);

    const best = localStorage.getItem('best_score') ?? 0;
    best_score_ph.innerText = best;
}


function start() {

    score = 0;
    score_ph.innerText = score;
    dir = 0;
    newDir = []; fresh = true;
    length = 1;
    tail = Array(N);
    ptr = 0;
    for (let i = 0; i < N; i++) {
        tail[(ptr - i + N) % N] = 0;
    }
    pos = 0;
    food = pickNewFood(0);
    gold = -1;

    gameLoop = setInterval(update, clock);

}

function pickNewFood(newPos) {
    
    const k = N - length - 1;
    let p = Math.floor(Math.random() * k);

    let taken = [];
    taken.push(newPos);
    for (let i = 0; i < length; i++) {
        taken.push(tail[(ptr - i + N) % N]);
    }
    taken.sort((a, b) => a - b);

    for (let x of taken) {
        if (x <= p) p++;
    }

    return p;
}

function draw() {

    // clear
    cells.map(cell => cell.style.backgroundColor = 'var(--dark-bg)');

    // draw snake
    for (let i = 0; i < length; i++) {
        let k = tail[(ptr - i + N) % N];
        cells[k].style.backgroundColor = 'var(--snake-color)';
    }

    // draw food
    cells[food].style.backgroundColor = 'var(--food-color)';

    if (gold > 0)
        cells[gold].style.backgroundColor = 'var(--food-gold)';

}

function update() {

    if (newDir.length > 0)
        dir = newDir.shift();
    fresh = true;
    const newPos = pos + dir;

    if (checkLose(newPos))
        return;
    
    checkFood(newPos);
    
    // newPosition
    ptr = (ptr + 1) % N;
    tail[ptr] = newPos;
    pos = newPos;
        
    draw();
}

function checkLose(newPos) {

    // check for edges
    if (newPos < 0 || newPos >= N
        || (newPos % n == 0 && dir == RIGHT)
        || (newPos % n == n-1 && dir == LEFT)
    ) {
        finish();
        return true;
    }

    // check for self
    for (let i = 0; i < length - 1; i++) {
        if (newPos === tail[(ptr - i + N) % N]) {
            finish();
            return true;
        }
    }

    return false;

}

function checkFood(newPos) {

    if (newPos === food) {
        score++;
        score_ph.innerText = score;
        const best = +best_score_ph.innerText;
        if (score > best)
            best_score_ph.innerText = score;
        length++;
        food = pickNewFood(newPos);
    }

    if (newPos === gold) {
        score += 10;
        score_ph.innerText = score;
        const best = +best_score_ph.innerText;
        if (score > best)
            best_score_ph.innerText = score;
        gold = -1;
    }

}

function finish() {

    clearInterval(gameLoop);
    clearInterval(goldLoop);

    // alert("Game over!");

    const name = prompt("You lost :(\nLet's see how you compare to others :)\nEnter your name plase");

    let scores = JSON.parse(localStorage.getItem('scores'));
    if (scores === null) scores = {};
    scores[name] = score;
    localStorage.setItem('scores', JSON.stringify(scores));

    const best = +localStorage.getItem('best_score') ?? 0;
    if (score > best) {
        localStorage.setItem('best_score', score);
    }

    localStorage.setItem('last', name);
    
    if (name !== null && name !== '') {
        addEntry(name, score);
    }

    start();

}
