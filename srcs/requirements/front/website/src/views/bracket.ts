import {player1, player2, player3, player4} from "../selectgames"
export function bracketView(): string {
    return /*html*/ `
    <div class="m-4 p-4">
        <!-- Structure simple en grille -->
        <div class="grid grid-cols-2 gap-4">
            <!-- Matches de gauche -->
            <div class="space-y-4">
                <!-- Match 1 -->
                <div class="bg-white rounded border border-gray-300 p-2">
                    <div class="flex justify-between mb-1 text-lime-500">
                        <span id="player1-name">${player1}</span>
                        <span id="player1-score">0</span>
                    </div>
                    <div class="flex justify-between text-lime-500">
                        <span id="player2-name">${player2}</span>
                        <span id="player2-score">0</span>
                    </div>
                </div>
                
                <!-- Match 2 -->
                <div class="bg-white rounded border border-gray-300 p-2">
                    <div class="flex justify-between mb-1">
                        <span id="player3-name">${player3}</span>
                        <span id="player3-score">0</span>
                    </div>
                    <div class="flex justify-between">
                        <span id="player4-name">${player4}</span>
                        <span id="player4-score">0</span>
                    </div>
                </div>
            </div>
            
            <!-- Match final au centre -->
            <div class="flex justify-center items-center">
                <div class="bg-white rounded border border-gray-300 p-2 w-full">
                    <div class="flex justify-between mb-1">
                        <span id="finalist1-name">Winner 1</span>
                        <span id="finalist1-score">0</span>
                    </div>
                    <div class="flex justify-between">
                        <span id="finalist2-name">Winner 2</span>
                        <span id="finalist2-score">0</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Bouton démarrer -->
        <div class="mt-6 text-center">
            <button id="start-game" class="bg-blue-500 text-white py-1 px-4 rounded">
                Start
            </button>
        </div>
    </div>
    `
}

export function semiView(): string {
    return /*html*/ `
    <div class="m-4 p-4">
        <!-- Structure simple en grille -->
        <div class="grid grid-cols-2 gap-4">
            <!-- Matches de gauche -->
            <div class="space-y-4">
                <!-- Match 1 -->
                <div class="bg-white rounded border border-gray-300 p-2">
                    <div class="flex justify-between mb-1 ">
                        <span id="player1-name">${player1}</span>
                        <span id="player1-score">0</span>
                    </div>
                    <div class="flex justify-between ">
                        <span id="player2-name">${player2}</span>
                        <span id="player2-score">0</span>
                    </div>
                </div>
                
                <!-- Match 2 -->
                <div class="bg-white rounded border border-gray-300 p-2">
                    <div class="flex justify-between mb-1 text-lime-500">
                        <span id="player3-name">${player3}</span>
                        <span id="player3-score">0</span>
                    </div>
                    <div class="flex justify-between text-lime-500">
                        <span id="player4-name">${player4}</span>
                        <span id="player4-score">0</span>
                    </div>
                </div>
            </div>
            
            <!-- Match final au centre -->
            <div class="flex justify-center items-center">
                <div class="bg-white rounded border border-gray-300 p-2 w-full">
                    <div class="flex justify-between mb-1">
                        <span id="finalist1-name">Winner 1</span>
                        <span id="finalist1-score">0</span>
                    </div>
                    <div class="flex justify-between">
                        <span id="finalist2-name">Winner 2</span>
                        <span id="finalist2-score">0</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Bouton démarrer -->
        <div class="mt-6 text-center">
            <button id="start-game" class="bg-blue-500 text-white py-1 px-4 rounded">
                Start
            </button>
        </div>
    </div>
    `
}
