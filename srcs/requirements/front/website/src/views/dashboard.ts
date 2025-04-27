export function dashboardView(): string {
    return /*html*/ `
    <div class="flex flex-col h-full bg-[#fdf8e1]">
        <!-- Navigation bar with tabs -->
        <div class="flex border-b border-gray-200 bg-white">
            <div class="flex">
                <button id="statsTab" class="tab-button px-6 py-3 text-lg font-medium border-b-2 text-[#8672FF] border-[#8672FF]" data-tab="stats">Stats</button>
                <button id="historyTab" class="tab-button px-6 py-3 text-lg font-medium text-gray-500 hover:text-[#8672FF]" data-tab="history">Game History</button>
            </div>
        </div>

        <!-- Tab contents -->
        <div class="p-6">
            <!-- Stats Tab Content -->
            <div id="stats-content" class="tab-content">
                <!-- Stats Cards -->
                <div class="grid grid-cols-3 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-700">Total Matches</h3>
                        <p class="text-3xl font-bold text-[#8672FF] mt-2">42</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-700">Win Rate</h3>
                        <p class="text-3xl font-bold text-[#8672FF] mt-2">75%</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-700">Total Wins</h3>
                        <p class="text-3xl font-bold text-[#8672FF] mt-2">32</p>
                    </div>
                </div>
                
                <!-- Performance Graph -->
                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Performance Graph</h3>
                    <div class="h-64 bg-white rounded-lg">
                        <canvas id="performance-graph"></canvas>
                    </div>
                </div>
            </div>

            <!-- History Tab Content -->
            <div id="history-content" class="tab-content hidden">
                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opponent</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">16/04/2024 14:30</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Player1</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5-3</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">Win</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `
} 