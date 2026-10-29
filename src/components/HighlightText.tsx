import React from 'react';

interface HighlightTextProps {
  text: string;
  highlight: string;
  className?: string;
  highlightClassName?: string;
}

/**
 * Escapes regex special characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Highlights terms matching the highlight query within text,
 * preserving original letter casing and supporting multi-word queries.
 */
export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  highlight,
  className = '',
  highlightClassName = '',
}) => {
  if (!text) return null;
  if (!highlight || !highlight.trim()) {
    return <span className={className}>{text}</span>;
  }

  // Split search query by whitespace to highlight individual tokens
  const terms = highlight
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 0);

  if (terms.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Create regex pattern matching any of the search terms
  const pattern = `(${terms.map(escapeRegExp).join('|')})`;
  const regex = new RegExp(pattern, 'gi');

  const parts = text.split(regex);

  const defaultHighlightClass =
    'bg-gradient-to-r from-orange-500/30 to-amber-500/30 text-amber-300 font-extrabold px-1.5 py-0.5 rounded border border-amber-500/40 shadow-xs shadow-orange-500/20 underline decoration-amber-400 decoration-2 underline-offset-2 transition-all';

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Check if this part matches any of the search terms
        const isMatch = terms.some(
          (term) => part.toLowerCase() === term.toLowerCase()
        );

        if (isMatch) {
          return (
            <mark
              key={index}
              className={highlightClassName || defaultHighlightClass}
            >
              {part}
            </mark>
          );
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};
