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

export function changeWinnerMsg(gameId: GameElements, winnerName:string) : void {
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
  const player1Name = gameId.player1?.textContent || "Unknown";
  const player2Name = gameId.player2?.textContent || "Unknown";
    if (gameState.scoreLeft >= WIN_SCORE) {
      console.log("👀 Player2:", player1Name);
        setPause(true);
        gameSounds?.victorySound.play();
        // fetch('/api/games', { 
      fetch('http://localhost:3000/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
      player2Name: localStorage.getItem("Player2") || "player2👻",
      score1: gameState.scoreLeft,
      score2: gameState.scoreRight,
      totalMoves: Math.floor(Math.random() * 50) + 30,
      avgMoveTime: (Math.random() * 3).toFixed(1) + "s", // aléatoire ou calculé
      duration: `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` // aléatoire ou calculé

      })
    })
    .then(res => res.json())
    .then(data => console.log("✅ Partie enregistrée :", data))
    .catch(err => console.error("❌ Erreur enregistrement :", err));

    
    changeWinnerMsg(gameId, player1Name);
    } else if (gameState.scoreRight >= WIN_SCORE) {
        // confetti();
        setPause(true);
        gameSounds?.victorySound.play();
        // fetch('/api/games', { 
      fetch('http://localhost:3000/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
      player1Id: gameState.player1Id,
        score1: gameState.scoreLeft,
        score2: gameState.scoreRight,
        totalMoves: Math.floor(Math.random() * 50) + 30,
        avgMoveTime: (Math.random() * 3).toFixed(1) + "s", // aléatoire ou calculé
        duration: `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` // aléatoire ou calculé

      })
    })
    .then(res => res.json())
    .then(data => console.log("✅ Partie enregistrée :", data))
    .catch(err => console.error("❌ Erreur enregistrement :", err));

    changeWinnerMsg(gameId, player2Name);
  }
}