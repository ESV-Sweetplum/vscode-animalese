import { VOICE_LIST } from '../constants/voiceList';
import { settings } from '../settings/pluginSettings';

export default function getCacheString(key: string) {
    return `${key}${VOICE_LIST.indexOf(
        settings.voice,
    )}${+settings.sounds_specialPunctuation}${+settings.sounds_alphabetical}${+settings.sounds_harmonic}${+settings.sounds_diacriticRecognition}`;
}
