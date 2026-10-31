import React, { useState } from 'react';
import { Trash2, Sparkles, AlertCircle, Cpu } from 'lucide-react';
import { MAX_PROMPT_LENGTH } from '../../core/detectorEngine.ts';

interface PromptEditorProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onClear: () => void;
  isScanning: boolean;
  scanDurationMs: number;
}

const SAMPLE_PROMPTS = [
  {
    title: 'Salary & Personal',
    text: `My name is Aakarsh Roy. My email is aakarsh.roy@example.com and phone is +91 9876543210.
I am currently earning a salary of 24 LPA as a Principal Engineer. Help me write a professional salary negotiation letter requesting 32 LPA.`,
  },
  {
    title: 'Server Error & API Key',
    text: `We experienced an authentication outage on production server 192.168.1.45.
The service crashed with:
AWS_ACCESS_KEY_ID: AKIAIOSFODNN7EXAMPLE
Error message: "Token validation failed for user admin@cloudcorp.internal".
How can we troubleshoot the IAM policy?`,
  },
  {
    title: 'Payment & ID Support',
    text: `Customer support request:
Customer PAN number is ABCDE1234F.
They attempted to charge card 4111-1111-1111-1111 for transaction ID 9821.
Please draft an apology email to customer@clientdomain.com.`,
  },
];

export const PromptEditor: React.FC<PromptEditorProps> = ({
  prompt,
  setPrompt,
  onClear,
  isScanning,
  scanDurationMs,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const charCount = prompt.length;
  const isNearLimit = charCount > MAX_PROMPT_LENGTH * 0.9;
  const isOverLimit = charCount > MAX_PROMPT_LENGTH;

  const handleClearClick = () => {
    if (prompt.trim().length > 0) {
      setShowClearConfirm(true);
    }
  };

  const confirmClear = () => {
    setShowClearConfirm(false);
    onClear();
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Editor Header */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-200">Prompt Editor</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-850 px-2 py-0.5 rounded border border-slate-750">
            <Cpu className="w-3 h-3 text-brand-500" />
            {isScanning ? 'Analyzing locally...' : `Local engine (${scanDurationMs}ms)`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {showClearConfirm ? (
            <div className="flex items-center gap-1.5 bg-red-950/60 border border-red-800 px-2 py-1 rounded text-xs">
              <span className="text-red-300">Clear prompt?</span>
              <button
                onClick={confirmClear}
                className="px-1.5 py-0.5 rounded bg-red-600 text-white font-medium hover:bg-red-500"
              >
                Yes
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleClearClick}
              disabled={prompt.length === 0}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800/80 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Synthetic Prompt Templates */}
      <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-850 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-400 flex items-center gap-1 font-medium whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          Load sample:
        </span>
        {SAMPLE_PROMPTS.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => setPrompt(sample.text)}
            className="px-2.5 py-1 rounded-md bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-800 transition-colors whitespace-nowrap"
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <div className="relative flex-1 p-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste or write your prompt here. Sensitive data (emails, keys, phone numbers, cards, passwords) will be detected locally in real-time..."
          className="w-full h-full min-h-[360px] p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 text-sm font-mono resize-none leading-relaxed"
          maxLength={MAX_PROMPT_LENGTH}
        />
      </div>

      {/* Editor Footer */}
      <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span>In-memory only</span>
          <span>•</span>
          <span>Never saved to storage</span>
        </div>

        <div className="flex items-center gap-2">
          {isOverLimit && (
            <span className="text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Exceeded maximum length limit
            </span>
          )}
          <span
            className={`font-mono ${
              isNearLimit ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            {charCount.toLocaleString()} / {MAX_PROMPT_LENGTH.toLocaleString()} chars
          </span>
        </div>
      </div>
    </div>
  );
};
