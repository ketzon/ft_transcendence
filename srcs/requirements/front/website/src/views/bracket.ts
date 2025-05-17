import {player1, player2, player3, player4} from "../selectgames"

export function bracketView(): string {
    return /*html*/ `
    <div class="bg-[url(https://culturezvous.com/wp-content/uploads/2018/09/MV5BYWI3ZDU2MDgtYTBkYy00ZDFkLWIxZDYtODQxZjYxNDE1OTljL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg)] bg-center bg-contain bg-no-repeat flex justify-center items-center min-h-screen">
        <div class="w-full max-w-2xl mx-auto">
            <div class="flex justify-center mb-16">
                <div id="match-title-bg" class="inline-block bg-purple-300 rounded border border-purple-700 p-4">
                    <h1 id="match-title" class="text-black font-bold text-center mb-0"></h1>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-6">
                    <!-- match 1 -->
                    <div id="match1-bg" class="bg-green-200 opacity-85 hover:opacity-95 rounded border border-violet-400 p-4">
                        <div class="flex justify-between items-center mb-2">
                            <span id="player1-name">${player1}</span>
                            <span id="match1-icon1" class="match-icon">⚔️</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span id="player2-name">${player2}</span>
                            <span id="match1-icon2" class="match-icon">⚔️</span>
                        </div>
                    </div>
                    <!-- match 2 -->
                    <div id="match2-bg" class="bg-white opacity-85 hover:opacity-95 rounded border border-violet-400 p-4">
                        <div class="flex justify-between items-center mb-2">
                            <span id="player3-name">${player3}</span>
                            <span id="match2-icon1" class="match-icon">⚔️</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span id="player4-name">${player4}</span>
                            <span id="match2-icon2" class="match-icon">⚔️</span>
                        </div>
                    </div>
                </div>
               
                <!-- match final -->
                <div class="flex items-center">
                    <div id="match3-bg" class="bg-white opacity-85 hover:opacity-95 rounded border border-violet-400 p-4 w-full">
                        <div class="flex justify-between items-center mb-2">
                            <span id="finalist1-name">Winner 1</span>
                            <span id="final-icon1" class="match-icon">🏆</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span id="finalist2-name">Winner 2</span>
                            <span id="final-icon2" class="match-icon">🏆</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-8 text-center">
                <button id="start-game" class="border border-purple-700 bg-purple-300 text-white py-2 px-6 rounded hover:bg-red-300 transition-colors">
                    START MATCH
                </button>
            </div>
        </div>
    </div>
    `
}

