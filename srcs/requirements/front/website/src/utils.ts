export function printResponse(route: string, response: Response): void {
    console.log("Response from " + route + " : " , response);
}

export function resetInput(inputId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;

    if (input)
        input.value = "";
}

export function isEmptyString(str: string): boolean {
    const trimmedStr = str.trim();

    console.log(trimmedStr);
    console.log(trimmedStr.length);
    if (trimmedStr.length === 0)
        return (true);
    return (false);
}
