// javascript
import React, { useEffect, useState } from 'react';

export const SurahsListLoader = () => {
    // determine number of columns based on viewport width
    const getColumns = (width) => {
        if (width >= 1536) return 5;
        if (width >= 1280) return 4;
        if (width >= 768) return 3;
        return 2;
    };

    const [columns, setColumns] = useState(() => getColumns(typeof window !== 'undefined' ? window.innerWidth : 1024));

    useEffect(() => {
        const onResize = () => setColumns(getColumns(window.innerWidth));
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const rows = 2; // always show 2 lines
    const totalCards = columns * rows;

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: 16,
        width: '100%',
    };

    const cardStyle = {
        borderRadius: 10,
        background: 'var(--third-bg)',
        padding: 18 ,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 96,
        boxShadow: 'inset 0 0 0 1px var(--skeleton-border, rgba(255,255,255,0.02))',
        border: "1px solid var(--second)",
    };

    const titleStyle = {
        height: 18,
        width: '58%',
        borderRadius: 6,
        background: 'var(--active-verse)'
    };

    const smallRect = {
        width: 48,
        height: 8,
        borderRadius: 4,
        background: 'var(--fourth-bg)'
    };

    return (
        <div className="w-full" aria-hidden="true">
            <div style={gridStyle}>
                {Array.from({ length: totalCards }).map((_, index) => (
                    <div key={index} style={cardStyle} className="surah-skeleton">
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={titleStyle} />
                        </div>

                        <div style={{ width: '100%', marginTop: 8 }}>
                            <div style={{ height: 8, width: '30%', borderRadius: 4, background: 'var(--card-subtitle, #374151)', marginBottom: 10 }} />
                            <div style={{ borderTop: "1px solid #e0e0e0", marginTop: "4px", height: 1, background: 'var(--card-bg, #0b1220)', marginBottom: 8 }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--card-subtitle, #374151)' }} />
                                    <div style={smallRect} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};