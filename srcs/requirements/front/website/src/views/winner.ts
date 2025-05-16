export function winnerView(): string{
    return `
<div id="tournament-victory-background" class="flex flex-col items-center justify-center min-h-screen bg-[#fdf8e1] p-4 text-white">
    <div class="flex flex-col items-center">
        <!-- Titre principal -->
        <h1 class="text-6xl sm:text-7xl md:text-8xl font-bold text-center mb-8 text-purple-200  ">
            <span id="tournament-winner">PLAYER</span> won the tournament!🏆
        </h1>
        
        
        
        <!-- Bouton pour quitter -->
        <button id="leave-pong-button" class="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-full text-xl transform transition duration-300 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50">
            Leave tournament
        </button>
    </div>
</div>`
}
