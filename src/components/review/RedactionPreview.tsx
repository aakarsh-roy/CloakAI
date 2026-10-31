import React from 'react';
import { ShieldCheck, FileCheck } from 'lucide-react';

interface RedactionPreviewProps {
  sanitizedText: string;
  appliedCount: number;
  excludedCount: number;
}

export const RedactionPreview: React.FC<RedactionPreviewProps> = ({
  sanitizedText,
  appliedCount,
  excludedCount,
}) => {
  // Regex to match placeholders like [EMAIL_1], [SECRET_1], [CREDIT_CARD_1], [EMAIL], etc.
  const placeholderRegex = /(\[(?:EMAIL|PHONE|SECRET|CREDIT_CARD|IP_ADDRESS|GOV_ID|CONTEXT|SENSITIVE|REDACTED)(?:_\d+)?\])/g;

  const renderHighlightedContent = () => {
    if (!sanitizedText) {
      return (
        <span className="text-slate-600 italic">
          Sanitized prompt preview will appear here once you enter a prompt...
        </span>
      );
    }

    const parts = sanitizedText.split(placeholderRegex);
    return parts.map((part, index) => {
      if (placeholderRegex.test(part)) {
        return (
          <span
            key={index}
            className="inline-block px-1.5 py-0.5 mx-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/40 font-mono font-semibold text-xs shadow-sm"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-brand-500" />
          <span className="font-semibold text-sm text-slate-200">Sanitized Prompt Preview</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-brand-500"></span>
            {appliedCount} {appliedCount === 1 ? 'replacement' : 'replacements'}
          </span>
          {excludedCount > 0 && (
            <span className="text-amber-400/80 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {excludedCount} kept original
            </span>
          )}
        </div>
      </div>

      <div className="p-4 bg-slate-950 font-mono text-sm leading-relaxed text-slate-200 min-h-[160px] max-h-[320px] overflow-y-auto whitespace-pre-wrap select-text">
        {renderHighlightedContent()}
      </div>

      <div className="px-4 py-2 bg-slate-900/40 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
          Ready for safe pasting into your preferred AI tool
        </span>
        <span className="text-slate-400 font-mono">
          {sanitizedText.length.toLocaleString()} chars
        </span>
      </div>
    </div>
  );
};
