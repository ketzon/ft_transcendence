import { GameElements } from '../types';
import { gameState } from '../core/gamestate';
import { WIN_SCORE } from '../utils/constants';
import { resetGame } from '../core/gameloop';
import { setPause } from '../core/gamestate';
// import confetti  from 'canvas-confetti';
import { gameSounds } from '../utils/audio';
import { tournamentResults } from '../core/gamestate'; 
import { sendTournamentToBackend } from './tournamentResults';

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

  const isTournament = localStorage.getItem("tournamentPlayers") !== null;
  const player1Name = gameId.player1?.textContent || "Unknown";
  const player2Name = gameId.player2?.textContent || "Unknown";
  const isPlayer1User = player1Name === localStorage.getItem("nickname");
  
  if (gameState.scoreLeft >= WIN_SCORE) //Si le joueur de gauche (player1) a gagné
  {
    setPause(true);
    gameSounds?.victorySound.play();

    if (isTournament) { //Si c'est un tournoi, ajooute le resulatat dans le tableau local tournamentsResults
    tournamentResults.push({
      player1: player1Name,
      player2: player2Name,
      winner: player1Name,
      score1: gameState.scoreLeft,
      score2: gameState.scoreRight,
    });
    console.log("✅ Résultat ajouté au tournoi :", tournamentResults);
    }
    // const isPlayer1ConnectedUser = (gameState.player1Id === connectedUserId); // ou une condition équivalente

    fetch('http://back:3000/api/games',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify  ({
          // player2Name: localStorage.getItem("Player2") || "player2👻",
          player1Name,
          player2Name,
          score1: gameState.scoreLeft,
          score2: gameState.scoreRight,
          totalMoves: Math.floor(Math.random() * 50) + 30,
          avgMoveTime: (Math.random() * 3).toFixed(1) + "s", // aléatoire ou calculé
          duration: `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` // aléatoire ou calculé
          // ...(isPlayer1ConnectedUser && { player1Id: gameState.player1Id })
        })
      })
    .then(res => res.json())
    .then(data => console.log("✅ Partie enregistrée :", data))
    .catch(err => console.error("❌ Erreur enregistrement :", err));

    
    changeWinnerMsg(gameId, player1Name);
    }
    
    else if (gameState.scoreRight >= WIN_SCORE)
    {
      setPause(true);
      gameSounds?.victorySound.play();

    if (isTournament) {
      tournamentResults.push({
        player1: player1Name,
        player2: player2Name,
        winner: player2Name,
        score1: gameState.scoreLeft,
        score2: gameState.scoreRight,
      });
      console.log("✅ Résultat ajouté au tournoi :", tournamentResults);
    }

      fetch('http://back:3000/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        // player2Name: localStorage.getItem("Player2") || "player2👻",
        // player1Id: gameState.player1Id,
        player1Name,
        player2Name,
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

    if (tournamentResults.length >= 3)
          sendTournamentToBackend();
}
