import { keys } from "./constants";
import { player, enemy } from "./initGame";

export function handleKeyPress(event: KeyboardEvent): void {
    switch (event.key)
    {
        //Player keys
        case "a":
            keys.a.pressed = true;
            player.lastKey = "a";
            break;

        case "d":
            keys.d.pressed = true;
            player.lastKey = "d";
            break;

        case "w":
            player.velocity.y = -20;
            break;

        case " ": // Spacebar
            player.attack();
            break

        //Enemy keys
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = "ArrowLeft";
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastKey = "ArrowRight";
            break;

        case "ArrowUp":
            enemy.velocity.y = -20;
            break;

        case "ArrowDown":
            enemy.attack();
    }
}

export function handleKeyRelease(event: KeyboardEvent): void {
    switch (event.key)
    {
        //Player keys
        case "a":
            keys.a.pressed = false;
            break;

        case "d":
            keys.d.pressed = false;
            break;

        case "w":
            keys.w.pressed = false;
            break ;

        //Enemy keys
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;

        case "ArrowUp":
            keys.ArrowUp.pressed = false;
            break ;
    }
}

export function handleKeys(): void {
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);
}
