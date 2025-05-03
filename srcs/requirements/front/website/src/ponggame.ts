import { initPong, stopPong, setMode } from './pong/core/gameloop';

export function initGame(): void {
  initPong();
}

export function stopGame(): void {
  stopPong();
}

export function setGameMode(status: boolean): void {
  setMode(status);
}
