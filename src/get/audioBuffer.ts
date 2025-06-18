import * as vscode from "vscode";
import * as fs from "fs";

const BUFFER_CACHE: Map<string, AudioBuffer> = new Map();
const DELAY_CACHE: Map<string, number> = new Map();

export default async function getAudioBuffer(
    filePath: string,
    context: AudioContext
) {
    let audioData: AudioBuffer;
    let cachedBuffer = BUFFER_CACHE.get(filePath);
    let cachedDelay = DELAY_CACHE.get(filePath);
    let delay = 0;
    if (cachedBuffer && cachedDelay) {
        // Bypass doing computationally intensive tasks
        return { audioData: cachedBuffer, delay: cachedDelay };
    }
    const initialBuffer = fs.readFileSync(filePath);
    const audioBuffer = initialBuffer.buffer.slice(
        initialBuffer.byteOffset,
        initialBuffer.byteOffset + initialBuffer.byteLength
    ); // Strip metadata from audio buffer
    try {
        audioData = await context.decodeAudioData(audioBuffer);
    } catch (e) {
        vscode.window.showErrorMessage(
            "The provided custom sound is not a valid audio type."
        );
        throw new Error("The provided custom sound is not a valid audio type.");
    }

    const audioValues = audioData.getChannelData(0);
    // The following loop is necessary to trim silence from the start of the audio. It will only be run once, then the cache will handle it.
    for (let i = 0; i < audioValues.length; i++) {
        if (audioValues[i] !== 0) {
            delay = i / audioData.sampleRate;
            break;
        }
    }

    BUFFER_CACHE.set(filePath, audioData);
    DELAY_CACHE.set(filePath, delay);

    return { audioData, delay };
}
