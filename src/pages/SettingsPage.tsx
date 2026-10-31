import React, { useState } from 'react';
import { Sliders, RotateCcw, Plus, Trash2, Database, Check } from 'lucide-react';
import { FindingCategory, PrivacySettings, RedactionStyle } from '../core/types.ts';
import { DEFAULT_SETTINGS, saveSettings, clearStoredSettings } from '../core/settings.ts';
import { getCategoryDisplayName } from '../core/detectorRegistry.ts';

interface SettingsPageProps {
  settings: PrivacySettings;
  setSettings: React.Dispatch<React.SetStateAction<PrivacySettings>>;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  setSettings,
}) => {
  const [newKeyword, setNewKeyword] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  const notifySaved = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const toggleCategory = (category: FindingCategory) => {
    setSettings((prev) => {
      const updated: PrivacySettings = {
        ...prev,
        enabledCategories: {
          ...prev.enabledCategories,
          [category]: !prev.enabledCategories[category],
        },
      };
      saveSettings(updated);
      notifySaved();
      return updated;
    });
  };

  const setStyle = (style: RedactionStyle) => {
    setSettings((prev) => {
      const updated: PrivacySettings = {
        ...prev,
        redactionStyle: style,
      };
      saveSettings(updated);
      notifySaved();
      return updated;
    });
  };

  const addKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newKeyword.trim();
    if (!trimmed) return;
    if (settings.customKeywords.includes(trimmed)) return;

    setSettings((prev) => {
      const updated: PrivacySettings = {
        ...prev,
        customKeywords: [...prev.customKeywords, trimmed],
      };
      saveSettings(updated);
      notifySaved();
      return updated;
    });
    setNewKeyword('');
  };

  const removeKeyword = (keyword: string) => {
    setSettings((prev) => {
      const updated: PrivacySettings = {
        ...prev,
        customKeywords: prev.customKeywords.filter((k) => k !== keyword),
      };
      saveSettings(updated);
      notifySaved();
      return updated;
    });
  };

  const resetToDefaults = () => {
    const updated = { ...DEFAULT_SETTINGS };
    setSettings(updated);
    saveSettings(updated);
    notifySaved();
  };

  const purgeAllData = () => {
    clearStoredSettings();
    setSettings({ ...DEFAULT_SETTINGS });
    notifySaved();
  };

  // Inspect localStorage content to prove transparency
  const rawStoredData =
    typeof window !== 'undefined' && window.localStorage
      ? localStorage.getItem('cloakai_preferences_v1') || '(Empty / No custom preferences stored)'
      : '(localStorage unavailable)';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-brand-500" />
            <span>Privacy & Detection Preferences</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure detector categories, placeholder styling, and custom sensitive terms.
          </p>
        </div>

        {saveToast && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40 text-xs font-medium animate-fade-in">
            <Check className="w-3.5 h-3.5 text-brand-400" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      {/* 1. Category Toggles */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h3 className="font-semibold text-base text-slate-100">Enabled Detectors</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Turn specific pattern detectors on or off based on your privacy needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {(Object.keys(settings.enabledCategories) as FindingCategory[]).map((cat) => {
            const isEnabled = settings.enabledCategories[cat];
            return (
              <label
                key={cat}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  isEnabled
                    ? 'bg-slate-950/80 border-slate-700 text-slate-200'
                    : 'bg-slate-950/30 border-slate-850 text-slate-500'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{getCategoryDisplayName(cat)}</span>
                  <span className="text-[11px] text-slate-400">
                    {isEnabled ? 'Active in scan' : 'Disabled'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => toggleCategory(cat)}
                  className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 focus:ring-offset-slate-900"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Redaction Placeholder Style */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h3 className="font-semibold text-base text-slate-100">Placeholder Format</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose how redacted tokens are formatted in the sanitized prompt.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setStyle('bracket_counter')}
            className={`p-4 rounded-xl border text-left transition-colors ${
              settings.redactionStyle === 'bracket_counter'
                ? 'bg-brand-500/10 border-brand-500/40 text-slate-100'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-mono text-sm text-brand-400 font-semibold mb-1">
              [CATEGORY_1], [CATEGORY_2]
            </div>
            <p className="text-xs text-slate-400">
              Numbered placeholders. Maintains distinct entity references across multiple people or emails.
            </p>
          </button>

          <button
            onClick={() => setStyle('generic_tag')}
            className={`p-4 rounded-xl border text-left transition-colors ${
              settings.redactionStyle === 'generic_tag'
                ? 'bg-brand-500/10 border-brand-500/40 text-slate-100'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-mono text-sm text-brand-400 font-semibold mb-1">
              [CATEGORY]
            </div>
            <p className="text-xs text-slate-400">
              Generic categorical tags without indices. Simple and uniform replacement.
            </p>
          </button>
        </div>
      </div>

      {/* 3. Custom Sensitive Keywords */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h3 className="font-semibold text-base text-slate-100">Custom Sensitive Terms</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Define organization names, project codenames, or proprietary terms you want automatically flagged.
          </p>
        </div>

        <form onSubmit={addKeyword} className="flex gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="e.g. Project Apollo, InternalAcmeCorp"
            className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={!newKeyword.trim()}
            className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Term</span>
          </button>
        </form>

        {settings.customKeywords.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {settings.customKeywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-750 text-xs text-slate-200"
              >
                <span>{keyword}</span>
                <button
                  onClick={() => removeKeyword(keyword)}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                  aria-label={`Remove keyword ${keyword}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic pt-1">
            No custom terms registered.
          </p>
        )}
      </div>

      {/* 4. Local Storage Transparency Inspector */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-brand-500" />
          <h3 className="font-semibold text-base text-slate-100">Local Storage Privacy Audit</h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          CloakAI guarantees that only non-sensitive configuration parameters are stored in your browser's <code className="text-brand-300">localStorage</code>. Prompts, original findings, and placeholder mappings are <strong>never stored</strong>.
        </p>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
          {rawStoredData}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={resetToDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset to Default Preferences</span>
          </button>

          <button
            onClick={purgeAllData}
            className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-800 text-red-300 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Purge All Preferences From Browser</span>
          </button>
        </div>
      </div>
    </div>
  );
};
