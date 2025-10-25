const translation_by_lang_code = {
    "en": [{ id: 85, author_name: "Abdul Haleem" }],
    "bn": [{ id: 161, author_name: "Tawheed Publication" }],
    "ru": [{ id: 78, author_name: "Ministry of Awqaf, Egypt" }],
    "ur": [{ id: 234, author_name: "Fatah Muhammad Jalandhari" }],
    "fr": [{ id: 136, author_name: "Montada Islamic Foundation" }],
    "tr": [{ id: 210, author_name: "Dar Al-Salam Center" }],
    "es": [{ id: 140, author_name: "Montada Islamic Foundation" }],
    "id": [{ id: 33, author_name: "Unknown" }],
    // "nl": [{ id: 235, author_name: "Malak Faris Abdalsalaam" }],
    // "de": [{ id: 208, author_name: "Abu Reda Muhammad ibn Ahmad" }],
    // "ml": [{ id: 80, author_name: "Muhammad Karakunnu and Vanidas Elayavoor" }],
}

// this will include only the languages we support for tafsirs
const lang_code_to_name = {
    ar: 'arabic',
    en: 'english',
    ru: 'russian',
    ur: 'urdu',
    bn: 'bengali',
    // zh: "chinese",
    // fr: "french",
    // es: "spanish",
    // it: "italian",
    // tr: "turkish",
    // id: "indonesian",
};

const tafsirsScholars = [
    {
        author_name: "AbdulRahman Bin Hasan Al-Alshaikh",
        id: 381,
        language_name: "bengali",
        name: "Tafsir Fathul Majid",
        translated_name: "Fathul Majid Tafsir",
        slug: "bn-tafisr-fathul-majid",
        source: "https://quran.com/"
    },
    {
        author_name: "Hafiz Ibn Kathir",
        id: 169,
        language_name: "english",
        name: "Tafsir Ibn Kathir (abridged)",
        translated_name: "Tafsir Ibn Kathir (abridged)",
        slug: "en-tafisr-ibn-kathir",
        source: "https://quran.com/"
    },
    {
        author_name: "Hafiz Ibn Kathir",
        id: 14,
        language_name: "arabic",
        name: "Tafsir Ibn Kathir",
        translated_name: "تفسير ابن كثير",
        slug: "ar-tafsir-ibn-kathir",
        source: "https://quran.com/"
    },
    {
        author_name: "Tawheed Publication",
        id: 164,
        language_name: "bengali",
        name: "Tafseer ibn Kathir",
        translated_name: "Ibn Kathir Tafsir",
        slug: "bn-tafseer-ibn-e-kaseer",
        source: "https://quran.com/"
    },
    {
        author_name: "Bayaan Foundation",
        id: 165,
        language_name: "bengali",
        name: "Tafsir Ahsanul Bayaan",
        translated_name: "Ahsanul Bayaan Tafsir",
        slug: "bn-tafsir-ahsanul-bayaan",
        source: "https://quran.com/"
    },
    {
        author_name: "King Fahd Quran Printing Complex",
        id: 166,
        language_name: "bengali",
        name: "Tafsir Abu Bakr Zakaria",
        translated_name: "Abu Bakr Zakaria Tafsir",
        slug: "bn-tafsir-abu-bakr-zakaria",
        source: "https://quran.com/"
    },
    {
        author_name: "Mufti Muhammad Shafi",
        id: 168,
        language_name: "english",
        name: "Maarif-ul-Quran",
        translated_name: "Maarif-ul-Quran",
        slug: "en-tafsir-maarif-ul-quran",
        source: "https://quran.com/"
    },
    {
        author_name: "Saddi",
        id: 170,
        language_name: "russian",
        name: "Tafseer Al Saddi",
        translated_name: "تفسیر السعدي",
        slug: "ru-tafseer-al-saddi",
        source: "https://quran.com/"
    },
    {
        author_name: "Saddi",
        id: 91,
        language_name: "arabic",
        name: "Tafseer Al Saddi",
        translated_name: "تفسیر السعدي",
        slug: "ar-tafseer-al-saddi",
        source: "https://quran.com/"
    },
    {
        author_name: "Baghawy",
        id: 94,
        language_name: "arabic",
        name: "Tafseer Al-Baghawi",
        translated_name: "تفسير البغوي",
        slug: "ar-tafsir-al-baghawi",
        source: "https://quran.com/"
    },
    {
        author_name: "Tanweer",
        id: 92,
        language_name: "arabic",
        name: "Tafseer Tanwir al-Miqbas",
        translated_name: "تفسير تنوير المقابس",
        slug: "ar-tafseer-tanwir-al-miqbas",
        source: "https://quran.com/"
    },
    {
        author_name: "Waseet",
        id: 93,
        language_name: "arabic",
        name: "Tafsir Al Wasit",
        translated_name: "تفسير الوسيط",
        slug: "ar-tafsir-al-wasit",
        source: "https://quran.com/"
    },
    {
        author_name: "Tabari",
        id: 15,
        language_name: "arabic",
        name: "Tafsir al-Tabari",
        translated_name: "تفسير الطبري",
        slug: "ar-tafsir-al-tabari",
        source: "https://quran.com/"
    },
    {
        author_name: "المیسر",
        id: 16,
        language_name: "arabic",
        name: "Tafsir Muyassar",
        translated_name: "التفسير الميسر",
        slug: "ar-tafsir-muyassar",
        source: "https://quran.com/"
    },
    {
        author_name: "Qurtubi",
        id: 90,
        language_name: "arabic",
        name: "Tafseer Al Qurtubi",
        translated_name: "تفسير القرطبي",
        slug: "ar-tafseer-al-qurtubi",
        source: "https://quran.com/"
    },
    {
        author_name: "Rebar Kurdish Tafsir",
        id: 804,
        language_name: "Kurdish",
        name: "Rebar Kurdish Tafsir",
        translated_name: "Rebar Kurdish Tafsir",
        slug: "kurd-tafsir-rebar",
        source: "https://quran.com/"
    },
    {
        author_name: "Hafiz Ibn Kathir",
        id: 160,
        language_name: "urdu",
        name: "Tafsir Ibn Kathir",
        translated_name: "Tafsir Ibn Kathir",
        slug: "ur-tafseer-ibn-e-kaseer",
        source: "https://quran.com/"
    },
    {
        author_name: "Dr. Israr Ahmad",
        id: 159,
        language_name: "urdu",
        name: "Tafsir Bayan ul Quran",
        translated_name: "Tafsir Bayan ul Quran",
        slug: "ur-tafsir-bayan-ul-quran",
        source: "https://quran.com/"
    },
    {
        author_name: "Maulana Wahid Uddin Khan",
        id: 818,
        language_name: "urdu",
        name: "Tazkirul Quran(Maulana Wahiduddin Khan)",
        translated_name: "Tazkirul Quran(Maulana Wahiduddin Khan)",
        slug: "ur-tazkirul-quran",
        source: "https://quran.com/"
    },
    {
        author_name: "Maulana Wahid Uddin Khan",
        id: 817,
        language_name: "english",
        name: "Tazkirul Quran(Maulana Wahiduddin Khan)",
        translated_name: "Tazkirul Quran (Maulana Wahiduddin Khan)",
        slug: "en-tazkirul-quran",
        source: "https://quran.com/"
    },
    {
        author_name: "Kashf Al-Asrar Tafsir",
        id: 109,
        language_name: "english",
        name: "Kashf Al-Asrar Tafsir",
        translated_name: "Kashf Al-Asrar Tafsir",
        slug: "en-kashf-al-asrar-tafsir",
        source: "https://www.altafsir.com/"
    },
    {
        author_name: "Al Qushairi Tafsir",
        id: 108,
        language_name: "english",
        name: "Al Qushairi Tafsir",
        translated_name: "Al Qushairi Tafsir",
        slug: "en-al-qushairi-tafsir",
        source: "https://www.altafsir.com/"
    },
    {
        author_name: "Kashani Tafsir",
        id: 107,
        language_name: "english",
        name: "Kashani Tafsir",
        translated_name: "Kashani Tafsir",
        slug: "en-kashani-tafsir",
        source: "https://www.altafsir.com/"
    },
    {
        author_name: "Tafsir al-Tustari",
        id: 93,
        language_name: "english",
        name: "Tafsir al-Tustari",
        translated_name: "Tafsir al-Tustari",
        slug: "en-tafsir-al-tustari",
        source: "https://www.altafsir.com/"
    },
    {
        author_name: "Asbab Al-Nuzul by Al-Wahidi",
        id: 86,
        language_name: "english",
        name: "Asbab Al-Nuzul by Al-Wahidi",
        translated_name: "Asbab Al-Nuzul by Al-Wahidi",
        slug: "en-asbab-al-nuzul-by-al-wahidi",
        source: "https://www.altafsir.com/"
    },
    {
        author_name: "Tanwîr al-Miqbâs min Tafsîr Ibn ‘Abbâs",
        id: 73,
        language_name: "english",
        name: "Tanwîr al-Miqbâs min Tafsîr Ibn ‘Abbâs",
        translated_name: "Tanwîr al-Miqbâs min Tafsîr Ibn ‘Abbâs",
        slug: "en-tafsir-ibn-abbas",
        source: "https://www.altafsir.com/"
    },
    {
        author_name: "Al-Jalalayn",
        id: 74,
        language_name: "english",
        name: "Al-Jalalayn",
        translated_name: "Al-Jalalayn",
        slug: "en-al-jalalayn",
        source: "https://www.altafsir.com/"
    }
];

export { translation_by_lang_code, lang_code_to_name, tafsirsScholars }