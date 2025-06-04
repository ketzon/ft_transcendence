import { GameElements } from '../types';
import { keys, gameState } from '../core/gamestate';
import { GAME_HEIGHT, PADDLE_HEIGHT, PADDLE_SPEED } from '../utils/constants';

//reduit les valeur de paddle si je monte et augmente pour descendre pour ensuite maligner visuellement avec top, plus le chiffre est faible plus je suis haut et inversement
export function updatePaddles(gameId: GameElements): void {
    if (keys.w && gameState.paddleLeftY > 0) {
        gameState.paddleLeftY -= PADDLE_SPEED;
    }
    if (keys.s && gameState.paddleLeftY < GAME_HEIGHT - PADDLE_HEIGHT) {
        gameState.paddleLeftY += PADDLE_SPEED;
    }
    if (keys.ArrowUp && gameState.paddleRightY > 0) {
        gameState.paddleRightY -= PADDLE_SPEED;
    }
    if (keys.ArrowDown && gameState.paddleRightY < GAME_HEIGHT - PADDLE_HEIGHT) {
        gameState.paddleRightY += PADDLE_SPEED;
    }
    if (gameId.paddleLeft) {
        gameId.paddleLeft.style.top = `${gameState.paddleLeftY}px`;
    }
    if (gameId.paddleRight) {
        gameId.paddleRight.style.top = `${gameState.paddleRightY}px`;
    }
}

export function resetPaddles(gameId: GameElements):void {
    if (gameId.paddleLeft) {
        gameId.paddleLeft.style.top = `${160}px`;
    }
    if (gameId.paddleRight) {
        gameId.paddleRight.style.top = `${160}px`;
    }
}
