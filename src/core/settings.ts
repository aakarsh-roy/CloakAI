import { PrivacySettings } from './types.ts';

export const DEFAULT_SETTINGS: PrivacySettings = {
  enabledCategories: {
    email: true,
    phone: true,
    secret: true,
    credit_card: true,
    ip_address: true,
    identifier: true,
    contextual: true,
    custom: true,
  },
  redactionStyle: 'bracket_counter',
  customKeywords: [],
};

const STORAGE_KEY = 'cloakai_preferences_v1';

/**
 * Loads user preferences from localStorage.
 * STRICT PRIVACY GUARANTEE: Only non-sensitive configuration settings
 * (category toggles, redaction style, custom keywords) are stored.
 * Never stores prompt text, detected values, or placeholder maps.
 */
export function loadSettings(): PrivacySettings {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { ...DEFAULT_SETTINGS };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };

    const parsed = JSON.parse(raw);
    return {
      enabledCategories: {
        ...DEFAULT_SETTINGS.enabledCategories,
        ...(parsed.enabledCategories || {}),
      },
      redactionStyle:
        parsed.redactionStyle === 'generic_tag' ? 'generic_tag' : 'bracket_counter',
      customKeywords: Array.isArray(parsed.customKeywords)
        ? parsed.customKeywords.filter((k: unknown) => typeof k === 'string' && k.trim().length > 0)
        : [],
    };
  } catch {
    // If corrupt or inaccessible, fall back safely to defaults
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Saves non-sensitive user preferences.
 */
export function saveSettings(settings: PrivacySettings): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const safeData: PrivacySettings = {
      enabledCategories: settings.enabledCategories,
      redactionStyle: settings.redactionStyle,
      customKeywords: settings.customKeywords,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
  } catch {
    // Graceful degradation if localStorage is full or disabled
  }
}

/**
 * Purges all CloakAI saved preferences from localStorage.
 */
export function clearStoredSettings(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
