const board = document.getElementById('board');
const statusDiv = document.getElementById('status');
const playAgainBtn = document.getElementById('play-again');
const popup = document.getElementById('popup');
const popupWinner = document.getElementById('popup-winner');
const popupPlayAgain = document.getElementById('popup-play-again');
const confettiCanvas = document.getElementById('confetti-canvas');
let cells = [];
let currentPlayer = 'X';
let gameActive = true;

// Winning combinations
const winCombos = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diags
];

// Initialize board
function initBoard() {
    board.innerHTML = '';
    cells = [];
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
        cells.push(cell);
    }
    currentPlayer = 'X';
    gameActive = true;
    statusDiv.textContent = "Player X's turn";
    hidePopup();
    stopConfetti();
}

// Handle cell click
function handleCellClick(e) {
    const idx = e.target.dataset.index;
    if (!gameActive || cells[idx].textContent) return;
    cells[idx].textContent = currentPlayer;
    cells[idx].classList.add(currentPlayer.toLowerCase());
    if (checkWin(currentPlayer)) {
        showWinner(currentPlayer);
        highlightWin(currentPlayer);
        gameActive = false;
        launchConfetti();
    } else if (cells.every(cell => cell.textContent)) {
        showDraw();
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDiv.textContent = `Player ${currentPlayer}'s turn`;
    }
}

// Check for win
function checkWin(player) {
    return winCombos.some(combo =>
        combo.every(idx => cells[idx].textContent === player)
    );
}

// Highlight winning cells
function highlightWin(player) {
    for (const combo of winCombos) {
        if (combo.every(idx => cells[idx].textContent === player)) {
            combo.forEach(idx => cells[idx].classList.add('win'));
            break;
        }
    }
}

// Show winner popup
function showWinner(player) {
    statusDiv.textContent = `🎉 ${player} wins!`;
    popupWinner.textContent = `🎉 ${player} is the winner!`;
    showPopup();
}

// Show draw popup
function showDraw() {
    statusDiv.textContent = "It's a draw!";
    popupWinner.textContent = "It's a draw!";
    showPopup();
    stopConfetti();
}

// Popup controls
function showPopup() {
    popup.style.display = "flex";
}
function hidePopup() {
    popup.style.display = "none";
}

// Play again resets board
playAgainBtn.onclick = popupPlayAgain.onclick = function() {
    initBoard();
};

// --- Confetti Celebration ---
let confettiActive = false;
function launchConfetti() {
    confettiActive = true;
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    let confettiParticles = [];

    // Create confetti particles all over the screen
    for (let i = 0; i < 180; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * -confettiCanvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * 40 + 10,
            color: `hsl(${Math.random()*360},90%,60%)`,
            tilt: Math.random() * 10 - 10,
            tiltAngle: 0,
            tiltAngleIncremental: (Math.random() * 0.07) + .05,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 + 2
        });
    }

    function drawConfetti() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiParticles.forEach(p => {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + (p.r / 3), p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
            ctx.stroke();
            ctx.restore();
        });
        updateConfetti();
    }
    function updateConfetti() {
        confettiParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.tiltAngle += p.tiltAngleIncremental;
            p.tilt = Math.sin(p.tiltAngle - (p.d / 3)) * 15;
            if (p.y > confettiCanvas.height) {
                p.x = Math.random() * confettiCanvas.width;
                p.y = Math.random() * -20;
            }
        });
    }
    function animate() {
        if (!confettiActive) return;
        drawConfetti();
        requestAnimationFrame(animate);
    }
    animate();
}
function stopConfetti() {
    confettiActive = false;
    const ctx = confettiCanvas.getContext('2d');
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}
window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});

// Start game
initBoard();