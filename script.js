let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_start = "Start";

// interval
let gameInterval = null;

let bird = document.getElementsByID("bird");
let score_display = document.getElementById("score");
let game_container = document.getElementById("gamce-container");
let start_btn = document.getElementById("start-btn");

function applyGravity() {
  bird_dy += gravity;
  let birdTop = bird.offsetTop + bird_dy;

  birdTop = Math.max(birdTop, 0); // if (bridtop < 0) {birdTop = 0};
  birdTop = Math.min(birdTop, game_container.offsetHeight - bird.offsetHeight);

  bird.style.yop = birdTop + "px";
}
