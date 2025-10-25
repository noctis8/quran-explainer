import fetch from './fetch.js';
import { translation_by_lang_code } from '../data.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getTranslatorId = (lang) => {
    if (lang === "ar") return null;
    const translator = translation_by_lang_code[lang]?.[0];
    return translator?.id || 57; // Default to English (ID: 57)
};

// Get verses by page number
export const getVersesByPageService = async (pageId, lang) => {
    // this api needs the translation id not the langauge code
    const translatorId = getTranslatorId(lang);
    try {
        const response = await fetch(`${BASE_URL}/verses_by_page/${pageId}?id=${translatorId}`);
        return response || [];
    } catch (error) {
        console.error('Failed to fetch verses by page:', error);
        throw new Error(`Failed to load page ${pageId}`);
    }
};

// Get page number by surah and verse
export const getPageByVerseService = async (surahId, verseId, lang, scholarId) => {
    const translatorId = getTranslatorId(lang);
    try {
        const response = await fetch(`${BASE_URL}/page/${surahId}/${verseId}?translator_id=${translatorId}&tafsir_id=${scholarId}`);
        return response;
    } catch (error) {
        console.error('Failed to fetch page by verse:', error);
        throw new Error(`Failed to get page for surah ${surahId}, verse ${verseId}`);
    }
};

// Get text of a specific verse
export const getChapterInfo = async (surahId) => {
    try {
        const response = await fetch(`${BASE_URL}/chapter-info/${surahId}`);
        return response;
    } catch (error) {
        console.error('Failed to fetch page by verse:', error);
        throw new Error(`Failed to get page for surah ${surahId}`);
    }
};

export const getChaptersList = async (lang) => {
    try {
        const response = await fetch(`${BASE_URL}/chapters?lang=${lang}`);
        return response;
    } catch (error) {
        console.error('Failed to fetch page by verse:', error);
        throw new Error(`Failed to get chapters`);
    }
}

export const getTafsir = async (surahId, verseId, scholarId) => {
    try {
        const response = await fetch(`${BASE_URL}/tafsir/${scholarId}/${surahId}/${verseId}`);
        return response;
    } catch (error) {
        console.error('Failed to fetch tafsir:', error);
        throw new Error(`Failed to get tafsir for surah ${surahId}, verse ${verseId}`);
    }
}
