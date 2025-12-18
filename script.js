const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector(".high-score");
const scoreElement = document.querySelector(".score");
const timeElement = document.querySelector(".time");

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = "00-00";

highScoreElement.innerText = highScore;

const blockHeight = 60;
const blockWidth = 60;

let rows = Math.floor(board.clientHeight / blockHeight);
let cols = Math.floor(board.clientWidth / blockWidth);

let intervalId = null;
let timerIntervalId = null;
const blocks = {};

let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
};

let snake = [
    { x: 4, y: 0 },
    { x: 4, y: 1 },
    { x: 4, y: 2 },
];

function createBoard() {
    board.innerHTML = "";
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const block = document.createElement("div");
            block.classList.add("block");
            board.appendChild(block);
            blocks[`${i}-${j}`] = block;
        }
    }
}

createBoard();

let direction = "right";

function render() {
    let head;

    blocks[`${food.x}-${food.y}`]?.classList.add("food");

    if (direction === "right") head = { x: snake[0].x, y: snake[0].y + 1 };
    if (direction === "left") head = { x: snake[0].x, y: snake[0].y - 1 };
    if (direction === "up") head = { x: snake[0].x - 1, y: snake[0].y };
    if (direction === "down") head = { x: snake[0].x + 1, y: snake[0].y };

    if (
        head.x < 0 ||
        head.x >= rows ||
        head.y < 0 ||
        head.y >= cols
    ) {
        clearInterval(intervalId);
        clearInterval(timerIntervalId);
        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }

    let ateFood = false;
    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols),
        };
        score += 10;
        scoreElement.innerText = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        ateFood = true;
    }

    snake.forEach(seg =>
        blocks[`${seg.x}-${seg.y}`]?.classList.remove("fill")
    );

    snake.unshift(head);
    if (!ateFood) snake.pop();

    snake.forEach(seg =>
        blocks[`${seg.x}-${seg.y}`]?.classList.add("fill")
    );
}

startButton.addEventListener("click", () => {
    modal.style.display = "none";

    intervalId = setInterval(render, 300);

    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number);
        sec++;
        if (sec === 60) {
            sec = 0;
            min++;
        }
        time = `${String(min).padStart(2, "0")}-${String(sec).padStart(2, "0")}`;
        timeElement.innerText = time;
    }, 1000);
});

restartButton.addEventListener("click", () => location.reload());

addEventListener("keydown", e => {
    if (e.key === "ArrowUp") direction = "up";
    if (e.key === "ArrowDown") direction = "down";
    if (e.key === "ArrowLeft") direction = "left";
    if (e.key === "ArrowRight") direction = "right";
});

/* Recalculate grid on resize (mobile rotation) */
window.addEventListener("resize", () => location.reload());
