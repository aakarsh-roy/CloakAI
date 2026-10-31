import { Detector, Finding } from '../core/types.ts';

const CONTEXTUAL_PATTERNS: Array<{
  ruleId: string;
  name: string;
  regex: RegExp;
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
  valueExtractor: (match: RegExpMatchArray) => { value: string; offset: number };
}> = [
  // Names introduced by self-identification
  {
    ruleId: 'context-name',
    name: 'Personal Name (Contextual)',
    regex: /\b(?:my\s+name\s+is|i\s+am|this\s+is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b/g,
    confidence: 'medium',
    explanation: 'Name identified through self-introduction context ("My name is ...")',
    valueExtractor: (match) => {
      const val = match[1];
      return { value: val, offset: match[0].lastIndexOf(val) };
    },
  },
  // Salary / Compensation
  {
    ruleId: 'context-salary',
    name: 'Salary / Compensation Details',
    regex: /\b(?:salary|compensation|package|ctc|earning|stipend)\s*(?:of|is|:)?\s*([$€£₹]?\s*[\d,]+(?:\.\d+)?\s*(?:k|lpa|inr|usd|eur|gbp|per\s*(?:annum|year|month))?)\b/gi,
    confidence: 'high',
    explanation: 'Detected financial compensation or salary reference',
    valueExtractor: (match) => {
      const val = match[1].trim();
      return { value: val, offset: match[0].indexOf(val) };
    },
  },
  // Explicit currency amounts with frequency (e.g. $140,000 / year or 25 LPA)
  {
    ruleId: 'context-salary-explicit',
    name: 'Compensation Figure',
    regex: /\b(\d{1,3}(?:,\d{2,3})*\s*(?:lpa|inr|usd|per\s+annum))\b/gi,
    confidence: 'medium',
    explanation: 'Detected compensation figure with currency or frequency',
    valueExtractor: (match) => ({ value: match[1], offset: 0 }),
  },
  // Medical / Health conditions
  {
    ruleId: 'context-medical',
    name: 'Medical / Health Condition (Contextual)',
    regex: /\b(?:diagnosed\s+with|treatment\s+for|suffering\s+from|prescribed|medication\s+for)\s+([a-zA-Z\s]{3,30}?)(?=[.,;\n]|\band\b|$)/gi,
    confidence: 'medium',
    explanation: 'Detected health or medical term in personal disclosure context',
    valueExtractor: (match) => {
      const val = match[1].trim();
      return { value: val, offset: match[0].indexOf(val) };
    },
  },
];

export const contextualDetector: Detector = {
  id: 'detector-contextual',
  name: 'Contextual Sensitive Data Detector',
  category: 'contextual',
  detect(text: string): Finding[] {
    const findings: Finding[] = [];

    for (const pattern of CONTEXTUAL_PATTERNS) {
      const matches = text.matchAll(pattern.regex);
      for (const match of matches) {
        if (match.index === undefined) continue;

        const extracted = pattern.valueExtractor(match);
        if (!extracted.value) continue;

        const start = match.index + extracted.offset;
        const end = start + extracted.value.length;

        findings.push({
          id: `context-${pattern.ruleId}-${start}`,
          category: 'contextual',
          ruleId: pattern.ruleId,
          start,
          end,
          value: extracted.value,
          label: pattern.name,
          confidence: pattern.confidence,
          explanation: pattern.explanation,
          recommendedAction: 'Replace with [CONTEXT_N] placeholder',
        });
      }
    }

    return findings;
  },
};
