import * as vscode from 'vscode';
import * as fs from 'fs';

const BUFFER_CACHE: Map<string, AudioBuffer> = new Map();
const DELAY_CACHE: Map<string, number> = new Map();

interface AudioData {
    audioBuffer: AudioBuffer;
    delay: number;
}

/**
 * ### Given a file, returns the data of the audio that should be played.
 * @param filePath The path of the file to load.
 * @param context The given audio context to play the audio in.
 * @returns {AudioBuffer} A buffer containing all audio data to be played.
 * @returns {number} The amount of time, in seconds, to skip forward in order to avoid playing silence.
 */
export default async function getAudioData(
    filePath: string,
    context: AudioContext
): Promise<AudioData> {
    let audioBuffer: AudioBuffer;
    let cachedBuffer = BUFFER_CACHE.get(filePath);
    let cachedDelay = DELAY_CACHE.get(filePath);
    let delay = 0;
    if (cachedBuffer && cachedDelay) {
        // Bypass doing computationally intensive tasks
        return { audioBuffer: cachedBuffer, delay: cachedDelay };
    }
    const initialBuffer = fs.readFileSync(filePath);
    const fileBuffer = initialBuffer.buffer.slice(
        initialBuffer.byteOffset,
        initialBuffer.byteOffset + initialBuffer.byteLength
    ); // Strip metadata from audio buffer
    try {
        audioBuffer = await context.decodeAudioData(fileBuffer);
    } catch (e) {
        vscode.window.showErrorMessage(
            'The provided custom sound is not a valid audio type.'
        );
        throw new Error('The provided custom sound is not a valid audio type.');
    }

    const audioValues = audioBuffer.getChannelData(0);
    // The following loop is necessary to trim silence from the start of the audio. It will only be run once, then the cache will handle it.
    for (let i = 0; i < audioValues.length; i++) {
        if (audioValues[i] !== 0) {
            delay = i / audioBuffer.sampleRate;
            break;
        }
    }

    BUFFER_CACHE.set(filePath, audioBuffer);
    DELAY_CACHE.set(filePath, delay);

    return { audioBuffer, delay };
}
