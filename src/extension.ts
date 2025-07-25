import * as vscode from "vscode";
import * as fs from "fs";
import { AudioContext } from "node-web-audio-api";
import { isMelodic } from "./isParticularType";
import { getFilePath } from "./get/filePath";
import { settings } from "./settings/pluginSettings";
import { loadSettings } from "./settings/loadSettings";
import { getToggleCommand } from "./commands/toggle";
import { getEnableCommand } from "./commands/enable";
import { getDisableCommand } from "./commands/disable";
import { getSetVoiceCommand } from "./commands/setVoice";
import { getSetVolumeCommand } from "./commands/setVolume";
import { VOICE_LIST } from "./constants/voiceList";
import getAudioData from "./get/audioData";

export let extensionEnabled = true;
export const setExtensionEnabled = (val: boolean) => (extensionEnabled = val);

export function activate(context: vscode.ExtensionContext) {
    loadSettings(true);

    vscode.workspace.onDidChangeConfiguration((event) => {
        if (!event.affectsConfiguration("vscode-animalese")) return;
        loadSettings(false); // Needed to update the `settings` variable for immediate effect.
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

        handleKeyPress(context, event);
    });
}

export function deactivate() {}

export async function handleKeyPress(
    context: vscode.ExtensionContext,
    event: vscode.TextDocumentChangeEvent
) {
    let key = event.contentChanges[0].text.replaceAll("\r", "").slice(0, 1);
    if (/^( ){2,}$/.test(event.contentChanges[0].text)) {
        key = "tab"; // Only if the text is 2 or more spaces.
    }
    if (event.contentChanges[0].rangeLength > 0) key = "backspace"; // Assume backspace is pressed, upon any text being deleted/replaced. There's not really a better way to do this.

    let filePath = getFilePath(
        context.extensionPath,
        key,
        VOICE_LIST.indexOf(settings.voice),
        settings
    );

    if (!fs.existsSync(filePath) && settings.soundOverride) {
        if (settings.soundOverride) {
            vscode.window.showErrorMessage(
                "The provided custom sound does not exist. Please change the soundOverride parameter to a valid path."
            );
        } else {
            vscode.window.showErrorMessage(
                `An unknown error occurred trying to find the sound file corresponding to key ${key}. Please raise an issue on the GitHub repository with the file path "${filePath}".`
            );
        }
        return;
    }

    const audioContext = new AudioContext();
    const { audioBuffer, delay } = await getAudioData(filePath, audioContext);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
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
            1e-5, // Exponential function can never equal 0.
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
}
