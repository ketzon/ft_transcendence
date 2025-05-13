export function selectView(): string {
    return /*html*/`
    <div class="flex justify-center items-center h-screen w-full">
        <!-- conteneur pour les boutons avec espacement -->
        <div class="flex gap-4">
            <!-- Bouton Pong -->
            <button
              id="button-pong" class="relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px] bg-gradient-to-t from-[#8122b0] to-[#dc98fd] active:scale-95"
              onclick="document.getElementById('modal-pong').classList.remove('hidden')"
            >
              <span
                class="w-full h-full flex items-center gap-2 px-8 py-3 bg-[#B931FC] text-white rounded-[14px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <path
                    d="M8 13V9m-2 2h4m5-2v.001M18 12v.001m4-.334v5.243a3.09 3.09 0 0 1-5.854 1.382L16 18a3.618 3.618 0 0 0-3.236-2h-1.528c-1.37 0-2.623.774-3.236 2l-.146.292A3.09 3.09 0 0 1 2 16.91v-5.243A6.667 6.667 0 0 1 8.667 5h6.666A6.667 6.667 0 0 1 22 11.667Z"
                  ></path></svg
                >Play Pong</span
              >
            </button>
            
            <button
              id="button-versus" class="relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px] bg-gradient-to-t from-[#8122b0] to-[#dc98fd] active:scale-95"
              onclick="document.getElementById('modal-versus').classList.remove('hidden')"
            >
              <span
                class="w-full h-full flex items-center gap-2 px-8 py-3 bg-[#B931FC] text-white rounded-[14px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <path
                    d="M8 13V9m-2 2h4m5-2v.001M18 12v.001m4-.334v5.243a3.09 3.09 0 0 1-5.854 1.382L16 18a3.618 3.618 0 0 0-3.236-2h-1.528c-1.37 0-2.623.774-3.236 2l-.146.292A3.09 3.09 0 0 1 2 16.91v-5.243A6.667 6.667 0 0 1 8.667 5h6.666A6.667 6.667 0 0 1 22 11.667Z"
                  ></path></svg
                >Play Versus</span
              >
            </button>
        </div>
    </div>
    
    <!-- Modal pour Play Pong -->
    <div id="modal-pong" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center hidden">
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-purple-800">Pong Game Options</h3>
                <button onclick="document.getElementById('modal-pong').classList.add('hidden')" class="text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="space-y-4">
                <button id="pong-1v1" class="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">1v1 Game</button>
                <button id="pong-tournament" class="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Tournament</button>
            </div>
        </div>
    </div>
    
    <-- pour le prompt custom -->
    <div id="custom-prompt" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden ">
  <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
    <h3 id="prompt-title" class="text-xl font-bold text-purple-800 mb-4">Enter Username</h3>
    <input 
      type="text" 
      id="prompt-input" 
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
      placeholder="Your username"
    >
    <button 
      id="prompt-submit"
      class="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
    >
      Submit
    </button>
  </div>
</div>
    `
}
