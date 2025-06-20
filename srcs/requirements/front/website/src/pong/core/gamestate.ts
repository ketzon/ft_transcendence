import { GameState, Keys } from '../types';
import { WIN_SCORE } from '../utils/constants';

// variable state game
export let isBasic: boolean = true;
export let pause: boolean = true;
export let isResetting: boolean = false;
export let isScoring: boolean = false;
export let colorChangeTimer: number | undefined;
export let animationFrameId: number = -1;
export let tournamentMode: boolean = false;
export let isLooping: boolean = false;


export function setTournamentMode(value: boolean): void {
  tournamentMode = value;
}

export function setIsResetting(value: boolean): void {
  isResetting = value;
}

export function setPause(value: boolean): void {
  pause = value;
}

export function setIsScoring(value: boolean): void {
  isScoring = value;
}

export function setColorChangeTimer(value: number | undefined): void {
    colorChangeTimer = value;
}

export function setIsBasic(value: boolean): void {
    isBasic = value;
    console.log(`mode feature: ${isBasic}`)
}

export function setAnimationFrameId(value: number) {
    animationFrameId = value;
}

export function setIsLooping(value: boolean): void {
    isLooping = value;
}

//touche du jeu
export let keys: Keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

// game state
export let gameState: GameState = {
    ballX: 390,
    ballY: 190,
    ballSpeedX: 9,
    ballSpeedY: 5,
    paddleLeftY: 160,
    paddleRightY: 160,
    scoreRight: 0,
    scoreLeft: 0,
    player1Id: null
};

// config touches
export function setupKeyPress(): void {
    window.addEventListener("keydown", (event) => {
        if (event.key in keys) {
            keys[event.key as keyof Keys] = true;
        }
    });
    window.addEventListener("keyup", (event) => {
        if (event.key in keys) {
            keys[event.key as keyof Keys] = false;
        }
    });
}

// reset game
export function resetGameState(): void {
    gameState.scoreRight = 0;
    gameState.scoreLeft = 0;
    gameState.paddleRightY = 160;
    gameState.paddleLeftY = 160;
    pause = true;
    isBasic = true;
}

export let tournamentResults: { player1: string, player2: string, winner: string, score1: number, score2: number }[] = [];

export function resetTournamentResults(): void {
  tournamentResults = [];
}