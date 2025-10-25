import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import useAppState from "../../stores/surahStore.js";

const ITEM_HEIGHT = 44;
const BUFFER = 7;

const Dropdown = ({ description, currentVal, data }) => {
    const setNewState = useAppState(state => state.updateCurrentState);
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [range, setRange] = useState({ start: 0, end: 34 });
    const [isMdScreen, ] = useState(window.innerWidth >= 768);

    const dropdownRef = useRef(null);
    const listRef = useRef(null);

    // Parse current value
    const [key, val] = useMemo(() => {
        const entries = currentVal ? Object.entries(currentVal) : [];
        return entries.length > 0 ? entries[0] : [null, null];
    }, [currentVal]);

    const selectedId = useMemo(() => {
        if (val?.id !== undefined) return Number(val.id);
        if (val !== null && val !== undefined) return key === "scholar_id" ? val : Number(val);   // the id in scholar is name (slug) that's why we have to check the key first
        return null;
    }, [val]);

    // dropdown data
    const items = useMemo(() =>
            Array.isArray(data) ? data.filter(item => item && typeof item === 'object') : [],
        [data]
    );

    // get selected label
    const selectedLabel = useMemo(() => {
        if (items.length === 0) return String(val || '');

        const match = items.find(item => Number(item.id) === selectedId);
        if (match) {
            return match.name ? `${match.id} - ${match.name}` : String(match.id);
        }
        return String(val || '');
    }, [items, selectedId, val]);

    // Handlers
    const handleSelect = useCallback(async (item) => {
        if (!key) return;

        const newValue = item?.id !== undefined ? item.id : item;
        setNewState({ [key]: newValue });

        if (key === "surah_id") {
            setNewState({ verse_id: 1 });
        }

        setIsOpen(false);
        setHoveredItem(null);
    }, [key, setNewState]);

    const toggleDropdown = useCallback(() => setIsOpen(prev => !prev), []);

    // Click outside to close
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Virtual scrolling
    const handleScroll = useCallback((e) => {
        if (items.length === 0) return;

        const { scrollTop, clientHeight } = e.target;
        const visibleCount = Math.ceil(clientHeight / ITEM_HEIGHT);
        const start = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER);
        const end = Math.min(items.length, start + visibleCount + BUFFER * 2);

        setRange({ start, end });
    }, [items.length]);

    // Scroll to selected on open
    useEffect(() => {
        if (!isOpen || items.length === 0 || !listRef.current) return;

        const idx = items.findIndex(item => Number(item.id) === selectedId);
        const clientHeight = listRef.current.clientHeight || ITEM_HEIGHT * 8;
        const visibleCount = Math.max(1, Math.ceil(clientHeight / ITEM_HEIGHT));

        if (idx >= 0) {
            const start = Math.max(0, idx - Math.floor(visibleCount / 2) - BUFFER);
            const end = Math.min(items.length, start + visibleCount + BUFFER * 2);
            setRange({ start, end });

            const scrollTop = Math.max(0, idx * ITEM_HEIGHT - Math.floor(clientHeight / 2));
            requestAnimationFrame(() => {
                listRef.current.scrollTop = scrollTop;
            });
        } else {
            setRange({ start: 0, end: Math.min(items.length, visibleCount + BUFFER * 2) });
        }
    }, [isOpen, items, selectedId]);

    // Render helpers
    const sliced = items.slice(range.start, range.end);
    const topSpace = range.start * ITEM_HEIGHT;
    const bottomSpace = Math.max(0, items.length - range.end) * ITEM_HEIGHT;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className={`
                    bg-[var(--bg)] w-full py-2 px-3 md:px-4 border-2 rounded-2xl shadow-lg
                    transition-all duration-250 ease-out transform hover:scale-[1.02]
                    ${isOpen ? 'border-[var(--second-bg)]' : 'border-[var(--third-bg)]'}
                `}
            >
                <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm font-semibold text-[var(--second)]">
                        {key === "scholar_id" ? selectedLabel : description + " " + selectedLabel}
                    </span>
                    <ChevronDown
                        size={20}
                        className={`
                            text-[var(--third)] ml-2 transition-all duration-250
                            ${isOpen ? 'rotate-180 scale-110' : ''}
                        `}
                    />
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full sm:w-[max-content] right-0 mt-3 border-2 border-[var(--third-bg)] rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div
                        ref={listRef}
                        onScroll={handleScroll}
                        className="max-h-80 overflow-y-auto"
                    >
                        {items.length > 0 ? (
                            <div style={{ position: 'relative' }}>
                                {topSpace > 0 && <div style={{ height: topSpace }} />}

                                {sliced.map((item, idx) => {
                                    const realIdx = range.start + idx;
                                    const isSelected = selectedId !== null && item.id == selectedId;   // only == cz the id can be string or number (string in scholar case only)
                                    const isHovered = hoveredItem?.id === item.id;

                                    return (
                                        <button
                                            key={`${item.id}-${realIdx}`}
                                            onClick={() => handleSelect(item)}
                                            onMouseEnter={() => setHoveredItem(item)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                            className={`
                                                w-full px-4 py-3 text-left flex items-center justify-between gap-2
                                                transition-all duration-200 h-auto
                                                ${isSelected ? 'bg-[var(--primary-bg)] text-[var(--verse)]' : 'bg-[var(--third-bg)] text-[var(--second)]'}
                                                ${realIdx !== items.length - 1 ? 'border-b border-[var(--second-bg)]' : ''}
                                            `}
                                            style={{ height: isMdScreen ? ITEM_HEIGHT : 'auto' }}
                                        >
                                            <span className={`text-sm font-medium transition-transform ${isHovered ? 'translate-x-1' : ''}`}>
                                                {key === "scholar_id"
                                                    ? `${item.name}`
                                                    : `${item.id}${item.name ? ` - ${item.name}` : ""}`
                                                }
                                            </span>

                                            <Check
                                                size={20}
                                                className={`
                                                    transition-all duration-200
                                                    ${isSelected ? 'text-[var(--verse)]' : 'text-[var(--third)]'}
                                                    ${isHovered || isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                                                `}
                                            />
                                        </button>
                                    );
                                })}

                                {bottomSpace > 0 && <div style={{ height: bottomSpace }} />}
                            </div>
                        ) : (
                            <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                No items
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(Dropdown);