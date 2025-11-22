import NextPrevious from "../../components/ui/NextPrevious.jsx";
import Dropdown from "../../components/ui/Dropdown.jsx";
import useAppState from "../../stores/surahStore.js";
import useLanguageStore from "../../stores/languageStore";
import {useActiveVerseAndExplication} from "../../hooks/useActiveVerseAndExplication.jsx";
import {useChaptersList} from "../../hooks/useChaptersList.jsx";
import useDirection from "../../hooks/useDirection.jsx";
import {HighlightedTextexplanation} from "../../utils/htmlParser.jsx";
import {BadgeInfo} from "lucide-react";
import Tooltip from "../../components/ui/Tooltip.jsx";

const VerseExplanation = ({ t, lastVerse, arabicLang }) => {
    const increaseVerseId = useAppState(state => state.increaseVerseId);
    const decreaseVerseId = useAppState(state => state.decreaseVerseId);
    const verseId = useAppState(state => state.current_state.verse_id);
    const surahId = useAppState(state => state.current_state.surah_id);
    const scholarId = useAppState(state => state.current_state.scholar_id);
    const pageId = useAppState(state => state.current_state.page_id);
    const setNewState = useAppState(state => state.updateCurrentState);
    const selectedLanguageName = useLanguageStore(state => state.selectedLanguageName);

    // get the active verse text in bottom side and it's explanation
    const { verseText, explanation, loadingExplanation } = useActiveVerseAndExplication(surahId, verseId, scholarId, t, setNewState, pageId);
    // when language changes, fetch scholars list and set explication to fallback
    const { scholarsList, noTafsirForThatLang} = useChaptersList(selectedLanguageName, setNewState, scholarId);
    // get direction
    const { textDirection } = useDirection(selectedLanguageName, arabicLang);

    const hideNext = () => surahId === 114 && verseId === lastVerse
    const hidePrevious = () => surahId === 1 && verseId === 1

    return (
        <div className={'rounded-2xl space-y-2 py-2 px-2 md:px-4 bg-[var(--light-bg)]'}>
            <div className={'bg-[var(--second-bg)] rounded-lg px-4 py-2'}>
                <div className={`flex sm:justify-end items-center justify-center scholars-list
                     ${noTafsirForThatLang && '!justify-between flex-row'}`}
                >
                    <Tooltip content={t("messages.explanation_language_unavailable")}>
                        {noTafsirForThatLang && <BadgeInfo color={"red"} />}
                    </Tooltip>
                    <Dropdown data={scholarsList} description={t("dropdowns.select_scholar")} currentVal={{ scholar_id: scholarId }} />
                </div>
                <div dir={`${selectedLanguageName === "ar" || selectedLanguageName === "ur"
                    ? 'rtl' : 'ltr'}`}
                    className={'font-sans space-y-2 py-1'}
                >
                    <h3 className={'active-verse py-1 font-bold text-[var(--active-verse)]'}>
                        {verseText}
                    </h3>
                    <div className={"h-0.5 bg-white"}></div>
                    {loadingExplanation ? (
                        <div className="loader"></div>
                    ) : (
                        <div className="text-[var(--second)] md:text-lg">
                            {/* make quotes or verses that are inside " " highlighted */}
                            <HighlightedTextexplanation text={explanation} activeVerse={verseText} />
                        </div>
                    )}
                </div>
            </div>
            <div className={'arrows text-center'}>
                <NextPrevious decrease={decreaseVerseId} increase={increaseVerseId} hideNext={hideNext()} hidePrevious={hidePrevious()}
                  obj={{ val: verseId, surahId, max: lastVerse }} tooltipNext={t("tooltip.next_verse")}
                  textDirection={textDirection} tooltipPrevious={t("tooltip.previous_verse")}
                />
            </div>
        </div>
    )
}

export default VerseExplanation
