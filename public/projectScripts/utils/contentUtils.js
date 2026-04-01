import { LEXICON } from '../content-manager/content.js';

let currentLang = 'en';

/**
 * Set the current language for the system.
 * @param {string} lang - 'en' or 'vi'
 */
export const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'vi') {
        currentLang = lang;
    }
};

/**
 * Get the current language code.
 * @returns {string}
 */
export const getLanguage = () => currentLang;

/**
 * Resolves a content key to a randomized variant in the current language.
 * @param {string} key - The LEXICON key
 * @returns {string}
 */
export const getDynamicText = (key) => {
    const entry = LEXICON[key];
    if (!entry) {
        console.warn(`Lexicon Warning: Key [${key}] not found.`);
        return `!! ${key} !!`;
    }

    const variants = entry[currentLang] || entry['en'];
    if (!variants || variants.length === 0) {
        return `!! EMPTY_CONTENT: ${key} !!`;
    }

    // Pick a random variant
    const randomIndex = Math.floor(Math.random() * variants.length);
    return variants[randomIndex];
};
