import { useEffect, useState, useRef } from "react";
import { getPageByVerseService, getTafsir } from "../services/verseApiService.js";
import useLanguageStore from "../stores/languageStore.js";

export const useActiveVerseAndExplication = (surahId, verseId, scholarId, t, setNewState, pageId) => {
    const [verseText, setVerseText] = useState("");
    const [explanation, setExplanation] = useState(t("messages.explanation_unavailable"));
    const [loadingExplanation, setLoadingExplanation] = useState(false);
    const lang = useLanguageStore(state => state.selectedLanguageName);

    const prevPageId = useRef(pageId);
    const isUpdatingPage = useRef(false);

    useEffect(() => {
        if (!surahId || !verseId || !scholarId) return;

        let isMounted = true;

        const fetchVerseData = async () => {
            setLoadingExplanation(true);

            try {
                // call tafisr content and verse text
                const [pageInfo, tafsirContent] = await Promise.all([
                    getPageByVerseService(surahId, verseId, lang, scholarId),
                    getTafsir(surahId, verseId, scholarId)
                ]);

                if (!isMounted) return;

                // Update explanation
                setExplanation(tafsirContent);

                // Update verse text
                const activeVerseText = pageInfo.translations?.[0]?.text
                    || pageInfo.text_imlaei_simple
                    || pageInfo.text_uthmani
                    || "";
                setVerseText(activeVerseText);

                // Update page if changed
                const newPageId = pageInfo.page_number;
                if (newPageId && newPageId !== pageId && !isUpdatingPage.current) {
                    isUpdatingPage.current = true;
                    setNewState({ page_id: newPageId });

                    // Reset flag after a short delay
                    setTimeout(() => {
                        isUpdatingPage.current = false;
                    }, 100);
                }

                prevPageId.current = pageId;

            } catch (error) {
                console.error("Failed to fetch verse data:", error);
                if (isMounted) {
                    setExplanation(t("messages.explanation_unavailable"));
                }
            } finally {
                if (isMounted) {
                    setLoadingExplanation(false);
                }
            }
        };

        fetchVerseData();

        return () => {
            isMounted = false;
        };
    }, [verseId, surahId, scholarId, lang]);

    return { verseText, explanation, loadingExplanation };
};
