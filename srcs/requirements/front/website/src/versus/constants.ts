export let canvas: HTMLCanvasElement | null;
export let c: CanvasRenderingContext2D | null;

export const gravity = 0.7; //Set the gravity , ++ will make players fall faster from a jump
export const keys = {
    a: {pressed: false},
    d: {pressed: false},
    w: {pressed: false},
    ArrowLeft: {pressed: false},
    ArrowRight: {pressed: false},
    ArrowUp: {pressed: false}
};

export function loadConstants(): void {
    canvas = document.querySelector("canvas");
    c = canvas?.getContext("2d"); // Canvas context
}
