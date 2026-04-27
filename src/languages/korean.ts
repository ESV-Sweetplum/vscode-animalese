import { TextDocumentContentChangeEvent } from 'vscode';
import { isHangul, disassemble } from 'hangul-js';
const jamoToAlphabet: Record<string, string> = {
    // consonants
    "ㄱ": "g",
    "ㄲ": "k",
    "ㄴ": "n",
    "ㄷ": "d",
    "ㄸ": "t",
    "ㄹ": "r",
    "ㅁ": "m",
    "ㅂ": "b",
    "ㅃ": "p",
    "ㅅ": "s",
    "ㅆ": "s",
    "ㅇ": "n",
    "ㅈ": "j",
    "ㅉ": "j",
    "ㅊ": "c",
    "ㅋ": "k",
    "ㅌ": "t",
    "ㅍ": "p",
    "ㅎ": "h",

    // vowels
    "ㅏ": "a",
    "ㅐ": "i",
    "ㅑ": "n",
    "ㅒ": "i",
    "ㅓ": "o",
    "ㅔ": "i",
    "ㅕ": "y",
    "ㅖ": "y",
    "ㅗ": "o",
    "ㅛ": "y",
    "ㅜ": "u",
    "ㅠ": "u",
    "ㅡ": "u",
    "ㅣ": "e",
};

let lastEvent: TextDocumentContentChangeEvent;
export function translateFromKorean(event: TextDocumentContentChangeEvent): { key: string, playAudio: boolean } {
    try {
        const key = event.text.replaceAll('\r', '').slice(0, 1);
        if (isHangul(key) || !!jamoToAlphabet[key]) {
            // "Syllable completion" event is fired when typing Korean. Ignore that
            if (lastEvent && lastEvent.rangeOffset === event.rangeOffset && lastEvent.text === event.text) {
                return {
                    key: "",
                    playAudio: false
                };
            }

            const disassembled = disassemble(key);
            const lastDisassembled = lastEvent && lastEvent.rangeOffset === event.rangeOffset ? disassemble(lastEvent.text.replaceAll('\r', '').slice(0, 1)) : [];

            if (disassembled.length < lastDisassembled.length) {
                return {
                    key: "backspace",
                    playAudio: true
                };
            }

            if (disassembled.length === 0) {
                return {
                    key: "tab",
                    playAudio: true
                };
            }

            const lastJamo = disassembled[disassembled.length - 1];
            return {
                key: jamoToAlphabet[lastJamo] ?? lastJamo,
                playAudio: true
            };
        }

        throw new Error("Unsupported character");
    } finally {
        lastEvent = event;
    }
}
