document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status-text');
    const restartBtn = document.getElementById('restart-btn');
    const difficultySelect = document.getElementById('difficulty');

    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let difficulty = 'beginner';

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleCellClick = (e) => {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== '' || !gameActive || currentPlayer === 'O') {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    };

    const handleCellPlayed = (clickedCell, clickedCellIndex) => {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add('taken', currentPlayer.toLowerCase());
    };

    const handleResultValidation = () => {
        let roundWon = false;
        let winningLine = [];

        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = gameState[winCondition[0]];
            const b = gameState[winCondition[1]];
            const c = gameState[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }

            if (a === b && b === c) {
                roundWon = true;
                winningLine = winCondition;
                break;
            }
        }

        if (roundWon) {
            statusText.innerHTML = `Player <span class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span> Wins!`;
            gameActive = false;
            highlightWinningCells(winningLine);
            return;
        }

        const roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusText.textContent = "It's a Draw!";
            gameActive = false;
            return;
        }

        handlePlayerChange();
    };

    const handlePlayerChange = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.innerHTML = `Player <span class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s Turn`;

        if (currentPlayer === 'O' && gameActive) {
            setTimeout(makeComputerMove, 500); // Add a small delay for realism
        }
    };

    const highlightWinningCells = (winningLine) => {
        winningLine.forEach(index => {
            cells[index].classList.add('win');
        });
    };

    const handleRestartGame = () => {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusText.innerHTML = `Player <span class="player-x">X</span>'s Turn`;

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('taken', 'x', 'o', 'win');
        });
    };

    const handleDifficultyChange = (e) => {
        difficulty = e.target.value;
        handleRestartGame();
    };

    // AI Logic
    const makeComputerMove = () => {
        if (!gameActive) return;

        let moveIndex;
        const randomChance = Math.random();

        switch (difficulty) {
            case 'beginner':
                // 100% Random
                moveIndex = getRandomMove();
                break;
            case 'easy':
                // 75% Random, 25% Best
                if (randomChance < 0.75) {
                    moveIndex = getRandomMove();
                } else {
                    moveIndex = getBestMove();
                }
                break;
            case 'medium':
                // 50% Random, 50% Best
                if (randomChance < 0.5) {
                    moveIndex = getRandomMove();
                } else {
                    moveIndex = getBestMove();
                }
                break;
            case 'hard':
                // 20% Random, 80% Best
                if (randomChance < 0.2) {
                    moveIndex = getRandomMove();
                } else {
                    moveIndex = getBestMove();
                }
                break;
            case 'insanity':
                // 100% Best
                moveIndex = getBestMove();
                break;
            default:
                moveIndex = getRandomMove();
        }

        // Fallback if best move returns null (shouldn't happen if logic is correct, but safe)
        if (moveIndex === null || moveIndex === undefined) {
            moveIndex = getRandomMove();
        }

        const cellToPlay = cells[moveIndex];
        handleCellPlayed(cellToPlay, moveIndex);
        handleResultValidation();
    };

    const getRandomMove = () => {
        const availableMoves = gameState.map((val, index) => val === '' ? index : null).filter(val => val !== null);
        if (availableMoves.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        return availableMoves[randomIndex];
    };

    const getBestMove = () => {
        let bestScore = -Infinity;
        let move;

        for (let i = 0; i < 9; i++) {
            if (gameState[i] === '') {
                gameState[i] = 'O';
                let score = minimax(gameState, 0, false);
                gameState[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    };

    const scores = {
        X: -10,
        O: 10,
        tie: 0
    };

    const minimax = (boardState, depth, isMaximizing) => {
        let result = checkWinner();
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (boardState[i] === '') {
                    boardState[i] = 'O';
                    let score = minimax(boardState, depth + 1, false);
                    boardState[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (boardState[i] === '') {
                    boardState[i] = 'X';
                    let score = minimax(boardState, depth + 1, true);
                    boardState[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const checkWinner = () => {
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = gameState[winCondition[0]];
            const b = gameState[winCondition[1]];
            const c = gameState[winCondition[2]];

            if (a === '' || b === '' || c === '') continue;

            if (a === b && b === c) {
                return a;
            }
        }

        if (!gameState.includes('')) {
            return 'tie';
        }

        return null;
    };

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', handleRestartGame);
    difficultySelect.addEventListener('change', handleDifficultyChange);
});
