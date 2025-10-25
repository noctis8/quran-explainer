import { useMemo } from 'react';

const useDirection = (selectedLanguageName, arabicLang = null) => {
    const textDirection = useMemo(() => {
        return (selectedLanguageName === "ar" || selectedLanguageName === "ur" || arabicLang) ? 'rtl' : 'ltr';
    }, [selectedLanguageName, arabicLang]);

    return { textDirection };
}

export default useDirection;
