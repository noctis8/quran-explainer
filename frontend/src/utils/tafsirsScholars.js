
export function getScholarByLanguage(tafsirsScholars, lang) {
    return tafsirsScholars.filter(t => t.language_name.toLowerCase() === lang.toLowerCase());
}

