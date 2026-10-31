import { Detector, Finding } from '../core/types.ts';

// Indian mobile & landline patterns:
// +91 9876543210, 09876543210, 98765-43210, +91-98765-43210
const INDIAN_PHONE_REGEX = /(?:(?:\+91|0)[-\s]?)?[6-9]\d{4}[-\s]?\d{5}\b/g;

// North American / International E.164:
// +1 (555) 234-5678, +44 20 7946 0958, (555) 234-5678, 555-234-5678
const INTL_PHONE_REGEX = /(?:\+\d{1,3}[-\s]?)?(?:\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4})\b/g;

export const phoneDetector: Detector = {
  id: 'detector-phone',
  name: 'Phone Number Detector',
  category: 'phone',
  detect(text: string): Finding[] {
    const findings: Finding[] = [];
    const seenSpans = new Set<string>();

    // 1. Check Indian Phone Numbers
    const indianMatches = text.matchAll(INDIAN_PHONE_REGEX);
    for (const match of indianMatches) {
      if (match.index === undefined) continue;
      const raw = match[0];
      const digitsOnly = raw.replace(/\D/g, '');
      // Valid Indian numbers have 10 digits (or 11/12 with prefix 0 or 91)
      if (digitsOnly.length >= 10 && digitsOnly.length <= 12) {
        const spanKey = `${match.index}-${match.index + raw.length}`;
        seenSpans.add(spanKey);
        findings.push({
          id: `phone-in-${match.index}`,
          category: 'phone',
          ruleId: 'phone-in',
          start: match.index,
          end: match.index + raw.length,
          value: raw,
          label: 'Phone Number (IN)',
          confidence: 'high',
          explanation: 'Matches Indian 10-digit mobile/landline format',
          recommendedAction: 'Replace with [PHONE_N] placeholder',
        });
      }
    }

    // 2. Check International Phone Numbers
    const intlMatches = text.matchAll(INTL_PHONE_REGEX);
    for (const match of intlMatches) {
      if (match.index === undefined) continue;
      const raw = match[0];
      const digitsOnly = raw.replace(/\D/g, '');
      if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
        const spanKey = `${match.index}-${match.index + raw.length}`;
        if (!seenSpans.has(spanKey)) {
          findings.push({
            id: `phone-intl-${match.index}`,
            category: 'phone',
            ruleId: 'phone-intl',
            start: match.index,
            end: match.index + raw.length,
            value: raw,
            label: 'Phone Number',
            confidence: 'medium',
            explanation: 'Matches international telephone number format',
            recommendedAction: 'Replace with [PHONE_N] placeholder',
          });
        }
      }
    }

    return findings;
  },
};
