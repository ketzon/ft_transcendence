import { background } from "./pong"


export function selectView(): string {
  return /*html*/`

    <div id="custom-prompt" class=" ${background} bg-no-repeat bg-center bg-[length:100%_100%] min-h-screen flex justify-center items-center bg-opacity-50 hidden">
      <div class="bg-white opacity-85 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 id="prompt-title" class="text-xl font-bold text-purple-800 mb-4">Enter Username</h3>
        <input 
          type="text" 
          id="prompt-input" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          placeholder="Enter a name"
        >
        <button 
          id="prompt-submit"
          class="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
    <!-- Prompt tournoi -->
    <div id="custom-prompt-tournament" class="${background} bg-no-repeat bg-center bg-[length:100%_100%] min-h-screen flex justify-center items-center bg-opacity-50 hidden">
      <div class="bg-indigo-100 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 id="prompt-title-tournament" class="text-xl font-bold text-indigo-700 mb-4">Enter Tournament Name</h3>
        <input 
          type="text" 
          id="prompt-input-tournament" 
          class="w-full px-3 py-2 border border-indigo-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-4"
          placeholder="e.g. Grand Winter Cup"
        >
        <button 
          id="prompt-submit-tournament"
          class="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create Tournament
        </button>
      </div>
    </div>
  `;
}

