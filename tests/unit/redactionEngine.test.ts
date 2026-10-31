import { describe, it, expect } from 'vitest';
import { applyRedaction } from '../../src/core/redactionEngine.ts';
import { resolveOverlaps } from '../../src/core/overlapResolver.ts';
import { Finding } from '../../src/core/types.ts';

describe('Redaction & Overlap Engine Unit Tests', () => {
  it('correctly redacts multiple findings with bracket counter placeholders', () => {
    const text = 'Contact Alice at alice@example.com or call 9876543210.';
    const findings: Finding[] = [
      {
        id: '1',
        category: 'email',
        ruleId: 'email-std',
        start: 17,
        end: 34,
        value: 'alice@example.com',
        label: 'Email',
        confidence: 'high',
        explanation: 'Email detected',
        recommendedAction: 'Redact',
      },
      {
        id: '2',
        category: 'phone',
        ruleId: 'phone-in',
        start: 43,
        end: 53,
        value: '9876543210',
        label: 'Phone',
        confidence: 'high',
        explanation: 'Phone detected',
        recommendedAction: 'Redact',
      },
    ];

    const result = applyRedaction(text, findings, 'bracket_counter');
    expect(result.sanitizedText).toBe('Contact Alice at [EMAIL_1] or call [PHONE_1].');
    expect(result.placeholderMap.get('[EMAIL_1]')).toBe('alice@example.com');
    expect(result.placeholderMap.get('[PHONE_1]')).toBe('9876543210');
  });

  it('reuses the same placeholder for identical occurrences of sensitive values', () => {
    const text = 'Email user@test.com and confirm with user@test.com.';
    const findings: Finding[] = [
      {
        id: '1',
        category: 'email',
        ruleId: 'email-std',
        start: 6,
        end: 19,
        value: 'user@test.com',
        label: 'Email',
        confidence: 'high',
        explanation: 'Email detected',
        recommendedAction: 'Redact',
      },
      {
        id: '2',
        category: 'email',
        ruleId: 'email-std',
        start: 37,
        end: 50,
        value: 'user@test.com',
        label: 'Email',
        confidence: 'high',
        explanation: 'Email detected',
        recommendedAction: 'Redact',
      },
    ];

    const result = applyRedaction(text, findings, 'bracket_counter');
    expect(result.sanitizedText).toBe('Email [EMAIL_1] and confirm with [EMAIL_1].');
  });

  it('supports selective exclusion from redaction', () => {
    const text = 'Hello bob@example.com and alice@example.com';
    const findings: Finding[] = [
      {
        id: '1',
        category: 'email',
        ruleId: 'email-std',
        start: 6,
        end: 21,
        value: 'bob@example.com',
        label: 'Email',
        confidence: 'high',
        explanation: 'Email detected',
        recommendedAction: 'Redact',
        excluded: true, // Excluded by user
      },
      {
        id: '2',
        category: 'email',
        ruleId: 'email-std',
        start: 26,
        end: 43,
        value: 'alice@example.com',
        label: 'Email',
        confidence: 'high',
        explanation: 'Email detected',
        recommendedAction: 'Redact',
        excluded: false,
      },
    ];

    const result = applyRedaction(text, findings, 'bracket_counter');
    expect(result.sanitizedText).toBe('Hello bob@example.com and [EMAIL_1]');
    expect(result.excludedCount).toBe(1);
  });

  it('resolves overlapping spans deterministically favoring higher priority', () => {
    const overlapping: Finding[] = [
      {
        id: '1',
        category: 'contextual',
        ruleId: 'ctx',
        start: 10,
        end: 30,
        value: 'key is AKIAIOSFODNN7EXAMPLE',
        label: 'Context',
        confidence: 'medium',
        explanation: 'Contextual',
        recommendedAction: 'Redact',
      },
      {
        id: '2',
        category: 'secret',
        ruleId: 'secret-aws',
        start: 17,
        end: 37,
        value: 'AKIAIOSFODNN7EXAMPLE',
        label: 'AWS Key',
        confidence: 'high',
        explanation: 'Secret Key',
        recommendedAction: 'Redact',
      },
    ];

    const resolved = resolveOverlaps(overlapping);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].category).toBe('secret');
  });
});

