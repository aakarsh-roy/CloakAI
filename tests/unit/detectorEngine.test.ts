import { describe, it, expect } from 'vitest';
import { runDetection, MAX_PROMPT_LENGTH } from '../../src/core/detectorEngine.ts';

describe('Detector Engine Integration Tests', () => {
  it('detects multiple mixed entity types in a single prompt', () => {
    const prompt =
      'My name is Alice Smith. My email is alice@company.org and phone is +91 9876543210. ' +
      'Here is the secret API key: AKIAIOSFODNN7EXAMPLE and salary package is $140,000.';

    const result = runDetection(prompt);
    expect(result.findings.length).toBeGreaterThanOrEqual(4);
    expect(result.findings.some((f) => f.category === 'email')).toBe(true);
    expect(result.findings.some((f) => f.category === 'phone')).toBe(true);
    expect(result.findings.some((f) => f.category === 'secret')).toBe(true);
    expect(result.findings.some((f) => f.category === 'contextual')).toBe(true);
  });

  it('handles Unicode, emojis and multiline strings properly', () => {
    const prompt = '🔒 Confidential Report:\nName: Alice Smith\nEmail: alice@test.com 🎯\nStatus: OK';
    const result = runDetection(prompt);
    expect(result.findings.some((f) => f.category === 'email')).toBe(true);
  });

  it('truncates prompts exceeding maximum length to prevent browser freeze', () => {
    const hugePrompt = 'A'.repeat(MAX_PROMPT_LENGTH + 500) + ' test@example.com';
    const result = runDetection(hugePrompt);
    expect(result.isTruncated).toBe(true);
  });

  it('handles empty or whitespace prompts safely', () => {
    const result = runDetection('   \n\t  ');
    expect(result.findings).toHaveLength(0);
    expect(result.scanDurationMs).toBe(0);
  });
});

