import { Finding, FindingCategory } from './types.ts';

const CATEGORY_PRIORITY: Record<FindingCategory, number> = {
  secret: 100,
  credit_card: 90,
  identifier: 80,
  email: 70,
  phone: 60,
  ip_address: 50,
  custom: 40,
  contextual: 30,
};

const CONFIDENCE_PRIORITY = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Resolves overlapping findings deterministically.
 * Guarantees that the returned list contains non-overlapping spans sorted by `start` offset.
 */
export function resolveOverlaps(findings: Finding[]): Finding[] {
  if (findings.length <= 1) return [...findings];

  // Sort candidate findings by start index, then longer match, then priority
  const sorted = [...findings].sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    const aLen = a.end - a.start;
    const bLen = b.end - b.start;
    if (aLen !== bLen) return bLen - aLen; // longer first
    return CATEGORY_PRIORITY[b.category] - CATEGORY_PRIORITY[a.category];
  });

  const nonOverlapping: Finding[] = [];

  for (const current of sorted) {
    if (nonOverlapping.length === 0) {
      nonOverlapping.push(current);
      continue;
    }

    const previous = nonOverlapping[nonOverlapping.length - 1];

    // Check if current overlaps with previous
    if (current.start < previous.end) {
      // Conflict: decide whether current should replace previous
      const currentScore =
        CATEGORY_PRIORITY[current.category] * 10 +
        CONFIDENCE_PRIORITY[current.confidence] * 2 +
        (current.end - current.start);

      const previousScore =
        CATEGORY_PRIORITY[previous.category] * 10 +
        CONFIDENCE_PRIORITY[previous.confidence] * 2 +
        (previous.end - previous.start);

      if (currentScore > previousScore) {
        // Replace previous
        nonOverlapping[nonOverlapping.length - 1] = current;
      }
      // Else discard current
    } else {
      nonOverlapping.push(current);
    }
  }

  return nonOverlapping.sort((a, b) => a.start - b.start);
}

