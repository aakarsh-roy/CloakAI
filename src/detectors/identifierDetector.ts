import { Detector, Finding } from '../core/types.ts';

const SSN_REGEX = /\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b/g;
const PAN_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g;
const AADHAAR_REGEX = /\b[2-9]\d{3}\s\d{4}\s\d{4}\b/g;

export const identifierDetector: Detector = {
  id: 'detector-identifier',
  name: 'Government & National ID Detector',
  category: 'identifier',
  detect(text: string): Finding[] {
    const findings: Finding[] = [];

    // 1. US SSN
    const ssnMatches = text.matchAll(SSN_REGEX);
    for (const match of ssnMatches) {
      if (match.index === undefined) continue;
      const raw = match[0];
      findings.push({
        id: `id-ssn-${match.index}`,
        category: 'identifier',
        ruleId: 'id-us-ssn',
        start: match.index,
        end: match.index + raw.length,
        value: raw,
        label: 'Social Security Number (SSN)',
        confidence: 'high',
        explanation: 'Matches US Social Security Number pattern',
        recommendedAction: 'Replace with [ID_N] placeholder',
      });
    }

    // 2. Indian PAN Card
    const panMatches = text.matchAll(PAN_REGEX);
    for (const match of panMatches) {
      if (match.index === undefined) continue;
      const raw = match[0];
      findings.push({
        id: `id-pan-${match.index}`,
        category: 'identifier',
        ruleId: 'id-in-pan',
        start: match.index,
        end: match.index + raw.length,
        value: raw,
        label: 'PAN Card Number (IN)',
        confidence: 'high',
        explanation: 'Matches Indian Permanent Account Number (PAN) format',
        recommendedAction: 'Replace with [ID_N] placeholder',
      });
    }

    // 3. Indian Aadhaar Card
    const aadhaarMatches = text.matchAll(AADHAAR_REGEX);
    for (const match of aadhaarMatches) {
      if (match.index === undefined) continue;
      const raw = match[0];
      findings.push({
        id: `id-aadhaar-${match.index}`,
        category: 'identifier',
        ruleId: 'id-in-aadhaar',
        start: match.index,
        end: match.index + raw.length,
        value: raw,
        label: 'Aadhaar Card Number (IN)',
        confidence: 'medium',
        explanation: 'Matches Indian 12-digit Aadhaar ID format with spacing',
        recommendedAction: 'Replace with [ID_N] placeholder',
      });
    }

    return findings;
  },
};

