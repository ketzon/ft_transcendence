import { Howl } from 'howler';
import { GameSounds } from '../types';
import { GameElements } from '../types';

export let mute: boolean = false;
export let gameSounds: GameSounds;

export function setGameSounds(sounds: GameSounds): void {
    gameSounds = sounds;
}

export function initSounds(): GameSounds {
    const smashBall = new Howl({
     src: ["../sounds/sonic-boom.mp3"],
     volume: 0.5
    });

    const whiteBall = new Howl({
     src: ["../sounds/gated-drop.mp3"],
     volume: 0.5
    });

    const featuresMode = new Howl({
     src: ["../sounds/features-mode-robot.mp3"],
     volume: 0.5
    });

    const defaultMode = new Howl({
        src: ["../sounds/default_mode_robot.mp3"],
        volume: 0.5
    });

    const victorySound = new Howl({
     src: ["../sounds/victory.mp3"],
     volume: 0.4
    });

    const paddleSound = new Howl({
        src: ["../sounds/bubble-pop.mp3"],
        volume: 0.6
    });

    const smashSound = new Howl({
        src: ["../sounds/explo.mp3"],
        volume: 1.0
    });

    const doublePoints = new Howl({
     src: ["../sounds/doublexp_zombie.mp3"],
     volume: 0.1
    });

    const femaleCount = new Howl({
     src: ["../sounds/321-female.mp3"],
     volume: 0.5
    });
    const quickRiser = new Howl({
     src: ["../sounds/quick-riser.mp3"],
     volume: 0.5
    });

    const snareGreen = new Howl({
        src: ["../sounds/snare-green.mp3"],
        volume: 0.5
    });

    const doubleScore = new Howl({
        src: ["../sounds/choir.mp3"],
        volume: 0.5
    });
    return {
        smashBall,
        whiteBall,
        featuresMode,
        defaultMode,
        victorySound,
        paddleSound,
        smashSound,
        doublePoints,
        femaleCount,
        quickRiser,
        snareGreen,
        doubleScore
    };
}

export function changeAudioStatus(gameId: GameElements): void {
    if (mute !== null) {
        if (mute === true) {
            gameId.muteGame.textContent = "mute";
            mute = false;
        }
        else {
            gameId.muteGame.textContent = "unmute";
            mute = true;
        }
    }
}

export function stopAllAudio(): void {
    if (mute === true && gameSounds) {
        Object.values(gameSounds).forEach(sound => {
            if (sound && typeof sound.stop === 'function') {
                sound.stop();
            }
        });
    }
}

export function applySoundEffect(colors: string): void {
    if (!gameSounds || mute) return;

    if (colors === "red") {
        gameSounds.smashSound.play();
    }
    else if (colors === "green") {
        gameSounds.snareGreen.play();
    }
    else {
        gameSounds.paddleSound.play();
    }
}

export function resetAllsounds(): void {
    if (!gameSounds) return;
    Object.values(gameSounds).forEach(sound => {
        if (sound && typeof sound.stop === 'function') {
            sound.stop();
        }
    });
}
