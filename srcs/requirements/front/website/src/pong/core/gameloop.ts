// import confetti from "canvas-confetti";
import { GameElements } from '../types';
import { updatePaddles } from '../components/paddle';
import { updateBall, resetBall, autoChangeColor } from '../components/ball';
import { checkWinner } from '../components/score';
import { WIN_SCORE } from '../utils/constants';
import { resetScore } from '../components/score';
import { resetPaddles } from '../components/paddle';
import { getElements } from '../components/elements';
import { setupKeyPress, gameState, pause, isBasic, isResetting, animationFrameId, tournamentMode, colorChangeTimer, setColorChangeTimer, setIsBasic, setPause, setAnimationFrameId, setTournamentMode, } from './gamestate';
import { setGameSounds, resetAllsounds, initSounds, gameSounds, stopAllAudio, mute} from '../utils/audio';
import { listenStatus } from '../events';
import { changingArea } from "../../router";
import { gameSettingsView, initGameSettings } from "../../pongCustomization";
import { bracketView } from '../../views/bracket';
import { BracketElements, getBracketElements, showBracket, player1, player2, player3, player4 } from  "../../selectgames"
import { settingsView } from '../../views/settings';
import { winnerView } from '../../views/winner';
// import { player1, player2, player3, player4 } from '../../selectgames';

//main loop
export function gameLoop(gameId: GameElements): void {
    if (pause === false) {
        updatePaddles(gameId)
        updateBall(gameId);
    }
    if (mute) {
        stopAllAudio();
    }
    checkWinner(gameId);
    console.log("dans game loop");
    setAnimationFrameId(requestAnimationFrame(() => gameLoop(gameId)));
}

function updateUi(gameId: GameElements) : void {
    gameId.winnerMsg.textContent = `Reach ${WIN_SCORE} point(s) to claim victory!🏆`;
    console.log("dans update ui")
    if(isBasic === false) {
        gameId.basicButton.textContent = "default-mode";
    }
    if (!tournamentMode) {
        console.log("tournament mode off")
        gameId.player1.textContent = localStorage.getItem('nickname');
        gameId.player2.textContent = localStorage.getItem('Player2');
    }
    if(tournamentMode){
        console.log("tournament mode on")
        const tournamentPlayers = JSON.parse(localStorage.getItem("tournamentPlayers") || "[]");
        console.log(tournamentPlayers);
        console.log(stage);
        switch (stage){
            case 0:
                gameId.player1.textContent = player1;
                gameId.player2.textContent = player2; 
                break;
            case 1:
                gameId.player1.textContent = player3;
                gameId.player2.textContent = player4;
                break;
            case 2:
                gameId.player1.textContent = qualifiedPlayer.stage1
                gameId.player2.textContent = qualifiedPlayer.stage2
                break;
        }
    }
}


export function initPong(): void {
    setupKeyPress();
    if (animationFrameId !== -1) {
        cancelAnimationFrame(animationFrameId);
        setAnimationFrameId(-1);
    }
    let gameId = getElements();
    updateUi(gameId);
    listenStatus(gameId);
    if (!gameSounds) {
        setGameSounds(initSounds());
    }
    setAnimationFrameId(requestAnimationFrame(() => gameLoop(gameId)));
}

//reset game si leave PongView
export function stopPong(): void {
    if (animationFrameId !== -1) {
        cancelAnimationFrame(animationFrameId);
        setAnimationFrameId(-1);
    }
    let gameId = getElements();
    setIsBasic(true);
    resetGame(gameId);
}

export function setMode(status:boolean): void {
    setIsBasic(status);
}

//change le status de pause
export function changePause(gameId: GameElements): void{
    setPause(!pause);
    if (gameId.pauseGame) {
        if (pause === true) {
         gameId.pauseGame.textContent = "start";
         clearTimeout(colorChangeTimer);
         setColorChangeTimer(undefined);
        }
        if (pause === false) {
         gameId.pauseGame.textContent = "pause";
         autoChangeColor(gameId); //start la boucle principale pour le mode features
        }
    }
}


export const pongScore = {
    tempRight: 0,
    tempLeft: 0
}

let bracketId: BracketElements;

export let stage:number = 0;
export function setStage(value: number): void {
    stage = value
}

function checkTournament(): void {
    console.log("je suis bien dans check tournament")
    if (tournamentMode) {
        if(pongScore.tempLeft >= WIN_SCORE || pongScore.tempRight >= WIN_SCORE){
            showBracket();
            bracketId = getBracketElements();
            if (pongScore.tempLeft >= WIN_SCORE) {
                getWinner("left", stage);
            } else if (pongScore.tempRight >= WIN_SCORE)  {
                getWinner("right", stage);
            }
            stage++;
            console.log(`je suis stage ${stage}`)
        }
    }
}

export const qualifiedPlayer = {
    stage1: "",
    stage2: "",
    winner: "",
}

function updateStage1(winner:string): void {
    qualifiedPlayer.stage1 = winner;
    bracketId.finalist1Name.textContent = winner;
    document.getElementById('match-title')!.textContent = `${player3} vs ${player4}`
    const stage1 = document.getElementById('match1-bg');
    if (stage1) {
        stage1.classList.remove("bg-green-200");
        stage1.classList.add("bg-white");
    }
    const stage2 = document.getElementById('match2-bg');
    if (stage2) {
        stage2.classList.remove("bg-white");
        stage2.classList.add("bg-green-200");
    }
}

function updateStage2(winner:string): void {
    qualifiedPlayer.stage2 = winner;
    bracketId.finalist1Name.textContent = qualifiedPlayer.stage1
    bracketId.finalist2Name.textContent = winner;
    document.getElementById('match-title')!.textContent = `${qualifiedPlayer.stage1} vs ${qualifiedPlayer.stage2}`
    const stage1 = document.getElementById('match1-bg');
    if (stage1) {
        stage1.classList.remove("bg-green-200");
        stage1.classList.add("bg-white");
    }
    const stage3 = document.getElementById('match3-bg');
    if (stage3) {
        stage3.classList.remove("bg-white");
        stage3.classList.add("bg-green-200");
    }
}

function updateFinal(winner: string): void {
    document.getElementById('match-title')!.textContent = "";
    qualifiedPlayer.winner = winner;
    stopPong();
    displayWinner(winner);

}

type WinnerElements = {
    tournamentWinner: HTMLElement
    leaveButton: HTMLElement
    tournamentBackground: HTMLElement
}

export function getWinnerElements(): WinnerElements {
    return {
        tournamentBackground: document.getElementById("tournament-victory-background") as HTMLElement,
        tournamentWinner: document.getElementById("tournament-winner") as HTMLElement,
        leaveButton: document.getElementById("leave-pong-button") as HTMLElement,
    };
}


function displayWinner(winner:string): void {
    if(changingArea){
        changingArea.innerHTML = winnerView();
        let gameWinnerId = getWinnerElements();
        gameWinnerId.tournamentWinner.textContent = winner;
        gameWinnerId.leaveButton.addEventListener("click", () => {
            changingArea!.innerHTML = gameSettingsView();
            initGameSettings();
        })

    }
}

function getWinner(pos:string, stage:number):  void {
    switch (stage) {
        case 0:
            if(pos === "left"){
                updateStage1(player1);
        } else if(pos === "right") {
                updateStage1(player2);
        }
            break;
        case 1:
            if (pos === "left") {
            updateStage2(player3);
        }else if(pos === "right") {
            updateStage2(player4);
        }
            break;
        case 2:
            if (pos === "left") {
            updateFinal(qualifiedPlayer.stage1);
        }else if(pos === "right") {
            updateFinal(qualifiedPlayer.stage2);
        }
            break;
    }
}



//reset le jeu
export function resetGame(gameId: GameElements): void {
    if (colorChangeTimer !== undefined) {
        clearTimeout(colorChangeTimer);
        setColorChangeTimer(undefined);
    }
    pongScore.tempLeft = gameState.scoreLeft;
    pongScore.tempRight = gameState.scoreRight;
    gameState.scoreRight = 0
    gameState.scoreLeft = 0
    gameState.paddleRightY = 160;
    gameState.paddleLeftY = 160;
    resetBall(gameId);
    resetPaddles(gameId);
    resetScore(gameId);
    resetAllsounds();
    if (gameId.basicButton === null) return; //fix temporaire
    gameId.basicButton.textContent = "features-mode";
    gameId.ball.style.backgroundColor = "white";
    setPause(true);
    gameId.pauseGame.textContent = "start";
    console.log("avant check tournament");
    checkTournament();
}

export function setBasicMode(gameId: GameElements):void {
    if (isBasic !== null) {
        if (isBasic === false) {
            setIsBasic(true);
            if (!isResetting) {
                gameSounds?.defaultMode.play();
            }
            gameId.basicButton.textContent = "features-mode";
            gameId.ball.style.backgroundColor = "white";
        }
        else {
            setIsBasic(false);
            if (!isResetting) {
                gameSounds?.featuresMode.play();
            }
            gameId.basicButton.textContent = "default-mode";
        }
    }
}

