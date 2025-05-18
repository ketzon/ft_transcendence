export function dashboardView(): string {
    return /*html*/ `
    <div class="flex flex-col h-full bg-[#fdf8e1] transition-all duration-500 ease-in-out">

        <!-- ✅ Profile Card -->
        <div class="bg-white rounded-2xl shadow-md mx-6 mt-6 mb-4 p-4 flex items-center gap-4">
            <img id="profile-avatar" src="" class="w-16 h-16 rounded-full border border-gray-300" alt="avatar">
            <div>
                <h2 id="profile-username" class="text-xl font-semibold text-gray-800">Player</h2>
                <p id="profile-rank" class="text-sm text-gray-500">Rang : -</p>
                <p id="profile-status" class="text-xs text-green-600 mt-1">🟢 En ligne</p>
            </div>
        </div>

        <!-- Navigation bar -->
        <div class="flex border-b border-gray-200 bg-white shadow-sm">
            <div class="flex">
                <button id="statsTab" class="tab-button px-6 py-3 text-lg font-medium border-b-2 text-[#8672FF] border-[#8672FF]" data-tab="stats">📊 Stats</button>
                <button id="historyTab" class="tab-button px-6 py-3 text-lg font-medium text-gray-500 hover:text-[#8672FF]" data-tab="history">📜 Game History</button>
            </div>
        </div>

        <!-- Tab contents -->
        <div class="p-6">
            <!-- Stats Tab -->
            <div id="stats-content" class="tab-content animate-fade-in">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                    <div class="stat-card">🎮 <strong>Total Matches</strong><p id="total-matches" class="stat-value">0</p></div>
                    <div class="stat-card">🏆 <strong>Win Rate</strong><p id="win-rate" class="stat-value">0%</p></div>
                    <div class="stat-card">✨ <strong>Total Wins</strong><p id="total-wins" class="stat-value">0</p></div>
                    <div class="stat-card">❌ <strong>Total Defeats</strong><p id="total-losses" class="stat-value">0</p></div>
                    <div class="stat-card">🔥 <strong>Best Win Streak</strong><p id="max-streak" class="stat-value">0</p></div>
                    <div class="stat-card">⚔️ <strong>Most Played Opponent</strong><p id="top-opponent" class="stat-value text-sm text-gray-700 mt-2">-</p></div>
                    <div class="stat-card">🎯 <strong>Avg Score</strong><p id="avg-score" class="stat-value">0</p></div>
                    <div class="stat-card">⏱ <strong>Avg Game Duration</strong><p id="avg-duration" class="stat-value">0s</p></div>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-md transition duration-500 hover:shadow-lg">
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">📈 Performance Graph</h3>
                    <div class="h-64">
                        <canvas id="performance-graph"></canvas>
                    </div>
                </div>
            </div>

            <!-- History Tab -->
            <div id="history-content" class="tab-content hidden animate-fade-in">
                <div class="bg-white rounded-xl shadow-md overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opponent</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                            </tr>
                        </thead>
                        <tbody id="game-history-body" class="bg-white divide-y divide-gray-200"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Scripts -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
        let performanceChart;

        function createPerformanceChart(labels, totalGames, totalWins) {
            const ctx = document.getElementById('performance-graph').getContext('2d');
            if (performanceChart) performanceChart.destroy();

            performanceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Total games',
                            data: totalGames,
                            borderColor: 'black',
                            backgroundColor: 'transparent',
                            tension: 0.4,
                            pointRadius: 3
                        },
                        {
                            label: 'Wins',
                            data: totalWins,
                            borderColor: 'limegreen',
                            backgroundColor: 'transparent',
                            tension: 0.4,
                            pointRadius: 3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'top' } },
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                }
            });
        }

        function populateGameHistory(games) {
            const tbody = document.getElementById("game-history-body");
            tbody.innerHTML = "";

            games.forEach((game) => {
                const opponent = game.username;
                const resultColor = game.result === "Win" ? "text-green-600" : "text-red-500";
                const resultEmoji = game.result === "Win" ? "✅" : "❌";

                const row = document.createElement("tr");
                row.className = "hover:bg-gray-50 transition-colors";
                row.innerHTML = \`
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${game.date}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-3">
                        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=\${opponent}" class="w-6 h-6 rounded-full" alt="avatar">
                        \${opponent}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${game.score}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm \${resultColor}">\${resultEmoji} \${game.result}</td>
                \`;
                tbody.appendChild(row);
            });
        }

        async function loadStats(userId = 1) {
            try {
                const res = await fetch(\`http://localhost:3000/api/stats/user/\${userId}\`, { credentials: 'include' });
                if (!res.ok) throw new Error('Erreur API');
                const data = await res.json();

                // 📛 Profil
                const username = data.games[0]?.username || "Player";
                document.getElementById("profile-username").textContent = username;
                document.getElementById("profile-avatar").src = "https://api.dicebear.com/7.x/bottts/svg?seed=" + username;

                let rank = "-";
                if (data.winRate >= 90) rank = "🏆 Légende";
                else if (data.winRate >= 70) rank = "🥇 Pro";
                else if (data.winRate >= 50) rank = "🥈 Confirmé";
                else if (data.winRate > 0) rank = "🥉 Débutant";
                else rank = "👾 Novice";
                document.getElementById("profile-rank").textContent = "Rang : " + rank;

                // Stats
                document.getElementById("total-matches").textContent = data.gamesPlayed;
                document.getElementById("win-rate").textContent = data.winRate + "%";
                document.getElementById("total-wins").textContent = data.wins;
                document.getElementById("total-losses").textContent = data.losses;

                let streak = 0, maxStreak = 0;
                data.games.forEach(g => {
                    if (g.result === 'Win') {
                        streak++;
                        if (streak > maxStreak) maxStreak = streak;
                    } else {
                        streak = 0;
                    }
                });
                document.getElementById("max-streak").textContent = maxStreak;

                const map = {};
                data.games.forEach(g => {
                    const opp = g.username;
                    map[opp] = (map[opp] || 0) + 1;
                });
                const top = Object.entries(map).sort((a, b) => b[1] - a[1])[0];
                document.getElementById("top-opponent").textContent = top ? top[0] + " (" + top[1] + "×)" : "-";

                let totalScore = 0;
                data.games.forEach(g => {
                    const [s1, s2] = g.score.split("-").map(Number);
                    const isP1 = g.player1.id === data.userId;
                    totalScore += isP1 ? s1 : s2;
                });
                const avgScore = data.games.length > 0 ? (totalScore / data.games.length).toFixed(1) : "0";
                document.getElementById("avg-score").textContent = avgScore;

                const durations = data.games.map(g => g.gameStats?.gameDuration || 0);
                const avgDuration = durations.length > 0 ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(0) : 0;
                document.getElementById("avg-duration").textContent = avgDuration + "s";

                // Graph & history
                const gamesPerDay = {};
                const winsPerDay = {};
                data.games.forEach(game => {
                    const date = game.date.slice(0, 10).split("-").reverse().join("/");
                    gamesPerDay[date] = (gamesPerDay[date] || 0) + 1;
                    if (game.result === "Win") winsPerDay[date] = (winsPerDay[date] || 0) + 1;
                });
                const sortedDates = Object.keys(gamesPerDay).sort((a, b) => {
                    const [da, ma, ya] = a.split("/").map(Number);
                    const [db, mb, yb] = b.split("/").map(Number);
                    return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
                });

                const totalGames = sortedDates.map(d => gamesPerDay[d]);
                const totalWins = sortedDates.map(d => winsPerDay[d] || 0);
                createPerformanceChart(sortedDates, totalGames, totalWins);

                populateGameHistory(data.games);
            } catch (e) {
                console.error(e);
            }
        }

        function setupTabs() {
            const tabs = document.querySelectorAll(".tab-button");
            const contents = document.querySelectorAll(".tab-content");

            tabs.forEach(tab => {
                tab.addEventListener("click", () => {
                    const selected = tab.dataset.tab;

                    tabs.forEach(btn => {
                        btn.classList.remove("text-[#8672FF]", "border-b-2", "border-[#8672FF]");
                        btn.classList.add("text-gray-500");
                    });

                    tab.classList.add("text-[#8672FF]", "border-b-2", "border-[#8672FF]");
                    tab.classList.remove("text-gray-500");

                    contents.forEach(content => {
                        if (content.id === \`\${selected}-content\`) {
                            content.classList.remove("hidden");
                            content.classList.add("animate-fade-in");
                        } else {
                            content.classList.add("hidden");
                            content.classList.remove("animate-fade-in");
                        }
                    });
                });
            });
        }

        document.addEventListener("DOMContentLoaded", () => {
            setupTabs();
            loadStats();
        });
        </script>

        <!-- Styles -->
        <style>
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fade-in 0.5s ease-in-out;
            }
            .stat-card {
                background: white;
                padding: 1.5rem;
                border-radius: 1rem;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .stat-card:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .stat-value {
                font-size: 2rem;
                font-weight: bold;
                color: #8672FF;
                margin-top: 0.5rem;
            }
        </style>
    </div>
    `;
}
