import { background } from "./pong"


export function selectView(): string {
  return /*html*/`
    <div id="custom-prompt" class=" ${background} bg-no-repeat bg-center bg-contain bg-white/60 min-h-screen flex justify-center items-center bg-opacity-50 hidden">
      <div class="bg-white opacity-85 p-6 rounded-lg shadow-xl max-w-md w-full">
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

