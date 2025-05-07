import { canvas, c, keys } from "./constants";
import { Sprite } from "./classes/SpriteClass";
import { Figther } from "./classes/FigtherClass";
import { initConstants } from "./constants";
import { handleKeys } from "./keyHandling";
import { clearTimer, stopVersusGame } from "./cleanUp";

import { initTimer, decreaseTimer } from "./timer";
import { determineWinner } from "./utils";
import { rectangularCollision } from "./utils";

//Variables used to stop the requestAnimation
export let animationId: number;

//Variables that will hold players
export let player: Figther; // Player1
export let enemy: Figther; // Player 2

//Variables that will hold the sprites
export let background: Sprite;
export let shop: Sprite;

// This is the main gameloop
function animate(): void {
    animationId = window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);

    background.update();
    shop.update();

    player.update();
    // enemy.update();

    //Player movement
    player.velocity.x = 0; // Resets velocity , if a key is pressed it will change it , if no player will not move because of reset.
    if (keys.a.pressed && player.lastKey === "a")
    {
        player.velocity.x = -5;
        player.switchSprite("run"); //We change the sprite to the run
    }
    else if (keys.d.pressed && player.lastKey === "d")
    {
        player.velocity.x = 5;
        player.switchSprite("run");  //We change the sprite to the run
    }
    else
    {
        player.switchSprite("idle") //Resets to idle sprite.
    }

        //Player jumping
    if (player.velocity.y < 0)
    {
        player.switchSprite("jump");
    }
        // If velocity is > 0 it means gravity is pushing us down in a fall status
    if (player.velocity.y > 0)
    {
        player.switchSprite("fall");
    }

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

function initPlayers(): void {
    player = new Figther({
        position: {x: 0, y: 0},
        velocity: {x: 0, y: 0},
        color: "red",
        // offset: {x: 0, y: 0},
        imageSrc: "assets/versus/samuraiMack/Idle.png",
        framesMax: 8,
        scale: 2.5,
        offset: {x: 215, y: 157},
        sprites : {
            idle: {
                imageSrc : "assets/versus/samuraiMack/Idle.png",
                framesMax: 8
            },
            run: {
                imageSrc : "assets/versus/samuraiMack/Run.png",
                framesMax: 8,
            },
            jump: {
                imageSrc : "assets/versus/samuraiMack/Jump.png",
                framesMax: 2,
            },
            fall: {
                imageSrc: "assets/versus/samuraiMack/Fall.png",
                framesMax: 2,
            }
        }
    })

    enemy = new Figther({
        position: {x: 400, y: 100},
        velocity: {x: 0, y: 0},
        color: "blue",
        offset: {x: -50, y: 0},
        // imageSrc: "assets/versus/samuraiMack/Idle.png",
    })
}

function initCanvas(): void {
    canvas.width = 1024;
    canvas.height = 576;
    c.fillRect(0, 0, canvas.width, canvas.height); // fill the canvas with color (default black);
}

function initSprites(): void {
    background = new Sprite({
        position: {x: 0, y: 0},
        imageSrc: "assets/versus/background.png",
        scale: 1,
        framesMax: 1
    })

    shop = new Sprite({
        position: {x: 600, y: 128},
        imageSrc: "assets/versus/shop.png",
        scale: 2.75,
        framesMax: 6
    })
}

export function initVersusFight(): void {
    initConstants();
    initCanvas();
    initPlayers();
    initSprites();
    initTimer();

    // player.draw();
    // enemy.draw();

    animate();
    handleKeys();
    decreaseTimer();
}
