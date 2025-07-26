export const settings = {
    volume: 50,
    voice: 'Female Voice 1 (Sweet)',
    intonation_falloffTime: 0.5,
    intonation_pitchVariation: 100,
    intonation_switchToExponentialFalloff: false,
    intonation_louderUppercase: 20,
    specialPunctuation: false,
    soundOverride: '',
};

export const DEFAULT_SETTINGS = structuredClone(settings); // Necessary to create a deep clone, so this object isn't modified when the original `settings` object is changed.
