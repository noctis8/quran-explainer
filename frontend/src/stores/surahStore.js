import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppState = create(
    persist(
        (set) => ({
            current_state: { surah_id: 1, page_id: 1, verse_id: 1, scholar_id: null },
            quranFont: 'text_imlaei_simple',

            setQuranFont: (font) => set(() => ({ quranFont: font })),

            increaseSurahId: () =>
                set((state) => ({
                    current_state: {
                        ...state.current_state,
                        surah_id: state.current_state.surah_id + 1,
                    },
                })),

            decreaseSurahId: () =>
                set((state) => ({
                    current_state: {
                        ...state.current_state,
                        surah_id: Math.max(state.current_state.surah_id - 1, 1),
                    },
                })),

            increasePageId: () =>
                set((state) => ({
                    current_state: {
                        ...state.current_state,
                        page_id: state.current_state.page_id + 1,
                    },
                })),

            decreasePageId: () =>
                set((state) => ({
                    current_state: {
                        ...state.current_state,
                        page_id: Math.max(state.current_state.page_id - 1, 1),
                    },
                })),

            increaseVerseId: () =>
                set((state) => ({
                    current_state: {
                        ...state.current_state,
                        verse_id: state.current_state.verse_id + 1,
                    },
                })),

            decreaseVerseId: () =>
                set((state) => ({
                    current_state: {
                        ...state.current_state,
                        verse_id: Math.max(state.current_state.verse_id - 1, 1),
                    },
                })),

            updateCurrentState: (newState) =>
                set((state) => ({
                    current_state: {
                        ...state.current_state,
                        ...newState,
                    },
                })),
        }),
        {
            name: 'app-state',
        }
    )
);

export default useAppState;
