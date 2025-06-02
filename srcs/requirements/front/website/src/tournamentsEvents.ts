import { Player, Game, Round, Tournament } from './types/gameTypes';

interface State {
    loading: boolean;
    serverUrl: string | null;
    tours: Tournament[];
    selectedTourJson: Tournament | null;
    myId: number;
    unknownPlayer: Player;
}

let state: State = {
    loading: true,
    serverUrl: null,
    tours: [],
    selectedTourJson: null,
    myId: 1,
    unknownPlayer: { id: 0, username: 'unknown', avatar: 'png/avatar.png' }
};

document.getElementById('create-tour')?.addEventListener('click', (e) => {
    e.preventDefault();
    createTour();
});

function normalizeTournament(t: any): Tournament {
    const normalizedPlayers = (t.players || []).map((p: any, idx: number) =>
        typeof p === 'string'
            ? { id: idx + 1, username: p, avatar: `https://robohash.org/${p}?set=set4` }
            : p
    );

    return {
        ...t,
        start_time: t.start_time || t.date || '',
        name: t.tournamentName || `Tournament ${t.id}`,
        players: normalizedPlayers,
        rounds: (t.rounds || []).map((r: any) => ({
            ...r,
            players: normalizedPlayers, // Ajoute cette ligne
            games: r.games || [{
                player1: { id: 0, username: r.player1 || 'unknown', avatar: '' },
                player2: { id: 0, username: r.player2 || 'unknown', avatar: '' },
                score1: r.score1, score2: r.score2,
                is_completed: true
            }]
        }))
    };
}
export async function initializeTournaments() {
    try {
        const res = await fetch("http://localhost:3000/api/tournaments", { credentials: "include" });
        console.log("📌 State Tour", state.tours);
        const tournaments = await res.json();
        state.tours = tournaments.map(normalizeTournament);
        state.loading = false;
        state.serverUrl = 'http://localhost:5173';
        state.selectedTourJson = null;
        // document.getElementById('create-tour')?.addEventListener('click', createTour);
        updateTournamentDiv();
    } catch (error) {
        console.error("Error initializing tournaments:", error);
    }
}

async function createTour() {
    try {
        const name = prompt("Enter tournament name:");
        if (!name) return;
        const res = await fetch("http://localhost:3000/api/tournaments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name })
        });
        const newTour = await res.json();
        state.selectedTourJson = newTour;
        await initializeTournaments();
        // updateTournamentDiv();
    } catch (error) {
        console.error("Error creating tour:", error);
    }
}

async function showTour(tourId: string) {
    try {
        const res = await fetch(`http://localhost:3000/api/tournaments/${tourId}`, { credentials: "include" });

        const tournament = normalizeTournament(await res.json());
        state.selectedTourJson = tournament;
        console.log("✅ Tournois ", tournament);
        updateTournamentDiv();
    } catch (error) {
        console.error("Error showing tour:", error);
    }
}

function updateTournamentsList() {
    const tournamentsList = document.getElementById('tournaments-list');
    if (!tournamentsList) return;
    tournamentsList.innerHTML = '';
    tournamentsList.innerHTML = state.tours.slice().reverse().map((t: Tournament) => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150 ${state.selectedTourJson?.id === t.id ? 'ring-2 ring-[#8672FF]' : ''}">
            <span class="text-gray-700 font-medium truncate">${t.tournamentName}</span>
            <button class="show-tour ml-2 px-3 py-1 text-sm bg-[#8672FF] text-white rounded hover:bg-[#6a5acc]" data-id="${t.id}">
                Show
            </button>
        </div>
    `).join('');
    tournamentsList.querySelectorAll('.show-tour').forEach(button => {
        button.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const id = target.dataset.id;
            if (id) showTour(id);
        });
    });
}

function renderGameHtml(game: Game): string {
    const getPlayerHtml = (player: Player | null, isWinner: boolean, badge: string) => `
        <div class="flex flex-col items-center relative">
            ${badge ? `<div class="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl" style="text-shadow: 0 0 5px #FFD700;">${badge}</div>` : ''}
            <img src="${player?.avatar || 'png/avatar.png'}"
                class="w-12 h-12 rounded-full object-cover ${isWinner ? 'ring-4 ring-yellow-400' : 'opacity-75'}"
                alt="${player?.username || 'Unknown'}">

            <div class="mt-2 text-sm font-medium ${isWinner ? 'text-green-600' : 'text-gray-500'}">
                ${player?.username || 'Unknown'}
            </div>
        </div>`;
    if (game.is_bye) {
        return `
            <div class="flex items-center p-4 bg-blue-50 rounded-lg mb-3 border border-blue-200">
                ${getPlayerHtml(game.player1, true, '')}
                <div class="flex-1 ml-4">
                    <div class="text-blue-600 font-medium">${game.player1?.username} automatically advances</div>
                    <div class="text-sm text-blue-500">Qualified for next round</div>
                </div>
                <div class="text-2xl font-bold text-blue-400 ml-4">BYE</div>
            </div>
        `;
    }
    const player1Wins = game.score1 > game.score2;
    const player2Wins = game.score2 > game.score1;
    return `
        <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-3">
            ${getPlayerHtml(game.player1, player1Wins, game.is_completed && player1Wins ? '👑' : '')}
            <div class="flex flex-col items-center justify-center mx-4">
                <div class="text-2xl font-bold text-gray-700">
                    ${game.is_completed ? game.score1 : '...'} - ${game.is_completed ? game.score2 : '...'}
                </div>
                ${game.is_completed ? 
                    `<div class="text-sm text-gray-500 mt-1">Completed</div>` : 
                    `<div class="text-sm text-yellow-600 mt-1">In Progress</div>`
                }
            </div>
            ${getPlayerHtml(game.player2, player2Wins, game.is_completed && player2Wins ? '👑' : '')}
        </div>
    `;
}

function renderGamesHtml(tournament: Tournament): string {
    const roundGames = (games: Game[]) => {
        return games.length > 0
            ? games.map(game => renderGameHtml(game)).join('')
            : '<div class="text-gray-500 bg-gray-50 p-4 rounded-lg">No games found in this round</div>';
    };
    const rounds = tournament.rounds;
    if (!rounds || rounds.length === 0)
        return '<div class="text-gray-500 bg-gray-50 p-4 rounded-lg">No rounds found</div>';
    return rounds.map((round: Round, index: number) => `
        <div class="mb-6">
            <h3 class="text-lg font-semibold text-[#8672FF] mb-3">Round ${index + 1}</h3>
            <div class="space-y-3">
                ${round.games?.length > 0
                    ? roundGames(round.games)
                    : '<div class="text-gray-500 bg-gray-50 p-4 rounded-lg">No games in this round</div>'}
            </div>
        </div>
    `).join('');
}


function calculateRatings(tournament: Tournament): (Player & { rating: number })[] {
    if (!tournament.rounds) return [];
    const ratingsMap = new Map<string, Player & { rating: number }>();
    tournament.rounds.forEach((round: Round) => {
        if (!round.games || !round.players) return;
        const roundRatings = new Map(
            round.players.map((player: Player) => [player.username, { ...player, rating: 0 }])
        );
        round.games.forEach((game: Game) => {
            if (game.score1 > game.score2 && game.player1) {
                const player = roundRatings.get(typeof game.player1 === 'string' ? game.player1 : game.player1.username);
                if (player) player.rating++;
            } else if (game.score2 > game.score1 && game.player2Name) {
                const player = roundRatings.get(game.player2Name);
                if (player) player.rating++;
            }
        });
        roundRatings.forEach((player, username) => {
            const existingPlayer = ratingsMap.get(username);
            if (existingPlayer)
                existingPlayer.rating += player.rating;
            else
                ratingsMap.set(username, player);
        });
    });
    const sortedPlayers= Array.from(ratingsMap.values()).sort((a, b) => b.rating - a.rating);
      sortedPlayers.forEach((player, index) => {
    (player as Player & { rank: number }).rank = index + 1;
  });

  return sortedPlayers;
}


function updateTournamentDiv() {
    updateTournamentsList();
    console.log("🎯 Les donnees dans UTDiv", state.selectedTourJson);
    const content = document.getElementById('tournament-content');
    if (!content) return;
    if (!state.selectedTourJson) {
        content.innerHTML = `
            <div class="text-center py-12">
                <h3 class="text-xl font-medium text-gray-500">Select a tournament to view details</h3>
                <p class="text-gray-400 mt-2">Choose from the list on the left</p>
            </div>`;
        return;
    }

    const tour = state.selectedTourJson;
    console.log("Tour sélectionné :", tour);
    
    let contentHtml = `
        <div class="space-y-6">
            <div class="border-b border-gray-200 pb-4">
                <h2 class="text-2xl font-bold text-gray-800">${tour.name || `Tournament ${tour.id}`}</h2>
                <p class="text-gray-500 mt-2">Starts at ${new Date(tour.start_time).toLocaleString()}</p>
            </div>
            <div class="grid grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Tournament Rounds</h3>
                    ${renderGamesHtml(tour)}
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2">Tournament Ratings</h3>
                    <p class="text-sm text-gray-500 mb-4">(${tour.players.length} players)</p>
                    <div class="bg-gray-50 p-4 rounded-lg space-y-3">
                        ${calculateRatings(tour).map(user => {
                            const userWithRank = user as Player & { rank: number };
                            return `
                            <div class="flex items-center space-x-3">
                                <img src="${user.avatar || 'https://via.placeholder.com/40'}" class="w-10 h-10 rounded-full object-cover" alt="${user.username}">
                                <div class="flex-1">
                                    <div class="text-sm font-medium text-gray-900">${userWithRank.username}</div>
                                    <div class="text-sm text-gray-500">Rank: ${userWithRank.rank} | Victories: ${user.rating}</div>

                                 </div>
                            </div>
                        `;}).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    content.innerHTML = contentHtml;
}
