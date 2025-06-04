import { changePause, resetGame, setBasicMode } from './core/gameloop';
import { GameElements } from './types'; 
import { changeAudioStatus } from './utils/audio';


export function listenStatus(gameId: GameElements): void {
    
    if (gameId.pauseGame) {
        gameId.pauseGame.addEventListener("click", () =>  changePause(gameId));
    }
    if (gameId.resetGame) {
        gameId.resetGame.addEventListener("click", () => resetGame(gameId));
    }
    if (gameId.muteGame) {
        gameId.muteGame.addEventListener("click", () => changeAudioStatus(gameId));
    }
    if (gameId.basicButton) {
        gameId.basicButton.addEventListener("click", () => setBasicMode(gameId));
    }
}
