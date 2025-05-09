import { initGame, setGameMode } from "./ponggame";
import { changingArea } from "./router";
import { pongView } from "./views/pong";

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
        const playerCountStr = await customPrompt("How many players?");
        const playerCount = parseInt(playerCountStr) || 4;
        const players: string[] = [];

        for (let i = 1; i <= playerCount; i++) {
            const playerName = await customPrompt(`Enter name for Player ${i}:`);
            players.push(playerName);
        }

        localStorage.setItem("tournamentPlayers", JSON.stringify(players));
        changingArea.innerHTML = pongView();
        setGameMode(true);
        initGame();
    });

    //ajouter quand j'ai le mode versus
    // versusButton.addEventListener("click", () => {
    //     versusView()
    // })
}

// Ajouter cette fonction à votre code
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
