import { Link } from 'react-router-dom';
import {useEffect, useState} from "react";
import { ArrowUpDown, ChevronRight, ChevronLeft } from 'lucide-react';
import useAppState from "../../stores/surahStore.js";
import useLanguageStore from "../../stores/languageStore.js";
import { useChaptersList } from '../../hooks/useChaptersList.jsx';
import { useTranslation } from 'react-i18next';
import useDirection from "../../hooks/useDirection.jsx";
import { SurahsListLoader } from '../../components/ui/SurahsListLoader.jsx';

const SurahList = () => {
    const { t } = useTranslation();
    const [sortOrder, setSortOrder] = useState('asc');   // values are 'asc' or 'desc'
    const setNewState = useAppState(state => state.updateCurrentState);
    const selectedLanguage = useLanguageStore(state => state.selectedLanguageName);

    // get chapters by selected language
    const { chapters } = useChaptersList(selectedLanguage);
    // get direction
    const { textDirection } = useDirection(selectedLanguage);

    useEffect(() => {
        console.log(chapters)
    }, [chapters]);

    // Sort chapters based on current sort order
    const sortedChapters = [...chapters].sort((a, b) => {
        return sortOrder === 'asc' ? (a.id - b.id) : (b.id - a.id);
    });

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div
            className="px-4 py-6 lg:px-20 lg:py-12 mx-auto my-8"
            dir={textDirection}
        >
            {/* Header with Sort Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[var(--primary)]">{t('home.surah_list_title')}</h1>
                <button
                    onClick={toggleSortOrder}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600
                             text-white rounded-lg transition-colors duration-200"
                >
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="text-sm">
                        {sortOrder === 'asc' ? t('home.ascending') : t('home.descending')}
                    </span>
                </button>
            </div>

            {/* Show loader while chapters are loading */}
            {(!chapters || chapters.length === 0) ? (
                <div className="w-full">
                    <SurahsListLoader />
                </div>
            ) : (
                <div
                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6"
                >
                    {sortedChapters?.map((surah) => (
                        <Link
                            to={`/quran`}
                            key={surah.id}
                            onClick={() => setNewState({ surah_id: surah.id, page_id: surah.pages?.[0], verse_id: 1 })}
                            className="group relative cursor-pointer bg-[var(--second-bg)] hover:bg-[var(--primary-bg)] text-[var(--primary)]
                                     transition-all duration-300 ease-out rounded-lg p-3
                                     border border-gray-600 hover:border-[var(--third)]
                                     hover:shadow-md hover:shadow-[var(--active-verse)]/20"
                        >
                            {/* Diamond Number Badge */}
                            <div className="absolute -top-1 -right-1 w-6 h-6
                                           bg-gray-600 group-hover:bg-[var(--third)]
                                           transform rotate-45 flex items-center justify-center
                                           transition-all duration-300 shadow-md">
                                <span className="transform -rotate-45 text-white font-bold text-xs">
                                    {surah.id}
                                </span>
                            </div>

                            {/* Main Content */}
                            <div className="pr-2">
                                {selectedLanguage === 'ar' ? (
                                    // Arabic Layout: Show Arabic name prominently
                                    <div className="text-right mb-2 flex gap-2 justify-between">
                                        <h2 className="arabic-font text-lg font-medium text-[var(--primary)] group-hover:text-[var(--active-verse)] transition-all duration-300">
                                            سورة {surah.name_arabic}
                                        </h2>
                                        <h4 className="hidden md:block text-sm font-medium text-[var(--second)] group-hover:text-[var(--active-verse)] transition-all duration-300">
                                            {surah.name_arabic}
                                        </h4>
                                    </div>
                                ) : (
                                    // Non-Arabic Layout: Show translated name and translation
                                    <>
                                        <div>
                                            <h2 className={`text-md sm:text-lg font-semibold text-[var(--primary)] group-hover:text-[var(--active-verse)] transition-all duration-300
                                            ${surah.translated_name?.name.split(" ").length >= 3 ? 'text-sm sm:text-lg' : ''}`}>        {/* shrink the font size of surahs with more thant 3 words */}
                                                {surah.translated_name?.name || surah.name_simple}
                                            </h2>
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--second)]  transition-colors">
                                                {surah.name_simple}
                                            </p>
                                        </div>
                                    </>
                                )}

                                {/* Bottom Section */}
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-600 group-hover:border-gray-500 transition-colors">
                                    {/* Verse Count */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-4 bg-gray-600 group-hover:bg-[var(--active-verse)]/30 p-3 rounded-full flex items-center justify-center transition-all duration-300">
                                            <span className="text-xs text-gray-300 group-hover:text-[var(--active-verse)] font-medium">
                                                {surah.verses_count}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-bold ">
                                            {t('home.verses')}
                                        </span>
                                    </div>

                                    {/* Arrow Indicator */}
                                    <div className={`opacity-0 group-hover:opacity-100 transition-all duration-300 text-[var(--active-verse)] ${textDirection === "rtl" ? 'order-1' : 'order-2'}`}>
                                        {textDirection === "rtl" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SurahList;