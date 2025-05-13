export const GAME_HEIGHT = 400;
export const GAME_WIDTH = 800;
export const BALL_SIZE = 20;
export const PADDLE_HEIGHT = 80;
export const PADDLE_WIDTH = 10;
export let PADDLE_SPEED = 8;
export const MARGIN = 10;
export let WIN_SCORE = 10;

export function setWinningScore(score: number): void {
    WIN_SCORE = score;
}

export function setPaddleSpeed(speed: number): void {
    PADDLE_SPEED = 8 * speed;
}
