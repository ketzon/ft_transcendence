export function loginView(): string {
    return /*html*/`
   <div id="login-view" class="bg-violet-950">
                    <div class="wrapper h-screen w-[max(40%,600px)] bg-violet-200 flex flex-col justify-center items-center m-auto p-2.5 rounded-2xl">
                        <h1 class="text-5xl text-[var(--text-color)] uppercase">login</h1>
                        <p id="error-message" class="text-[var(--error-color)]"></p>
                        <form id="login-form" class="w-[min(400px,100%)] flex flex-col items-center gap-2.5 mt-5 mb-12">
                            <div class="w-full flex flex-row-reverse justify-center">
                                <input type="email" name="email" id="email-input" placeholder="Email" class="bg-[var(--base-color)] grow-1 min-w-0 h-12 p-4 rounded-r-lg border-2 border-l-0 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer">
                                <label for="email-input" class="bg-[var(--accent-color)] h-12 w-12 flex justify-center shrink-0 items-center fill-white text-white text-2xl font-medium rounded-l-lg peer-focus:bg-[var(--text-color)]">
                                    <span>@</span>
                                </label>
                            </div>
                            <div class="w-full flex flex-row-reverse justify-center">
                            <input type="password" name="password" id="password-input" placeholder="Password" class="bg-[var(--input-color)] grow-1 min-w-0 h-12 p-4 rounded-r-lg border-2 border-l-0 border-[var(--input-color)] ease-150 text-[length:inherit] hover:border-[var(--accent-color)] focus:border-[var(--text-color)] focus:outline-0 peer">
                                <label for="password-input" class="bg-[var(--accent-color)] h-12 w-12 flex justify-center shrink-0 items-center fill-white text-white text-2xl font-medium rounded-l-lg peer-focus:bg-[var(--text-color)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>
                                </label>
                            </div>
                            <button type="submit" class="bg-[var(--accent-color)] mt-2.5 px-16 py-3.5 text-white border-0 rounded-[1000px] font-semibold text-[length:inherit] uppercase ease-150 cursor-pointer hover:bg-[var(--text-color)] focus:outline-0 focus:bg-[var(--text-color)]">Login</button>
                        </form>
                        <p>New here ? <a href="/signup" class="text-[var(--accent-color)]">Create an Account</a></p>
                    </div>
                </div>
`
}
