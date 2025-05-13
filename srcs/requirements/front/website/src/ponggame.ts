import { setTournamentMode } from "./pong/core/gamestate"
import { initPong, stopPong, setMode } from './pong/core/gameloop';

export function initGame(value:boolean): void {
  setTournamentMode(value);
  initPong();
}

export function stopGame(): void {
  stopPong();
}

export function setGameMode(status: boolean): void {
  setMode(status);
}
