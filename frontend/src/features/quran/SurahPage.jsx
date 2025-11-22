import Dropdown from "../../components/ui/Dropdown.jsx";
import NextPrevious from "../../components/ui/NextPrevious.jsx";
import useAppState from "../../stores/surahStore.js";
import {generateObjectArray, minimalizeChapters} from "../../utils/verseUtils.js";
import { useVersesByPage } from "../../hooks/useVersesByPage.jsx";
import VerseDisplay from "./VerseDisplay.jsx";
import {useChaptersList} from "../../hooks/useChaptersList.jsx";
import useLanguageStore from "../../stores/languageStore.js";
import {ArrowLeftRight} from "lucide-react";
import {useMemo} from 'react';
import useDirection from "../../hooks/useDirection.jsx";

const SurahPage = ({ t, lastVerse, arabicLang, setArabicLang }) => {
    const surahId = useAppState(state => state.current_state.surah_id);
    const pageId = useAppState(state => state.current_state.page_id);
    const verseId = useAppState(state => state.current_state.verse_id);
    const setNewState = useAppState(state => state.updateCurrentState);
    const decreasePageId = useAppState(state => state.decreasePageId);
    const increasePageId = useAppState(state => state.increasePageId);
    const font = useAppState(state => state.quranFont);
    const selectedLanguage = useLanguageStore(state => state.selectedLanguageName);

    // get all verses in the current page
    const { pageVerses, isLoading } = useVersesByPage(pageId, surahId, verseId, setNewState, selectedLanguage);
    // get chapters id and name [{id, name_arabic, pages, translated_name, }, ...]
    const { chapters } = useChaptersList(selectedLanguage);
    // get direction
    const { textDirection } = useDirection(selectedLanguage, arabicLang);

    // Memoize
    const isLastPage = useMemo(() => pageId === 604, [pageId]);
    const isFirstPage = useMemo(() => pageId === 1, [pageId]);
    const verseData = useMemo(() => generateObjectArray(lastVerse), [lastVerse]);
    const pageData = useMemo(() => generateObjectArray(604), []);
    const minimizedChapters = useMemo(() => minimalizeChapters(chapters, selectedLanguage), [chapters]);

    return (
        <div className={'surah-page-containter rounded-2xl space-y-2 py-2 px-2 md:px-4 bg-[var(--light-bg)]'}>
            <div className={"flex flex-wrap gap-2 sm:flex-row-reverse justify-between"}>
                <div className={'surah-verse-list sm:justify-end flex justify-center gap-4'}>
                    <Dropdown description={t("dropdowns.select_verse")} currentVal={{ verse_id: verseId }} data={verseData} />
                    <Dropdown description={t("dropdowns.select_chapter")} currentVal={{ surah_id: surahId }} data={minimizedChapters} />
                </div>
                {/* enable an option to change lang of quran if the lang is not arabic */}
                { selectedLanguage !== "ar" && (
                    <div onClick={() => setArabicLang(!arabicLang)}>
                        <p className={'text-center btn'}>
                            <ArrowLeftRight />
                            <span className={"ml-2"}>{arabicLang ? t("messages.translation") : t("messages.original")}</span>
                        </p>
                    </div>
                )}
            </div>
            <VerseDisplay
                arabicLang={arabicLang}
                pageVerses={pageVerses}
                chapters={chapters}
                verseId={verseId}
                surahId={surahId}
                setNewState={setNewState}
                isLoading={isLoading}
                font={font}
                selectedLanguage={selectedLanguage}
            />
            <div className={'arrows text-center'} >
                <NextPrevious
                    decrease={decreasePageId} increase={increasePageId} hideNext={isLastPage} hidePrevious={isFirstPage}
                    obj={{ val: pageId }} textDirection={textDirection} tooltipNext={t("tooltip.next_page")} tooltipPrevious={t("tooltip.previous_page")}
                    component={<Dropdown description={t("dropdowns.select_page")} currentVal={{ page_id: pageId }} data={pageData} />}
                />   {/* 604 is pages number in madani mushaf */}
            </div>
        </div>
    )
}

export default SurahPage