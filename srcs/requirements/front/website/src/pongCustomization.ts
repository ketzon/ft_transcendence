let toggleSettings: HTMLFormElement;
let settingsPopup: HTMLDivElement;

import { setWinningScore, setPaddleSpeed } from "./pong/utils/constants";
import { changingArea } from "./router";
import { initGame } from "./ponggame";
import { pongView } from "./views/pong";
import { setGameMode } from "./ponggame";
import { stopPong } from "./pong/core/gameloop";

let pongMaps = {
    classic: "bg-map-classic",
    tennis: "bg-map-tennis",
    hell: "bg-map-hell",
    ice: "bg-map-ice"
}

function setCustomSettings(): void {
    const customSettingsForm = document.getElementById("customSettingsForm") as HTMLFormElement | null;

    if (!customSettingsForm)
        return ;

    const formData = new FormData(customSettingsForm);
    let newSettings = {
        winScore: Number(formData.get("score")),
        paddleSpeed: Number(formData.get("paddle-speed")),
        featuresMode: Boolean(formData.get("features"))
    }
    console.log(newSettings);
    setWinningScore(newSettings.winScore);
    setPaddleSpeed(newSettings.paddleSpeed);
    if (newSettings.featuresMode === true)
        setGameMode(false);


}

function setGameSettings(): void {
    if (!toggleSettings || !settingsPopup)
        return ;

    const selectedValue = new FormData(toggleSettings).get("custom_toggle");
    if (selectedValue === "OFF")
    {
        console.log("Default settings will be used");
        //setGametoDefault();
        return;
    }
    else if (selectedValue === "ON")
    {
        console.log("Custom settings will be used");
        setCustomSettings();
        return ;
    }
}

function handlePlayBtn(): void {
    const playBtn = document.getElementById("play-btn");

    if (!playBtn)
        return ;
    playBtn.addEventListener("click", () => {
        setGameSettings();
        //When game settings are changed we can now move to the game/tournament setup.

        if (changingArea)
        {
            changingArea.innerHTML = pongView(pongMaps.classic);
            initGame(false);
        }
    })
}

export function initGameSettings(): void {
    stopPong();

    showCustomSettings();
    handlePlayBtn();
}

function showCustomSettings(): void {
    toggleSettings = document.getElementById("toggleCustomForm") as HTMLFormElement;
    settingsPopup = document.getElementById("settingsPopup") as HTMLDivElement;

    toggleSettings?.addEventListener("change", () => {
        const selectedValue = new FormData(toggleSettings).get("custom_toggle");

        if (selectedValue === "ON")
        {
            settingsPopup?.classList.remove("hidden");
        }
        else if (selectedValue === "OFF")
        {
            settingsPopup?.classList.add("hidden");
        }
    })
}

export function gameSettingsView(): string {
    return /*html*/ `
    <div class="flex justify-center items-center h-full gap-2"> <!-- Wrapper !-->
        <div class="flex flex-col  bg-white rounded-2xl"> <!-- Main box !-->
            <div class="flex flex-col items-center m-3 bg-indigo-100 rounded-2xl">
                <h2 class="bg-indigo-200 w-full text-center p-4 rounded-t-2xl font-semibold text-lg">Game Settings</h2>
                <div class="m-3">
                    <form id="toggleCustomForm">
                        <fieldset>
                            <legend class="text-center font-semibold my-2">Custom Settings</legend>
                            <div class="flex flex-wrap justify-center my-2 gap-5">
                                <label>
                                    <input class="hidden peer" type="radio" id="OFF" name="custom_toggle" value="OFF" checked/>
                                    <span class="cursor-pointer px-10 py-1 border-2 rounded-md border-indigo-400 text-indigo-400 peer-checked:bg-indigo-400 peer-checked:text-white">OFF</span>
                                </label>
                                <label>
                                    <input class="hidden peer" type="radio" id="ON" name="custom_toggle" value="ON"/>
                                    <span class="cursor-pointer px-10 py-1 border-2 rounded-md border-indigo-400 text-indigo-400 peer-checked:bg-indigo-400 peer-checked:text-white">ON</span>
                                </label>
                            </div>
                        </fieldset>
                    </form>
                    <div id="settingsPopup" class="hidden">
                        <form id="customSettingsForm">
                            <fieldset class="my-3">
                                <legend class="text-center font-semibold py-1 mb-2">Score to win</legend>
                                <div class="py-2 flex justify-center gap-10">
                                    <label>
                                        <input class="hidden peer" type="radio" name="score" value="5"/>
                                        <span class="cursor-pointer px-10 py-1 border-2 rounded-md border-indigo-400 text-indigo-400 peer-checked:bg-indigo-400 peer-checked:text-white">5</span>
                                    </label>
                                    <label>
                                        <input class="hidden peer" type="radio" name="score" value="10" checked/>
                                        <span class="cursor-pointer px-10 py-1 border-2 rounded-md border-indigo-400 text-indigo-400 peer-checked:bg-indigo-400 peer-checked:text-white">10</span>
                                    </label>
                                    <label>
                                        <input class="hidden peer" type="radio" name="score" value="15"/>
                                        <span class="cursor-pointer px-10 py-1 border-2 rounded-md border-indigo-400 text-indigo-400 peer-checked:bg-indigo-400 peer-checked:text-white">15</span>
                                    </label>
                                    <label>
                                        <input class="hidden peer" type="radio" name="score" value="20"/>
                                        <span class="cursor-pointer px-10 py-1 border-2 rounded-md border-indigo-400 text-indigo-400 peer-checked:bg-indigo-400 peer-checked:text-white">20</span>
                                    </label>
                                </div>
                            </fieldset>
                            <fieldset class="my-3">
                                <legend class="text-center font-semibold py-1 mb-2">Paddle Speed</legend>
                                <div class="py-2 flex justify-center gap-10">
                                    <label>
                                        <input class="hidden peer" type="radio" name="paddle-speed" value="0.5"/>
                                        <span class="cursor-pointer px-10 py-1 border-2 rounded-md border-indigo-400 text-indigo-400 peer-checked:bg-indigo-400 peer-checked:text-white">0.5x</span>
                                    </label>
                                    <label>
                                        <input class="hidden peer" type="radio" name="paddle-speed" value="1" checked/>
                                        <span class="cursor-pointer px-10 py-1 border-2 rounded-md border-indigo-400 text-indigo-400 peer-checked:bg-indigo-400 peer-checked:text-white">1x</span>
                                    </label>
                                    <label>
                                        <input class="hidden peer" type="radio" name="paddle-speed" value="1.5"/>
                                        <span class="cursor-pointer px-10 py-1 border-2 rounded-md border-indigo-400 text-indigo-400 peer-checked:bg-indigo-400 peer-checked:text-white">1.5x</span>
                                    </label>
                                    <label>
                                        <input class="hidden peer" type="radio" name="paddle-speed" value="2"/>
                                        <span class="cursor-pointer px-10 py-1 border-2 rounded-md border-indigo-400 text-indigo-400 peer-checked:bg-indigo-400 peer-checked:text-white">2x</span>
                                    </label>
                                </div>
                            </fieldset>
                            <fieldset class="my-3">
                                <legend class="text-center font-semibold py-1 mb-2">Features Mode</legend>
                                <div class="py-2 flex justify-center gap-10">
                                    <label>
                                        <input class="hidden peer" type="radio" name="features" value="" checked/>
                                        <span class="cursor-pointer px-10 py-1 border-2 rounded-md border-indigo-400 text-indigo-400 peer-checked:bg-indigo-400 peer-checked:text-white">OFF</span>
                                    </label>
                                    <label>
                                        <input class="hidden peer" type="radio" name="features" value="ON"/>
                                        <span class="cursor-pointer px-10 py-1 border-2 rounded-md border-indigo-400 text-indigo-400 peer-checked:bg-indigo-400 peer-checked:text-white">ON</span>
                                    </label>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-center m-3 bg-indigo-100 rounded-2xl">
                <h2 class="bg-indigo-200 w-full text-center p-4 rounded-t-2xl font-semibold text-lg">Custom Map</h2>
                <div class="flex justify-center gap-5 mx-10">
                    <div class="rounded-md my-5 h-50 w-60 bg-amber-300 cursor-pointer hover:border-indigo-400 hover:border-2"></div>
                    <div class="rounded-md my-5 h-50 w-60 bg-green-300 cursor-pointer hover:border-indigo-400 hover:border-2"></div>
                    <div class="rounded-md my-5 h-50 w-60 bg-red-300 cursor-pointer hover:border-indigo-400 hover:border-2"></div>
                </div>
            </div>
        </div>
        <div class="flex flex-col justify-center py-10 w-1/5 bg-white rounded-2xl gap-1">
            <button class="border-2 mx-2 px-20 py-2 rounded-xl bg-blue-600 text-white cursor-pointer hover:opacity-50" type="button" id="play-btn">DUEL</button>
            <button class="border-2 mx-2 px-20 py-2 rounded-xl bg-blue-600 text-white cursor-pointer hover:opacity-50" type="button" id="play-btn">TOURNAMENT</button>
        </div>
    </div>
`
}
