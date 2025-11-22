import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Sun, MoonStar, Wrench, Settings as SetttingsIcon } from 'lucide-react';
import useLanguageStore from "../../stores/languageStore.js";
import useAppState from '../../stores/surahStore.js';
import useDirection from "../../hooks/useDirection.jsx";

const Settings = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const dropdownRef = useRef(null);
    const selectedLanguageName = useLanguageStore(state => state.selectedLanguageName);
    const { t } = useTranslation();
    const quranFont = useAppState(state => state.quranFont);
    const setQuranFont = useAppState(state => state.setQuranFont);
    const { textDirection } = useDirection(selectedLanguageName);

    const themes = [
        { id: 'light', labelKey: 'settings.theme.light_mode', icon: <Sun size={17} /> },
        {
            id: 'sepia', labelKey: 'settings.theme.sepia_mode', icon: (
                <svg width="20" height="20" viewBox="0 0 48 48" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 13C30.03 13 35 18 35 24C35 24.68 34.94 25.35 34.82 26H42.75C43.44 26 44 26.56 44 27.25C44 27.94 43.44 28.5 42.75 28.5H5.25C4.56 28.5 4 27.94 4 27.25C4 26.56 4.56 26 5.25 26H13.18C13.06 25.35 13 24.68 13 24C13 18 18 13 24 13Z" fill="currentColor"/>
                    <path d="M11.5 9.8L13.75 12C14.24 12.5 14.24 13.3 13.75 13.8C13.3 14.27 12.58 14.3 12.09 13.9L9.84 11.66C9.35 11.18 9.35 10.38 9.84 9.9C10.3 9.44 11.01 9.41 11.5 9.8Z" fill="currentColor"/>
                    <path d="M38.14 9.9C38.6 10.35 38.63 11.07 38.24 11.56L36 13.8C35.51 14.3 34.72 14.3 34.23 13.8C33.77 13.36 33.74 12.64 34.14 12.14L36.38 9.9C36.86 9.41 37.66 9.41 38.14 9.9Z" fill="currentColor"/>
                    <path d="M24 4C24.65 4 25.18 4.49 25.24 5.12V8.28C25.24 8.98 24.69 9.53 24 9.53C23.35 9.53 22.82 9.04 22.76 8.41V5.25C22.76 4.56 23.31 4 24 4Z" fill="currentColor"/>
                </svg>
            )
        },
        { id: 'dark', labelKey: 'settings.theme.dark_mode', icon: <MoonStar size={17} /> }
    ];

    // tajweed api have some issues (it's not accurate and have some missing Rulings(a7kem) like tafkhim) so we disable it for now untill they fix it
    const fontStyles = [
        { id: 'text_uthmani', labelKey: 'settings.quran_font.imlaei' },
        { id: 'text_imlaei_simple', labelKey: 'settings.quran_font.simple' },
        { id: 'text_uthmani_tajweed', labelKey: 'settings.quran_font.tajweed' }
    ];

    const handleThemeSelect = (theme) => {
        const themeId = theme.id;
        setSelectedTheme(themeId);
        document.documentElement.classList.remove('theme-dark', 'theme-sepia');
        if (themeId !== 'light') document.documentElement.classList.add(`theme-${themeId}`);
        localStorage.setItem('theme', themeId);
    };

    useEffect(() => {
        handleThemeSelect({ id: selectedTheme }); // Apply stored theme on load
    }, []);

    const handleQuranFont = (font) => setQuranFont(font);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /** Helper for sliding indicator position respecting RTL **/
    const getIndicatorPosition = (items, selectedId) => {
        const index = items.findIndex(i => i.id === selectedId);
        const percentage = 100 / items.length;
        if (textDirection === 'rtl') {
            return { right: `calc(${index * percentage}% + 6px)` };
        }
        return { left: `calc(${index * percentage}% + 6px)` };
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-[var(--fourth-bg)] transition-all duration-200 flex items-center justify-center"
                aria-label="Settings"
            >
                <SetttingsIcon className={`duration-300 ${isOpen ? 'rotate-30' : ''}`} size={24} />
            </button>

            {isOpen && (
                <div className="max-w-54 md:max-w-88 absolute right-0 top-full mt-2 w-96 bg-[var(--bg)] rounded-2xl shadow-2xl border border-[var(--verse)]/10 z-50" dir={textDirection}>
                    {/* Header */}
                    <div className="flex items-center justify-between py-2 px-4 border-b border-[var(--verse)]/10">
                        <h2 className="text-xl font-bold text-[var(--primary)]">
                            {t('settings.title') || 'Settings'}
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 hover:bg-[var(--fourth-bg)] rounded-full transition-colors">
                            <X size={20} className="text-[var(--second)]" />
                        </button>
                    </div>

                    <div className="p-2 md:px-4 space-y-4 max-h-[500px] overflow-y-auto">
                        {/* Theme Section */}
                        <div className="space-y-4">
                            <h3 className="text-base font-semibold text-[var(--primary)]">
                                {t('settings.theme.theme')}
                            </h3>

                            <div className="relative bg-[var(--third-bg)] rounded-full flex items-center">
                                <div
                                    className="absolute h-[calc(100%-12px)] bg-[var(--primary-bg)] rounded-full transition-all duration-300 ease-out shadow-md"
                                    style={{
                                        width: `calc(${100 / themes.length}% - 10px)`,
                                        ...getIndicatorPosition(themes, selectedTheme)
                                    }}
                                />
                                {themes.map(theme => (
                                    <button
                                        key={theme.id}
                                        onClick={() => handleThemeSelect(theme)}
                                        className={`relative flex-1 flex flex-col items-center gap-1 p-2 rounded-full transition-all duration-200 ${
                                            selectedTheme === theme.id
                                                ? 'text-[var(--verse)]'
                                                : 'text-[var(--second)] hover:text-[var(--primary)]'
                                        }`}>
                                        <span className="transition-transform duration-200 hover:scale-110">
                                            {theme.icon}
                                        </span>
                                        <span className="text-xs hidden md:block font-medium whitespace-nowrap">
                                            {t(theme.labelKey)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-[var(--verse)]/10" />

                        {/* Quran Font Section */}
                        <div className="space-y-4">
                            <h3 className="text-base font-semibold text-[var(--primary)]">
                                {t('settings.quran_font.font')}
                            </h3>

                            <div className="relative bg-[var(--third-bg)] rounded-full flex items-center">
                                <div
                                    className="absolute h-[calc(100%-12px)] bg-[var(--primary-bg)] rounded-full transition-all duration-300 ease-out shadow-md"
                                    style={{
                                        width: `calc(${100 / fontStyles.length}% - 8px)`,
                                        ...getIndicatorPosition(fontStyles, quranFont)
                                    }}
                                />
                                {fontStyles.map(font => {
                                    const isTajweed = font.id === 'text_uthmani_tajweed';
                                    return (
                                        <button
                                            key={font.id}
                                            onClick={() => { if (!isTajweed) handleQuranFont(font.id); }}
                                            disabled={isTajweed}
                                            aria-disabled={isTajweed}
                                            className={`relative flex-1 py-3 px-3 rounded-full transition-all duration-200 text-center ${
                                                quranFont === font.id
                                                    ? 'text-[var(--verse)] font-semibold'
                                                    : 'text-[var(--second)] hover:text-[var(--primary)]'
                                            } ${isTajweed ? '!cursor-not-allowed' : ''}`}
                                            type="button"
                                        >
                                            <span className="text-xs md:text-sm whitespace-nowrap flex items-center flex-col md:flex-row justify-center gap-0 md:gap-1">
                                                {t(font.labelKey)}
                                                {isTajweed && (
                                                    <Wrench style={{ marginTop: '2px' }} size={12}/>
                                                )}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { Settings };
