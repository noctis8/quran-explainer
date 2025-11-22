import React from 'react';
import parse, { domToReact } from 'html-react-parser';
import DOMPurify from 'dompurify';

// the tajweed parser will work untill the api fixes the tajweed tags
export function renderVerseHtml(rawHtml) {
    if (!rawHtml) return null;

    const clean = DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
        ADD_TAGS: ['tajweed'],
        ADD_ATTR: ['class'],
    });

    const options = {
        replace: (node) => {
            if (node.type === 'tag' && node.name === 'tajweed') {
                const cls = node.attribs?.class || '';
                return (
                    <tajweed className={cls}>
                        {domToReact(node.children, options)}
                    </tajweed>
                );
            }
            if (node.type === 'tag' && node.name === 'span' && node.attribs?.class === 'end') {
                return (
                    <span className="end">
                        {domToReact(node.children, options)}
                    </span>
                );
            }
            return undefined;
        },
    };

    return parse(clean, options);
}

export function HighlightedTextexplanation({ text, activeVerse }) {
    if (!text || !activeVerse) return null;

    const containsArabic = (str) => /[\u0600-\u06FF]/.test(str);

    const normalizeArabic = (str) =>
        str
            .replace(/[أإآ]/g, 'ا')
            .replace(/[ىئ]/g, 'ي')
            .replace(/ة/g, 'ه')
            .replace(/[ًٌٍَُِّْٰ]/g, '')
            .trim()
            .toLowerCase();

    const normalizeOther = (str) => str.trim().toLowerCase();

    const isArabic = containsArabic(activeVerse);
    const normalizedActive = isArabic
        ? normalizeArabic(activeVerse)
        : normalizeOther(activeVerse);

    const bracketPlaceholders = [];
    let protectedText = text.replace(/\[([^\]]+)\]/g, (match, content) => {
        const placeholder = `__BRACKET_${bracketPlaceholders.length}__`;
        bracketPlaceholders.push(content);
        return placeholder;
    });

    const parenPlaceholders = [];
    protectedText = protectedText.replace(/\(([^)]+)\)/g, (match, content) => {
        const placeholder = `__PAREN_${parenPlaceholders.length}__`;
        parenPlaceholders.push(content);
        return placeholder;
    });

    const curlyPlaceholders = [];
    protectedText = protectedText.replace(/\{([^}]+)\}/g, (match, content) => {
        const placeholder = `__CURLY_${curlyPlaceholders.length}__`;
        curlyPlaceholders.push(content);
        return placeholder;
    });

    const quoteRegex = /(["'])([^"']+?)\1/g;
    let highlightedText = protectedText.replace(quoteRegex, (match, quoteChar, quotedText) => {
        if (match.includes('style=') || match.includes('--')) return match;
        const normalizedQuoted = isArabic
            ? normalizeArabic(quotedText)
            : normalizeOther(quotedText);
        const isMatch =
            normalizedActive.length > 3 &&
            (normalizedActive.includes(normalizedQuoted) ||
                normalizedQuoted.includes(normalizedActive));

        const color = isMatch ? 'var(--active-verse)' : 'var(--prophet-parole)';
        const weight = isMatch ? 'bold' : 'normal';

        return `${quoteChar}<span style="color:${color}; font-weight:${weight};">${quotedText}</span>${quoteChar}`;
    });

    parenPlaceholders.forEach((content, index) => {
        highlightedText = highlightedText.replace(`__PAREN_${index}__`, `(${content})`);
    });

    bracketPlaceholders.forEach((content, index) => {
        highlightedText = highlightedText.replace(`__BRACKET_${index}__`, `[${content}]`);
    });

    curlyPlaceholders.forEach((content, index) => {
        highlightedText = highlightedText.replace(
            `__CURLY_${index}__`,
            `{<span style="color:var(--active-verse); font-weight:bold;">${content}</span>}`
        );
    });

    return (
        <div
            className="highlighted-explanation"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
    );
}
