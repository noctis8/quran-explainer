import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLanguageStore = create(persist(
    (set) => ({
        // store only the language name (lowercase) as requested
        selectedLanguageName: 'en',
        setLanguage: (languageCode) => {
            set({ selectedLanguageName: languageCode });
        }
    }),
    {
        name: 'language',
    }
));

export default useLanguageStore;
