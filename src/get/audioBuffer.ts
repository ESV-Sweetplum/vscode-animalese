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
        audioData = cachedBuffer;
        delay = cachedDelay;
        return { audioData, delay };
    } else {
        const initialBuffer = fs.readFileSync(filePath);
        const audioBuffer = initialBuffer.buffer.slice(
            initialBuffer.byteOffset,
            initialBuffer.byteOffset + initialBuffer.byteLength
        );
        try {
            audioData = await context.decodeAudioData(audioBuffer);
        } catch (e) {
            vscode.window.showErrorMessage(
                "The provided custom sound is not a valid audio type."
            );
            throw new Error(
                "The provided custom sound is not a valid audio type."
            );
        }

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

    return { audioData, delay };
}
