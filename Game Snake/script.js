const playBoard = document.querySelector('.play-board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const controls = document.querySelectorAll('.controls i');

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

//Obter pontuação armazenamento local

let highScore = localStorage.getItem('high-score') || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;

//Comida gerada de forma aleatória

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert('Jogo acabou. Pressione Ok para jogar novamene');
    location.reload();
}

//Altera o valor da velocidade com base no pressionamento de tecla
const changeDirection = e => {
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Muda de direção ao clicar 

controls.forEach(button => button.addEventListener("click", () => changeDirection({key:button.dataset.key})));

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY}/${foodX}"></div>`;

    // O que acontece quando a cobra come

    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // add food to snake body array
        score++;
        highScore = score >= highScore ? score : highScore;
        //if score > high score => high score = score

        localStorage.setItem('high-score', highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    //atualiza cabeça da cobra
    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length -1; i > 0; i--) {
        snakeBody[i] = snakeBody [i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    //Verifica se a cobra esta dentro das paredes ou não

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    //Adiciona uma div para cada parte do corpo da cobra

    for(let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        //Verifica se a cobra esta se auto comendo
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;

}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener('keyup', changeDirection);
