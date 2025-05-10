import { GameElements } from '../types';
import { gameState } from '../core/gamestate';
import { WIN_SCORE } from '../utils/constants';
import { resetGame } from '../core/gameloop';
import { setPause } from '../core/gamestate';
import confetti from 'canvas-confetti';
import { gameSounds } from '../utils/audio';

// Variable pour suivre si un match a été gagné
let winnerDeclared = false;

export function resetScore(gameId: GameElements): void {
    if (gameId.scoreLeft || gameId.scoreRight) {
        gameId.scoreLeft.textContent = '0';
        gameId.scoreRight.textContent = '0';
    }
    // Réinitialiser la variable de suivi
    winnerDeclared = false;
}

export function changeWinnerMsg(gameId: GameElements, winnerName: string): void {
    if (gameId.winnerMsg) {
        gameId.winnerMsg.textContent = `Victory goes to ${winnerName}! 👑🥳`;
        
        // Réinitialiser le jeu
        resetGame(gameId);
        
        if (gameId.pauseGame) {
            gameId.pauseGame.textContent = "start";
        }
    }
}

export function checkWinner(gameId: GameElements): boolean {
    // Mettre à jour les textes d'affichage du score
    if (gameId.scoreLeft && gameId.scoreRight) {
        gameId.scoreLeft.textContent = gameState.scoreLeft.toString();
        gameId.scoreRight.textContent = gameState.scoreRight.toString();
    }
    
    // Si un gagnant a déjà été déclaré, ne pas continuer la vérification
    if (winnerDeclared) {
        return true; // Un gagnant a déjà été trouvé
    }
    
    // Vérifier si un joueur a gagné
    if (gameState.scoreLeft >= WIN_SCORE) {
        confetti();
        setPause(true);
        if (gameSounds?.victorySound) gameSounds.victorySound.play();
        changeWinnerMsg(gameId, gameId.player1.textContent || "Player 1");
        winnerDeclared = true;
        return true; // Un gagnant a été trouvé
    } else if (gameState.scoreRight >= WIN_SCORE) {
        confetti();
        setPause(true);
        if (gameSounds?.victorySound) gameSounds.victorySound.play();
        changeWinnerMsg(gameId, gameId.player2.textContent || "Player 2");
        winnerDeclared = true;
        return true; // Un gagnant a été trouvé
    }
    
    return false; // Aucun gagnant pour l'instant
}
