let toggleSettings: HTMLFormElement;
let settingsPopup: HTMLDivElement;

import { setWinningScore, setPaddleSpeed } from "./pong/utils/constants";
// import { changingArea } from "./router";
// import { initGame } from "./ponggame";
// import { pongView } from "./views/pong";
import { setGameMode } from "./ponggame";
import { stopPong } from "./pong/core/gameloop";
import { setPongBackground } from "./views/pong";
import { execSelect} from "./selectgames";
// import { selectView } from "./views/select";
// import { setPause, setTournamentMode } from "./pong/core/gamestate";
import { setStage } from "./pong/core/gameloop";

function setCustomSettings(): void {
    console.log("im in custom settings");
    const customSettingsForm = document.getElementById("customSettingsForm") as HTMLFormElement | null;

    if (!customSettingsForm)
        return ;

    console.log("custom settings working");
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

export function setGameSettings(): void {
    if (!toggleSettings || !settingsPopup)
        return ;

    const selectedValue = new FormData(toggleSettings).get("custom_toggle");
    console.log(selectedValue)
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

export function setChoosenBackground(): void {
    const mapSelectionForm = document.getElementById("mapSelection") as HTMLFormElement | null;

    if (!mapSelectionForm)
        return ;
    const formData = new FormData(mapSelectionForm);
    const choosenMap = formData.get("map")?.toString();

    if (choosenMap)
        setPongBackground(choosenMap);
}


export function initGameSettings(): void {
    stopPong();

    setStage(0);
    showCustomSettings();
    execSelect()
}

function showCustomSettings(): void {
    toggleSettings = document.getElementById("toggleCustomForm") as HTMLFormElement;
    settingsPopup = document.getElementById("settingsPopup") as HTMLDivElement;

    toggleSettings?.addEventListener("change", () => {
        const selectedValue = new FormData(toggleSettings).get("custom_toggle");

        console.log(selectedValue)
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
            <div class="flex flex-col items-center m-3 bg-violet-100 rounded-2xl">
                <h2 class="i18n bg-violet-300 w-full text-center p-4 rounded-t-2xl font-semibold text-lg">Game Settings</h2>
                <div class="m-3">
                    <form id="toggleCustomForm">
                        <fieldset>
                        <div class="i18n text-center font-semibold my-2">Custom Settings</div>
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
                                <div class="text-center font-semibold py-1 mb-2">Score to win</div>
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
                                <div class="text-center font-semibold py-1 mb-2">Paddle Speed</div>
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
                                <div class="text-center font-semibold py-1 mb-2">Features Mode</div>
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
            <div class="flex flex-col items-center m-3 bg-violet-100 rounded-2xl">
                <h2 class="i18n bg-violet-300 w-full text-center p-4 rounded-t-2xl font-semibold text-lg">Custom Map</h2>
                    <form id="mapSelection" class="flex flex-wrap justify-center gap-5 mx-10">
                        <label class="cursor-pointer my-5">
                            <input class="hidden peer" type="radio" name="map" value="bg-map-classic" checked/>
                            <div class="overflow-hidden transition-all rounded-lg shadow border-4 border-transparent peer-checked:border-indigo-400">
                                <img class="w-60 h-50 object-cover" src="../../assets/pong/pong_classic_map.png" alt="pong_classic_map">
                                <div class="bg-indigo-200 font-semibold text-center py-2">Classic</div>
                            </div>
                        </label>
                        <label class="cursor-pointer my-5">
                            <input class="hidden peer" type="radio" name="map" value="bg-map-tennis"/>
                            <div class="overflow-hidden transition-all rounded-lg shadow border-4 border-transparent peer-checked:border-indigo-400">
                                <img class="w-60 h-50 object-cover" src="../../assets/pong/pong_tennis_map.png" alt="pong_classic_map">
                                <div class="bg-indigo-200 font-semibold text-center py-2">Tennis</div>
                            </div>
                        </label>
                        <label class="cursor-pointer my-5">
                            <input class="hidden peer" type="radio" name="map" value="bg-map-hell"/>
                            <div class="overflow-hidden transition-all rounded-lg shadow border-4 border-transparent peer-checked:border-indigo-400">
                                <img class="w-60 h-50 object-cover" src="../../assets/pong/pong_hell_map.png" alt="pong_classic_map">
                                <div class="bg-indigo-200 font-semibold text-center py-2">Hell</div>
                            </div>
                        </label>
                        <label class="cursor-pointer my-5">
                            <input class="hidden peer" type="radio" name="map" value="bg-map-ice"/>
                            <div class="overflow-hidden transition-all rounded-lg shadow border-4 border-transparent peer-checked:border-indigo-400">
                                <img class="w-60 h-50 object-cover" src="../../assets/pong/pong_ice_map.png" alt="pong_classic_map">
                                <div class="bg-indigo-200 font-semibold text-center py-2">Ice</div>
                            </div>
                        </label>
                    </form>
            </div>
        </div>
        <div class="flex flex-col justify-center py-10 w-1/5 bg-white rounded-2xl gap-1">
            <button class="border-2 mx-2 px-20 py-2 rounded-xl bg-violet-400 text-white cursor-pointer hover:opacity-50" type="button" id="play-1v1">DUEL</button>
            <button class="border-2 mx-2 px-20 py-2 rounded-xl bg-violet-400 text-white cursor-pointer hover:opacity-50" type="button" id="play-tournament">TOURNAMENT</button>
        </div>
    </div>
`
}

