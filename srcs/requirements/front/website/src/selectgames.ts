import { changingArea } from "./router"
import { pongView } from "./views/pong"
import { initGame, stopGame, setGameMode } from "./ponggame.ts";

export function execSelect(): void {
let pongButton = document.getElementById("button-pong") 
// let versusButton = document.getElementById("button-pong")

pongButton.addEventListener("click",() => {
    changingArea.innerHTML = pongView();
    setGameMode(true);
    initGame();
})

//ajouter quand j'ai le mode versus
// versusButton.addEventListener("click", () => {
//     versusView()
// })
}
