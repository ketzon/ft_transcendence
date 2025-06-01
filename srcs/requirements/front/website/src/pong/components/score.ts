import { GameElements } from '../types';
import { gameState } from '../core/gamestate';
import { WIN_SCORE } from '../utils/constants';
import { resetGame } from '../core/gameloop';
import { setPause } from '../core/gamestate';
import confetti  from 'canvas-confetti';
import { gameSounds } from '../utils/audio';

export function resetScore(gameId: GameElements):void {
    if (gameId.scoreLeft || gameId.scoreLeft) {
        gameId.scoreLeft.textContent = '0';
        gameId.scoreRight.textContent = '0';
    }
}

export function changeWinnerMsg(gameId: GameElements, winnerName:string | null) : void {
    if (gameId.winnerMsg) {
         setTimeout(() => {
            gameId.winnerMsg.textContent = `Reach ${WIN_SCORE} point(s) to claim victory!🏆`;
         }, 3000);
        gameId.winnerMsg.textContent = `Victory goes to ${winnerName}! 👑🥳`;
        resetGame(gameId);
        gameId.pauseGame.textContent = "start";
    }
}

export function checkWinner(gameId: GameElements): void {
    if (gameState.scoreLeft >= WIN_SCORE) {
        // confetti();
        setPause(true);
        gameSounds?.victorySound.play();
        changeWinnerMsg(gameId, gameId.player1.textContent);
    } else if (gameState.scoreRight >= WIN_SCORE) {
        // confetti();
        setPause(true);
        gameSounds?.victorySound.play();
        changeWinnerMsg(gameId, gameId?.player2.textContent);
    }
}
