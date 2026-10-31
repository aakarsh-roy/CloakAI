import { Detector, Finding } from '../core/types.ts';

// Robust, non-backtracking email pattern matching common standard & international email formats
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

export const emailDetector: Detector = {
  id: 'detector-email',
  name: 'Email Detector',
  category: 'email',
  detect(text: string): Finding[] {
    const findings: Finding[] = [];
    const matches = text.matchAll(EMAIL_REGEX);

    for (const match of matches) {
      if (match.index === undefined) continue;
      const val = match[0];
      findings.push({
        id: `email-${match.index}-${match.index + val.length}`,
        category: 'email',
        ruleId: 'email-standard',
        start: match.index,
        end: match.index + val.length,
        value: val,
        label: 'Email Address',
        confidence: 'high',
        explanation: 'Matches RFC email address pattern',
        recommendedAction: 'Replace with [EMAIL_N] placeholder',
      });
    }

    return findings;
  },
};
