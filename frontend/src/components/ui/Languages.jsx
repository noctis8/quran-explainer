import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import useLanguageStore from '../../stores/languageStore.js';
import { lang_code_to_name } from "../../data.js";
import { Languages as LanguagesIcon } from 'lucide-react';

const languages = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'ur', label: 'اردو' },
    { code: 'ru', label: 'Русский' },
    { code: 'fr', label: 'Français' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'es', label: 'Español' },
    { code: 'id', label: 'Indonesia' },
];

const Languages = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedLanguageName = useLanguageStore(state => state.selectedLanguageName);
    const setLanguage = useLanguageStore(state => state.setLanguage);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('language');
            if (!raw) return;
            const parsed = JSON.parse(raw);
            const candidateName = parsed?.state?.selectedLanguageName || parsed?.selectedLanguageName || (typeof parsed === 'string' ? parsed : null);
            if (candidateName) {
                // find corresponding language code from lowercase store name
                const foundCode = Object.keys(lang_code_to_name).find(code => lang_code_to_name[code] === candidateName.toLowerCase());
                if (foundCode) {
                    setLanguage(foundCode);
                    i18n.changeLanguage(foundCode);
                }
            }
        } catch (e) {
            console.warn('Failed to parse persisted language:', e);
        }
    }, [setLanguage]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageSelect = (lang) => {
        setLanguage(lang.code);
        // change i18n language as well in order to change all the static content language
        i18n.changeLanguage(lang.code);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? "bg-[var(--fourth-bg)]" : ""} cursor-pointer p-2 rounded-full hover:bg-[var(--fourth-bg)] transition-colors duration-200 flex items-center justify-center`}
                aria-label={t('dropdowns.select_language')}
            >
                <LanguagesIcon size={24} />
            </button>

            {isOpen && (
                <div className="custom-scrollbar max-h-[400px] overflow-y-scroll absolute right-0 mt-2 w-48 bg-[var(--bg)] rounded-lg shadow-lg border border-[var(--verse)]/10 z-50 py-1">
                    {languages.map((lang) => {
                        const isActive = selectedLanguageName === lang.code;
                        return (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageSelect(lang)}
                                className={`w-full text-left px-4 py-2 transition-colors duration-150 flex items-center justify-between ${
                                    isActive ? 'bg-[var(--primary-bg)] text-[var(--verse)]' : 'text-[var(--second)] hover:bg-[var(--fourth-bg)]'
                                }`}
                            >
                                <span>{t(lang.label)}</span>
                                <span className="text-sm text-gray-500">{lang.code.toUpperCase()}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export { Languages };