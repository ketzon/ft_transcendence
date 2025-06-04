import { initGame, setGameMode } from "./ponggame";
import { changingArea } from "./router";
import { pongView } from "./views/pong";
import { tournamentsView } from "./views/tournaments";
import { bracketView } from "./views/bracket";
import { gameState, setPause } from "./pong/core/gamestate";
import { getElements } from "./pong/components/elements";
import { pongScore } from "./pong/core/gameloop";
import { combatView} from "./views/combat";
import { setGameSettings, setChoosenBackground } from "./pongCustomization";
import { selectView } from "./views/select";
import { gameLoop } from "./pong/core/gameloop";
import { setIsLooping, isLooping } from "./pong/core/gamestate";  


declare const VANTA: any; //typescript


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

    pong1v1.addEventListener("click", async () => {
        if(!changingArea) return;
        setGameSettings();
        setChoosenBackground();
        changingArea.innerHTML = selectView();
        let player2 = await customPrompt("Enter Player 2 username:");
        
        if (player2 === "") { 
            player2 = "player2👻";
        }
        console.log("prompt working")
        localStorage.setItem("Player2", player2);

        setPause(true);
        changingArea.innerHTML = pongView();
        const gameId = getElements(); //26/05 
        setIsLooping(true) //ines fix
        gameLoop(gameId); //26/05

        // setGameMode(true);
        initGame(false);
    });

    pongTournament.addEventListener("click", async () => {
        console.log("im in tournament mode")
        if(!changingArea) return;
        const players: string[] = [];
        setGameSettings();
        setChoosenBackground();
        setPause(true);
        changingArea.innerHTML = selectView();
        let tournamentName = await customPrompt("Enter tournament name:");
       // let creatorId = localStorage.getItem('userID') ?? "";
        for (let i = 2; i <= 4; i++) { //tournament for 4 person
            let playerName = await customPrompt(`Enter name for Player ${i}:`);
            if (playerName === "") {
                playerName = "player" + `${i}` + "👻" 
            }
            players.push(playerName);
        }
        const user1 = localStorage.getItem('nickname') || 'player1👻';
        players.push(user1);
        localStorage.setItem("tournamentPlayers", JSON.stringify(players));
        localStorage.setItem("tournamentName", tournamentName);
      //  localStorage.setItem("creatorId", creatorId);


        const randomizedPlayer = shufflePlayers(players);

        player1 = randomizedPlayer[0]; 
        player2 = randomizedPlayer[1]; 
        player3 = randomizedPlayer[2]; 
        player4 = randomizedPlayer[3]; 
        localStorage.setItem("Player2", player2);
        showBracket();
    });
}

function shufflePlayers(array: string[]): string[] { 
    const shuffled: string[] = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

interface VantaEffect {
    destroy: () => void;
}

//recup l'instance
let vantaEffect:VantaEffect | null = null;
export function showBracket(): void {
  if (changingArea) {
    if (vantaEffect) {
      vantaEffect.destroy();
      vantaEffect = null;
    }


    changingArea.innerHTML = bracketView();
    const matchTitle = document.getElementById('match-title');
    if (matchTitle) {
        matchTitle.textContent = `${player1} vs ${player2}`;
    }
    let start = document.getElementById("start-game");
    if (!start) return;
    if (typeof VANTA !== 'undefined') {
      const targetElement = document.getElementById('vanta-bg');
      if (targetElement) {
        try {
          vantaEffect = VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xb089cd,
            backgroundColor: 0xe7e7f2,
            points: 4.00,
            maxDistance: 10.00,
            spacing: 20.00,
            fps: 30
          });
        } catch (error) {
          console.error("erreur init vanta", error);
        }
      }
    }
    start.addEventListener("click", () => {
      if(changingArea) {
        if (vantaEffect) {
          vantaEffect.destroy();
          vantaEffect = null;
        }
        changingArea.innerHTML = pongView();
        const gameId = getElements();
        setIsLooping(true)//ines fix
        gameLoop(gameId);

        initGame(true);
      }
    }, { once: true }); //seulement 1 listener
  }
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
