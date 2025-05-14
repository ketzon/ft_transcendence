import { initGame, setGameMode } from "./ponggame";
import { changingArea } from "./router";
import { pongView } from "./views/pong";
import { tournamentsView } from "./views/tournaments";
import { bracketView } from "./views/bracket";
import { gameState } from "./pong/core/gamestate";
import { getElements } from "./pong/components/elements";
import { pongScore } from "./pong/core/gameloop";
import { combatView} from "./views/combat";
import { setGameSettings, setChoosenBackground } from "./pongCustomization";
import { selectView } from "./views/select";


export type BracketElements = {
  player1Name: HTMLElement;
  player1Score: HTMLElement;
  player2Name: HTMLElement;
  player2Score: HTMLElement;
  player3Name: HTMLElement;
  player3Score: HTMLElement;
  player4Name: HTMLElement;
  player4Score: HTMLElement;
  finalist1Name: HTMLElement;
  finalist1Score: HTMLElement;
  finalist2Name: HTMLElement;
  finalist2Score: HTMLElement;
}

export function getBracketElements(): BracketElements {
    return {
        player1Name: document.getElementById("player1-name") as HTMLElement,
        player1Score: document.getElementById("player1-score") as HTMLElement,
        player2Name: document.getElementById("player2-name") as HTMLElement,
        player2Score: document.getElementById("player2-score") as HTMLElement,
        player3Name: document.getElementById("player3-name") as HTMLElement,
        player3Score: document.getElementById("player3-score") as HTMLElement,
        player4Name: document.getElementById("player4-name") as HTMLElement,
        player4Score: document.getElementById("player4-score") as HTMLElement,
        finalist1Name: document.getElementById("finalist1-name") as HTMLElement,
        finalist1Score: document.getElementById("finalist1-score") as HTMLElement,
        finalist2Name: document.getElementById("finalist2-name") as HTMLElement,
        finalist2Score: document.getElementById("finalist2-score") as HTMLElement,
    };
}


export let player1: string
export let player2: string
export let player3: string
export let player4: string

export function execSelect(): void {
    let pong1v1 = document.getElementById("play-1v1");
    let pongTournament = document.getElementById("play-tournament");

    if (!pong1v1 || !pongTournament) return;
    // setGameSettings();
    // setChoosenBackground();

    pong1v1.addEventListener("click", async () => {
        console.log("im in 1v1 mode")

        setGameSettings();
        setChoosenBackground();
        changingArea.innerHTML = selectView();
        const player2 = await customPrompt("Enter Player 2 username:");
        console.log("prompt working")
        localStorage.setItem("Player2", player2);
        changingArea.innerHTML = pongView();
        // setGameMode(true);
        initGame(false);
    });

    pongTournament.addEventListener("click", async () => {
        console.log("im in tournament mode")
        const players: string[] = [];
        setGameSettings();
        setChoosenBackground();
        changingArea.innerHTML = selectView();
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

//fonction test a update
export function updateBracket(winner: string, player1: string, player2: string): void {
    let bracketId = getBracketElements();
    
    if ((player1 === bracketId.player1Name.textContent && player2 === bracketId.player2Name.textContent) || 
        (player2 === bracketId.player1Name.textContent && player1 === bracketId.player2Name.textContent)) {
        bracketId.finalist1Name.textContent = winner;
    } else if ((player1 === bracketId.player3Name.textContent && player2 === bracketId.player4Name.textContent) || 
               (player2 === bracketId.player3Name.textContent && player1 === bracketId.player4Name.textContent)) {
        bracketId.finalist2Name.textContent = winner;
    } else if ((player1 === bracketId.finalist1Name.textContent && player2 === bracketId.finalist2Name.textContent) || 
               (player2 === bracketId.finalist1Name.textContent && player1 === bracketId.finalist2Name.textContent)) {
        alert(`${winner} has won the tournament!`);
    }
}

export function showBracket(): void {
    changingArea.innerHTML = bracketView();
    let bracketId:BracketElements = getBracketElements();
   let start = document.getElementById("start-game");
   start.addEventListener("click", () => {
       changingArea.innerHTML = pongView();
        initGame(true);
   })
}

function customPrompt(message: string): Promise<string> {
    return new Promise((resolve) => {
        const promptTitle = document.getElementById('prompt-title');
        if (promptTitle) {
            promptTitle.textContent = message;
        }
        const promptModal = document.getElementById('custom-prompt');
        if (promptModal) {
            promptModal.classList.remove('hidden');
        }
        const promptInput = document.getElementById('prompt-input') as HTMLInputElement;
        if (promptInput) {
            promptInput.value = '';
            promptInput.focus();
        }
        const submitAndClose = () => {
            const value = promptInput ? promptInput.value || '' : '';
            if (promptModal) {
                promptModal.classList.add('hidden');
            }
            resolve(value);
        };
        const submitButton = document.getElementById('prompt-submit');
        if (submitButton) {
            submitButton.onclick = submitAndClose;
        }
        if (promptInput) {
            promptInput.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    submitAndClose();
                }
            };
        }
    });
}
