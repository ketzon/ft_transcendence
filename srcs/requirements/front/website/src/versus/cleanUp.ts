import { animationId, timerId } from "./initGame";
import { handleKeyPress, handleKeyRelease } from "./keyHandling";

function stopKeyListeners(): void {
    console.log("Cleaning VersusGame listeners..");
    window.removeEventListener("keydown", handleKeyPress);
    window.removeEventListener("keyup", handleKeyRelease);
}

export function clearTimer(): void {
    console.log("Cleaning VersusGame timer..")
    if (timerId)
        clearTimeout(timerId);
}

export function stopVersusGame(): void {
    console.log("Cleaning VersusGame");
    cancelAnimationFrame(animationId);
    stopKeyListeners();
    clearTimer();
}
