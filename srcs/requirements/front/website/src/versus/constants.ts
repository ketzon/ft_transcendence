export let canvas: HTMLCanvasElement | null;
export let c: CanvasRenderingContext2D | null;

export let   roundEnded: boolean;
export const roundTime = 30;
export const gravity = 0.7; //Set the gravity , ++ will make players fall faster from a jump
export const keys = {
    a: {pressed: false},
    d: {pressed: false},
    w: {pressed: false},
    ArrowLeft: {pressed: false},
    ArrowRight: {pressed: false},
    ArrowUp: {pressed: false}
};

export function setRoundEnded(status: boolean): void {
    roundEnded = status;
}

export function initConstants(): void {
    canvas = document.querySelector("canvas");
    c = canvas?.getContext("2d"); // Canvas context
    roundEnded = false;
}
