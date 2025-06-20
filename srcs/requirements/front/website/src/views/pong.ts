export let background: string = "bg-map-classic";

export function setPongBackground(bgImg: string): void {
    background = bgImg;
}

export function pongView(): string {
    return /*html*/`
<div class="h-full w-full flex justify-center items-center flex-col">
    <h1 id="winner-message" class="text-indigo-200 w-[800px] mb-10  text-center text-4xl"> [playerName] won the game! 🥳</h1>

    <!-- player profile -->
    <div id="player-profile" class="text-violet-400 flex mt-4 mb-4 font-bold place-content-between w-[800px]">
        <div id="player1" class="text-violet-400">player1😈</div>
        <div id="player2" class="text-violet-400">player2💀</div>
    </div>

    <!-- elements du jeu -->

      <div id="game-container" class="relative">
        <div id="game-board" class="${background} bg-cover bg-center rounded relative w-[800px] h-[400px] border border-violet-400">
          <div id="ball" class="absolute w-5 h-5 bg-white rounded-full" style="left: 390px; top: 190px;"></div>
          <div id="paddle-left" class="border border-violet-400 absolute rounded w-[10px] h-[80px] bg-white" style="left: 10px; top: 160px;"></div>
          <div id="paddle-right" class="border border-violet-400 absolute rounded w-[10px] h-[80px] bg-white" style="right: 10px; top: 160px;"></div>
        </div>

    <!-- les scores -->
        <div class="flex justify-around text-violet-400 mt-2">
          <div id="score-left" class="text-[25px]">0</div>
          <div id="score-right" class="text-[25px]">0</div>
        </div>
      </div>

    <!-- les boutons -->
      <div class="flex gap-4 mt-4">
        <button id="button-pause" class="border border-purple-700 bg-purple-300 text-white py-2 px-6 rounded hover:bg-red-300 transition-colors ">start</button>
        <button id="button-ball" class="border border-purple-700 bg-purple-300 text-white py-2 px-6 rounded hover:bg-red-300 transition-colors ">mute</button>        
        <button id="button-basic" class="border border-purple-700 bg-purple-300 text-white py-2 px-6 rounded hover:bg-red-300 transition-colors ">features-mode</button>
      </div>
</div>
`

}
