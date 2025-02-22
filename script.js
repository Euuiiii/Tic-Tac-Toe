// Hamburger Menu Code
const hamburgerMenu = document.getElementById('hamburger-menu');
const menu = document.getElementById('menu');

hamburgerMenu.addEventListener('click', (event) => {
  event.stopPropagation();
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
});

window.addEventListener('click', (event) => {
  if (!hamburgerMenu.contains(event.target) && !menu.contains(event.target)) {
    menu.style.display = 'none';
  }
});

// Leaderboard 
let scoreX = 0;
let scoreO = 0;

function updateScore(winner) {
  if (winner === "X") {
    scoreX++;
    document.getElementById("scoreX").innerText = scoreX;
  } else if (winner === "O") {
    scoreO++;
    document.getElementById("scoreO").innerText = scoreO;
  }
}

// Game Code
let chance = "X";
const buttons = document.querySelectorAll(".btn");
let board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
let aiEnabled = true; // game starts in Ai mode

const winCombo = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function checkGames() {
  for (const [a, b, c] of winCombo) {
    if (board[a] === board[b] && board[a] === board[c] && board[a] !== "-") {
      showMessage(`Player ${board[a]} wins!`);
      updateScore(board[a]);
      disableButtons();
      return "win";
    }
  }
  if (!board.includes("-")) {
    showMessage("It's a tie!");
    disableButtons();
    return "tie";
  }
  return "play";
}

function disableButtons() {
  buttons.forEach((btn) => btn.disabled = true);
}

function showMessage(msg) {
  document.getElementById("result").innerText = msg;
}

const modeButton = document.getElementById("mode");

modeButton.innerText = "2 Player Mode"; // The inner text will be 2 player when ai is playing

// To toggle between AI mode and 2 player
function toggleMode() {
  aiEnabled = !aiEnabled;

  // inner Text according to mode
  modeButton.innerText = aiEnabled ? "2 Player Mode" : "Play with Computer";

  restartButton();
}

modeButton.onclick = toggleMode;

buttons.forEach((btn, index) => {
  btn.onclick = function () {
    if (board[index] === "-" && (chance === "X" || (chance === "O" && !aiEnabled))) {
      btn.innerText = chance;
      btn.classList.add(chance === "X" ? "player-x" : "player-o"); // Add class for styling
      board[index] = chance;
      const gameStatus = checkGames();

      if (gameStatus === "play") {
        chance = chance === "X" ? "O" : "X";
        if (aiEnabled && chance === "O" && checkGames() === "play") {
          setTimeout(computerMove, 500);
        }
      }
    }
  };
});

function computerMove() {
  let move = getBestMove();
  if (move !== -1) {
    buttons[move].innerText = "O";
    buttons[move].classList.add("player-o"); // Add class for styling
    board[move] = "O";
    const gameStatus = checkGames();
    if (gameStatus === "win" || gameStatus === "tie") {
      return; 
    }
    if (gameStatus === "play") {
      chance = "X";
    }
  }
}

function getBestMove() {
  for (const [a, b, c] of winCombo) {
    if (board[a] === "O" && board[b] === "O" && board[c] === "-") return c;
    if (board[a] === "O" && board[c] === "O" && board[b] === "-") return b;
    if (board[b] === "O" && board[c] === "O" && board[a] === "-") return a;
  }
  for (const [a, b, c] of winCombo) {
    if (board[a] === "X" && board[b] === "X" && board[c] === "-") return c;
    if (board[a] === "X" && board[c] === "X" && board[b] === "-") return b;
    if (board[b] === "X" && board[c] === "X" && board[a] === "-") return a;
  }
  if (board[4] === "-") return 4;
  const corners = [0, 2, 6, 8].filter(c => board[c] === "-");
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  const sides = [1, 3, 5, 7].filter(s => board[s] === "-");
  if (sides.length) return sides[Math.floor(Math.random() * sides.length)];
  return -1;
}

const restartButton = () => {
  buttons.forEach((btn) => {
    btn.innerText = "";
    btn.disabled = false;
    btn.classList.remove("player-x", "player-o"); // Remove classes on restart
  });
  board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
  chance = "X";
  showMessage(aiEnabled ? "Have fun with AI. You are X." : "");
};

document.getElementById("restart").onclick = restartButton;
