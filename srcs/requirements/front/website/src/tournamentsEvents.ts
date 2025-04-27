import { STORAGE_KEYS } from './types/constants';
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
    myId: 1, // tmp Mock user ID
    unknownPlayer: { id: 0, username: 'unknown', avatar: 'png/avatar.png' }
};

export async function initializeTournaments() {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const storedTournaments = getFromLocalStorage(STORAGE_KEYS.TOURNAMENTS);
        if (!storedTournaments) {
            saveToLocalStorage(STORAGE_KEYS.TOURNAMENTS, mockData.tours);
            state.tours = mockData.tours;
        } else
            state.tours = storedTournaments;
        state = {
            ...state,
            loading: false,
            serverUrl: 'http://localhost:5173',
            tours: getFromLocalStorage(STORAGE_KEYS.TOURNAMENTS) || [],
            selectedTourJson: null
        };
        document.getElementById('create-tour')?.addEventListener('click', createTour);
        updateTournamentDiv();
    } catch (error) {
        console.error("Error initializing tournaments:", error);
    }
} 

async function createTour() {
    try {
        const name = prompt("Enter tournament name:");
        if (!name) return;
        const response = await postData("/tour/create/", { name });
        if (response.warning)
            alert(response.warning);
        state.selectedTourJson = response.tour;
        state.tours = await fetchData("/tours/");
        updateTournamentDiv();
        await new Promise(resolve => setTimeout(resolve, 7000));

        if (state.selectedTourJson) {
            const tournaments = getFromLocalStorage(STORAGE_KEYS.TOURNAMENTS);
            const tourId = tournaments.findIndex((t: Tournament) => t.id === state.selectedTourJson?.id);
            
            if (tourId !== -1) {
                let currentPlayers = [...tournaments[tourId].players];
                const rounds: Round[] = [];

                while (currentPlayers.length > 1) {
                    // Create a new round with games not completed
                    let round = startRound(currentPlayers);
                    rounds.push(round);
                    tournaments[tourId].rounds = rounds;
                    tournaments[tourId].isInvitationPhase = false;
                    saveToLocalStorage(STORAGE_KEYS.TOURNAMENTS, tournaments);
                    state.selectedTourJson = tournaments[tourId];
                    state.tours = tournaments;
                    updateTournamentDiv();

                    // Wait 5 seconds
                    await new Promise(resolve => setTimeout(resolve, 5000));

                    // Generate random scores for games
                    round.games = round.games.map(game => {
                        if (!game.is_bye) {
                            let score1, score2;
                            do {
                                score1 = Math.floor(Math.random() * 11);
                                score2 = Math.floor(Math.random() * 11);
                            } while (score1 === score2);
                            game.score1 = score1;
                            game.score2 = score2;
                            game.is_completed = true;
                        }
                        return game;
                    });

                    // Get winners for next round
                    const winners: Player[] = [];
                    round.games.forEach(game => {
                        if (game.is_bye && game.player1) {
                            winners.push(game.player1);
                        } else if (game.player1 && game.player2) {
                            winners.push(game.score1 > game.score2 ? game.player1 : game.player2);
                        }
                    });

                    // Update state and display
                    tournaments[tourId].rounds = rounds;
                    saveToLocalStorage(STORAGE_KEYS.TOURNAMENTS, tournaments);
                    state.selectedTourJson = tournaments[tourId];
                    state.tours = tournaments;
                    updateTournamentDiv();

                    // Update players for next round
                    currentPlayers = winners;
                }
            }
        }
    } catch (error) {
        console.error("Error creating tour:", error);
    }
}

async function joinTour() {
    try {
        await postData(`/tour/join/${state.selectedTourJson?.id}/`, {});
    } catch (error) {
        console.error("Error joining tour:", error);
    }
    showTour(state.selectedTourJson?.id.toString() || '');
}

async function showTour(tourId: string) {
    try {
        const tours = await fetchData("/tours/");
        state.tours = tours.sort((a: Tournament, b: Tournament) => a.id - b.id);
        state.selectedTourJson = tours.find((t: Tournament) => t.id === parseInt(tourId)) || null;
        updateTournamentDiv();
    } catch (error) {
        console.error("Error showing tour:", error);
    }
}

function updateTournamentsList() {
    const tournamentsList = document.getElementById('tournaments-list');
    if (!tournamentsList) return;
    tournamentsList.innerHTML = state.tours.slice().reverse().map((t: Tournament) => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150 ${state.selectedTourJson?.id === t.id ? 'ring-2 ring-[#8672FF]' : ''}">
            <span class="text-gray-700 font-medium truncate">${t.name}</span>
            <button class="show-tour ml-2 px-3 py-1 text-sm bg-[#8672FF] text-white rounded hover:bg-[#6a5acc] transition-colors duration-150" data-id="${t.id}">
                Show
            </button>
        </div>
    `).join('');
    tournamentsList.querySelectorAll('.show-tour').forEach(button => {
        button.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            showTour(target.dataset.id || '');
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
            <h3 class="text-lg font-semibold text-[#8672FF] mb-3">Round ${index + 1} (${round.players.length} players)</h3>
            <div class="space-y-3">
                ${round.games?.length > 0
                    ? roundGames(round.games)
                    : '<div class="text-gray-500 bg-gray-50 p-4 rounded-lg">No games in this round</div>'}
            </div>
        </div>
    `).join('');
}

function updateTournamentDiv() {
    updateTournamentsList();

    const content = document.getElementById('tournament-content');
    if (!content) return;
    if (!state.selectedTourJson) {
        content.innerHTML = `
            <div class="text-center py-12">
                <h3 class="text-xl font-medium text-gray-500">Select a tournament to view details</h3>
                <p class="text-gray-400 mt-2">Choose from the list on the left</p>
            </div>
        `;
        return;
    }
    let contentHtml = `
        <div class="space-y-6">
            <div class="border-b border-gray-200 pb-4">
                <h2 class="text-2xl font-bold text-gray-800">${state.selectedTourJson.name}</h2>
                <p class="text-gray-500 mt-2">Starts at ${new Date(state.selectedTourJson.start_time).toLocaleString()}</p>
            </div>
    `;

    // Afficher la liste des utilisateurs pendant la phase d'invitation
    if (state.selectedTourJson.isInvitationPhase) {
        contentHtml += `
            <div class="bg-white rounded-lg shadow">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-[#8672FF]">Inviting Players!</h3>
                    </div>
                    <div class="space-y-4">
                        ${mockSiteUsers.map(user => {
                            const isInTournament = state.selectedTourJson?.players.some(p => p.id === user.id);
                            return `
                                <div class="flex items-center justify-between p-4 bg-purple-50 rounded-lg transition-colors duration-150">
                                    <div class="flex items-center space-x-4">
                                        <div class="relative">
                                            <img src="${user.avatar}" alt="${user.username}" 
                                                class="w-12 h-12 rounded-full object-cover">
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">${user.username}</h4>
                                        </div>
                                    </div>
                                    ${isInTournament ? 
                                        `<span class="px-4 py-2 text-green-600 font-medium">Joined</span>` :
                                        `<button class="accept-invitation px-4 py-2 bg-[#8672FF] text-white rounded-lg hover:bg-[#6a5acc] transition-colors duration-150"
                                            data-user-id="${user.id}">
                                            Accept Invitation
                                        </button>`
                                    }
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;

        content.innerHTML = contentHtml;

        // Ajouter les écouteurs d'événements pour les boutons d'acceptation
        content.querySelectorAll('.accept-invitation').forEach(button => {
            button.addEventListener('click', async (event) => {
                const target = event.target as HTMLElement;
                const userId = parseInt(target.dataset.userId || '0');
                const user = mockSiteUsers.find(u => u.id === userId);
                if (user && state.selectedTourJson) {
                    const tournaments = getFromLocalStorage(STORAGE_KEYS.TOURNAMENTS);
                    const tourIndex = tournaments.findIndex((t: Tournament) => t.id === state.selectedTourJson?.id);
                    if (tourIndex !== -1) {
                        tournaments[tourIndex].players.push(user);
                        saveToLocalStorage(STORAGE_KEYS.TOURNAMENTS, tournaments);
                        state.selectedTourJson.players.push(user);
                        state.tours = tournaments;
                        updateTournamentDiv();
                    }
                }
            });
        });

        return;
    }

    // Afficher le contenu normal du tournoi
    const tourStarted = new Date() >= new Date(state.selectedTourJson.start_time);
    const iamInTour = state.selectedTourJson.players?.some(p => p.id === state.myId) || false;
    const playersCount = state.selectedTourJson.players?.length || 0;
    const roundsCount = state.selectedTourJson.rounds?.length || 0;
    if (!tourStarted && iamInTour) {
        contentHtml += `
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-blue-700">You are registered. The tournament starts soon.</p>
                    </div>
                </div>
            </div>
        `;
    } else if (!tourStarted && !iamInTour) {
        contentHtml += `
            <div class="bg-white p-4 rounded-lg border border-gray-200">
                <button id="join-tour" class="w-full bg-[#8672FF] text-white px-4 py-2 rounded hover:bg-[#6a5acc] transition-colors duration-150">
                    Join Tournament
                </button>
            </div>
        `;
    } else if (tourStarted && playersCount === 0) {
        contentHtml += `
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-yellow-700">No players registered, the tournament is canceled.</p>
                    </div>
                </div>
            </div>
        `;
    } else if (tourStarted && playersCount === 1) {
        contentHtml += `
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-yellow-700">Only one player registered, the tournament is canceled.</p>
                    </div>
                </div>
            </div>
        `;
    } else if (tourStarted && playersCount > 1 && roundsCount === 0) {
        contentHtml += `
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-yellow-700">There are no rounds yet.</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        treatUnknownPlayers(state.selectedTourJson);
        contentHtml += `
            <div class="grid grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Tournament Rounds</h3>
                    ${renderGamesHtml(state.selectedTourJson)}
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2">Tournament Ratings</h3>
                    <p class="text-sm text-gray-500 mb-4">(${state.selectedTourJson.players.length} players)</p>
                    <div class="bg-gray-50 p-4 rounded-lg space-y-3">
                        ${calculateRatings(state.selectedTourJson).map(user => `
                            <div class="flex items-center space-x-3">
                                <img src="${user.avatar}"
                                    class="w-10 h-10 rounded-full object-cover"
                                    alt="${user.username}">
                                <div class="flex-1">
                                    <div class="text-sm font-medium text-gray-900">${user.username}</div>
                                    <div class="text-sm text-gray-500">Rating: ${user.rating}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    contentHtml += '</div>';
    content.innerHTML = contentHtml;
    document.getElementById('join-tour')?.addEventListener('click', () => joinTour());
}

///////////////////////////////////////////////////////// tools

// les fonctions API simulées par des opérations localStorage
async function fetchData(endpoint: string): Promise<any> {
    switch (endpoint) {
        case '/tours/':
            return getFromLocalStorage(STORAGE_KEYS.TOURNAMENTS) || [];
        case '/env/server-url':
            return { SERVER_URL: 'http://localhost:5173' };
        case '/api/auth/me':
            return { user: { id: 1, username: 'CurrentUser' } };
        default:
            return null;
    }
}

async function postData(endpoint: string, data: any): Promise<any> {
    if (endpoint.includes('/tour/create/')) {
        const randomPlayers = getRandomPlayers();
        const newTour: Tournament = {
            id: Date.now(),
            name: data.name,
            start_time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            players: randomPlayers,
            rounds: [],
            isInvitationPhase: true
        };
        const tournaments = getFromLocalStorage(STORAGE_KEYS.TOURNAMENTS) || [];
        tournaments.push(newTour);
        saveToLocalStorage(STORAGE_KEYS.TOURNAMENTS, tournaments);
        return { tour: newTour };
    }

    if (endpoint.includes('/tour/join/')) {
        const tournaments = getFromLocalStorage(STORAGE_KEYS.TOURNAMENTS) || [];
        const tourId = parseInt(endpoint.split('/')[3]);
        const tourIndex = tournaments.findIndex((t: Tournament) => t.id === tourId);

        if (tourIndex !== -1) {
            const currentUser = { id: 1, username: "Atlas", avatar: "https://robohash.org/Atlas?set=set4" };
            if (!tournaments[tourIndex].players.some((p: Player) => p.id === currentUser.id)) {
                tournaments[tourIndex].players.push(currentUser);
                saveToLocalStorage(STORAGE_KEYS.TOURNAMENTS, tournaments);
            }
        }
        return { success: true };
    }

    return null;
}

function calculateRatings(tournament: Tournament): (Player & { rating: number })[] {
    if (!tournament.rounds) return [];
    const ratingsMap = new Map<number, Player & { rating: number }>();
    tournament.rounds.forEach((round: Round) => {
        if (!round.games || !round.players) return;
        const roundRatings = new Map(
            round.players.map((player: Player) => [player.id, { ...player, rating: 0 }])
        );
        round.games.forEach((game: Game) => {
            if (game.score1 > game.score2 && game.player1) {
                const player = roundRatings.get(game.player1.id);
                if (player) player.rating++;
            } else if (game.score2 > game.score1 && game.player2) {
                const player = roundRatings.get(game.player2.id);
                if (player) player.rating++;
            }
        });
        roundRatings.forEach((player, id) => {
            const existingPlayer = ratingsMap.get(id);
            if (existingPlayer)
                existingPlayer.rating += player.rating;
            else
                ratingsMap.set(id, player);
        });
    });
    return Array.from(ratingsMap.values()).sort((a, b) => b.rating - a.rating);
}

function treatUnknownPlayers(tournament: Tournament): void {
    tournament.rounds?.forEach((round: Round) => {
        round.games?.forEach((game: Game) => {
            game.player1 = game.player1 || state.unknownPlayer;
            game.player2 = game.player2 || state.unknownPlayer;
        });
    });
}

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function generateMatches(players: Player[]): Game[] {
    const shuffledPlayers = shuffleArray(players);
    const matches: Game[] = [];
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
        if (i + 1 < shuffledPlayers.length) {
            matches.push({
                player1: shuffledPlayers[i],
                player2: shuffledPlayers[i + 1],
                score1: 0,
                score2: 0,
                is_completed: false
            });
        } else {
            matches.push({
                player1: shuffledPlayers[i],
                player2: null,
                score1: 0,
                score2: 0,
                is_completed: true,
                is_bye: true
            });
        }
    }
    return matches;
}

function startRound(players: Player[]): Round {
    return {
        players: [...players],
        games: generateMatches(players)
    };
}

function getRandomPlayers(minPlayers: number = 4, maxPlayers: number = 10): Player[] {
    const shuffledPlayers = [...mockSiteUsers].sort(() => Math.random() - 0.5);
    const numPlayers = Math.floor(Math.random() * (maxPlayers - minPlayers + 1)) + minPlayers;
    return shuffledPlayers.slice(0, numPlayers);
}

function saveToLocalStorage(key: string, data: any): void {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving to localStorage: ${error}`);
    }
}

function getFromLocalStorage(key: string): any {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error reading from localStorage: ${error}`);
        return null;
    }
}

const mockData = {
    tours: [
        {
            id: 1,
            name: "Pixel Pioneers Championship",
            start_time: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
            players: [
                { id: 1, username: "Atlas", avatar: "https://robohash.org/Atlas?set=set4" },
                { id: 2, username: "Phoenix", avatar: "https://robohash.org/Phoenix?set=set4" },
                { id: 3, username: "Orion", avatar: "https://robohash.org/Orion?set=set4" },
                { id: 4, username: "Luna", avatar: "https://robohash.org/Luna?set=set4" },
                { id: 5, username: "Nova", avatar: "https://robohash.org/Nova?set=set4" },
                { id: 6, username: "Cosmos", avatar: "https://robohash.org/Cosmos?set=set4" },
                { id: 7, username: "Stellar", avatar: "https://robohash.org/Stellar?set=set4" },
                { id: 8, username: "Nebula", avatar: "https://robohash.org/Nebula?set=set4" },
                { id: 9, username: "Vega", avatar: "https://robohash.org/Vega?set=set4" },
                { id: 10, username: "Lyra", avatar: "https://robohash.org/Lyra?set=set4" }
            ],
            rounds: [
                {
                    players: [
                        { id: 1, username: "Atlas", avatar: "https://robohash.org/Atlas?set=set4" },
                        { id: 2, username: "Phoenix", avatar: "https://robohash.org/Phoenix?set=set4" },
                        { id: 3, username: "Orion", avatar: "https://robohash.org/Orion?set=set4" },
                        { id: 4, username: "Luna", avatar: "https://robohash.org/Luna?set=set4" },
                        { id: 5, username: "Nova", avatar: "https://robohash.org/Nova?set=set4" },
                        { id: 6, username: "Cosmos", avatar: "https://robohash.org/Cosmos?set=set4" },
                        { id: 7, username: "Stellar", avatar: "https://robohash.org/Stellar?set=set4" },
                        { id: 8, username: "Nebula", avatar: "https://robohash.org/Nebula?set=set4" },
                        { id: 9, username: "Vega", avatar: "https://robohash.org/Vega?set=set4" },
                        { id: 10, username: "Lyra", avatar: "https://robohash.org/Lyra?set=set4" }
                    ],
                    games: [
                        {
                            player1: { id: 1, username: "Atlas", avatar: "https://robohash.org/Atlas?set=set4" },
                            player2: { id: 2, username: "Phoenix", avatar: "https://robohash.org/Phoenix?set=set4" },
                            score1: 5,
                            score2: 3,
                            is_completed: true
                        },
                        {
                            player1: { id: 3, username: "Orion", avatar: "https://robohash.org/Orion?set=set4" },
                            player2: { id: 4, username: "Luna", avatar: "https://robohash.org/Luna?set=set4" },
                            score1: 5,
                            score2: 2,
                            is_completed: true
                        },
                        {
                            player1: { id: 5, username: "Nova", avatar: "https://robohash.org/Nova?set=set4" },
                            player2: { id: 6, username: "Cosmos", avatar: "https://robohash.org/Cosmos?set=set4" },
                            score1: 4,
                            score2: 5,
                            is_completed: true
                        },
                        {
                            player1: { id: 7, username: "Stellar", avatar: "https://robohash.org/Stellar?set=set4" },
                            player2: { id: 8, username: "Nebula", avatar: "https://robohash.org/Nebula?set=set4" },
                            score1: 5,
                            score2: 1,
                            is_completed: true
                        },
                        {
                            player1: { id: 9, username: "Vega", avatar: "https://robohash.org/Vega?set=set4" },
                            player2: { id: 10, username: "Lyra", avatar: "https://robohash.org/Lyra?set=set4" },
                            score1: 3,
                            score2: 5,
                            is_completed: true
                        }
                    ]
                },
                {
                    players: [
                        { id: 1, username: "Atlas", avatar: "https://robohash.org/Atlas?set=set4" },
                        { id: 3, username: "Orion", avatar: "https://robohash.org/Orion?set=set4" },
                        { id: 6, username: "Cosmos", avatar: "https://robohash.org/Cosmos?set=set4" },
                        { id: 7, username: "Stellar", avatar: "https://robohash.org/Stellar?set=set4" },
                        { id: 10, username: "Lyra", avatar: "https://robohash.org/Lyra?set=set4" }
                    ],
                    games: [
                        {
                            player1: { id: 1, username: "Atlas", avatar: "https://robohash.org/Atlas?set=set4" },
                            player2: { id: 3, username: "Orion", avatar: "https://robohash.org/Orion?set=set4" },
                            score1: 2,
                            score2: 5,
                            is_completed: true
                        },
                        {
                            player1: { id: 6, username: "Cosmos", avatar: "https://robohash.org/Cosmos?set=set4" },
                            player2: { id: 7, username: "Stellar", avatar: "https://robohash.org/Stellar?set=set4" },
                            score1: 5,
                            score2: 4,
                            is_completed: true
                        },
                        {
                            player1: { id: 10, username: "Lyra", avatar: "https://robohash.org/Lyra?set=set4" },
                            player2: { id: 3, username: "Orion", avatar: "https://robohash.org/Orion?set=set4" },
                            score1: 3,
                            score2: 5,
                            is_completed: true
                        }
                    ]
                },
                {
                    players: [
                        { id: 3, username: "Orion", avatar: "https://robohash.org/Orion?set=set4" },
                        { id: 6, username: "Cosmos", avatar: "https://robohash.org/Cosmos?set=set4" }
                    ],
                    games: [
                        {
                            player1: { id: 3, username: "Orion", avatar: "https://robohash.org/Orion?set=set4" },
                            player2: { id: 6, username: "Cosmos", avatar: "https://robohash.org/Cosmos?set=set4" },
                            score1: 5,
                            score2: 3,
                            is_completed: true
                        }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: "Quantum Quick Match",
            start_time: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
            players: [
                { id: 11, username: "Nova", avatar: "https://robohash.org/Nova?set=set4" },
                { id: 12, username: "Pixel", avatar: "https://robohash.org/Pixel?set=set4" },
                { id: 13, username: "Echo", avatar: "https://robohash.org/Echo?set=set4" },
                { id: 14, username: "Void", avatar: "https://robohash.org/Void?set=set4" },
                { id: 15, username: "Flux", avatar: "https://robohash.org/Flux?set=set4" }
            ],
            rounds: [
                {
                    players: [
                        { id: 11, username: "Nova", avatar: "https://robohash.org/Nova?set=set4" },
                        { id: 12, username: "Pixel", avatar: "https://robohash.org/Pixel?set=set4" },
                        { id: 13, username: "Echo", avatar: "https://robohash.org/Echo?set=set4" },
                        { id: 14, username: "Void", avatar: "https://robohash.org/Void?set=set4" },
                        { id: 15, username: "Flux", avatar: "https://robohash.org/Flux?set=set4" }
                    ],
                    games: [
                        {
                            player1: { id: 11, username: "Nova", avatar: "https://robohash.org/Nova?set=set4" },
                            player2: { id: 12, username: "Pixel", avatar: "https://robohash.org/Pixel?set=set4" },
                            score1: 5,
                            score2: 2,
                            is_completed: true
                        },
                        {
                            player1: { id: 13, username: "Echo", avatar: "https://robohash.org/Echo?set=set4" },
                            player2: { id: 14, username: "Void", avatar: "https://robohash.org/Void?set=set4" },
                            score1: 5,
                            score2: 4,
                            is_completed: true
                        },
                        {
                            player1: { id: 15, username: "Flux", avatar: "https://robohash.org/Flux?set=set4" },
                            player2: null,
                            score1: 0,
                            score2: 0,
                            is_completed: true,
                            is_bye: true
                        }
                    ]
                },
                {
                    players: [
                        { id: 11, username: "Nova", avatar: "https://robohash.org/Nova?set=set4" },
                        { id: 13, username: "Echo", avatar: "https://robohash.org/Echo?set=set4" },
                        { id: 15, username: "Flux", avatar: "https://robohash.org/Flux?set=set4" }
                    ],
                    games: [
                        {
                            player1: { id: 11, username: "Nova", avatar: "https://robohash.org/Nova?set=set4" },
                            player2: { id: 13, username: "Echo", avatar: "https://robohash.org/Echo?set=set4" },
                            score1: 5,
                            score2: 3,
                            is_completed: true
                        },
                        {
                            player1: { id: 15, username: "Flux", avatar: "https://robohash.org/Flux?set=set4" },
                            player2: null,
                            score1: 0,
                            score2: 0,
                            is_completed: true,
                            is_bye: true
                        }
                    ]
                },
                {
                    players: [
                        { id: 11, username: "Nova", avatar: "https://robohash.org/Nova?set=set4" },
                        { id: 15, username: "Flux", avatar: "https://robohash.org/Flux?set=set4" }
                    ],
                    games: [
                        {
                            player1: { id: 11, username: "Nova", avatar: "https://robohash.org/Nova?set=set4" },
                            player2: { id: 15, username: "Flux", avatar: "https://robohash.org/Flux?set=set4" },
                            score1: 5,
                            score2: 1,
                            is_completed: true
                        }
                    ]
                }
            ]
        },
        {
            id: 3,
            name: "Cyber Legends League",
            start_time: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 90 minutes ago
            players: [
                { id: 16, username: "Zenith", avatar: "https://robohash.org/Zenith?set=set4" },
                { id: 17, username: "Cipher", avatar: "https://robohash.org/Cipher?set=set4" },
                { id: 18, username: "Matrix", avatar: "https://robohash.org/Matrix?set=set4" },
                { id: 19, username: "Vector", avatar: "https://robohash.org/Vector?set=set4" },
                { id: 20, username: "Binary", avatar: "https://robohash.org/Binary?set=set4" },
                { id: 21, username: "Nexus", avatar: "https://robohash.org/Nexus?set=set4" },
                { id: 22, username: "Quantum", avatar: "https://robohash.org/Quantum?set=set4" },
                { id: 23, username: "Crypto", avatar: "https://robohash.org/Crypto?set=set4" },
                { id: 24, username: "Shadow", avatar: "https://robohash.org/Shadow?set=set4" }
            ],
            rounds: [
                {
                    players: [
                        { id: 16, username: "Zenith", avatar: "https://robohash.org/Zenith?set=set4" },
                        { id: 17, username: "Cipher", avatar: "https://robohash.org/Cipher?set=set4" },
                        { id: 18, username: "Matrix", avatar: "https://robohash.org/Matrix?set=set4" },
                        { id: 19, username: "Vector", avatar: "https://robohash.org/Vector?set=set4" },
                        { id: 20, username: "Binary", avatar: "https://robohash.org/Binary?set=set4" },
                        { id: 21, username: "Nexus", avatar: "https://robohash.org/Nexus?set=set4" },
                        { id: 22, username: "Quantum", avatar: "https://robohash.org/Quantum?set=set4" },
                        { id: 23, username: "Crypto", avatar: "https://robohash.org/Crypto?set=set4" },
                        { id: 24, username: "Shadow", avatar: "https://robohash.org/Shadow?set=set4" }
                    ],
                    games: [
                        {
                            player1: { id: 16, username: "Zenith", avatar: "https://robohash.org/Zenith?set=set4" },
                            player2: { id: 17, username: "Cipher", avatar: "https://robohash.org/Cipher?set=set4" },
                            score1: 5,
                            score2: 3,
                            is_completed: true
                        },
                        {
                            player1: { id: 18, username: "Matrix", avatar: "https://robohash.org/Matrix?set=set4" },
                            player2: { id: 19, username: "Vector", avatar: "https://robohash.org/Vector?set=set4" },
                            score1: 5,
                            score2: 2,
                            is_completed: true
                        },
                        {
                            player1: { id: 20, username: "Binary", avatar: "https://robohash.org/Binary?set=set4" },
                            player2: { id: 21, username: "Nexus", avatar: "https://robohash.org/Nexus?set=set4" },
                            score1: 3,
                            score2: 5,
                            is_completed: true
                        },
                        {
                            player1: { id: 22, username: "Quantum", avatar: "https://robohash.org/Quantum?set=set4" },
                            player2: { id: 23, username: "Crypto", avatar: "https://robohash.org/Crypto?set=set4" },
                            score1: 5,
                            score2: 4,
                            is_completed: true
                        },
                        {
                            player1: { id: 24, username: "Shadow", avatar: "https://robohash.org/Shadow?set=set4" },
                            player2: null,
                            score1: 0,
                            score2: 0,
                            is_completed: true,
                            is_bye: true
                        }
                    ]
                },
                {
                    players: [
                        { id: 16, username: "Zenith", avatar: "https://robohash.org/Zenith?set=set4" },
                        { id: 18, username: "Matrix", avatar: "https://robohash.org/Matrix?set=set4" },
                        { id: 21, username: "Nexus", avatar: "https://robohash.org/Nexus?set=set4" },
                        { id: 22, username: "Quantum", avatar: "https://robohash.org/Quantum?set=set4" },
                        { id: 24, username: "Shadow", avatar: "https://robohash.org/Shadow?set=set4" }
                    ],
                    games: [
                        {
                            player1: { id: 16, username: "Zenith", avatar: "https://robohash.org/Zenith?set=set4" },
                            player2: { id: 18, username: "Matrix", avatar: "https://robohash.org/Matrix?set=set4" },
                            score1: 4,
                            score2: 5,
                            is_completed: true
                        },
                        {
                            player1: { id: 21, username: "Nexus", avatar: "https://robohash.org/Nexus?set=set4" },
                            player2: { id: 22, username: "Quantum", avatar: "https://robohash.org/Quantum?set=set4" },
                            score1: 5,
                            score2: 3,
                            is_completed: true
                        },
                        {
                            player1: { id: 24, username: "Shadow", avatar: "https://robohash.org/Shadow?set=set4" },
                            player2: null,
                            score1: 0,
                            score2: 0,
                            is_completed: true,
                            is_bye: true
                        }
                    ]
                },
                {
                    players: [
                        { id: 18, username: "Matrix", avatar: "https://robohash.org/Matrix?set=set4" },
                        { id: 21, username: "Nexus", avatar: "https://robohash.org/Nexus?set=set4" },
                        { id: 24, username: "Shadow", avatar: "https://robohash.org/Shadow?set=set4" }
                    ],
                    games: [
                        {
                            player1: { id: 18, username: "Matrix", avatar: "https://robohash.org/Matrix?set=set4" },
                            player2: { id: 21, username: "Nexus", avatar: "https://robohash.org/Nexus?set=set4" },
                            score1: 5,
                            score2: 4,
                            is_completed: true
                        },
                        {
                            player1: { id: 24, username: "Shadow", avatar: "https://robohash.org/Shadow?set=set4" },
                            player2: null,
                            score1: 0,
                            score2: 0,
                            is_completed: true,
                            is_bye: true
                        }
                    ]
                },
                {
                    players: [
                        { id: 18, username: "Matrix", avatar: "https://robohash.org/Matrix?set=set4" },
                        { id: 24, username: "Shadow", avatar: "https://robohash.org/Shadow?set=set4" }
                    ],
                    games: [
                        {
                            player1: { id: 18, username: "Matrix", avatar: "https://robohash.org/Matrix?set=set4" },
                            player2: { id: 24, username: "Shadow", avatar: "https://robohash.org/Shadow?set=set4" },
                            score1: 5,
                            score2: 3,
                            is_completed: true
                        }
                    ]
                }
            ]
        }
    ] as Tournament[]
};

// Ajouter la liste des utilisateurs mock du site
const mockSiteUsers = [
    { id: 1, username: "Atlas", avatar: "https://robohash.org/Atlas?set=set4" },
    { id: 2, username: "Phoenix", avatar: "https://robohash.org/Phoenix?set=set4" },
    { id: 3, username: "Orion", avatar: "https://robohash.org/Orion?set=set4" },
    { id: 4, username: "Luna", avatar: "https://robohash.org/Luna?set=set4" },
    { id: 5, username: "Nova", avatar: "https://robohash.org/Nova?set=set4" },
    { id: 6, username: "Cosmos", avatar: "https://robohash.org/Cosmos?set=set4" },
    { id: 7, username: "Stellar", avatar: "https://robohash.org/Stellar?set=set4" },
    { id: 8, username: "Nebula", avatar: "https://robohash.org/Nebula?set=set4" },
    { id: 9, username: "Vega", avatar: "https://robohash.org/Vega?set=set4" },
    { id: 10, username: "Lyra", avatar: "https://robohash.org/Lyra?set=set4" },
    { id: 11, username: "Astro", avatar: "https://robohash.org/Astro?set=set4" },
    { id: 12, username: "Comet", avatar: "https://robohash.org/Comet?set=set4" },
    { id: 13, username: "Meteor", avatar: "https://robohash.org/Meteor?set=set4" },
    { id: 14, username: "Quasar", avatar: "https://robohash.org/Quasar?set=set4" },
    { id: 15, username: "Pulsar", avatar: "https://robohash.org/Pulsar?set=set4" }
];