import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { AudioContext } from "node-web-audio-api";
import {
    HARMONIC_CHARACTERS,
    isAlphabetical,
    isHarmonic,
    isMelodic,
    isSymbolic,
} from "./isParticularType";
import { getFilePath } from "./getFilePath";

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

const PATH_CACHE: Map<string, string> = new Map();
const BUFFER_CACHE: Map<string, AudioBuffer> = new Map();

let extensionEnabled = true;
let volume = 0.5;
let vocalIndex = 0;
let falloffTime = 0.5;
let pitchVariation = 100;
let specialPunctuation = false;
let switchToExponentialFalloff = false;

export const enablingText = "Enabled Animalese Sounds. Type away!";
export const disablingText = "Disabled Animalese Sounds.";

export function activate(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration("vscode-animalese");
    volume = (config.get<number>("volume") ?? 50) / 100;
    vocalIndex = VOICE_LIST.indexOf(
        config.get<string>("voice") ?? "Female Voice 1 (Sweet)"
    );
    falloffTime = config.get<number>("intonation.falloffTime") ?? 0.5;
    pitchVariation = config.get<number>("intonation.pitchVariation") ?? 100;
    specialPunctuation = config.get<boolean>("specialPunctuation") ?? false;
    switchToExponentialFalloff =
        config.get<boolean>("intonation.switchToExponentialFalloff") ?? false;

    vscode.workspace.onDidChangeConfiguration((event) => {
        if (!event.affectsConfiguration("vscode-animalese")) return;
        volume = (config.inspect<number>("volume")?.globalValue ?? 50) / 100;
        vocalIndex = VOICE_LIST.indexOf(
            config.inspect<string>("voice")?.globalValue ??
                "Female Voice 1 (Sweet)"
        );
        falloffTime =
            config.inspect<number>("intonation.falloffTime")?.globalValue ??
            0.5;
        pitchVariation =
            config.inspect<number>("intonation.pitchVariation")?.globalValue ??
            100;
        specialPunctuation =
            config.inspect<boolean>("specialPunctuation")?.globalValue ?? false;
        switchToExponentialFalloff =
            config.inspect<boolean>("intonation.switchToExponentialFalloff")
                ?.globalValue ?? false;
    });

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
                    config.update("voice", VOICE_LIST[vocalIndex]);
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
                    config.update("volume", percentage);
                });
        }
    );
    context.subscriptions.push(setVolumeCmd);
    vscode.workspace.onDidChangeTextDocument((event) => {
        if (!extensionEnabled || !event.contentChanges.length) return;
        handleKeyPress(event);
    });
}

export function deactivate() {}

export async function handleKeyPress(event: vscode.TextDocumentChangeEvent) {
    let key = event.contentChanges[0].text.replaceAll("\r", "").slice(0, 1);
    if (/^( ){2,}$/.test(event.contentChanges[0].text)) {
        key = "tab";
    }
    if (event.contentChanges[0].rangeLength > 0) key = "backspace";
    let filePath = "";
    const cachedPath = PATH_CACHE.get(
        `${key}${vocalIndex}${+specialPunctuation}`
    );
    if (cachedPath) {
        filePath = cachedPath;
    } else {
        filePath = getFilePath(key, vocalIndex, specialPunctuation);
        PATH_CACHE.set(`${key}${vocalIndex}${+specialPunctuation}`, filePath);
    }

    const audioContext = new AudioContext();
    let audioData: AudioBuffer;
    let cachedBuffer = BUFFER_CACHE.get(filePath);
    if (cachedBuffer) {
        audioData = cachedBuffer;
    } else {
        const initialBuffer = fs.readFileSync(filePath);
        const audioBuffer = initialBuffer.buffer.slice(
            initialBuffer.byteOffset,
            initialBuffer.byteOffset + initialBuffer.byteLength
        );
        audioData = await audioContext.decodeAudioData(audioBuffer);
        BUFFER_CACHE.set(filePath, audioData);
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioData;
    source.detune.value = isMelodic(key)
        ? 0
        : Math.random() * pitchVariation * 2 - pitchVariation;
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    if (switchToExponentialFalloff) {
        gainNode.gain.exponentialRampToValueAtTime(
            0,
            audioContext.currentTime + falloffTime
        );
    } else {
        gainNode.gain.linearRampToValueAtTime(
            0,
            audioContext.currentTime + falloffTime
        );
    }
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start();
    source.onended = (_) => {
        audioContext.close();
    };
}
