// export function winnerView(): string{
//     return `
// <div id="tournament-victory-background" class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 p-4 text-white">
//     <div class="flex flex-col items-center transform scale-100 animate-pulse">
//         <!-- Couronne au-dessus du texte -->
//         <svg class="w-32 h-32 text-yellow-400 mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//             <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-0.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.97 3.97 0 0115 15a3.977 3.977 0 01-2.786-1.142 1 1 0 01-.285-1.05l1.715-5.349L10 6.477 6.356 7.459l1.715 5.349a1 1 0 01-.285 1.05A3.977 3.977 0 015 15a3.977 3.977 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clip-rule="evenodd"></path>
//         </svg>

//         <!-- Animation de confetti -->
//         <div class="absolute inset-0 pointer-events-none">
//             <div class="absolute left-1/4 top-1/4 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
//             <div class="absolute left-3/4 top-1/3 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
//             <div class="absolute left-1/2 top-1/4 w-5 h-5 bg-blue-400 rounded-full animate-ping"></div>
//             <div class="absolute left-1/3 top-2/3 w-4 h-4 bg-pink-400 rounded-full animate-ping"></div>
//             <div class="absolute left-2/3 top-3/4 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
//         </div>
        
//         <!-- Titre principal -->
//         <h1 class="text-6xl sm:text-7xl md:text-8xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-200 animate-pulse">
//             <span id="tournament-winner">PLAYER</span> A GAGNÉ LE TOURNOI!
//         </h1>
        
//         <!-- Trophée -->
//         <div class="p-6 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full shadow-lg animate-bounce mb-12">
//             <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-yellow-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
//             </svg>
//         </div>
        
//         <!-- Message de félicitations -->
//         <p class="text-xl sm:text-2xl text-center max-w-2xl mb-12 text-indigo-100">
//             Félicitations pour cette victoire éclatante! Vous avez démontré une technique impressionnante et une détermination sans faille.
//         </p>
        
//         <!-- Bouton pour quitter -->
//         <button id="leave-pong-button" class="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-full text-xl transform transition duration-300 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50">
//             Quitter le Pong
//         </button>
//     </div>
// </div>`
// }
export function winnerView(): string{
    return `
<div id="tournament-victory-background" class="flex flex-col items-center justify-center min-h-screen bg-black p-4 text-white">
    <div class="flex flex-col items-center">
        <!-- Titre principal -->
        <h1 class="text-6xl sm:text-7xl md:text-8xl font-bold text-center mb-8 text-white  bg-black">
            <span id="tournament-winner">PLAYER</span> won the tournament!🏆
        </h1>
        
        
        
        <!-- Bouton pour quitter -->
        <button id="leave-pong-button" class="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-full text-xl transform transition duration-300 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50">
            Leave tournament
        </button>
    </div>
</div>`
}
