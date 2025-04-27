export function pongView(): string {
    return /*html*/`
<div class="h-full w-full flex justify-center items-center flex-col">
    <h1 id="winner-message" class="text-indigo-200 w-[800px] mb-10  text-center text-4xl"> [playerName] won the game! 🥳</h1>

    <!-- player profile -->
    <div id="player-profile" class="text-violet-400 flex mt-4 mb-4 font-bold place-content-between w-[800px]">
        <div id="player1" class="text-violet-400">player1😈</div>
        <div id="player2" >player2💀</div>
    </div>

    <!-- elements du jeu -->
      <div id="game-container" class="relative">
        <div id="game-board" class="bg-indigo-200 rounded relative w-[800px] h-[400px] border border-violet-400">
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
        <button id="button-pause" class="text-white bg-red-400 rounded p-1 ">start</button>
        <button id="button-reset" class="text-white  bg-red-400 rounded p-1 ">reset</button>
        <button id="button-ball" class="text-white  bg-red-400 rounded p-1 ">ball-color</button> 
        <button id="button-basic" class="text-white  bg-red-400 rounded p-1 ">features-mode</button>
      </div>


    <!-- tout les liens -->
       <div class="flex justify-between">
         <div class="fixed bottom-4 right-4">
         <a href="images/pong-infos2.png" target="_blank" class="text-gray-400 font-bold p-4" rel="pong-infos">
         「 pong infos black 」
         </a>
        <div class="fixed bottom-4 left-4">
         <a href="images/pong-infos.png" target="_blank" class="text-gray-400 font-bold p-4" rel="pong-infos">
         「 pong infos white 」
         </a>
        </div>
</div>
`

}
