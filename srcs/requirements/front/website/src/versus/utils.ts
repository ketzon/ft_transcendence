import { Figther } from "./classes/FigtherClass";
import { clearTimer } from "./cleanUp";

export function determineWinner({player, enemy}: {player : Figther, enemy: Figther}) {
    const gameResultElem = document.getElementById("displayText");

    clearTimer();
    // stopVersusGame();
    if (!gameResultElem)
    {
        console.log("ERROR TO PRINT VERSUS RESULT");
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
