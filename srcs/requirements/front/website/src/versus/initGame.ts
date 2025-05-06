import { canvas, c, keys } from "./constants";
import { Sprite } from "./SpriteClass";
import { loadConstants } from "./constants";
import { handleKeys } from "./keyHandling";
import { clearTimer } from "./cleanUp";

export let animationId: number;
export let timerId: number;

export let player: Sprite; // Player1
export let enemy: Sprite; // Player 2

let timer; // Duration of a round.

function initPlayers(): void {
    player = new Sprite({
        position: {x: 0, y: 0},
        velocity: {x: 0, y: 0},
        color: "red",
        offset: {x: 0, y: 0}
    })

    enemy = new Sprite({
        position: {x: 400, y: 100},
        velocity: {x: 0, y: 0},
        color: "blue",
        offset: {x: -50, y: 0}
    })
}

//Detect if rectangle1's attackBox is hitting rectangle2.
function rectangularCollision({rectangle1, rectangle2}: {rectangle1: Sprite, rectangle2: Sprite}): boolean {
    if (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
    {
        return (true);
    }
    return (false);
}

function determineWinner({player, enemy}: {player : Sprite, enemy: Sprite}) {
    const gameResultElem = document.getElementById("displayText");

    clearTimer();
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

function decreaseTimer(): void {
    if (timer > 0)
    {
        timerId = setTimeout(decreaseTimer, 1000); // Every secondes we remove 1 to the timer.
        timer--;

        const timerElem = document.getElementById("timer");

        if (timerElem)
            timerElem.innerHTML = timer.toString();
    }

    if (timer === 0)
    {
        determineWinner({player, enemy});
    }
}

// This is the main gameloop
function animate(): void {
    animationId = window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    //Player movement
    player.velocity.x = 0; // Resets velocity , if a key is pressed it will change it , if no player will not move because of reset.
    if (keys.a.pressed && player.lastKey === "a")
        player.velocity.x = -5;
    else if (keys.d.pressed && player.lastKey === "d")
        player.velocity.x = 5;

    //Enemy movement
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft")
        enemy.velocity.x = -5;
    else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight")
        enemy.velocity.x = 5;

    //We check if player1 is attacking and if it hits the player2(enemy).
    if (rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAtacking)
    {
        console.log("Player 1 HIT Player 2");
        player.isAtacking = false; // This is used so it act as only 1 hit has landed.
        enemy.health -= 20;
        document.getElementById("enemyHealth").style.width = enemy.health + "%";
    }
    //We check if player2 is attacking and if it hits the player1(enemy).
    if (rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAtacking)
    {
        console.log("Player 2 HIT Player 1");
        enemy.isAtacking = false; // This is used so it act as only 1 hit has landed.
        player.health -= 20;
        document.getElementById("playerHealth").style.width = player.health + "%"; // Makes the visual change on health bars.
    }

    //Check if we have a ending condition
    if (player.health <= 0 || enemy.health <= 0)
    {
        determineWinner({player, enemy});
    }
}

function initCanvas(): void {
    canvas.width = 1024;
    canvas.height = 576;
    c.fillRect(0, 0, canvas.width, canvas.height); // fill the canvas with color (default black);
}

export function initVersusFight(): void {
    loadConstants();
    timer = 10;
    initCanvas();
    initPlayers();

    player.draw();
    enemy.draw();

    animate();
    handleKeys();
    decreaseTimer();
}
