import { describe, it, expect } from 'vitest';
import { assessPrivacyRisk } from '../../src/core/riskAssessment.ts';
import { Finding } from '../../src/core/types.ts';

describe('Risk Assessment Unit Tests', () => {
  it('returns "none_detected" and disclaimer when findings are empty', () => {
    const assessment = assessPrivacyRisk([]);
    expect(assessment.level).toBe('none_detected');
    expect(assessment.title).toBe('No Supported Patterns Detected');
    expect(assessment.description).toContain('does NOT guarantee complete anonymity');
    expect(assessment.totalFindings).toBe(0);
  });

  it('classifies secret findings as critical_detected', () => {
    const findings: Finding[] = [
      {
        id: '1',
        category: 'secret',
        ruleId: 'secret-aws',
        start: 0,
        end: 20,
        value: 'AKIAIOSFODNN7EXAMPLE',
        label: 'AWS Key',
        confidence: 'high',
        explanation: 'AWS secret',
        recommendedAction: 'Redact',
      },
    ];

    const assessment = assessPrivacyRisk(findings);
    expect(assessment.level).toBe('critical_detected');
    expect(assessment.categoryCounts.secret).toBe(1);
  });

  it('classifies contact information as sensitive_detected', () => {
    const findings: Finding[] = [
      {
        id: '1',
        category: 'email',
        ruleId: 'email-std',
        start: 0,
        end: 15,
        value: 'user@domain.com',
        label: 'Email',
        confidence: 'high',
        explanation: 'Email detected',
        recommendedAction: 'Redact',
      },
    ];

    const assessment = assessPrivacyRisk(findings);
    expect(assessment.level).toBe('sensitive_detected');
    expect(assessment.categoryCounts.email).toBe(1);
  });
});

