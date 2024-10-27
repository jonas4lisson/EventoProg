const botao = document.querySelector('button')

botao.addEventListener('click', () => {
// Redireciona para outra página
window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSfla-bqS9TOCW72AU8CTDadNPQ94UKlDO7yI4ecQXzC2RqgvA/viewform?usp=sf_link'; // Coloque o link para onde deseja redirecionar
});

botao.addEventListener('mousemove', (e) => {
const rect = button.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

// Atualiza a posição do brilho
botao.style.setProperty('--x', `${x}px`);
botao.style.setProperty('--y', `${y}px`);
});

const gameArea = document.getElementById("gameArea");
const snakeContainer = document.getElementById("snake");
const snakeSize = 22;
let snake = [];
let direction = { x: 1, y: 0 }; // Inicializa a direção para a direita
let randomMovement = false;
let movementInterval;
let positionChangeInterval;

// Inicialmente oculta a cobra
function createSnake() {
const startX = (gameArea.clientWidth / 2) - (snakeSize); // Posição X inicial (centro)
const startY = (gameArea.clientHeight / 2) - (snakeSize / 2); // Posição Y inicial (centro)

// Cria a cabeça da cobra
const head = document.createElement("div");
head.classList.add("snake-part", "snake-head");
head.style.left = `${startX}px`; // Posição da cabeça
head.style.top = `${startY}px`; // Posição da cabeça
snake.push(head);
snakeContainer.appendChild(head);

// Cria a segunda parte da cobra
const secondPart = document.createElement("div");
secondPart.classList.add("snake-part");
secondPart.style.left = `${startX + snakeSize}px`; // Posição do segundo bloco à direita da cabeça
secondPart.style.top = `${startY}px`; // Alinhado na mesma linha
snake.push(secondPart);
snakeContainer.appendChild(secondPart);
}

function isCollision(x, y) {
// Verifica se a nova posição colide com o corpo da cobra
return snake.some(part => parseInt(part.style.left) === x && parseInt(part.style.top) === y);
}

function resetGame() {
// Reinicializa a cobra e a área de jogo
snakeContainer.innerHTML = ''; // Limpa a cobra
snake = []; // Reinicia a cobra
createSnake(); // Cria a nova cobra
direction = { x: 1, y: 0 }; // Reseta a direção para a direita
}

function moveSnake() {
if (!randomMovement) return;

let headX = parseInt(snake[0].style.left); // Use a cabeça (primeiro elemento) para obter a posição
let headY = parseInt(snake[0].style.top); // Use a cabeça (primeiro elemento) para obter a posição

// Calcule a nova posição da cabeça da cobra
let newX = headX + direction.x * snakeSize;
let newY = headY + direction.y * snakeSize;

// Faz o wrap-around se sair da área de jogo
if (newX < 0) {
    newX = gameArea.clientWidth - snakeSize; // Volta pela direita
} else if (newX >= gameArea.clientWidth) {
    newX = 0; // Volta pela esquerda
}
if (newY < 0) {
    newY = gameArea.clientHeight - snakeSize; // Volta pela parte de baixo
} else if (newY >= gameArea.clientHeight) {
    newY = 0; // Volta pela parte de cima
}

// Verifica colisão com o corpo da cobra
if (isCollision(newX, newY)) {
    resetGame(); // Retorna ao início se colidir com o corpo
    return;
}

// Mover o corpo da cobra
for (let i = snake.length - 1; i > 0; i--) {
    snake[i].style.left = snake[i - 1].style.left;
    snake[i].style.top = snake[i - 1].style.top;
}

// Move a cabeça da cobra
snake[0].style.left = `${newX}px`;
snake[0].style.top = `${newY}px`;

// Adiciona nova parte ao corpo aleatoriamente
if (Math.random() < 0.1) { // 10% chance de adicionar uma nova parte
    const newPart = document.createElement("div");
    newPart.classList.add("snake-part");
    newPart.style.left = snake[snake.length - 1].style.left;
    newPart.style.top = snake[snake.length - 1].style.top;
    snake.push(newPart);
    snakeContainer.appendChild(newPart);
}
}

function changeDirection() {
// Altera a direção aleatoriamente
const directions = [
    { x: 1, y: 0 },   // Direita
    { x: -1, y: 0 },  // Esquerda
    { x: 0, y: 1 },   // Baixo
    { x: 0, y: -1 }   // Cima
];

let randomIndex;
let newDirection;

do {
    randomIndex = Math.floor(Math.random() * directions.length);
    newDirection = directions[randomIndex];
} while (isCollision(
    parseInt(snake[0].style.left) + newDirection.x * snakeSize,
    parseInt(snake[0].style.top) + newDirection.y * snakeSize
));

direction = newDirection;
}

// Exibe a cobra e inicia o movimento ao passar o mouse
botao.addEventListener("mouseenter", () => {
randomMovement = true;
gameArea.style.display = "block"; // Exibe a área de jogo
resetGame(); // Reinicializa a cobra
movementInterval = setInterval(() => {
    moveSnake();
}, 100); // Aumenta a velocidade do movimento diminuindo

// Muda a posição da cobra 
positionChangeInterval = setInterval(() => {
    changeDirection(); // Muda a direção aleatoriamente
}, 500); // Aumenta o tempo de mudança de direção
});

botao.addEventListener("mouseleave", () => {
randomMovement = false;
clearInterval(movementInterval); // Para o movimento ao sair
clearInterval(positionChangeInterval); // Para a mudança de posição
gameArea.style.display = "none"; // Esconde a área de jogo
});
