import { Howl } from 'howler';

export type GameElements = {
  gameContainer: HTMLElement;
  gameBoard: HTMLElement;
  ball: HTMLElement;
  paddleLeft: HTMLElement;
  paddleRight: HTMLElement;
  scoreLeft: HTMLElement;
  scoreRight: HTMLElement;
  pauseGame: HTMLElement;
  resetGame: HTMLElement;
  winnerMsg: HTMLElement;
  muteGame: HTMLElement;
  basicButton: HTMLElement;
  player1: HTMLElement;
  player2: HTMLElement;
}

export type GameSounds = {
    smashBall: Howl;
    whiteBall: Howl;
    featuresMode: Howl;
    defaultMode: Howl;
    victorySound: Howl;
    paddleSound: Howl;
    smashSound: Howl;
    doublePoints: Howl;
    femaleCount: Howl;
    quickRiser: Howl;
    snareGreen: Howl,
    doubleScore: Howl
}

export type GameState = {
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  paddleLeftY: number;
  paddleRightY: number;
  scoreRight: number;
  scoreLeft: number;
}

export type Keys = {
  w: boolean;
  s: boolean;
  i: boolean;
  k: boolean;
}

export type BallColorProperties = {
  [key: string]: {
    speedX: number;
    speedY: number;
    onBounce?: (gameState: GameState, leftOrRight: string, gameId: GameElements) => void;
    onScore?: (gameState: GameState, leftOrRight: string) => void;
    sound?: (gameSounds: GameSounds) => void;
  }
}
