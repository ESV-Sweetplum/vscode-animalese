import { TextDocumentContentChangeEvent } from 'vscode';
import { settings } from '../settings/pluginSettings';
import { translateFromKorean } from './korean';

export function translate(event: TextDocumentContentChangeEvent): { key: string, playAudio: boolean } {
    try {
        if (settings.languageSupports.includes("korean")) {
            return translateFromKorean(event);
        }
    } catch {}

    let key = event.text.replaceAll('\r', '').slice(0, 1);
    if (/^( ){2,}$/.test(event.text)) {
        key = 'tab'; // Only if the text is 2 or more spaces.
    }
    if (event.rangeLength > 0 && event.text === '') key = 'backspace'; // Assume backspace is pressed, upon any text being deleted/replaced. There's not really a better way to do this.

    return {
        key: key,
        playAudio: true
    };
}
