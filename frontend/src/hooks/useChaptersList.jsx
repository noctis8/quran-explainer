import { useEffect, useState } from "react";
import {getChaptersList} from "../services/verseApiService.js";
import { getScholarByLanguage } from "../utils/tafsirsScholars.js";
import { tafsirsScholars, lang_code_to_name } from "../data.js";

export const useChaptersList = (selectedLanguage = "en", setNewState = null, scholar_id = null) => {
    const [chapters, setChapters] = useState([]);
    const [scholarsList, setScholarsList] = useState([]);
    const [noTafsirForThatLang, setTafsirAvability] = useState(false);

    useEffect(() => {
        const fetchChapters = async () => {
            // get scholars list and set explication to fallback
            if (setNewState) {
                // see if there's tafsir available for the selected language (we have only 5 langauges available for tafsir and 10 language for quran translation)
                let selectedLang = "english";      // not all languages have tafsir so we set default to english (in case there's no tafsir for the selected language it will be in english)
                setTafsirAvability(true)
                if (lang_code_to_name[selectedLanguage]) {
                    selectedLang =  lang_code_to_name[selectedLanguage];
                    setTafsirAvability(false)
                }
                const scholars = getScholarByLanguage(tafsirsScholars, selectedLang);
                // normalize response to array of {slug, name} instead of the id we're gonna use slug as id wich is combination between scholar name and the lang (exp: ar-ibn-kathir ...)
                const normalized = scholars.map((scholar) => ({ id: scholar.slug, name: scholar.translated_name ?? scholar.name }));
                setScholarsList(normalized);
                // set default scholar as the first one in the list if none is selected
                if (normalized.length > 0 && !normalized.some((ele) => ele.id === scholar_id) ) {
                    setNewState({ scholar_id: normalized[0].id });
                }
            } else {
                // get chapters id and name [{id, name_arabic, pages, translated_name, }, ...]
                const chaptersData = await getChaptersList(selectedLanguage);
                setChapters(chaptersData || []);
            }
        };
        fetchChapters();
    }, [selectedLanguage]);

    return { chapters, scholarsList, noTafsirForThatLang };
};