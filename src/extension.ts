import * as vscode from "vscode";
import * as fs from "fs";
import { AudioContext } from "node-web-audio-api";
import { isMelodic } from "./isParticularType";
import { getFilePath } from "./getFilePath";
import { getConfig } from "./configState";
import { DEFAULT_SETTINGS, settings } from "./settings";

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

export const enablingText = "Enabled Animalese Sounds. Type away!";
export const disablingText = "Disabled Animalese Sounds.";

let extensionEnabled = true;

export function activate(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration("vscode-animalese");
    (Object.keys(settings) as Array<keyof typeof settings>).forEach(
        (key: keyof typeof settings) => {
            (settings as any)[key] =
                getConfig(key, DEFAULT_SETTINGS[key]) ?? false;
        }
    );

    vscode.workspace.onDidChangeConfiguration((event) => {
        if (!event.affectsConfiguration("vscode-animalese")) return;
        (Object.keys(settings) as Array<keyof typeof settings>).forEach(
            (key: keyof typeof settings) => {
                (settings as any)[key] =
                    getConfig(key, DEFAULT_SETTINGS[key], true) ?? false;
            }
        );
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
            const oldVoice = settings.voice ?? "Female Voice 1 (Sweet)";
            vscode.window
                .showQuickPick(VOICE_LIST, {
                    title: "Set Voice",
                    placeHolder: oldVoice,
                })
                .then((v) => {
                    if (!v) return;
                    vscode.window.showInformationMessage(
                        `Successfully set voice to ${v}.`
                    );
                    settings.voice = v;
                    config.update("voice", settings.voice);
                });
        }
    );
    context.subscriptions.push(setVoiceCmd);
    const setVolumeCmd = vscode.commands.registerCommand(
        "vscode-animalese.setVolume",
        () => {
            const oldVolume = settings.volume ?? 50;
            vscode.window
                .showInputBox({
                    title: "Set Volume",
                    prompt: "What would you like the volume % to be? The response should be an integer within 1-100.",
                    placeHolder: oldVolume.toString(),
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
                    const percentage = parseInt(v);
                    vscode.window.showInformationMessage(
                        `Successfully set volume to ${percentage}%.`
                    );
                    settings.volume = percentage;
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
        `${key}${VOICE_LIST.indexOf(
            settings.voice
        )}${+settings.specialPunctuation}`
    );
    if (cachedPath) {
        filePath = cachedPath;
    } else {
        filePath = getFilePath(
            key,
            VOICE_LIST.indexOf(settings.voice),
            settings.specialPunctuation
        );
        PATH_CACHE.set(
            `${key}${settings.voice}${+settings.specialPunctuation}`,
            filePath
        );
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
        : Math.random() * settings.intonation_pitchVariation * 2 -
          settings.intonation_pitchVariation;
    const gainNode = audioContext.createGain();

    let audioVolume = settings.volume;
    if (settings.intonation_louderUppercase > 0 && /^[A-Z]$/.test(key)) {
        audioVolume =
            audioVolume * (1 + settings.intonation_louderUppercase / 100);
        source.detune.value =
            1.5 *
            settings.intonation_pitchVariation *
            (1 + settings.intonation_louderUppercase / 100);
    }

    gainNode.gain.setValueAtTime(audioVolume / 100, audioContext.currentTime);
    if (settings.intonation_switchToExponentialFalloff) {
        gainNode.gain.exponentialRampToValueAtTime(
            0.000001,
            audioContext.currentTime + settings.intonation_falloffTime
        );
    } else {
        gainNode.gain.linearRampToValueAtTime(
            0,
            audioContext.currentTime + settings.intonation_falloffTime
        );
    }
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start();
    source.onended = (_) => {
        audioContext.close();
    };
}
