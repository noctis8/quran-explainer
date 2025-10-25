import { useMemo } from 'react';
import { renderVerseHtml } from "../../utils/htmlParser.jsx";

const VerseDisplay = ({
                          arabicLang,
                          pageVerses,
                          isLoading,
                          verseId,
                          surahId,
                          setNewState,
                          chapters,
                          font,
                          selectedLanguage
                      }) => {

    // Memoize direction to avoid recalculation
    const textDirection = useMemo(() =>
            arabicLang || selectedLanguage === "ur" ? 'rtl' : 'ltr',
        [arabicLang, selectedLanguage]
    );

    // Memoize chapter lookup
    const getChapterName = useMemo(() => {
        const chapterMap = new Map(chapters.map(c => [Number(c.id), c]));
        return (chapterId) => {
            const chapter = chapterMap.get(Number(chapterId));
            return chapter?.translated_name?.name || chapter?.name_arabic || `chapter ${chapterId}`;
        };
    }, [chapters]);

    // Memoize whether to show Arabic or translation
    const showArabic = useMemo(() =>
            arabicLang || selectedLanguage === "ar",
        [arabicLang, selectedLanguage]
    );

    function getSurahNumber(key) {
        return Number(key.split(":")[0]);
    }

    // Helper to check if verse is active
    const isActiveVerse = (verse) => {
        return verse.verse_number === verseId && getSurahNumber(verse.verse_key) === surahId;
    };

    const renderVerseText = (verse) => {
        if (showArabic) {
            if (font === "text_uthmani_tajweed") {
                return (
                    <span className="verse-text-html">
                        {renderVerseHtml(verse.text_uthmani_tajweed)}
                    </span>
                );
            }
            return <span className="verse-text-plain">{verse[font]}</span>;
        }
        const translationText = verse.translations?.[0]?.text || verse[font];
        return (
            <span className="verse-text-plain">
                {renderVerseHtml(translationText)}
            </span>
        );
    };

    const renderVerseNumber = (verseNumber) => (
        <span className="relative inline-block text-[var(--third)]">
            <span className="text-2xl">۝</span>
            <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold">
                {verseNumber}
            </span>
        </span>
    );

    const renderChapterHeader = (verse) => {
        if (verse.verse_number !== 1) return null;     // there's no new chapter in that page

        const chapterId = getSurahNumber(verse.verse_key);
        const chapterName = getChapterName(chapterId);

        return (
            <h3 className={`${selectedLanguage === "ar" ? 'arabic-font' : ''} bg-[var(--bg)] max-w-[70%] lg:max-w-[50%] mx-auto text-center font-bold py-1 mb-2 mt-1 text-[var(--second)] rounded-xl`}>
                {chapterName}
            </h3>
        );
    };

    // Handle verse click
    const handleVerseClick = (verse) => {
        setNewState({
            verse_id: verse.verse_number,
            surah_id: getSurahNumber(verse.verse_key)
        });
    };

    if (isLoading) {
        return (
            <div className="surah-page md:text-[1.35rem] p-2 rounded-lg bg-[var(--primary-bg)]">
                <div className="flex justify-center items-center py-8">
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${arabicLang ? 'md:text-[1.45rem]' : 'md:text-xl'} surah-page text-lg p-2 rounded-lg bg-[var(--primary-bg)]`}>
            <div dir={textDirection} className="text-center leading-normal">
                {pageVerses.map((verse) => (
                    <span key={verse.id}>
                        {/* check if we have new chapter by showing its name */}
                        {renderChapterHeader(verse)}

                        {/* verse (text + number) */}
                        <span
                            className={"hover:cursor-pointer"}
                            onClick={() => handleVerseClick(verse)}
                        >
                            <span className={`hover:underline ${isActiveVerse(verse) ? 'text-[var(--active-verse)]' : 'text-[var(--verse)]'}`}> {renderVerseText(verse)} </span>
                            <span> {renderVerseNumber(verse.verse_number)} </span>
                        </span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default VerseDisplay;