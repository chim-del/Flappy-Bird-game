let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "Start";
let pipes = [];
let pipe_gap = 250;
let frame = 0;
let pipeSpeed = 3;
const frame_time = 150;
let highScore = localStorage.getItem("flappyBirdHighScore") || 0;
let selectBtn = document.getElementById("difficulty-select");
let musicMuted = false;


// interval
let gameInterval = null;

let bird = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_container = document.getElementById("game_container");
let start_btn = document.getElementById("start-btn");

function startGame() {
  if (gameInterval !== null) return;
  backgroundMusic.play();
  highScore = localStorage.getItem("flappyBirdHighScore") || 0;
  score_display.textContent = "Score:" + score + "|Best:" + highScore;
  gameInterval = setInterval(() => {
    applyGravity();
    movePipes();
    checkCollision();
    getDifficultySettings();
    frame++;
    if (frame % frame_time === 0) {
      createPipe();
    }
  }, 10);
}

function applyGravity() {
  bird_dy += gravity;
  let birdTop = bird.offsetTop + bird_dy;

  birdTop = Math.max(birdTop, 0); // if (bridtop < 0) {birdTop = 0};
  birdTop = Math.min(birdTop, game_container.offsetHeight - bird.offsetHeight);

  bird.style.top = birdTop + "px";
  let angle = Math.min(Math.max(bird_dy * 3, -30), 90);
  bird.style.transform = `rotate(${angle}deg)`;
}

function onStartButtonClick() {
  if (game_state !== "Play") {
    game_state = "Play";
    startGame();
    start_btn.style.visibility = "hidden";
    muteBtn.style.visibility = "hidden";
    selectBtn.style.visibility = "hidden";
  }
}
document.addEventListener("keydown", (e) => {
  if (gameInterval === null) return;
  if (e.code === "Space" || e.code === "ArrowUp") {
    flapSound.play();
    bird_dy = -7;
  }
});

// Create Pipe
function createPipe() {
  let pipe_position =
    Math.floor(Math.random() * (game_container.offsetHeight - pipe_gap - 100)) +
    50;

  // Top pipe
  let top_pipe = document.createElement("div");
  top_pipe.className = "pipe top_pipe";
  top_pipe.style.height = pipe_position + "px";
  top_pipe.style.top = "0px";
  top_pipe.style.left = "100%";
  game_container.appendChild(top_pipe);

  // Bottom pipe
  let bottom_pipe = document.createElement("div");
  bottom_pipe.className = "pipe bottom_pipe";
  bottom_pipe.style.height =
    game_container.offsetHeight - pipe_gap - pipe_position + "px";
  bottom_pipe.style.bottom = "0px";
  bottom_pipe.style.left = "100%";
  game_container.appendChild(bottom_pipe);

  pipes.push(top_pipe, bottom_pipe);
}

function movePipes() {
  for (let pipe of pipes) {
    pipe.style.left = pipe.offsetLeft - pipeSpeed + "px";

    // Remove pipes from the screeen
    if (pipe.offsetLeft < -pipe.offsetWidth) {
      pipe.remove();
    }
  }

  // Remove old pipes from the array
  pipes = pipes.filter((pipe) => pipe.offsetLeft + pipe.offsetWidth > 0);
}
function checkCollision() {
  let birdRect = bird.getBoundingClientRect();
  for (let pipe of pipes) {
    let pipeRect = pipe.getBoundingClientRect();

    if (
      birdRect.left + 10 < pipeRect.left + pipeRect.width &&
      birdRect.left + birdRect.width > pipeRect.left &&
      birdRect.top + 10 < pipeRect.top + pipeRect.height &&
      birdRect.top + birdRect.height > pipeRect.top
    ) {
      endGame();
      return;
    }
  }
  if (
    bird.offsetTop <= 0 ||
    bird.offsetTop >= game_container.offsetHeight - bird.offsetHeight
  ) {
    endGame();
  }
  // Increase score
  pipes.forEach((pipe, index) => {
    if (index % 2 === 0) {
      if (
        pipe.offsetLeft + pipe.offsetWidth < bird.offsetLeft &&
        !pipe.passed
      ) {
        pipe.passed = true;
        setScore(score + 1);
      }
    }
  });
}

function setScore(newScore) {
  if (newScore > score) {
    scoreSound.play();
  }
  score = newScore;
  score_display.textContent = "Score:" + score + "|Best:" + highScore;
}

function endGame() {
  if (Number(score) > Number(highScore)) {
    localStorage.setItem("flappyBirdHighScore", score);
  }
  hitSound.play();
  clearInterval(gameInterval);
  gameInterval = null;
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  alert("Game Over! Your Score " + score);
  resetGame();
}

function resetGame() {
  start_btn.style.visibility = "visible";
  muteBtn.style.visibility = "visible";
  selectBtn.style.visibility = "visible";
  bird.style.transform = `rotate(${0}deg)`;
  bird.style.top = "50%";
  bird_dy = 0;
  for (let pipe of pipes) {
    pipe.remove();
  }
  pipes = [];
  setScore(0);
  frame = 0;
  game_state = "Start";
}

function getDifficultySettings() {
  const selected = document.getElementById("difficulty-select").value;

  if (selected === "easy") {
    pipeSpeed = 2;
    pipe_gap = 350;
  } else if (selected === "medium") {
    pipeSpeed = 3;
    pipe_gap = 250;
  } else if (selected === "hard") {
    pipeSpeed = 5;
    pipe_gap = 150;
  }
}

const flapSound = new Audio("music/flap.mp3");
flapSound.volume = 0.2;

const scoreSound = new Audio("music/score.mp3");
scoreSound.volume = 0.2;

const hitSound = new Audio("music/hit.mp3");
hitSound.volume = 0.5;

const backgroundMusic = new Audio("music/background-music.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

muteBtn = document.getElementById("mute-btn");

muteBtn.addEventListener("click", () => {
  if (musicMuted) {
    backgroundMusic.play();
    muteBtn.textContent = "Mute Music";
  } else {
    backgroundMusic.pause();
    muteBtn.textContent = "Play Music";
  }
  musicMuted = !musicMuted;
});

