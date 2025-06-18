import path from "path";
import {
    HARMONIC_CHARACTERS,
    isAlphabetical,
    isHarmonic,
    isSymbolic,
} from "./isParticularType";

export function getFilePath(
    key: string,
    vocalIndex: number,
    specialPunctuation: boolean,
    soundOverride: string
) {
    if (soundOverride) return soundOverride;

    let filePath = "";

    switch (true) {
        case isAlphabetical(key.toLowerCase()): {
            filePath = path.join(
                __dirname,
                `..\\audio\\animalese\\${
                    vocalIndex <= 3 ? "female" : "male"
                }\\voice_${(vocalIndex % 4) + 1}\\${key}.mp3`
            );
            break;
        }
        case isHarmonic(key): {
            filePath = path.join(
                __dirname,
                `..\\audio\\vocals\\${
                    vocalIndex <= 3 ? "female" : "male"
                }\\voice_${(vocalIndex % 4) + 1}\\${HARMONIC_CHARACTERS.indexOf(
                    key
                )}.mp3`
            );
            break;
        }
        case key === "!" || key === "?" || key.includes("\n"): {
            if (specialPunctuation) {
                const noise = { "!": "Gwah", "?": "Deska", "\n": "OK" };
                filePath = path.join(
                    __dirname,
                    `..\\audio\\animalese\\${
                        vocalIndex <= 3 ? "female" : "male"
                    }\\voice_${(vocalIndex % 4) + 1}\\${
                        noise[key as keyof typeof noise]
                    }.mp3`
                );
                break;
            }
        }
        case isSymbolic(key): {
            filePath = path.join(
                __dirname,
                `..\\audio\\sfx\\${symbolToName(key) ?? "default"}.mp3`
            );
            break;
        }
        case ["tab", "backspace"].includes(key): {
            filePath = path.join(__dirname, `..\\audio\\sfx\\${key}.mp3`);
            break;
        }
        default: {
            filePath = path.join(__dirname, `..\\audio\\sfx\\default.mp3`);
            break;
        }
    }
    return filePath;
}

export function symbolToName(sym: string) {
    switch (sym) {
        case "~": {
            return "tilde";
        }
        case "!": {
            return "exclamation";
        }
        case "@": {
            return "at";
        }
        case "#": {
            return "pound";
        }
        case "$": {
            return "dollar";
        }
        case "%": {
            return "percent";
        }
        case "^": {
            return "caret";
        }
        case "&": {
            return "ampersand";
        }
        case "*": {
            return "asterisk";
        }
        case "(": {
            return "parenthesis_open";
        }
        case ")": {
            return "parenthesis_closed";
        }
        case "{": {
            return "brace_open";
        }
        case "}": {
            return "brace_closed";
        }
        case "[": {
            return "bracket_open";
        }
        case "]": {
            return "bracket_closed";
        }
        case "?": {
            return "question";
        }
        case "\n": {
            return "enter";
        }
        case "/": {
            return "slash_forward";
        }
        case "\\": {
            return "slash_back";
        }
    }
    return null;
}
