export const settings = {
    volume: 50,
    voice: 'Female Voice 1 (Sweet)',
    sounds_alphabetical: false,
    sounds_harmonic: true,
    sounds_diacriticRecognition: true,
    sounds_specialPunctuation: false,
    sounds_override: '',
    intonation_falloffTime: 0.5,
    intonation_pitchVariation: 100,
    intonation_switchToExponentialFalloff: false,
    intonation_louderUppercase: 20,
};

export const DEFAULT_SETTINGS = structuredClone(settings); // Necessary to create a deep clone, so this object isn't modified when the original `settings` object is changed.
