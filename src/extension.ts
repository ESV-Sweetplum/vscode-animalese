import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { AudioContext } from "node-web-audio-api";

const VOICE_LIST = [
    "Female Voice 1 (Sweet)",
    "Female Voice 2 (Peppy)",
    "Female Voice 3 (Big Sister)",
    "Female Voice 4 (Snooty)",
    "Male Voice 1 (Jock)",
    "Male Voice 2 (Lazy)",
    "Male Voice 3 (Smug)",
    "Male Voice 4 (Cranky)",
];

let extensionEnabled = true;
let volume = 0.5;
let vocalIndex = 0;

export const enablingText = "Enabled Animalese Sounds. Type away!";
export const disablingText = "Disabled Animalese Sounds.";

export function activate(context: vscode.ExtensionContext) {
    volume = context.globalState.get("animalese-volume") || 0.5;
    vocalIndex = context.globalState.get("animalese-vocalIndex") || 0;

    const toggleCmd = vscode.commands.registerCommand(
        "vscode-animalese.toggle",
        () => {
            extensionEnabled = !extensionEnabled;
            vscode.window.showInformationMessage(
                extensionEnabled ? enablingText : disablingText
            );
        }
    );
    context.subscriptions.push(toggleCmd);
    const disableCmd = vscode.commands.registerCommand(
        "vscode-animalese.disable",
        () => {
            extensionEnabled = false;
            vscode.window.showInformationMessage(disablingText);
        }
    );
    context.subscriptions.push(disableCmd);
    const enableCmd = vscode.commands.registerCommand(
        "vscode-animalese.enable",
        () => {
            extensionEnabled = true;
            vscode.window.showInformationMessage(enablingText);
        }
    );
    context.subscriptions.push(enableCmd);
    const setVoiceCmd = vscode.commands.registerCommand(
        "vscode-animalese.setVoice",
        () => {
            vscode.window
                .showQuickPick(VOICE_LIST, {
                    title: "Set Voice",
                    placeHolder: VOICE_LIST[1],
                })
                .then((v) => {
                    if (!v) return;
                    vscode.window.showInformationMessage(
                        `Successfully set voice to ${v}.`
                    );
                    vocalIndex = VOICE_LIST.indexOf(v);
                    context.globalState.update(
                        "animalese-vocalIndex",
                        vocalIndex
                    );
                });
        }
    );
    context.subscriptions.push(setVoiceCmd);
    const setVolumeCmd = vscode.commands.registerCommand(
        "vscode-animalese.setVolume",
        () => {
            vscode.window
                .showInputBox({
                    title: "Set Volume",
                    prompt: "What would you like the volume % to be? The response should be an integer within 1-100.",
                    placeHolder: "50",
                    validateInput: (str) => {
                        if (isNaN(parseInt(str))) {
                            return {
                                message: "The input provided is not a number.",
                                severity: 3,
                            };
                        }
                        if (!Number.isInteger(parseFloat(str))) {
                            return {
                                message:
                                    "The input provided should be an integer.",
                                severity: 2,
                            };
                        }
                        return "";
                    },
                })
                .then((v) => {
                    if (!v) return;
                    const percentage = Math.floor(parseFloat(v));
                    vscode.window.showInformationMessage(
                        `Successfully set volume to ${percentage}%.`
                    );
                    volume = percentage / 100;
                    context.globalState.update("animalese-volume", volume);
                });
        }
    );
    context.subscriptions.push(setVolumeCmd);
    vscode.workspace.onDidChangeTextDocument(async (event) => {
        if (!extensionEnabled) return;
        const key = event.contentChanges[0].text.slice(0, 1);
        let filePath = "";
        switch (true) {
            case "abcdefghijklmnopqrstuvwxyz"
                .split("")
                .includes(key.toLowerCase()): {
                filePath = path.join(
                    __dirname,
                    `..\\audio\\animalese\\${
                        vocalIndex <= 3 ? "female" : "male"
                    }\\voice_${(vocalIndex % 4) + 1}\\${key}.mp3`
                );
                break;
            }
            case "1234567890-=".split("").includes(key): {
                filePath = path.join(
                    __dirname,
                    `..\\audio\\vocals\\${
                        vocalIndex <= 3 ? "female" : "male"
                    }\\voice_${(vocalIndex % 4) + 1}\\${"1234567890-="
                        .split("")
                        .indexOf(key)}.mp3`
                );
                break;
            }
            case key === "!" || key === "?": {
                if (true) {
                    // ADD PUNCTUATION NOISE SETTING
                    const noise = { "!": "Gwah", "?": "Deska" };
                    filePath = path.join(
                        __dirname,
                        `..\\audio\\animalese\\${
                            vocalIndex <= 3 ? "female" : "male"
                        }\\voice_${(vocalIndex % 4) + 1}\\${noise[key]}.mp3`
                    );
                    break;
                }
            }
            case "~@#$%^&*(){}[]\\".split("").includes(key): {
                filePath = path.join(
                    __dirname,
                    `..\\audio\\sfx\\${symbolToName(key)}.mp3`
                );
                break;
            }
            default: {
                return;
            }
        }

        const audioContext = new AudioContext();

        const initialBuffer = fs.readFileSync(filePath);
        const audioBuffer = initialBuffer.buffer.slice(
            initialBuffer.byteOffset,
            initialBuffer.byteOffset + initialBuffer.byteLength
        );

        const audioData = await audioContext.decodeAudioData(audioBuffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioData;
        source.detune.value = "1234567890-=".split("").includes(key)
            ? 0
            : Math.random() * 200 - 100;
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
            0,
            audioContext.currentTime + 0.4
        );
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start();
    });
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
    }
    return null;
}

export function deactivate() {}
