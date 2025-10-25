import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import useLanguageStore from '../../stores/languageStore.js';
import { lang_code_to_name } from "../../data.js";

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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z" fill="currentColor"/>
                </svg>
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