import { Detector, Finding, PrivacySettings } from '../core/types.ts';

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const customKeywordDetector: Detector = {
  id: 'detector-custom-keyword',
  name: 'Custom Keyword Detector',
  category: 'custom',
  detect(text: string, settings?: PrivacySettings): Finding[] {
    if (!settings || !settings.customKeywords || settings.customKeywords.length === 0) {
      return [];
    }

    const findings: Finding[] = [];

    for (const rawKeyword of settings.customKeywords) {
      const keyword = rawKeyword.trim();
      if (!keyword) continue;

      // Match as whole word if alphanumeric, otherwise substring
      const isWord = /^\w+$/.test(keyword);
      const pattern = isWord
        ? new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'gi')
        : new RegExp(escapeRegex(keyword), 'gi');

      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match.index === undefined) continue;
        const val = match[0];
        findings.push({
          id: `custom-${match.index}-${match.index + val.length}`,
          category: 'custom',
          ruleId: 'custom-user-keyword',
          start: match.index,
          end: match.index + val.length,
          value: val,
          label: `Custom Term: "${keyword}"`,
          confidence: 'high',
          explanation: 'Matched user-configured custom sensitive keyword',
          recommendedAction: 'Replace with [CUSTOM_N] placeholder',
        });
      }
    }

    return findings;
  },
};
