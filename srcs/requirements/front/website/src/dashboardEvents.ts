import { Chart, ChartConfiguration } from 'chart.js/auto';
import { Game } from './types/gameTypes';

import { updateI18nTranslations } from './i18next';

import { API_URL } from './config';

function setupTabs() {
    const statsTab = document.getElementById('statsTab');
    const historyTab = document.getElementById('historyTab');
    const statsContent = document.getElementById('stats-content');
    const historyContent = document.getElementById('history-content');

    if (!statsTab || !historyTab || !statsContent || !historyContent) {
        console.error('❌ Tabs or content sections not found');
        return;
    }

    const switchTab = (
        activeTab: HTMLElement,
        inactiveTab: HTMLElement,
        showContent: HTMLElement,
        hideContent: HTMLElement
    ) => {
        // Styles
        activeTab.classList.add('text-[#8672FF]', 'border-b-2', 'border-[#8672FF]');
        activeTab.classList.remove('text-gray-500');

        inactiveTab.classList.remove('text-[#8672FF]', 'border-b-2', 'border-[#8672FF]');
        inactiveTab.classList.add('text-gray-500');

        // Contenus
        showContent.classList.remove('hidden');
        showContent.classList.add('animate-fade-in');
        hideContent.classList.add('hidden');
        hideContent.classList.remove('animate-fade-in');

        // Action conditionnelle
        if (showContent.id === 'history-content') {
            updateGameHistory();
        }
    };

    statsTab.addEventListener('click', () => {
        switchTab(statsTab, historyTab, statsContent, historyContent);
    });

    historyTab.addEventListener('click', () => {
        switchTab(historyTab, statsTab, historyContent, statsContent);
    });

    // Initialisation selon l'état actuel
    if (!historyContent.classList.contains('hidden')) {
        updateGameHistory();
    }
}

function formatDateFR(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
}

// Function to format short date (for graph)
function formatShortDateFR(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit'
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
}

// Function to display game details modal
function showGameDetails(game: Game) {
    // Remove existing modal if any
    const oldModal = document.getElementById('gameDetailsModal');
    if (oldModal) {
        oldModal.remove();
    }

    // Create new modal
    const modal = document.createElement('div');
    modal.id = 'gameDetailsModal';
    modal.className = 'fixed inset-0 bg-gray-600/70 flex justify-center items-center';

    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-lg p-8 max-w-2xl w-full mx-4 relative';
      const playerName = game.player1?.username && game.player1.username !== 'Playernull'
    ? game.player1.username
    : game.player2Name || 'Unknown';
    const playerIsPlayer1 = playerName === game.player1?.username;

    const playerScore = playerIsPlayer1 ? game.gameStats.score1 : game.gameStats.score2;
    const opponentScore = playerIsPlayer1 ? game.gameStats.score2 : game.gameStats.score1;


    modalContent.innerHTML = `
        <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onclick="document.getElementById('gameDetailsModal').remove()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Game Details</h2>
        <div class="grid grid-cols-2 gap-6">
            <div>
                <h3 class="text-lg font-semibold mb-4 text-gray-700">General Information</h3>
                <p class="mb-2"><span class="font-medium">Date:</span> ${game.date}</p>
                <p class="mb-2"><span class="font-medium">Players:</span> ${playerName} vs ${game.opponent || 'Unknown'}</p>
                <p class="mb-2"><span class="font-medium">Final Score:</span> ${game.score}</p>
                <p class="mb-2"><span class="font-medium">Result:</span> <span class="${
                    game.result === 'Win' ? 'text-green-600' :
                    game.result === 'Loss' ? 'text-red-600' :
                    'text-yellow-600'
                }">${game.result}</span></p>
            </div>
            <div>
                <h3 class="text-lg font-semibold mb-4 text-gray-700">Game Statistics</h3>
                <p class="mb-2"><span class="font-medium">Total Duration:</span> ${game.gameStats.gameDuration}</p>
                <p class="mb-2"><span class="font-medium">Points ${playerName || 'Player 1'}:</span> ${playerScore}</p>
                <p class="mb-2"><span class="font-medium">Points ${game.opponent || 'Player 2'}:</span> ${opponentScore}</p>
                <p class="mb-2"><span class="font-medium">Total Moves:</span> ${game.gameStats.totalMoves}</p>
                <p class="mb-2"><span class="font-medium">Average Move Time:</span> ${game.gameStats.avgMoveTime}</p>
            </div>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

async function getGameHistory(): Promise<Game[]> {
  try {
    const res = await fetch(`${API_URL}/api/stats/user`, {
        cache: 'no-store',
        credentials: 'include' // Include cookies for authentication ETAPE 1
    });
    if (!res.ok) throw new Error('Erreur HTTP');

    const data = await res.json();
    console.log('📊 Historique des parties récupéré :', data);
    return data.games;
  } catch (err) {
    console.error('Erreur lors de la récupération de l’historique :', err);
    return [];
  }
}



// Function to create performance graph
function createPerformanceGraph(games: Game[]) {
    const canvas = document.querySelector('#performance-graph') as HTMLCanvasElement;
    if (!canvas) {
        console.error('Could not find performance graph canvas');
        return;
    }

    // Prepare data by day
    const gamesByDate = new Map<string, { total: number; wins: number }>();
    const today = new Date();

    // Initialize last 10 days with 0
    for (let i = 9; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = formatShortDateFR(date);
        gamesByDate.set(dateStr, { total: 0, wins: 0 });
    }

    // Count games and wins by day
    games.forEach(game => {
        // const dateStr = game.date.split(' ')[0]; // Take just the date without time
        const dateObj = new Date(game.date);
        const dateStr = formatShortDateFR(dateObj); // ✅ ex : "17/05"
        const stats = gamesByDate.get(dateStr) || { total: 0, wins: 0 };
        stats.total++;
        if (game.result === 'Win') {
            stats.wins++;
        }
        gamesByDate.set(dateStr, stats);
    });

    // Prepare data for graph
    const dates = Array.from(gamesByDate.keys());
    const totalGames = Array.from(gamesByDate.values()).map(stats => stats.total);
    const totalWins = Array.from(gamesByDate.values()).map(stats => stats.wins);

    // Graph configuration
    const config: ChartConfiguration = {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Total games',
                    data: totalGames,
                    borderColor: 'rgb(0, 0, 0)',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Wins',
                    data: totalWins,
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    suggestedMax: Math.max(...totalGames, ...totalWins) + 1
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    };

    // Destroy existing chart if any
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    // Create new chart
    new Chart(canvas, config);
}

// Function to update game history table
async function updateGameHistory() {
    const games = await getGameHistory();
    const tableBody = document.querySelector('#history-content table tbody');

    if (!tableBody) {
        console.error('Could not find game history table');
        return;
    }

    // Clear existing table
    tableBody.innerHTML = '';

    // Add new rows
    games.forEach(game => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${game.date}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${game.opponent || 'Unknown'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${game.score}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${
                game.result === 'Win' ? 'text-green-600' :
                game.result === 'Loss' ? 'text-red-600' :
                'text-yellow-600'
            }">${game.result}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button class="bg-[#8672FF] text-white px-4 py-2 rounded hover:bg-[#6a5acc] transition-colors duration-150">
                    Game Details
                </button>
            </td>
        `;

        // Add click event to the button
        const detailsButton = row.querySelector('button');
        if (detailsButton) {
            detailsButton.addEventListener('click', () => showGameDetails(game));
        }

        tableBody.appendChild(row);
    });

    console.log("📊 Résultats des parties :", games.map(g => g.result));
    console.log("📅 Dates des parties :", games.map(g => g.date));
    console.log("👤 Joueurs des parties :", games.map(g => `${g.player1?.username || 'Unknown'} vs ${g.player2Name || 'Unknown'}`));
    console.log("🏆 Scores des parties :", games.map(g => g.score));
    console.log("⏱️ Durée des parties :", games.map(g => g.gameStats.gameDuration));

    createPerformanceGraph(games);
}

export function initializeDashboard() {
    updateI18nTranslations(); //traduction automatique
    const avatarUrl = localStorage.getItem('avatarUrl');
    const avatarImg = document.getElementById('profile-avatar') as HTMLImageElement;

    if (avatarUrl && avatarImg) {
        avatarImg.src = avatarUrl;
    }

    setupTabs(); // 👈 gère tous les onglets maintenant
    // Initialiser les stats dès l’ouverture
    getGameHistory().then((games) => {
        fetch(`${API_URL}/api/stats/user`, {
            cache: 'no-store',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            if (data.user && data.user.avatar) {
                localStorage.setItem('avatarUrl', data.user.avatar);
            const rawAvatar = localStorage.getItem('avatarUrl'); // Récupère l'URL de l'avatar depuis le localStorage
            if (rawAvatar && avatarImg) {
                const isFullUrl = rawAvatar.startsWith('http'); // Vérifie si l'URL est complète
                // Si l'URL n'est pas complète, on la préfixe avec l'URL de base du serveur
                const avatarUrl = isFullUrl ? rawAvatar : `${API_URL}/${rawAvatar}`;
                avatarImg.src = avatarUrl;
            }
            const usernameSpan = document.getElementById('profile-username');
            if (usernameSpan && data.user.username) {
                usernameSpan.textContent = data.user.username;
                console.log('✅ Username mis à jour dans le DOM :', data.user.username);
                } else {
                console.warn('⚠️ Élément #profile-username non trouvé ou username absent');
                }

            }
            document.getElementById('total-matches')!.textContent = data.gamesPlayed.toString();
            document.getElementById('win-rate')!.textContent = data.winRate.toFixed(1) + '%';
            document.getElementById('total-wins')!.textContent = data.wins.toString();
            document.getElementById('max-streak')!.textContent = data.maxStreak.toString();
            document.getElementById('total-defeats')!.textContent = data.losses.toString();
        })
        .catch(err => {
            console.error('❌ Erreur récupération stats :', err);
        });

        createPerformanceGraph(games);
    });
}
