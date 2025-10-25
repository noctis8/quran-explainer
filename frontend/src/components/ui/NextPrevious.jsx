import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useAppState from "../../stores/surahStore.js";
import { getChapterInfo } from "../../services/verseApiService.js";
import Tooltip from '../ui/Tooltip.jsx';

export default function NavButtons({
   textDirection,
   component,
   decrease,
   increase,
   hideNext,
   hidePrevious,
   obj: { val, surahId = 0, max = 0 },
   tooltipNext,
   tooltipPrevious
}) {
    const decreaseSurahId = useAppState(state => state.decreaseSurahId);
    const increaseSurahId = useAppState(state => state.increaseSurahId);
    const setVerseId = useAppState(state => state.updateCurrentState);

    const lockRef = useRef(false);
    const [isLocked, setIsLocked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const MIN_DELAY = 2000; // 2000 ms minimum for debouncing

    // Release the lock after a minimum delay
    const releaseLock = useCallback((start) => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, MIN_DELAY - elapsed);

        setTimeout(() => {
            setIsLoading(false);
            lockRef.current = false;
            setIsLocked(false);
        }, remaining);
    }, [MIN_DELAY]);

    // Shared navigation logic for verse navigation
    const navigateVerse = useCallback(async (direction) => {
        if (direction === 'previous') {
            // Verse navigation - Previous
            if (val > 1 && surahId >= 1) {
                await decrease();
            } else if (val === 1 && surahId > 1) {
                // Move to previous surah's last verse
                const response = await getChapterInfo(surahId - 1);
                await decreaseSurahId();
                if (response?.verses_count) {
                    setTimeout(() => {
                        setVerseId({ verse_id: response.verses_count });
                    }, 100);
                }
            }
        } else if (direction === 'next') {
            // Verse navigation - Next
            if (val < max) {
                await increase();
            } else if (val === max && surahId < 114) {
                await increaseSurahId();
                setVerseId({ verse_id: 1 });
            }
        }
    }, [val, surahId, max, decrease, increase, decreaseSurahId, increaseSurahId, setVerseId]);

    // Handle Previous (button click)
    const handlePrevious = useCallback(async () => {
        if (lockRef.current) return;

        lockRef.current = true;
        setIsLocked(true);
        setIsLoading(true);
        const start = Date.now();

        try {
            if (surahId === 0) {
                // Page navigation
                if (val > 1) {
                    await decrease();
                }
            } else {
                // Verse navigation
            }
        } catch (error) {
            console.error('Error during navigation:', error);
        } finally {
            // After clicking on any btn debounce to avoid multiple rapid clicks
            releaseLock(start);
        }
    }, [surahId, val, decrease, navigateVerse, releaseLock]);

    // Handle Next (button click)
    const handleNext = useCallback(async () => {
        if (lockRef.current) return;

        lockRef.current = true;
        setIsLocked(true);
        setIsLoading(true);
        const start = Date.now();

        try {
            if (surahId === 0) {
                // Page navigation
                if (val < 604) {
                    await increase();
                }
            } else {
                // Verse navigation
                await navigateVerse('next');
            }
        } catch (error) {
            console.error('Error during navigation:', error);
        } finally {
            // After clicking on any btn debounce to avoid multiple rapid clicks
            releaseLock(start);
        }
    }, [surahId, val, increase, navigateVerse, releaseLock]);

    // Keyboard navigation handler for verses (left/right arrows)
    const handleArrowKeys = useCallback(async (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        if (lockRef.current) return;

        // Ignore keyboard events when typing in input fields
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;

        lockRef.current = true;
        setIsLocked(true);
        setIsLoading(true);
        const start = Date.now();

        try {
            event.preventDefault();
            if (event.key === "ArrowRight" && textDirection === "rtl" || event.key === "ArrowLeft" && textDirection === "ltr") {
                await navigateVerse('previous');
            } else if (event.key === "ArrowLeft" && textDirection === "rtl" || event.key === "ArrowRight" && textDirection === "ltr") {
                await navigateVerse('next');
                }
            } catch (error) {
            console.error('Error during keyboard navigation:', error);
        } finally {
            releaseLock(start);
        }
    }, [navigateVerse, releaseLock, textDirection]);

    // Attach keyboard listener
    useEffect(() => {
        window.addEventListener("keydown", handleArrowKeys);
        return () => {
            setIsLoading(false);
            window.removeEventListener("keydown", handleArrowKeys);
        };
    }, [handleArrowKeys]);

    return (
        <div className="flex justify-center items-center gap-6">
            {/* switch the position of buttons and the arrow direction based on rtl or ltr */}
            {textDirection === "ltr" ? (
                <>
                    {/* Previous Button */}
                    <Tooltip content={tooltipPrevious}>
                        <button
                            onClick={handlePrevious}
                            disabled={isLoading || hidePrevious}
                            className={`
                              group relative overflow-hidden
                              w-8 h-8 rounded-full
                              bg-gradient-to-r from-[var(--btn2-f)] to-[var(--btn2-t)]
                              transition-all duration-300 ease-out
                              hover:scale-110 hover:shadow-lg hover:shadow-[var(--btn1-f)]
                              active:scale-95
                              ${hidePrevious || isLocked  ? 'opacity-30 !cursor-not-allowed' : 'opacity-100 cursor-pointer'}
                            `}
                        >
                            <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-r from-[var(--btn2-f)] to-[var(--btn2-t)] rounded-full">
                                <ChevronLeft
                                    className={`
                                      w-5 h-5 text-white transition-transform duration-200 ease-out
                                      group-hover:-translate-x-1 group-active:scale-75
                                    `}
                                />
                            </div>
                        </button>
                    </Tooltip>

                    {component}

                    {/* Next Button */}
                    <Tooltip content={tooltipNext}>
                        <button
                            onClick={handleNext}
                            disabled={isLoading || hideNext}
                            className={`
                              group relative overflow-hidden
                              w-8 h-8 rounded-full
                              bg-gradient-to-r from-[var(--btn1-f)] to-[var(--btn1-t)]
                              transition-all duration-300 ease-out
                              hover:scale-110 hover:shadow-lg hover:shadow-[var(--btn1-f)]
                              active:scale-95
                              ${hideNext || isLocked  ? 'opacity-30 !cursor-not-allowed' : 'opacity-100 cursor-pointer'}
                            `}
                        >
                            <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-r from-[var(--btn1-f)] to-[var(--btn1-t)] rounded-full">
                                <ChevronRight
                                    className={`
                                  w-5 h-5 text-white transition-transform duration-200 ease-out
                                  group-hover:translate-x-1 group-active:scale-75
                                `}
                                />
                            </div>
                        </button>
                    </Tooltip>
                </>
            ) : (
                <>
                    {/* Next Button (left side in RTL) */}
                    <Tooltip content={tooltipNext}>
                        <button
                            onClick={handleNext}
                            disabled={isLoading || hideNext}
                            className={`
                              group relative overflow-hidden
                              w-8 h-8 rounded-full
                              bg-gradient-to-r from-[var(--btn1-f)] to-[var(--btn1-t)]
                              transition-all duration-300 ease-out
                              hover:scale-110 hover:shadow-lg hover:shadow-[var(--btn1-f)]
                              active:scale-95
                              ${hideNext || isLocked  ? 'opacity-30 !cursor-not-allowed' : 'opacity-100 cursor-pointer'}
                            `}
                        >
                            <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-r from-[var(--btn1-f)] to-[var(--btn1-t)] rounded-full">
                                <ChevronLeft
                                    className={`
                                  w-5 h-5 text-white transition-transform duration-200 ease-out
                                  group-hover:-translate-x-1 group-active:scale-75
                                `}
                                />
                            </div>
                        </button>
                    </Tooltip>

                    {component}

                    {/* Previous Button (right side in RTL) */}
                    <Tooltip content={tooltipPrevious}>
                        <button
                            onClick={handlePrevious}
                            disabled={isLoading || hidePrevious}
                            className={`
                              group relative overflow-hidden
                              w-8 h-8 rounded-full
                              bg-gradient-to-r from-[var(--btn2-f)] to-[var(--btn2-t)]
                              transition-all duration-300 ease-out
                              hover:scale-110 hover:shadow-lg hover:shadow-[var(--btn1-f)]
                              active:scale-95
                              ${hidePrevious || isLocked  ? 'opacity-30 !cursor-not-allowed' : 'opacity-100 cursor-pointer'}
                            `}
                        >
                            <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-r from-[var(--btn2-f)] to-[var(--btn2-t)] rounded-full">
                                <ChevronRight
                                    className={`
                                  w-5 h-5 text-white transition-transform duration-200 ease-out
                                  group-hover:translate-x-1 group-active:scale-75
                                `}
                                />
                            </div>
                        </button>
                    </Tooltip>
                </>
            )}
        </div>
    );
}