/**
 * Generate array of objects with sequential IDs
 */
export const generateObjectArray = (max) => {
    if (!max || max < 1) return [];
    return Array.from({ length: max }, (_, i) => ({
        id: i + 1,
        name: ""
    }));
};

/**
 * Minimize chapters data to only id and name
 */
export const minimalizeChapters = (data, lang) => {
    if (!data || data.length === 0) {
        return Array.from({ length: 114 }, (_, i) => ({
            id: i + 1,
            name: `Surah ${i + 1}`
        }));
    }
    // in name add condition to return arabic name if the lang is arabic itherwise return translated name
    return data.map(chapter => ({
        id: chapter.id,
        name: lang === "ar" ? chapter.name_arabic : chapter.translated_name?.name
    }));
};

