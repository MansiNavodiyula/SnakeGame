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
const blockwidth = 60;
const rows = Math.floor(board.clientHeight / blockHeight);
const cols = Math.floor(board.clientWidth / blockwidth);

let intervalId = null;
let timerIntervalId = null;
const blocks = [];

let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
};

let snake = [
    { x: 4, y: 0 },
    { x: 4, y: 1 },
    { x: 4, y: 2 },
];

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${i}-${j}`] = block;
    }
}

let direction = "right";

function render() {
    let head = null;
    blocks[`${food.x}-${food.y}`].classList.add("food");

    if (direction == "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    } else if (direction == "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    } else if (direction == "up") {
        head = { x: snake[0].x - 1, y: snake[0].y };
    } else if (direction == "down") {
        head = { x: snake[0].x + 1, y: snake[0].y };
    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId);
        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }

    let ateFood = false;
    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols),
        };
        score += 10;
        scoreElement.innerText = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
        }
        ateFood = true;
    }

    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });

    snake.unshift(head);
    if (!ateFood) {
        snake.pop();
    }

    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
}

startButton.addEventListener("click", () => {
    modal.style.display = "none";
    intervalId = setInterval(() => {
        render();
    }, 300);

    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number);
        if (sec == 59) {
            min += 1;
            sec = 0;
        } else {
            sec += 1;
        }
        time = `${min}-${sec}`;
        timeElement.innerText = time;
    }, 1000);
});

restartButton.addEventListener("click", restartGame);

function restartGame() {
    score = 0;
    time = "00-00";
    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highScore;
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });
    modal.style.display = "none";
    snake = [
        { x: 4, y: 0 },
        { x: 4, y: 1 },
        { x: 4, y: 2 },
    ];
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols),
    };
    clearInterval(intervalId);
    direction = "right";
    intervalId = setInterval(() => {
        render();
    }, 300);
}

addEventListener("keydown", (event) => {
    if (event.key == "ArrowUp") direction = "up";
    else if (event.key == "ArrowDown") direction = "down";
    else if (event.key == "ArrowRight") direction = "right";
    else if (event.key == "ArrowLeft") direction = "left";
});
