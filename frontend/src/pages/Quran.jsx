import Navbar from "../components/layout/Navbar.jsx";
import SurahPage from "../features/quran/SurahPage.jsx";
import VerseExplanation from "../features/quran/VerseExplanation.jsx";
import {useEffect, useState} from "react";
import useAppState from "../stores/surahStore.js";
import {getChapterInfo} from "../services/verseApiService.js";
import {useTranslation} from "react-i18next";

const Quran = () => {
    const { t } = useTranslation();
    const surahId = useAppState(state => state.current_state.surah_id);

    // by default make the quran verses in arbaic language (user can change it later)
    const [arabicLang, setArabicLang] = useState(true);

    // get and set number of verses in the current surah
    const [lastVerse, setLastVerse] = useState(null);
    useEffect(() => {
        let isMounted = true;
        const fetchVersesCount = async () => {
            const response = await getChapterInfo(surahId);
            if (isMounted && response?.verses_count) {
                setLastVerse(response.verses_count);
            }
        };
        fetchVersesCount();
        return () => {
            isMounted = false;
        };
    }, [surahId, setLastVerse]);

    return (
        <>
            <Navbar />
            <div className={'space-y-4 mt-4 mb-18 max-w-[100vw] lg:max-w-[86vw] mx-auto p-2 lg:p-4'}>
                <SurahPage setArabicLang={setArabicLang} arabicLang={arabicLang} t={t} lastVerse={lastVerse} />
                <VerseExplanation arabicLang={arabicLang} t={t} lastVerse={lastVerse} />
            </div>
        </>
    )
}

export default Quran