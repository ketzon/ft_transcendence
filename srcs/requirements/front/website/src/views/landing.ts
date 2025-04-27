export function landingView(): string {
    return /*html*/`
    <div class="signin-box">
        <h1>TRANSCENDENCE</h1>
        <a href="/dashboard">SIGN IN</a>
        <button id="registerBtn">REGISTER</button>
        <form id="popup-form" class="popup-form">
            REGISTER
            <input type="email" name="email" id="email" placeholder="Email" required>
            <input type="password" name="password" id="password" placeholder="Password" required>
            <button type="submit" id="register-submit">SUBMIT</button>
            <div id="result"></div>
        </form>
    </div>
    `
}
