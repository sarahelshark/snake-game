const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const grid = 20;
let count = 0;
let score = 0;

let snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};

let apple = {
    x: 320,
    y: 320
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function resetGame() {
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    score = 0;

    placeApple();
}

function placeApple() {
    let newApplePosition;
    do {
        newApplePosition = {
            x: getRandomInt(0, canvas.width / grid) * grid,
            y: getRandomInt(0, canvas.height / grid) * grid
        };
    } while (snake.cells.some(cell => cell.x === newApplePosition.x && cell.y === newApplePosition.y));

    apple.x = newApplePosition.x;
    apple.y = newApplePosition.y;
}

function loop() {
    requestAnimationFrame(loop);

    if (++count < 10) { // Slowing down the snake
        return;
    }

    count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    // Check for collision with walls
    if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
        resetGame();
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    ctx.fillStyle = 'green';
    snake.cells.forEach(function (cell, index) {
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score++;
            placeApple();
        }

        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                resetGame();
            }
        }
    });

    // Display score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

document.addEventListener('keydown', function (e) {
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

// Add touch controls for mobile devices
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0 && snake.dx === 0) {
            snake.dx = -grid;
            snake.dy = 0;
        } else if (xDiff < 0 && snake.dx === 0) {
            snake.dx = grid;
            snake.dy = 0;
        }
    } else {
        if (yDiff > 0 && snake.dy === 0) {
            snake.dy = -grid;
            snake.dx = 0;
        } else if (yDiff < 0 && snake.dy === 0) {
            snake.dy = grid;
            snake.dx = 0;
        }
    }

    xDown = null;
    yDown = null;
}

resetGame();
requestAnimationFrame(loop);