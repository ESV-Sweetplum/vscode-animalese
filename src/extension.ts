import * as vscode from "vscode";
import * as fs from "fs";
import { AudioContext } from "node-web-audio-api";
import { isMelodic } from "./isParticularType";
import { getFilePath } from "./getFilePath";
import { settings } from "./settings/pluginSettings";
import { loadSettings } from "./settings/loadSettings";
import { getToggleCommand } from "./commands/toggle";
import { getEnableCommand } from "./commands/enable";
import { getDisableCommand } from "./commands/disable";
import { getSetVoiceCommand } from "./commands/setVoice";
import { getSetVolumeCommand } from "./commands/setVolume";
import { VOICE_LIST } from "./constants/voiceList";

const PATH_CACHE: Map<string, string> = new Map();
const BUFFER_CACHE: Map<string, AudioBuffer> = new Map();
const DELAY_CACHE: Map<string, number> = new Map();

export let extensionEnabled = true;

export const setExtensionEnabled = (val: boolean) => (extensionEnabled = val);

export function activate(context: vscode.ExtensionContext) {
    loadSettings(true);

    vscode.workspace.onDidChangeConfiguration((event) => {
        if (!event.affectsConfiguration("vscode-animalese")) return;
        loadSettings(false);
    });

    const commands = [
        getToggleCommand(),
        getEnableCommand(),
        getDisableCommand(),
        getSetVoiceCommand(),
        getSetVolumeCommand(),
    ];

    context.subscriptions.push(...commands);

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
    let cachedDelay = DELAY_CACHE.get(filePath);
    let delay = 0;
    if (cachedBuffer && cachedDelay) {
        audioData = cachedBuffer;
        delay = cachedDelay;
    } else {
        const initialBuffer = fs.readFileSync(filePath);
        const audioBuffer = initialBuffer.buffer.slice(
            initialBuffer.byteOffset,
            initialBuffer.byteOffset + initialBuffer.byteLength
        );
        audioData = await audioContext.decodeAudioData(audioBuffer);

        const audioValues = audioData.getChannelData(0);

        for (let i = 0; i < audioValues.length; i++) {
            if (audioValues[i] !== 0) {
                delay = i / audioData.sampleRate;
                break;
            }
        }

        BUFFER_CACHE.set(filePath, audioData);
        DELAY_CACHE.set(filePath, delay);
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
            1e-5,
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
    source.start(0, delay);
    source.onended = (_) => {
        audioContext.close();
    };
    console.log(delay);
}
