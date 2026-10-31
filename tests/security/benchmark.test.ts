import { describe, it, expect } from 'vitest';
import { runDetection } from '../../src/core/detectorEngine.ts';
import { DEFAULT_SETTINGS } from '../../src/core/settings.ts';

interface BenchmarkFixture {
  id: string;
  text: string;
  expectedCategoryMatches: string[];
}

const SYNTHETIC_FIXTURES: BenchmarkFixture[] = [
  {
    id: 'email-pos',
    text: 'Contact user support at contact@example.com for assistance.',
    expectedCategoryMatches: ['email'],
  },
  {
    id: 'email-neg',
    text: 'No email here, just user@ or invalid string.',
    expectedCategoryMatches: [],
  },
  {
    id: 'phone-in-pos',
    text: 'Call +91 9876543210 immediately.',
    expectedCategoryMatches: ['phone'],
  },
  {
    id: 'phone-intl-pos',
    text: 'Direct office dial (555) 234-5678.',
    expectedCategoryMatches: ['phone'],
  },
  {
    id: 'cc-luhn-pos',
    text: 'Transaction card: 4111-1111-1111-1111.',
    expectedCategoryMatches: ['credit_card'],
  },
  {
    id: 'cc-luhn-neg',
    text: 'Random serial number 1234-5678-9012-3456 that fails Luhn check.',
    expectedCategoryMatches: [],
  },
  {
    id: 'secret-aws-pos',
    text: 'Deploy token AKIAIOSFODNN7EXAMPLE for upload.',
    expectedCategoryMatches: ['secret'],
  },
  {
    id: 'secret-passwd-pos',
    text: 'db_password = "MyStrongPassword2026!" in local config.',
    expectedCategoryMatches: ['secret'],
  },
  {
    id: 'ip-v4-pos',
    text: 'Route traffic through 192.168.1.1.',
    expectedCategoryMatches: ['ip_address'],
  },
  {
    id: 'id-pan-pos',
    text: 'Verification PAN ABCDE1234F provided.',
    expectedCategoryMatches: ['identifier'],
  },
  {
    id: 'context-salary-pos',
    text: 'Current compensation package of 28 LPA with bonus.',
    expectedCategoryMatches: ['contextual'],
  },
  {
    id: 'innocuous-neg',
    text: 'Can you help me write a poem about the morning sunrise and ocean waves?',
    expectedCategoryMatches: [],
  },
];

describe('Synthetic Benchmark & Precision/Recall Suite', () => {
  it('evaluates detection performance across synthetic benchmark fixtures', () => {
    let truePositives = 0;
    let falsePositives = 0;
    let falseNegatives = 0;

    for (const fixture of SYNTHETIC_FIXTURES) {
      const result = runDetection(fixture.text, DEFAULT_SETTINGS);
      const detectedCategories = new Set(result.findings.map((f) => f.category));

      for (const expected of fixture.expectedCategoryMatches) {
        if (detectedCategories.has(expected as any)) {
          truePositives++;
        } else {
          falseNegatives++;
        }
      }

      for (const detected of detectedCategories) {
        if (!fixture.expectedCategoryMatches.includes(detected)) {
          falsePositives++;
        }
      }
    }

    const precision =
      truePositives + falsePositives > 0
        ? truePositives / (truePositives + falsePositives)
        : 1;
    const recall =
      truePositives + falseNegatives > 0
        ? truePositives / (truePositives + falseNegatives)
        : 1;
    const f1 =
      precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    // Documented benchmark result: Synthetic test fixtures achieve >= 0.90 F1
    expect(f1).toBeGreaterThanOrEqual(0.9);
    expect(precision).toBeGreaterThanOrEqual(0.9);
    expect(recall).toBeGreaterThanOrEqual(0.9);
  });
});
