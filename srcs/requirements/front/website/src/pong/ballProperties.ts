import { BallColorProperties, GameState, GameElements } from './types';
import { gameSounds } from './utils/audio';

export const ballProperties: BallColorProperties = {
    white: { // ball par defaut sans pouvoir
        speedX: 9,
        speedY: 5,
        onBounce: (gameState: GameState, _leftOrRight: string, _gameId: GameElements) => {
            const dirX = Math.sign(gameState.ballSpeedX || 1);
            const dirY = Math.sign(gameState.ballSpeedY || 1);
            gameState.ballSpeedX = 9 * dirX;
            gameState.ballSpeedY = 5 * dirY;
            // console.log("bounce balle blanche")
        },
        onScore: (gameState, leftOrRight) => {
            if (leftOrRight === "left") gameState.scoreLeft++;
            else if (leftOrRight === "right") gameState.scoreRight++;
        },
        sound: (gameSounds) =>   { 
            gameSounds?.whiteBall.play()}
    },
    red: { //balle avec effet smash vitesse horizontal augmente
        speedX: 9,
        speedY: 5,
        onBounce: (gameState: GameState, leftOrRight: string, gameId: GameElements) => {
            const originalColor = "white";
            const dirX = Math.sign(gameState.ballSpeedX || 1);
            const dirY = Math.sign(gameState.ballSpeedY || 1);
            const boostedSpeed = 14 * dirX;//fixed speed
            gameState.ballSpeedX = boostedSpeed;
            gameState.ballSpeedY =  5 * dirY;
            if (leftOrRight === "left") {
                gameId.paddleLeft.style.backgroundColor = "yellow";
                setTimeout(() => {
                    gameId.paddleLeft.style.backgroundColor = originalColor;
                }, 100)
            }
            if (leftOrRight === "right") {
                gameId.paddleRight.style.backgroundColor = "yellow";
                setTimeout(() => {
                    gameId.paddleRight.style.backgroundColor = originalColor;
                }, 100)
            }
        }, 
        onScore: (gameState: GameState, leftOrRight: string) => {
            if (leftOrRight === "left") gameState.scoreLeft++;
            else if (leftOrRight === "right") gameState.scoreRight++;
        },
        sound: (gameSounds) => {
            gameSounds.smashBall.play()
        }
    },
    green: { //balle avec effet zigzag vitesse vertical augmente
        speedX: 9,
        speedY: 5,
        onBounce: (gameState: GameState, _leftOrRight: string, _gameId: GameElements) => {
            const dirY = Math.sign(gameState.ballSpeedY);
            const dirX = Math.sign(gameState.ballSpeedX);
            gameState.ballSpeedY = 10 * dirY; 
            gameState.ballSpeedX = 9 * dirX; 
        },
        onScore: (gameState: GameState, leftOrRight: string) => {
            if (leftOrRight === "left") gameState.scoreLeft++;
            else if (leftOrRight === "right") gameState.scoreRight++;
        },
        sound: (gameSounds) => {
            gameSounds.quickRiser.play();
        }
    },
    blue: { //balle avec double points sur le score et garde les pouvoirs des anciennes balles
        speedX: 9,
        speedY: 5,
        onBounce: (_gameState: GameState, _leftOrRight: string, _gameId: GameElements) => {

        },
        onScore: (gameState: GameState, leftOrRight: string) => {
            if (leftOrRight === "left") {
                gameState.scoreLeft += 2;
            }
            else if (leftOrRight === "right"){
                gameState.scoreRight += 2;
            }
            gameSounds.doubleScore.play();
        },
        sound: (gameSounds) => {
            gameSounds.doublePoints.play();
        }
    }
}

