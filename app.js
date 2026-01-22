const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");
const modeSelect = document.querySelector("#mode");
const difficultySelect = document.querySelector("#difficulty");

const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreOText = document.getElementById("scoreOText");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;

let scoreX = 0;
let scoreO = 0;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Mode change
modeSelect.addEventListener("change", () => {
  scoreOText.innerHTML =
    modeSelect.value === "ai"
      ? `AI (O): <span id="scoreO">${scoreO}</span>`
      : `Player O: <span id="scoreO">${scoreO}</span>`;
});

// Reset game
const resetGame = () => {
  board.fill("");
  currentPlayer = "X";
  gameActive = true;
  boxes.forEach(box => {
    box.textContent = "";
    box.disabled = false;
    box.classList.remove("win");
  });
  msgContainer.classList.add("hide");
};

// Box click
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (!gameActive || board[index]) return;

    playMove(index, currentPlayer);

    if (modeSelect.value === "ai" && currentPlayer === "O" && gameActive) {
      setTimeout(aiMove, 500);
    }
  });
});

// Play move
const playMove = (index, player) => {
  board[index] = player;
  boxes[index].textContent = player;
  boxes[index].disabled = true;
  clickSound.play();

  if (checkWinner(player)) {
    updateScore(player);
    highlightWin(player);
    endGame(`${player === "X" ? "Player X" : "Player O"} Wins!`, winSound);
    return;
  }

  if (!board.includes("")) {
    endGame("It's a Draw!", drawSound);
    return;
  }

  currentPlayer = player === "X" ? "O" : "X";
};

// AI move
const aiMove = () => {
  let index =
    difficultySelect.value === "easy" ? randomMove() : smartMove();
  playMove(index, "O");
};

// AI logic
const randomMove = () => {
  const empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
};

const smartMove = () => {
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      if (checkWinner("O")) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }
  return randomMove();
};

// Winner check
const checkWinner = (player) =>
  winPatterns.some(p => p.every(i => board[i] === player));

// Highlight win
const highlightWin = (player) => {
  winPatterns.forEach(p => {
    if (p.every(i => board[i] === player)) {
      p.forEach(i => boxes[i].classList.add("win"));
    }
  });
};

// Score update
const updateScore = (player) => {
  if (player === "X") {
    scoreX++;
    scoreXEl.textContent = scoreX;
  } else {
    scoreO++;
    scoreOEl.textContent = scoreO;
  }
};

// End game
const endGame = (text, sound) => {
  msg.textContent = text;
  msgContainer.classList.remove("hide");
  gameActive = false;
  sound.play();
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);