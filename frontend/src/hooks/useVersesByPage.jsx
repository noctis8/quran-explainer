import { useEffect, useState, useRef } from "react";
import { getVersesByPageService } from "../services/verseApiService.js";

export const useVersesByPage = (pageId, surahId, verseId, setNewState, selectedLanguage) => {
    const [pageVerses, setPageVerses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isInitialMount = useRef(true);
    const prevPageId = useRef(pageId);

    useEffect(() => {
        let isMounted = true;

        const getVersesByPage = async () => {
            setIsLoading(true);

            try {
                const res = await getVersesByPageService(pageId, selectedLanguage);

                if (!isMounted || !res || res.length === 0) return;

                setPageVerses(res);

                // Only update verse/surah on page change (not on initial mount or language change)
                const pageChanged = prevPageId.current !== pageId;

                if (pageChanged && !isInitialMount.current) {
                    // Get the first verse of the page
                    const firstVerse = res[0];
                    const firstSurahId = Number(firstVerse.verse_key.split(':')[0]);
                    const firstVerseId = Number(firstVerse.verse_key.split(':')[1]);

                    // Check if current verse exists on this page
                    const currentVerseExists = res.some(v => {
                        const [vSurahId, vVerseId] = v.verse_key.split(':').map(Number);
                        return vSurahId === surahId && vVerseId === verseId;
                    });

                    // If current verse is not on this page, update to first verse of page
                    if (!currentVerseExists) {
                        setNewState({
                            surah_id: firstSurahId,
                            verse_id: firstVerseId
                        });
                    }
                }

                prevPageId.current = pageId;
                isInitialMount.current = false;

            } catch (error) {
                console.error("Failed to fetch verses:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        getVersesByPage();

        return () => {
            isMounted = false;
        };
    }, [pageId, selectedLanguage]);

    return { pageVerses, isLoading };
};
