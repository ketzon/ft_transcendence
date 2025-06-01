import { GameElements } from '../types';
import { ballProperties } from '../ballProperties';
import { isBasic, isScoring, gameState, isResetting, colorChangeTimer, pause } from '../core/gamestate';
import { setIsResetting, setIsScoring, setColorChangeTimer } from '../core/gamestate';
import { applySoundEffect } from '../utils/audio';
import { GAME_HEIGHT, GAME_WIDTH, BALL_SIZE, MARGIN, PADDLE_WIDTH, PADDLE_HEIGHT } from '../utils/constants';
import { gameSounds, mute } from '../utils/audio';


export function updateBall(gameId: GameElements): void {
    let ballColors: string = gameId.ball.style.backgroundColor;
    
    // fait bouger la balle
    gameState.ballX += gameState.ballSpeedX; //default 9
    gameState.ballY += gameState.ballSpeedY; //default 5
    
    // rebond haut et bas du terrain
    if (gameState.ballY <= 0 || gameState.ballY >= GAME_HEIGHT - BALL_SIZE) {
        gameState.ballSpeedY = -gameState.ballSpeedY;
        if (gameState.ballY <= 0) { //fix pour debloquer balle
            gameState.ballY = 1;
        } else {
            gameState.ballY = GAME_HEIGHT - BALL_SIZE - 1;
        }
    }
    if (gameState.ballX <= MARGIN + PADDLE_WIDTH &&
        gameState.ballY + BALL_SIZE >= gameState.paddleLeftY &&
        gameState.ballY <= gameState.paddleLeftY + PADDLE_HEIGHT) {
        
        // recupere position du rebond 
        const hitPosition = (gameState.ballY + BALL_SIZE/2 - gameState.paddleLeftY) / PADDLE_HEIGHT;
        //utilise la position du rebond pour faire un effet sur langles de -5 a 5
        const verticalInfluence = (hitPosition - 0.5) * 10;
        // applique les effet de ballProperties
        ballColors = applyColorEffect(gameId, "left", "bounce");
        // inverse la directoin horizontal pour juste faire un rebond
        gameState.ballSpeedX = -gameState.ballSpeedX;
        // applique leffet vertical pour un gameplay moin lineaire
        gameState.ballSpeedY += verticalInfluence;
        // ajoute un effet random sur la verticalite (a voir si je garimport * as utils from './utils.js';des)
        gameState.ballSpeedY += (Math.random() - 0.5) * 2;
        
        // limite sur l'angle vertical
        if (Math.abs(gameState.ballSpeedY) > 10) {
            if (gameId.ball.style.backgroundColor !== "green") {
            gameState.ballSpeedY = Math.sign(gameState.ballSpeedY) * 10;
            }
        }
        // oblige un minimum de verticalite
        if (Math.abs(gameState.ballSpeedY) < 1) {
            gameState.ballSpeedY = Math.sign(gameState.ballSpeedY) || 1;
        }
        gameState.ballX = MARGIN + PADDLE_WIDTH + 1;
        applySoundEffect(ballColors);
    }
    if (gameState.ballX + BALL_SIZE >= GAME_WIDTH - MARGIN - PADDLE_WIDTH &&
        gameState.ballY + BALL_SIZE >= gameState.paddleRightY &&
        gameState.ballY <= gameState.paddleRightY + PADDLE_HEIGHT) {
        
        const hitPosition = (gameState.ballY + BALL_SIZE/2 - gameState.paddleRightY) / PADDLE_HEIGHT;
        const verticalInfluence = (hitPosition - 0.5) * 10;
        
        ballColors = applyColorEffect(gameId, "right", "bounce");
        gameState.ballSpeedX = -gameState.ballSpeedX;
        gameState.ballSpeedY += verticalInfluence;
        gameState.ballSpeedY += (Math.random() - 0.5) * 2;
        if (Math.abs(gameState.ballSpeedY) > 10) {
            if (gameId.ball.style.backgroundColor !== "green") {
            gameState.ballSpeedY = Math.sign(gameState.ballSpeedY) * 10;
            }
        }
        if (Math.abs(gameState.ballSpeedY) < 1) {
            gameState.ballSpeedY = Math.sign(gameState.ballSpeedY) || 1;
        }
        gameState.ballX = GAME_WIDTH - MARGIN - PADDLE_WIDTH - BALL_SIZE - 1;
        applySoundEffect(ballColors);
    }
    if (gameId.ball) {
        gameId.ball.style.left = `${gameState.ballX}px`;
        gameId.ball.style.top = `${gameState.ballY}px`;
    }
    //--------------------------DEBUG--------------------------------------
    // console.log(`la vitesse de la balle ${ballColors} en Y: ${gameState.ballSpeedY}`);
    // console.log(`la vitesse de la balle ${ballColors} en X: ${gameState.ballSpeedX}`);
    //--------------------------DEBUG--------------------------------------
    if (gameState.ballX < 0) {
        if (!isScoring) {
            gameId.ball.style.backgroundColor = "white";
            setIsScoring(true);
            if (isBasic) {
                gameState.scoreRight++;
            } else {
                applyColorEffect(gameId, "right", "score");
            }
            setTimeout(() => { setIsScoring(false); }, 500);
        }
        resetBall(gameId);
    }
    if (gameState.ballX + BALL_SIZE > GAME_WIDTH) {
        if (!isScoring) {
            gameId.ball.style.backgroundColor = "white";
            setIsScoring(true);
            if (isBasic) {
                gameState.scoreLeft++;
            } else {
                applyColorEffect(gameId, "left", "score");
            }
            setTimeout(() => { setIsScoring(false); }, 500);
        }
        resetBall(gameId);
    }
}

//recentre la balle avec un delais init le score et renvoie la balle
export function resetBall(gameId: GameElements):void {
    if (isResetting) return ;
    setIsResetting(true);
    //remet la balle au centre sans ms
    gameState.ballSpeedX = 0;
    gameState.ballSpeedY = 0;
    gameState.ballX = GAME_WIDTH / 2 - BALL_SIZE / 2;
    gameState.ballY = GAME_HEIGHT / 2 - BALL_SIZE / 2;
    if (gameId.scoreRight) {
        gameId.scoreRight.textContent = `${gameState.scoreRight}`;
    }
    if (gameId.scoreLeft) {
        gameId.scoreLeft.textContent = `${gameState.scoreLeft}`;
    }
    if (gameId.ball){
        gameId.ball.style.left = `${gameState.ballX}px`;
        gameId.ball.style.top = `${gameState.ballY}px`;
    }
    setTimeout(() => {
        const baseSpeed = 7 + Math.random() * 4;
        const angle = (Math.random() * Math.PI / 2) - Math.PI / 4;
        const direction = Math.random() > 0.5 ? 1 : -1;
        gameState.ballSpeedX = baseSpeed * direction * Math.cos(angle);
        gameState.ballSpeedY = baseSpeed * Math.sin(angle);
        setIsResetting(false);
        if (!pause && !isBasic) {
            autoChangeColor(gameId);
        }
    }, 1000);
}


//function recursive call entre 5/10sec via autoChangeColor avec le mode features
export function changeBall(gameId: GameElements): void {
    if (!isBasic) { 
      let temp:string = gameId.ball.style.backgroundColor;
    if (!temp) {
        temp = "white";
    }
    const colors:string[] = ["green", "red", "blue", "white"];
    let randomColor:string = colors[Math.floor(Math.random() * colors.length)];
    while (randomColor === temp) {
        randomColor = colors[Math.floor(Math.random() * colors.length)];
    }
    gameId.ball.style.backgroundColor = randomColor;
    if (!mute && ballProperties[randomColor].sound) {
        ballProperties[randomColor].sound(gameSounds);
    }
  }
}

// applique les effet d'une couleur 
export function applyColorEffect(gameId: GameElements, leftOrRight:string, status:string): string {
    if (isBasic === true) return "default" 
    let colors:string = gameId.ball.style.backgroundColor || "white";
    if (status === "bounce" && ballProperties[colors].onBounce){
        ballProperties[colors].onBounce(gameState, leftOrRight, gameId);
    }
    if (status === "score" && ballProperties[colors].onScore) {
        ballProperties[colors].onScore(gameState, leftOrRight);
    }
    return colors;
}

//boucle principale du mode features, call changeBall pour les couleur
export function autoChangeColor(gameId: GameElements): void {
    if (pause)  return;
    if (colorChangeTimer !== undefined) {
        clearTimeout(colorChangeTimer);
        // colorChangeTimer = undefined;
        setColorChangeTimer(undefined);
    }
    const delay = Math.floor(Math.random() * 5000) + 5000; // 5s a 10s
    console.log(`changement de couleur dans ${delay/1000} secondes`) //pour debug
    const startTime = Date.now(); //pour debug
    setColorChangeTimer(window.setTimeout(() => {
        const actualDelay = (Date.now() - startTime) / 1000; //pour debug
        console.log(`changement de couleur effectuer apres ${actualDelay} secondes`) //pour debug
    if (pause === false) {
        changeBall(gameId);
        autoChangeColor(gameId);
         }
    }, delay));
}
