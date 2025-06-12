export function printResponse(route: string, response: Response): void {
    // console.log("Response from " + route + " : " , response);
}

export function resetInput(inputId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;

    if (input)
        input.value = "";
}

export function isEmptyString(str: string): boolean {
    const trimmedStr = str.trim();

    if (trimmedStr.length === 0)
        return (true);
    return (false);
}

export function resetAllInputs(): void {
    const allInputs = document.querySelectorAll("input");

    for (let i = 0; i < allInputs.length; i++)
        allInputs[i].value = "";
}

export function hideNavbar(): void {
    let logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
    let selectLanguage = document.getElementById("selector") as HTMLButtonElement;
    const navbarElem = document.getElementById("navbar-box");

    // console.log("HIDENAVBAR FUNCTION")
    // console.log(logoutBtn);
    if(logoutBtn) logoutBtn.style.display = 'none'
    if(selectLanguage) selectLanguage.style.display = 'none'
    if(navbarElem) navbarElem.style.display = 'none'
}
