import { Chart, ChartConfiguration } from 'chart.js/auto';
import { Game, Game } from './types/gameTypes';

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

// Function to generate random stats
function generateRandomStats(): Game {
    const player1Points = Math.floor(Math.random() * 11);
    const player2Points = Math.floor(Math.random() * 11);
    const totalMoves = Math.floor(Math.random() * 100) + 50;
    const avgSeconds = (Math.random() * 2 + 0.5).toFixed(2); // Between 0.5 and 2.5 seconds

    return {
        gameDuration: `${Math.floor(Math.random() * 10) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        score1: player1Points,
        score2: player2Points,
        totalMoves: totalMoves,
        avgMoveTime: `${avgSeconds}s`
    };
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
                <p class="mb-2"><span class="font-medium">Players:</span> ${game.player1?.username || 'Unknown'} vs ${game.player2?.username || 'Unknown'}</p>
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
                <p class="mb-2"><span class="font-medium">Points ${game.player1?.username || 'Player 1'}:</span> ${game.gameStats.score1}</p>
                <p class="mb-2"><span class="font-medium">Points ${game.player2?.username || 'Player 2'}:</span> ${game.gameStats.score2}</p>
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

// Function to generate mock game history
function getMockGameHistory(): Game[] {
    const players = [
        { id: 1, username: 'IOK', avatar: 'https://robohash.org/IOK?set=set4' },
        { id: 2, username: 'Screaky', avatar: 'https://robohash.org/Screaky?set=set4' },
        { id: 3, username: 'Æther', avatar: 'https://robohash.org/Aether?set=set4' },
        { id: 4, username: 'ketzon', avatar: 'https://robohash.org/ketzon?set=set4' },
        { id: 5, username: 'Anna', avatar: 'https://robohash.org/Anna?set=set4' }
    ];
    const games: Game[] = [];
    const today = new Date();

    // For the last 10 days
    for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Generate between 0 and 5 games for each day
        const gamesPerDay = Math.floor(Math.random() * 6);

        for (let j = 0; j < gamesPerDay; j++) {
            const hours = 9 + Math.floor(Math.random() * 15);
            const minutes = Math.floor(Math.random() * 60);
            date.setHours(hours, minutes);

            // Select two different random players
            const player1Index = Math.floor(Math.random() * players.length);
            let player2Index;
            do {
                player2Index = Math.floor(Math.random() * players.length);
            } while (player2Index === player1Index);

            // Generate random score (0-10)
            const score1 = Math.floor(Math.random() * 11);
            const score2 = Math.floor(Math.random() * 11);

            // Determine result
            let result: 'Win' | 'Loss';
            result = score1 > score2 ? 'Win' : 'Loss';

            games.push({
                date: formatDateFR(date),
                player1: players[player1Index],
                player2: players[player2Index],
                score: `${score1}-${score2}`,
                result: result,
                gameStats: generateRandomStats()
            });
        }
    }

    // Sort games by date and time
    games.sort((a, b) => {
        const [dateA, timeA] = a.date.split(' ');
        const [dateB, timeB] = b.date.split(' ');

        const [dayA, monthA, yearA] = dateA.split('/');
        const [dayB, monthB, yearB] = dateB.split('/');
        const fullDateA = new Date(`${yearA}-${monthA}-${dayA}T${timeA}`);
        const fullDateB = new Date(`${yearB}-${monthB}-${dayB}T${timeB}`);

        return fullDateB.getTime() - fullDateA.getTime();
    });

    return games;
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
        const dateStr = game.date.split(' ')[0]; // Take just the date without time
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
                    }
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
function updateGameHistory() {
    const games = getMockGameHistory();
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
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${game.player2?.username || 'Unknown'}</td>
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

    // Update performance graph
    createPerformanceGraph(games);
}

export function initializeDashboard() {
    const statsTab = document.getElementById('statsTab');
    const historyTab = document.getElementById('historyTab');
    const statsContent = document.getElementById('stats-content');
    const historyContent = document.getElementById('history-content');

    if (!statsTab || !historyTab || !statsContent || !historyContent) {
        console.error('Could not find dashboard elements');
        return;
    }

    // Function to switch tabs
    function switchTab(activeTab: HTMLElement, inactiveTab: HTMLElement,
                      showContent: HTMLElement, hideContent: HTMLElement) {
        // Update tab styles
        activeTab.classList.add('text-[#8672FF]', 'border-[#8672FF]', 'border-b-2');
        activeTab.classList.remove('text-gray-500', 'border-transparent');

        inactiveTab.classList.remove('text-[#8672FF]', 'border-[#8672FF]', 'border-b-2');
        inactiveTab.classList.add('text-gray-500', 'border-transparent');

        // Show/hide content
        showContent.classList.remove('hidden');
        hideContent.classList.add('hidden');

        // Update game history if switching to history tab
        if (showContent === historyContent) {
            updateGameHistory();
        }
    }

    // Event handler for Stats tab
    statsTab.addEventListener('click', () => {
        switchTab(statsTab, historyTab, statsContent, historyContent);
    });

    // Event handler for History tab
    historyTab.addEventListener('click', () => {
        switchTab(historyTab, statsTab, historyContent, statsContent);
    });

    // Initialize game history if starting on history tab
    if (!historyContent.classList.contains('hidden')) {
        updateGameHistory();
    } else {
        // Otherwise, initialize just the graph with data
        createPerformanceGraph(getMockGameHistory());
    }
}
