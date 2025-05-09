import { initGame, setGameMode } from "./ponggame";
import { changingArea } from "./router";
import { pongView } from "./views/pong";
import { tournamentsView } from "./views/tournaments";
import { bracketView } from "./views/bracket";



export let player1: string
export let player2: string
export let player3: string
export let player4: string

export function execSelect(): void {
    let pong1v1 = document.getElementById("pong-1v1");
    let pongTournament = document.getElementById("pong-tournament");
    // let versusButton = document.getElementById("button-pong")

    pong1v1.addEventListener("click", async () => {
        const player2 = await customPrompt("Enter Player 2 username:");
        localStorage.setItem("Player2", player2);
        changingArea.innerHTML = pongView();
        setGameMode(true);
        initGame();
    });

    pongTournament.addEventListener("click", async () => {
        const players: string[] = [];

        for (let i = 2; i <= 4; i++) { //tournament for 4 person
            let playerName = await customPrompt(`Enter name for Player ${i}:`);
            if (playerName === "") {
                playerName = "player" + `${i}` + "👻" 
            }
            players.push(playerName);
        }
        localStorage.setItem("tournamentPlayers", JSON.stringify(players));
        player1 = localStorage.getItem('nickname')
        player2 = players[0];
        player3 = players[1];
        player4 = players[2];
        showBracket();
    });
}

function showBracket(): void {
    changingArea.innerHTML = bracketView();
   let start = document.getElementById("start-game");
   start.addEventListener("click", () => {
       changingArea.innerHTML = pongView();
        setGameMode(true);
        initGame();
   })
}

function customPrompt(message: string): Promise<string> {
    return new Promise((resolve) => {
        // print message du prompt
        const promptTitle = document.getElementById('prompt-title');
        if (promptTitle) {
            promptTitle.textContent = message;
        }
        // on affiche la modal avec remove hidden
        const promptModal = document.getElementById('custom-prompt');
        if (promptModal) {
            promptModal.classList.remove('hidden');
        }
        // focus imput
        const promptInput = document.getElementById('prompt-input') as HTMLInputElement;
        if (promptInput) {
            promptInput.value = '';
            promptInput.focus();
        }
        // resous la promesse et cache le prompt (remet en hidden)
        const submitAndClose = () => {
            const value = promptInput ? promptInput.value || '' : '';
            if (promptModal) {
                promptModal.classList.add('hidden');
            }
            resolve(value);
        };
        // event submit
        const submitButton = document.getElementById('prompt-submit');
        if (submitButton) {
            submitButton.onclick = submitAndClose;
        }
        // on peut utilise enter pour send
        if (promptInput) {
            promptInput.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    submitAndClose();
                }
            };
        }
    });
}
