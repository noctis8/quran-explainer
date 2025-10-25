import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Sun, MoonStar, Wrench } from 'lucide-react';
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
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                >
                    <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2573 9.77251 19.9887C9.5799 19.7201 9.31074 19.5159 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.74270 9.96512 4.01127 9.77251C4.27984 9.5799 4.48405 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.87653 6.85425 4.02405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
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
