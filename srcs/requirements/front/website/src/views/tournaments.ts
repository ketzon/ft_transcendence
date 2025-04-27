export function tournamentsView(): string {
    return `
    <div class="flex flex-col h-full bg-[#fdf8e1]">
        <!-- Content -->
        <div class="p-6">
            <div class="grid grid-cols-4 gap-6">
                <!-- Sidebar -->
                <div class="col-span-1">
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-700 mb-4">Available Tournaments</h3>
                        <button id="create-tour" class="w-full bg-[#8672FF] text-white px-4 py-2 rounded hover:bg-[#6a5acc] transition-colors duration-150 mb-4">
                            Start new Tournament
                        </button>
                        <div id="tournaments-list" class="space-y-2">
                            <!-- Tournaments will be inserted here by JS -->
                        </div>
                    </div>
                </div>

                <!-- Main content -->
                <div class="col-span-3">
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <div id="tournament-content">
                            <!-- Tournament content will be inserted here by JS -->
                            <p class="text-gray-500">Select a tournament to view details.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}