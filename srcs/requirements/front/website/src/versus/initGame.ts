import { canvas, c, keys } from "./constants";
import { Sprite } from "./SpriteClass";
import { loadConstants } from "./constants";
import { handleKeys } from "./keyHandling";

export let animationId: number;

export let player: Sprite;
export let enemy: Sprite;

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
function rectangularCollision({rectangle1, rectangle2}): boolean {
    if (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
    {
        return (true);
    }
    return (false);
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
        player.isAtacking = false; // This is used so it act as only 1 hit has landed.
        console.log("Player 1 HIT");
    }
    //We check if player2 is attacking and if it hits the player1(enemy).
    if (rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAtacking)
    {
        enemy.isAtacking = false; // This is used so it act as only 1 hit has landed.
        console.log("Player 2 HIT");
    }
}

function initCanvas(): void {
    canvas.width = 1024;
    canvas.height = 576;
    c.fillRect(0, 0, canvas.width, canvas.height); // fill the canvas with color (default black);
}

export function initVersusFight(): void {
    loadConstants();
    initCanvas();
    initPlayers();

    player.draw();
    enemy.draw();

    animate();
    handleKeys();
}
