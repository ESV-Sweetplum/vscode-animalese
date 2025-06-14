export const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

export const MELODIC_SYMBOLS = ["-", "=", "!", "?"];

export const HARMONIC_CHARACTERS = [
    ...NUMBERS,
    ...MELODIC_SYMBOLS.slice(undefined, 2),
];

export const MELODIC_CHARACTERS = [...NUMBERS, ...MELODIC_SYMBOLS];

export const SYMBOLS = [
    "~",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "{",
    "}",
    "[",
    "]",
    "/",
    "\\",
];

export function isMelodic(char: string | number): boolean {
    if (typeof char === "number") return true;
    return MELODIC_CHARACTERS.includes(char);
}

export function isAlphabetical(char: string | number): boolean {
    if (typeof char === "number") return false;
    return /^[A-z]$/.test(char);
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
