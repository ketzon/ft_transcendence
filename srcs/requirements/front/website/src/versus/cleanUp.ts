import { animationId } from "./initGame";
import { handleKeyPress, handleKeyRelease } from "./keyHandling";

function stopKeyListeners(): void {
    console.log("Cleaning VersusGame listeners..");
    window.removeEventListener("keydown", handleKeyPress);
    window.removeEventListener("keyup", handleKeyRelease);
}

export function stopVersusGame(): void {
    console.log("Cleaning VersusGame");
    cancelAnimationFrame(animationId);
    stopKeyListeners();
}
