import React, { useState } from 'react';
import { Eye, EyeOff, CheckSquare, Square, Tag } from 'lucide-react';
import { Finding, FindingCategory } from '../../core/types.ts';
import { getCategoryDisplayName } from '../../core/detectorRegistry.ts';

interface FindingsListProps {
  findings: Finding[];
  onToggleExclude: (id: string) => void;
  onSetAllExcluded: (excluded: boolean) => void;
}

function maskValue(val: string): string {
  if (val.length <= 4) return '••••';
  if (val.includes('@')) {
    const [user, domain] = val.split('@');
    return `${user.slice(0, 2)}•••@${domain}`;
  }
  return `${val.slice(0, 3)}••••${val.slice(-3)}`;
}

export const FindingsList: React.FC<FindingsListProps> = ({
  findings,
  onToggleExclude,
  onSetAllExcluded,
}) => {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (findings.length === 0) {
    return (
      <div className="p-6 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
        <Tag className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-300">No findings detected</p>
        <p className="text-xs text-slate-500 mt-1">
          Patterns matching emails, credentials, cards, phones, and IDs will appear here.
        </p>
      </div>
    );
  }

  // Group findings by category
  const grouped = findings.reduce<Record<FindingCategory, Finding[]>>((acc, f) => {
    if (!acc[f.category]) acc[f.category] = [];
    acc[f.category].push(f);
    return acc;
  }, {} as Record<FindingCategory, Finding[]>);

  const totalActive = findings.filter((f) => !f.excluded).length;

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header & Batch Controls */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-200">Detected Entities</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium">
            {totalActive} of {findings.length} set to redact
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onSetAllExcluded(false)}
            className="text-brand-400 hover:text-brand-300 transition-colors"
          >
            Redact All
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => onSetAllExcluded(true)}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            Keep All
          </button>
        </div>
      </div>

      {/* Findings List grouped */}
      <div className="divide-y divide-slate-850 max-h-[380px] overflow-y-auto p-2 space-y-2">
        {(Object.keys(grouped) as FindingCategory[]).map((category) => (
          <div key={category} className="p-2 bg-slate-950/40 rounded-lg border border-slate-850">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {getCategoryDisplayName(category)} ({grouped[category].length})
              </span>
            </div>

            <div className="space-y-1.5">
              {grouped[category].map((item) => {
                const isRevealed = revealedIds.has(item.id);
                const isExcluded = !!item.excluded;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded-md border text-xs transition-colors ${
                      isExcluded
                        ? 'bg-slate-900/40 border-slate-800 text-slate-500'
                        : 'bg-slate-900 border-slate-750 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                      <button
                        onClick={() => onToggleExclude(item.id)}
                        className="text-slate-400 hover:text-brand-400 transition-colors flex-shrink-0"
                        title={isExcluded ? 'Include in redaction' : 'Exclude from redaction'}
                        aria-label={`Toggle redaction for ${item.label}`}
                      >
                        {isExcluded ? (
                          <Square className="w-4 h-4 text-slate-600" />
                        ) : (
                          <CheckSquare className="w-4 h-4 text-brand-500" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-slate-300 truncate">
                            {item.label}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                              item.confidence === 'high'
                                ? 'bg-emerald-950 text-emerald-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {item.confidence}
                          </span>
                        </div>

                        {/* Value masked by default */}
                        <div className="font-mono text-[11px] text-slate-400 mt-0.5 truncate">
                          {isRevealed ? item.value : maskValue(item.value)}
                        </div>
                      </div>
                    </div>

                    {/* Reveal Button */}
                    <button
                      onClick={() => toggleReveal(item.id)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex-shrink-0"
                      title={isRevealed ? 'Hide sensitive value' : 'Explicitly reveal sensitive value'}
                      aria-label="Toggle value visibility"
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
