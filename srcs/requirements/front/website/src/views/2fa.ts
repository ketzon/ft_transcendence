export function twofaView():string {
    return /*html*/ `
        <div id="2fa-area" class="w-full h-full flex flex-col justify-center items-center">
            <div class="flex flex-col justify-center items-center h-1/2 w-1/2 border-2 rounded-4xl">
                <h1>2FA AUTH</h1>
                <img id="qr-code-img" class="w-full max-w-64 h-auto" src="">
                <div id="user-email"></div>
                <div id="error-message"></div>
                <form id="twofa-form" class="flex flex-col gap-2.5 items-center">
                    <label for="code">CODE : </label>
                    <input required type="text" name="code" id="code" maxlength="6" class="w-2/3 border-2 rounded-2xl text-center">
                    <button type="submit" id="submit-2fa" class="w-1/2 border-2 border-purple-500 rounded-2xl">SUBMIT</button>
                </form>
            </div>
        </div>
    `
}
