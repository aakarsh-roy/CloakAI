import { Detector, Finding } from '../core/types.ts';

/**
 * Validates a numeric string using the Luhn checksum algorithm (Mod 10).
 */
export function passesLuhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// Matches card number patterns:
// 4-4-4-4 (Visa/Mastercard/RuPay), 4-6-5 (Amex), or continuous 13-19 digits
const CC_CANDIDATE_REGEX = /\b(?:\d{4}[ -]\d{4}[ -]\d{4}[ -]\d{1,4}|\d{4}[ -]\d{6}[ -]\d{4,5}|\d{13,19})\b/g;

export const creditCardDetector: Detector = {
  id: 'detector-credit-card',
  name: 'Credit Card Detector',
  category: 'credit_card',
  detect(text: string): Finding[] {
    const findings: Finding[] = [];
    const matches = text.matchAll(CC_CANDIDATE_REGEX);

    for (const match of matches) {
      if (match.index === undefined) continue;
      const raw = match[0].trim();
      const digitsOnly = raw.replace(/\D/g, '');

      // Must be standard card length (13 to 19 digits)
      if (digitsOnly.length >= 13 && digitsOnly.length <= 19) {
        // Must strictly pass the Luhn algorithm
        if (passesLuhnCheck(digitsOnly)) {
          findings.push({
            id: `cc-${match.index}`,
            category: 'credit_card',
            ruleId: 'credit-card-luhn',
            start: match.index,
            end: match.index + raw.length,
            value: raw,
            label: 'Payment Card Number',
            confidence: 'high',
            explanation: 'Matches payment card structure and passed Luhn (Mod 10) checksum verification',
            recommendedAction: 'Replace with [CREDIT_CARD_N] placeholder',
          });
        }
      }
    }

    return findings;
  },
};
