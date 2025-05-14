export function selectView(): string {
    return /*html*/`
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
