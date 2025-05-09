import { GameElements } from '../types';

export function getElements(): GameElements {
    return {
        gameContainer: document.getElementById("game-container") as HTMLElement,
        gameBoard: document.getElementById("game-board") as HTMLElement,
        ball: document.getElementById("ball") as HTMLElement,
        paddleLeft: document.getElementById("paddle-left") as HTMLElement,
        paddleRight: document.getElementById("paddle-right") as HTMLElement,
        scoreLeft: document.getElementById("score-left") as HTMLElement,
        scoreRight: document.getElementById("score-right") as HTMLElement,
        pauseGame: document.getElementById("button-pause") as HTMLElement,
        resetGame: document.getElementById("button-reset") as HTMLElement,
        winnerMsg: document.getElementById("winner-message") as HTMLElement,
        muteGame: document.getElementById("button-ball") as HTMLElement,
        basicButton: document.getElementById("button-basic") as HTMLElement,
        player1: document.getElementById("player1") as HTMLElement,
        player2: document.getElementById("player2") as HTMLElement,
    };
}
