import {
    HARMONIC_CHARACTERS,
    MELODIC_CHARACTERS,
    NUMBERS,
    SYMBOLS,
} from "./constants/charTypes";

export function isMelodic(char: string | number): boolean {
    if (typeof char === "number") return true;
    return MELODIC_CHARACTERS.includes(char);
}

export function isAlphabetical(char: string | number): boolean {
    if (typeof char === "number") return false;
    return /^[a-z]$/i.test(char);
}

export function isHarmonic(char: string | number): boolean {
    if (typeof char === "number") return true;
    return HARMONIC_CHARACTERS.includes(char);
}

export function isSymbolic(char: string | number): boolean {
    if (typeof char === "number") return false;
    return SYMBOLS.includes(char);
}

export function isNumeric(char: string | number): boolean {
    if (typeof char === "string") return false;
    return NUMBERS.includes(char.toString());
}
