import { describe, it, expect, beforeEach } from 'vitest';
import { runDetection } from '../../src/core/detectorEngine.ts';
import { applyRedaction } from '../../src/core/redactionEngine.ts';
import { saveSettings, loadSettings } from '../../src/core/settings.ts';
import { DEFAULT_SETTINGS } from '../../src/core/settings.ts';

describe('Security: Storage Privacy & Anti-Leakage Verification', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('never leaks prompts, finding offsets, or placeholder mappings into localStorage', () => {
    const rawSecretPrompt = 'Top secret code for user dev@internal.org is sk-proj-1234567890abcdef1234';

    const detection = runDetection(rawSecretPrompt, DEFAULT_SETTINGS);
    const redaction = applyRedaction(rawSecretPrompt, detection.findings);

    // Save preferences
    saveSettings({
      ...DEFAULT_SETTINGS,
      customKeywords: ['InternalProject'],
    });

    const loaded = loadSettings();
    expect(loaded.customKeywords).toEqual(['InternalProject']);

    // Inspect everything in localStorage
    const storedKeys = Object.keys(localStorage);
    expect(storedKeys).toEqual(['cloakai_preferences_v1']);

    const storedValue = localStorage.getItem('cloakai_preferences_v1') || '';

    // Verify raw prompt is NOT anywhere in localStorage
    expect(storedValue).not.toContain(rawSecretPrompt);
    expect(storedValue).not.toContain('dev@internal.org');
    expect(storedValue).not.toContain('sk-proj-1234567890abcdef1234');
    expect(storedValue).not.toContain(redaction.sanitizedText);
  });
});
