import { player, enemy } from "./initGame";
import { roundTime } from "./constants";
import { determineWinner } from "./utils";

export let timerId;
export let timer;

export function initTimer(): void {
    timer = roundTime; // use the global roundTime;
}

export function decreaseTimer(): void {
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
