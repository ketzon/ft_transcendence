import {player1, player2, player3, player4} from "../selectgames"

export function bracketView(): string {
    return /*html*/ `
    <div class="flex justify-center items-center min-h-screen">
        <div class="w-full max-w-2xl mx-auto">
            <!-- structure simple en grille -->
            <h1 id="match-title" class="font-bold text-center mb-15"></h1>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- matches de gauche -->
                <div class="space-y-6">
                    <!-- match 1 -->
                    <div class="bg-white rounded border border-gray-300 p-4">
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
                    <div class="bg-white rounded border border-gray-300 p-4">
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
                    <div class="bg-white rounded border border-gray-300 p-4 w-full">
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
            <!-- bouton démarrer -->
            <div class="mt-8 text-center">
                <button id="start-game" class="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition-colors">
                    Start
                </button>
            </div>
        </div>
    </div>
    `
}
