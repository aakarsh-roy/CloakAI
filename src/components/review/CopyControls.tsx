import React, { useState } from 'react';
import { Copy, Check, AlertTriangle, ShieldAlert } from 'lucide-react';

interface CopyControlsProps {
  sanitizedPrompt: string;
  originalPrompt: string;
  totalFindings: number;
}

export const CopyControls: React.FC<CopyControlsProps> = ({
  sanitizedPrompt,
  originalPrompt,
  totalFindings,
}) => {
  const [copiedSanitized, setCopiedSanitized] = useState(false);
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [clipboardError, setClipboardError] = useState<string | null>(null);

  const copyToClipboard = async (text: string, isSanitized: boolean) => {
    setClipboardError(null);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for environments where clipboard API is blocked
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      if (isSanitized) {
        setCopiedSanitized(true);
        setTimeout(() => setCopiedSanitized(false), 2500);
      } else {
        setCopiedOriginal(true);
        setTimeout(() => setCopiedOriginal(false), 2500);
      }
    } catch {
      setClipboardError('Failed to copy to clipboard. Please select and copy the text manually.');
    }
  };

  const handleCopyOriginalConfirm = () => {
    setShowWarningModal(false);
    copyToClipboard(originalPrompt, false);
  };

  return (
    <div className="flex flex-col gap-2">
      {clipboardError && (
        <div className="p-2 rounded bg-red-950/60 border border-red-800 text-xs text-red-300">
          {clipboardError}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Primary Action: Copy Sanitized Prompt */}
        <button
          onClick={() => copyToClipboard(sanitizedPrompt, true)}
          disabled={!sanitizedPrompt.trim()}
          className="flex-1 py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:pointer-events-none text-white font-medium text-sm transition-all shadow-md shadow-brand-500/10 flex items-center justify-center gap-2"
        >
          {copiedSanitized ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Sanitized Prompt Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-white" />
              <span>Copy Sanitized Prompt</span>
            </>
          )}
        </button>

        {/* Secondary Action: Copy Unredacted Original (with warning) */}
        <button
          onClick={() => {
            if (totalFindings > 0) {
              setShowWarningModal(true);
            } else {
              copyToClipboard(originalPrompt, false);
            }
          }}
          disabled={!originalPrompt.trim()}
          className="py-2.5 px-4 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 hover:text-slate-100 disabled:opacity-40 text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          {copiedOriginal ? (
            <>
              <Check className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300">Original Copied</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-slate-400" />
              <span>Copy Original</span>
            </>
          )}
        </button>
      </div>

      {/* Confirmation Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-amber-800/80 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800">
                <ShieldAlert className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-bold text-lg text-slate-100">Exposing Unredacted Data</h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              This prompt contains <strong className="text-amber-400">{totalFindings} sensitive findings</strong> (credentials, personal identifiers, or contact info).
            </p>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 bg-slate-950 p-3 rounded-lg border border-slate-850">
              Copying the unredacted original prompt may expose sensitive credentials or personal details if submitted to external AI chat models or logged by third parties.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowWarningModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCopyOriginalConfirm}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white transition-colors flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>I Understand, Copy Raw Text</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

