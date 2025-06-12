import { Figther } from "./classes/FigtherClass";
import { clearTimer } from "./cleanUp";
import { stopVersusGame } from "./cleanUp";
import { roundEnded, setRoundEnded } from "./constants";

export let stopGameTimeoutId: number | undefined;

export function resetGameTimeoutId():void {
    stopGameTimeoutId = undefined;
}

export function determineWinner({player, enemy}: {player : Figther, enemy: Figther}) {
    const gameResultElem = document.getElementById("displayText");

    // Since stopVersusGame is called after 2sec the game will still loop and determineWinner will keep getting called,
    // so to prevent cleaning multiple times.
    if (roundEnded)
        return;
    setRoundEnded(true);
    // We use timeout so death sprite can fully loop
   stopGameTimeoutId = setTimeout(() => {
        stopVersusGame();
    }, 2000);

    if (!gameResultElem)
    {
        // console.log("ERROR TO PRINT VERSUS RESULT");
        return;
    }

    gameResultElem.style.display = "flex";
    if (player.health === enemy.health)
        gameResultElem.innerHTML = "TIE";
    else if (player.health > enemy.health)
        gameResultElem.innerHTML = "Player 1 Wins";
    else if (enemy.health > player.health)
        gameResultElem.innerHTML = "Player 2 Wins";
}

//Detect if rectangle1's attackBox is hitting rectangle2.
export function rectangularCollision({rectangle1, rectangle2}: {rectangle1: Figther, rectangle2: Figther}): boolean {
    if (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
    {
        return (true);
    }
    return (false);
}
