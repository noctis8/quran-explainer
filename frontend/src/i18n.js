import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

function detectInitialLang() {
    try {
        const raw = localStorage.getItem('language');
        if (!raw) return 'en';
        const parsed = JSON.parse(raw);
        const candidateName = parsed?.state?.selectedLanguageName || parsed?.selectedLanguageName || (typeof parsed === 'string' ? parsed : null);
        if (!candidateName) return 'en';
        return candidateName.toLowerCase();
    } catch (e) {
        console.log("from i18n", e)
        return 'en';
    }
}

i18n
    .use(HttpApi) // Tell i18next to use the backend
    .use(initReactI18next)
    .init({
        lng: detectInitialLang(),
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },

        // backend configuration
        backend: {
            // We going to import translations from public folder
            // {{lng}} is a placeholder for the language code from the storage (like 'en' ...)
            loadPath: '/locales/{{lng}}.json',
        },

        // for a better loading experience
        react: { useSuspense: true },
    });

export default i18n;