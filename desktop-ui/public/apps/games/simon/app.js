let gameSeq = [];
let userSeq = [];
let btns = ["red", "blue", "yellow", "purple"]; // Top, Left, Right, Bottom

let currentScore = 0;
let highScore = 0;
let highScoreDisplay = document.getElementById("high-score");
let currentScoreDisplay = document.getElementById("current-score");
let h2 = document.getElementById("current-level");

let started = false;
let level = 0;

// Key mapping
const keyMap = {
    'w': 'red', 'ArrowUp': 'red', '8': 'red',
    'a': 'blue', 'ArrowLeft': 'blue', '4': 'blue',
    'd': 'yellow', 'ArrowRight': 'yellow', '6': 'yellow',
    's': 'purple', 'ArrowDown': 'purple', '2': 'purple'
};

document.addEventListener("keydown", function (e) {
    if (!started) {
        // Start game on any key press
        started = true;
        currentScore = 0;
        updateScoreDisplay();
        levelUp();
        return;
    }

    // Handle gameplay keys
    const mappedColor = keyMap[e.key] || keyMap[e.key.toLowerCase()];
    if (mappedColor) {
        const btn = document.getElementById(mappedColor);
        if (btn) {
            handleInput(btn, mappedColor);
        }
    }
});

let allBtns = document.querySelectorAll(".btn");
for (let i = 0; i < allBtns.length; i++) {
    allBtns[i].addEventListener("click", function() {
        if (!started) return;
        handleInput(this, this.getAttribute("id"));
    });
}

function handleInput(btn, color) {
    userFlash(btn);
    userSeq.push(color);
    checkAns(userSeq.length - 1);
}

function gameFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function () {
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn) {
    btn.classList.add("userflash");
    setTimeout(function () {
        btn.classList.remove("userflash");
    }, 150);
}

function levelUp() {
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;
    
    let randInx = Math.floor(Math.random() * 4);
    let randColor = btns[randInx];
    let randBtn = document.querySelector(`#${randColor}`);

    gameSeq.push(randColor);
    gameFlash(randBtn);
}

function updateScoreDisplay() {
    currentScoreDisplay.innerText = `Current Score: ${currentScore}`;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreDisplay.innerText = `High Score: ${highScore}`;
    }
}

function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        // Correct input
        currentScore++;
        updateScoreDisplay();

        if (userSeq.length === gameSeq.length) {
            setTimeout(levelUp, 1000);
        }
    } else {
        // Wrong input
        h2.innerHTML = `Game Over! <br> Press any key to restart`;
        document.querySelector("body").style.backgroundColor = "rgba(255, 0, 0, 0.2)";
        setTimeout(function () {
            document.querySelector("body").style.backgroundColor = "";
        }, 200);
        reset();
    }
}

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}
