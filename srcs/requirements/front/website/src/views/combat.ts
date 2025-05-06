export function combatView(): string {
    return /*html*/ `
        <div id="wrapper" class="flex h-full w-full justify-center items-center">
            <!-- Div that takes UI + Game canvas -->
            <div class="relative inline-block">
                <!-- Main UI div -->
                <div class="absolute flex w-full items-center p-[20px]">
                <!-- Player health -->
                    <div class="relative h-[30px] w-full flex justify-end">
                        <div class="bg-amber-300 h-[30px] w-full"></div>
                        <div  id="playerHealth" class="absolute bg-blue-600 top-0 right-0 bottom-0 w-full"></div>
                    </div>
                    <!-- Timer -->
                    <div id="timer" class="flex items-center justify-center bg-red-400 h-[100px] w-[100px] shrink-0">10</div>
                    <!-- Enemy health -->
                    <div class="relative h-[30px] w-full">
                        <div class="bg-amber-300 h-[30px]"></div>
                        <div  id="enemyHealth" class="absolute bg-blue-600 top-0 right-0 bottom-0 left-0"></div>
                    </div>
                </div>
                <div id="displayText" class="hidden absolute top-0 right-0 bottom-0 left-0 text-white items-center justify-center">TIE</div>
                <canvas></canvas>
            </div>
        </div>
    `
}
