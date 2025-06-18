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
