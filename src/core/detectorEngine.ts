import { Finding, PrivacySettings } from './types.ts';
import { getActiveDetectors } from './detectorRegistry.ts';
import { resolveOverlaps } from './overlapResolver.ts';

export const MAX_PROMPT_LENGTH = 50000;

export interface DetectionResult {
  findings: Finding[];
  scanDurationMs: number;
  totalRawMatches: number;
  isTruncated: boolean;
}

/**
 * Executes all active detectors over the provided text and resolves overlapping spans.
 * Strictly runs locally inside the browser memory.
 */
export function runDetection(text: string, settings?: PrivacySettings): DetectionResult {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  if (!text || text.trim().length === 0) {
    return {
      findings: [],
      scanDurationMs: 0,
      totalRawMatches: 0,
      isTruncated: false,
    };
  }

  // Guard against extreme input sizes
  let targetText = text;
  let isTruncated = false;
  if (targetText.length > MAX_PROMPT_LENGTH) {
    targetText = targetText.slice(0, MAX_PROMPT_LENGTH);
    isTruncated = true;
  }

  const detectors = getActiveDetectors(settings);
  const rawFindings: Finding[] = [];

  for (const detector of detectors) {
    try {
      const results = detector.detect(targetText, settings);
      rawFindings.push(...results);
    } catch {
      // Isolate detector failures so one detector doesn't break others
    }
  }

  const resolved = resolveOverlaps(rawFindings);
  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  return {
    findings: resolved,
    scanDurationMs: Math.round((endTime - startTime) * 10) / 10,
    totalRawMatches: rawFindings.length,
    isTruncated,
  };
}

