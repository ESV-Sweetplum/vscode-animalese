import path from 'path';
import { isAlphabetical, isHarmonic, isSymbolic } from '../isParticularType';
import { HARMONIC_CHARACTERS } from '../constants/charTypes';
import { settings } from '../settings/pluginSettings';
import getCacheString from './cacheString';

const PATH_CACHE: Map<string, string> = new Map();

/**
 * ### Gets the corresponding audio path to the given input.
 * @param key The keyboard input that will determine the file used.
 * @param vocalIndex A number within [0-7] which corresponds to one of the default voices.
 * @param pluginSettings Settings o the plugin, mainly used for small differences in behavior.
 * @returns {string} The path to the file which should be played.
 */
export function getFilePath(
    extensionPath: string,
    key: string,
    vocalIndex: number,
    pluginSettings: typeof settings,
): string {
    if (pluginSettings.sounds_override) return pluginSettings.sounds_override; // Reminder that sounds.override is an absolute path to the desired sound.

    let filePath = '';
    let cachedPath: string | undefined;

    if (!settings.sounds_alphabetical && isAlphabetical(key)) {
        key = 'default';
    }

    if (!settings.sounds_harmonic && isHarmonic(key)) {
        key = 'default';
    }

    if (settings.sounds_diacriticRecognition) {
        key = key.normalize('NFD').replace(/[ ̀-◌ͯ]/g, '');
    }

    cachedPath = PATH_CACHE.get(getCacheString(key));

    if (cachedPath && !settings.sounds_override) {
        return cachedPath;
    }

    // Note: some funky math tricks were used to greatly simplify converting vocalIndex (0-7) to male/female voices 1-4. Here, `vocalIndex = 0-3` represents female voices 1-4, while `vocalIndex = 4-7` represents male voices 1-4.
    const animalesePath = path.join(
        extensionPath,
        'audio',
        'animalese',
        vocalIndex <= 3 ? 'female' : 'male',
        `voice_${(vocalIndex % 4) + 1}`,
    );
    const vocalsPath = path.join(
        extensionPath,
        'audio',
        'vocals',
        vocalIndex <= 3 ? 'female' : 'male',
        `voice_${(vocalIndex % 4) + 1}`,
    );
    const sfxPath = path.join(extensionPath, 'audio', 'sfx');

    switch (true) {
        case isAlphabetical(key): {
            filePath = path.join(animalesePath, `${key}.mp3`);
            break;
        }
        case isHarmonic(key): {
            if (pluginSettings.sounds_harmonic) {
                filePath = path.join(vocalsPath, `${HARMONIC_CHARACTERS.indexOf(key)}.mp3`);
            } else {
                filePath = path.join(sfxPath, 'default.mp3');
            }
            break;
        }
        case key === '!' || key === '?' || key.includes('\n'): {
            if (pluginSettings.sounds_specialPunctuation) {
                const noise = { '!': 'Gwah', '?': 'Deska', '\n': 'OK' };
                filePath = path.join(animalesePath, `${noise[key as keyof typeof noise]}.mp3`);
                break;
            }
        }
        case isSymbolic(key): {
            filePath = path.join(sfxPath, `${symbolToName(key) ?? 'default'}.mp3`);
            break;
        }
        case ['tab', 'backspace'].includes(key): {
            filePath = path.join(sfxPath, `${key}.mp3`);
            break;
        }
        default: {
            filePath = path.join(sfxPath, `default.mp3`);
            break;
        }
    }
    PATH_CACHE.set(getCacheString(key), filePath);

    return filePath;
}

export function symbolToName(sym: string) {
    switch (sym) {
        case '~': {
            return 'tilde';
        }
        case '!': {
            return 'exclamation';
        }
        case '@': {
            return 'at';
        }
        case '#': {
            return 'pound';
        }
        case '$': {
            return 'dollar';
        }
        case '%': {
            return 'percent';
        }
        case '^': {
            return 'caret';
        }
        case '&': {
            return 'ampersand';
        }
        case '*': {
            return 'asterisk';
        }
        case '(': {
            return 'parenthesis_open';
        }
        case ')': {
            return 'parenthesis_closed';
        }
        case '{': {
            return 'brace_open';
        }
        case '}': {
            return 'brace_closed';
        }
        case '[': {
            return 'bracket_open';
        }
        case ']': {
            return 'bracket_closed';
        }
        case '?': {
            return 'question';
        }
        case '\n': {
            return 'enter';
        }
        case '/': {
            return 'slash_forward';
        }
        case '\\': {
            return 'slash_back';
        }
    }
    return null;
}
