export function initGameSettings(): void {
    showCustomSettings();
}

function showCustomSettings(): void {
    const customSettings = document.getElementById("customSettingsForm");
    const settingsPopup = document.getElementById("settingsPopup");

    customSettings.addEventListener("change", (event) => {
        console.log("Settings Changed", customSettings["on/off"].value);

        if (customSettings["on/off"].value === "ON")
            settingsPopup.classList.remove("hidden");
        else if (customSettings["on/off"].value === "OFF")
            settingsPopup.classList.add("hidden");
    })
}

export function gameSettingsView(): string {
    return /*html*/ `
    <div class="flex justify-center items-center h-full"> <!-- Wrapper !-->
        <div class="flex flex-col h-11/12 w-11/12 bg-white rounded-2xl"> <!-- Main box !-->
            <div class="flex flex-col items-center m-3 bg-indigo-100 rounded-2xl">
                <h2 class="bg-indigo-200 w-full text-center p-4 rounded-t-2xl">Game Settings</h2>
                <div class="m-3">
                    <form id="customSettingsForm">
                        <fieldset>
                            <legend>Custom Settings</legend>
                            <input type="radio" id="OFF" name="on/off" value="OFF" checked/>
                            <label for="OFF">OFF</label>
                            <input type="radio" id="ON" name="on/off" value="ON"/>
                            <label for="ON">ON</label>
                        </fieldset>
                    </form>
                    <div id="settingsPopup" class="hidden h-96 w-xs border-2 text-center">POPUP</div>
                </div>
            </div>
        </div>
    </div>
`
}
