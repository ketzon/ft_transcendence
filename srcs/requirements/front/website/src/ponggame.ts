import confetti from "canvas-confetti";
import  { Howl }  from "howler";

//---------------------MAIN-GAME-------------------------------//

type GameElements = {
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
    ballColor: HTMLElement;
    basicButton: HTMLElement;
}

type GameSounds = {
    smashBall: Howl;
    whiteBall: Howl;
    featuresMode: Howl;
    defaultMode: Howl;
    victorySound: Howl;
    paddleSound: Howl;
    smashSound: Howl;
    doublePoints: Howl;
}
// Utiliser les types définis

function getElements() {
    const gameId = {
        gameContainer: document.getElementById("game-container")as HTMLElement,
        gameBoard: document.getElementById("game-board")as HTMLElement,
        ball: document.getElementById("ball")as HTMLElement,
        paddleLeft: document.getElementById("paddle-left")as HTMLElement,
        paddleRight: document.getElementById("paddle-right")as HTMLElement,
        scoreLeft: document.getElementById("score-left")as HTMLElement,
        scoreRight: document.getElementById("score-right")as HTMLElement,
        pauseGame: document.getElementById("button-pause") as HTMLElement,
        resetGame: document.getElementById("button-reset")as HTMLElement,
        winnerMsg: document.getElementById("winner-message") as HTMLElement,
        ballColor: document.getElementById("button-ball") as HTMLElement,
        basicButton: document.getElementById("button-basic") as HTMLElement,
    }
    return gameId;
}

//sounds with howler.js
function initSounds(): GameSounds {
    const smashBall = new Howl({
     src: ["../sounds/sonic-boom.mp3"],
     volume: 0.5
    });

    const whiteBall = new Howl({
     src: ["../sounds/gated-drop.mp3"],
     volume: 0.5
    });

    const featuresMode = new Howl({
     src: ["../sounds/features-mode-robot.mp3"],
     volume: 0.5
    });

    const defaultMode = new Howl({
        src: ["../sounds/default_mode_robot.mp3"],
        volume: 0.5
    });

    const victorySound = new Howl({
     src: ["../sounds/victory.mp3"],
     volume: 0.4
    });

    const paddleSound = new Howl({
        src: ["../sounds/bubble-pop.mp3"],
        volume: 0.6
    });

    const smashSound = new Howl({
        src: ["../sounds/explo.mp3"],
        volume: 1.0
    });

    const doublePoints = new Howl({
     src: ["../sounds/doublexp_zombie.mp3"],
     volume: 0.1
    });
    return {
        smashBall,
        whiteBall,
        featuresMode,
        defaultMode,
        victorySound,
        paddleSound,
        smashSound,
        doublePoints
    };
}


//variable globale avec valeur default const
const gameHeight:number = 400; //valeur de base
const gameWidth:number = 800; //valeur de base
const ballSize:number = 20; //valeur de base 20
const paddleHeight:number = 80;
const paddleWidth:number = 10;
const paddleSpeed:number = 8;
const margin:number = 10;
const winScore:number = 5;

//game status variable
let isBasic:boolean = true;
let pause:boolean = true;
let isResetting:boolean = false; //pour ne pas overlap sur une loop pendant un reset
let colorChangeTimer:number | undefined; // id de setTimeout pour le cancel avec clearTimeout
let gameSounds: GameSounds
let gameId: GameElements 
let animationFrameId:number = -1;

type GameState = {
    ballX:number;
    ballY:number;
    ballSpeedX:number;
    ballSpeedY:number;
    paddleLeftY:number;
    paddleRightY:number;
    scoreRight:number;
    scoreLeft:number;
}

type Keys = {
    w:boolean;
    s:boolean;
    ArrowUp:boolean;
    ArrowDown:boolean;
}

//setup tout sur false
let keys: Keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
}

//init les valeurs avec pong de base
let gameState: GameState = {
    ballX:  390, //la moitie de la balle = 10 et moitie de laxe x = 400. 400 -10 = 390
    ballY: 190, // moitie de la balle - axe y (400 / 2) = 190
    ballSpeedX: 5,
    ballSpeedY:  2,
    paddleLeftY: 160,
    paddleRightY: 160,
    scoreRight: 0,
    scoreLeft: 0
}

//analyse un event clavier et check avec in si la bonne touch est press
function setupKeyPress(): void {
    window.addEventListener("keydown", (event) => {
        console.log("listen key: ", event.key);
        if (event.key in keys) {
            keys[event.key as keyof Keys] = true; //keyof pas necessaire si init direct keys en const a la place de type
        }
    })
    window.addEventListener("keyup", (event) => {
        if (event.key in keys) {
            keys[event.key as keyof Keys] = false;
        }
    })
}

//reduit les valeur de paddle si je monte et augmente pour descendre pour ensuite maligner visuellement avec top, plus le chiffre est faible plus je suis haut et inversement
function updatePaddles(gameId: GameElements): void {
    if (keys.w && gameState.paddleLeftY > 0) {
        gameState.paddleLeftY -= paddleSpeed;
    }
    if (keys.s && gameState.paddleLeftY < gameHeight - paddleHeight) {
        gameState.paddleLeftY += paddleSpeed;
    }
    if (keys.ArrowUp && gameState.paddleRightY > 0) {
        gameState.paddleRightY -= paddleSpeed;
    }
    if (keys.ArrowDown && gameState.paddleRightY < gameHeight - paddleHeight) {
        gameState.paddleRightY += paddleSpeed;
    }
    if (gameId.paddleLeft) {
        gameId.paddleLeft.style.top = `${gameState.paddleLeftY}px`;
    }
    if (gameId.paddleRight) {
        gameId.paddleRight.style.top = `${gameState.paddleRightY}px`;
    }
}

function resetPaddles(gameId: GameElements):void {
    if (gameId.paddleLeft) {
        gameId.paddleLeft.style.top = `${160}px`;
    }
    if (gameId.paddleRight) {
        gameId.paddleRight.style.top = `${160}px`;
    }
}

function resetScore(gameId: GameElements):void {
    if (gameId.scoreLeft || gameId.scoreLeft) {
        gameId.scoreLeft.textContent = '0';
        gameId.scoreRight.textContent = '0';
    }
}

//recentre la balle avec un delais init le score et renvoie la balle
function resetBall(gameId: GameElements):void {
    if (isResetting) return ;
    isResetting = true; //pour eviter datarace sur le mouvement de la balle
    //remet la balle au centre sans ms
    gameState.ballSpeedX = 0;
    gameState.ballSpeedY = 0;
    gameState.ballX = gameWidth / 2 - ballSize / 2;
    gameState.ballY = gameHeight / 2 - ballSize / 2;
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
    //envoie la balle en position random positif ou negatif (opti plus de combi)
    //pause de 1 sec pour pas trop enchainer
    setTimeout(() => {
        gameState.ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
        gameState.ballSpeedY = 2 * (Math.random() > 0.5 ? 1 : -1);
        isResetting = false;
    }, 1000)
}

function applyColorEffect(gameId: GameElements, leftOrRight:string, status:string): string {
    if (isBasic === false) {
    const originalColor = "white";
    let colors:string = gameId.ball.style.backgroundColor;
     if (colors === "blue" && status === "score") {
        if (leftOrRight === "left") {
             gameState.scoreLeft++;
        }
        else if (leftOrRight === "right") {
            gameState.scoreRight++;
        }
     }
     if (colors === "red" && status === "bounce") {
         const dirX = Math.sign(gameState.ballSpeedX || 1);
         const boostedSpeed = 14 * dirX;
         gameState.ballSpeedX = boostedSpeed;
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
      }
      return colors;
    }
    return "default";
}

function applySoundEffect(colors:string):void {
    if (colors === "red") {
        gameSounds?.smashSound.play();
    }
    else {
        gameSounds?.paddleSound.play();
    }
}


function updateBall(gameId: GameElements): void {
    let ballColors:string = gameId.ball.style.backgroundColor;
    gameState.ballX += gameState.ballSpeedX;
    gameState.ballY += gameState.ballSpeedY;
    if (gameState.ballY <= 0 || gameState.ballY >= gameHeight - ballSize){
        gameState.ballSpeedY = -gameState.ballSpeedY;
    }
    //je bounce uniquement a hauteur de paddle && en bas du haut du paddle et au dessus du bas du paddle gauche
    if (gameState.ballX <= margin + paddleWidth &&
        gameState.ballY + ballSize >= gameState.paddleLeftY &&
        gameState.ballY <= gameState.paddleLeftY + paddleHeight) { //pour rebondir a gauche
        ballColors = applyColorEffect(gameId,"left", "bounce");
        gameState.ballSpeedX = -gameState.ballSpeedX;
        gameState.ballX = margin + paddleWidth + 1; //decale de 1pixel pour eviter paddle block
        applySoundEffect(ballColors);
    }
    //bounce a distante de margin + paddle et uniquement sur paddle droite
    if (gameState.ballX + ballSize >= gameWidth - margin - paddleWidth &&
        gameState.ballY + ballSize >= gameState.paddleRightY &&
        gameState.ballY <= gameState.paddleRightY + paddleHeight) {
        ballColors = applyColorEffect(gameId,"right", "bounce");
        gameState.ballSpeedX = -gameState.ballSpeedX;
        gameState.ballX = gameWidth - margin - paddleWidth - ballSize - 1; //decale de 1 pixel pour eviter bug paddle block
        applySoundEffect(ballColors);
    }
    if (gameId.ball){
        gameId.ball.style.left = `${gameState.ballX}px`;
        gameId.ball.style.top = `${gameState.ballY}px`;
    }
    if (gameState.ballX < 0) {
        applyColorEffect(gameId,"right", "score");
        gameState.scoreRight++;
        resetBall(gameId);
    }
    if (gameState.ballX + ballSize > gameWidth){
        applyColorEffect(gameId,"left", "score");
        gameState.scoreLeft++;
        resetBall(gameId);
    }
}

//change le status de pause
function changePause(gameId: GameElements): void{
    pause = !pause; //change de true a false et inversement
    if (gameId.pauseGame) {
        if (pause === true) {
         gameId.pauseGame.textContent = "start";
         clearTimeout(colorChangeTimer);
         colorChangeTimer = undefined;
        }
        if (pause === false) {
         gameId.pauseGame.textContent = "pause";
         autoChangeColor(gameId);
        }
    }
}

//reset le jeu
function resetGame(gameId: GameElements): void {
    gameState.scoreRight = 0
    gameState.scoreLeft = 0
    gameState.paddleRightY = 160;
    gameState.paddleLeftY = 160;
    resetBall(gameId);
    resetPaddles(gameId);
    resetScore(gameId);
}

function changeBall(gameId: GameElements): void {
  if (!isBasic) {
    const temp:string = gameId.ball.style.backgroundColor;
    const colors:string[] = ["red", "blue", "white", "green"];
    let randomColor:string = colors[Math.floor(Math.random() * colors.length)];
    while (randomColor === temp) {
        randomColor = colors[Math.floor(Math.random() * colors.length)];
    }
    if (temp === "red" && randomColor !== "red") {
      const dirX:number = Math.sign(gameState.ballSpeedX) || 1;
      const dirY:number = Math.sign(gameState.ballSpeedY) || 1;
      const currentRatio:number = Math.abs(gameState.ballSpeedY / gameState.ballSpeedX);
      if (randomColor === "blue") {
        gameState.ballSpeedX = 6 * dirX;
        gameState.ballSpeedY = 6 * currentRatio * dirY;
      } else if (randomColor === "white") {
        gameState.ballSpeedX = 5 * dirX;
        gameState.ballSpeedY = 5 * currentRatio * dirY;
    }
    }
    gameId.ball.style.backgroundColor = randomColor;
    if (randomColor === "blue") {
      gameSounds?.doublePoints.play();
    }
    else if (randomColor === "red") {
      gameSounds?.smashBall.play();
    }
    else if (randomColor === "white") {
      gameSounds?.whiteBall.play();
    }
    else if (randomColor === "green") {
        gameSounds?.whiteBall.play();
    }
  }
}


function setBasicMode(gameId: GameElements):void {
    if (isBasic === false) {
       isBasic = true;
       gameSounds?.defaultMode.play();
       gameId.basicButton.textContent = "features-mode";
       gameId.ball.style.backgroundColor = "white";
    }
    else {
       isBasic = false;
       gameSounds?.featuresMode.play();
        gameId.basicButton.textContent = "default-mode";
    }
}

//ecoute bouton

function listenStatus(gameId: GameElements): void {
    if (gameId.pauseGame) {
        gameId.pauseGame.addEventListener("click", () =>  changePause(gameId));
    }
    if (gameId.resetGame) {
        gameId.resetGame.addEventListener("click", () => resetGame(gameId));
    }
    if (gameId.ballColor) {
        gameId.ballColor.addEventListener("click", () => changeBall(gameId));
    }
    if (gameId.basicButton) {
        gameId.basicButton.addEventListener("click", () => setBasicMode(gameId));
    }
}

function changeWinnerMsg(gameId: GameElements, winnerName:string) : void {
    if (gameId.winnerMsg) {
        if (winnerName) {
         setTimeout(() => {
            gameId.winnerMsg.textContent = `Reach ${winScore} point(s) to claim victory!🏆`;
         }, 3000);
        gameId.winnerMsg.textContent = `Victory goes to ${winnerName}! 👑🥳`;
        resetGame(gameId);
        gameId.pauseGame.textContent = "start";
        }
    }
}

function checkWinner(gameId: GameElements): void {
    if (gameState.scoreLeft >= winScore) {
        confetti();
        pause = true;
        gameSounds?.victorySound.play();
        changeWinnerMsg(gameId,"player1");
    } else if (gameState.scoreRight >= winScore) {
        confetti();
        pause = true;
        gameSounds?.victorySound.play();
        changeWinnerMsg(gameId,"player2");
    }
}

function autoChangeColor(gameId: GameElements): void {
    if (pause)return;

    const delay = Math.floor(Math.random() * 5000) + 5000; // 5s a 10s
    colorChangeTimer = window.setTimeout(() => {
    if (pause === false) {
        changeBall(gameId);
        autoChangeColor(gameId);
         }
    }, delay);
}
//-----------------------MAIN-GAME------------------------------//

//main loop
function gameLoop(gameId: GameElements): void {
    if (pause === false) {
        updatePaddles(gameId)
        updateBall(gameId);
    }
    checkWinner(gameId); 
    animationFrameId = requestAnimationFrame(() => gameLoop(gameId)); 
}

//reset game si leave PongView
export function stopPong(): void {
    pause = true;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = -1;
    gameId = getElements();
    resetGame(gameId);
}

export function initPong(): void {
    setupKeyPress();
    if (animationFrameId !== -1) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = -1;
    }
    gameId = getElements();
    gameId.winnerMsg.textContent = `Reach ${winScore} point(s) to claim victory!🏆`;
    listenStatus(gameId);
    if (!gameSounds) {
        gameSounds = initSounds();
    }
    animationFrameId = requestAnimationFrame(() => gameLoop(gameId));
}
