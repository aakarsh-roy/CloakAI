import { Finding, RedactionResult, RedactionStyle } from './types.ts';
import { PlaceholderManager } from './placeholderManager.ts';

/**
 * Deterministically applies redactions to the input text based on findings.
 * Findings that have `excluded === true` are preserved in the text as-is.
 * Slices text backwards from highest offset to lowest to prevent index shifting.
 */
export function applyRedaction(
  text: string,
  findings: Finding[],
  style: RedactionStyle = 'bracket_counter'
): RedactionResult {
  if (!text || findings.length === 0) {
    return {
      sanitizedText: text || '',
      placeholderMap: new Map(),
      appliedFindings: [],
      excludedCount: 0,
    };
  }

  const manager = new PlaceholderManager(style);
  const activeFindings = findings.filter((f) => !f.excluded);
  const excludedCount = findings.length - activeFindings.length;

  if (activeFindings.length === 0) {
    return {
      sanitizedText: text,
      placeholderMap: new Map(),
      appliedFindings: [],
      excludedCount,
    };
  }

  // Pre-generate placeholders in natural reading order (start ascending)
  const sortedAsc = [...activeFindings].sort((a, b) => a.start - b.start);
  const findingPlaceholderPairs = sortedAsc.map((f) => ({
    finding: f,
    placeholder: manager.getOrCreatePlaceholder(f),
  }));

  // Slices backwards (start descending) to replace without index drift
  let sanitized = text;
  const sortedDesc = [...findingPlaceholderPairs].sort(
    (a, b) => b.finding.start - a.finding.start
  );

  for (const { finding, placeholder } of sortedDesc) {
    const before = sanitized.slice(0, finding.start);
    const after = sanitized.slice(finding.end);
    sanitized = before + placeholder + after;
  }

  return {
    sanitizedText: sanitized,
    placeholderMap: manager.getPlaceholderMap(),
    appliedFindings: activeFindings,
    excludedCount,
  };
}

