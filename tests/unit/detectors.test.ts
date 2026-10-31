import { describe, it, expect } from 'vitest';
import { emailDetector } from '../../src/detectors/emailDetector.ts';
import { phoneDetector } from '../../src/detectors/phoneDetector.ts';
import { creditCardDetector, passesLuhnCheck } from '../../src/detectors/creditCardDetector.ts';
import { secretDetector } from '../../src/detectors/secretDetector.ts';
import { ipAddressDetector } from '../../src/detectors/ipAddressDetector.ts';
import { identifierDetector } from '../../src/detectors/identifierDetector.ts';
import { contextualDetector } from '../../src/detectors/contextualDetector.ts';
import { customKeywordDetector } from '../../src/detectors/customKeywordDetector.ts';
import { DEFAULT_SETTINGS } from '../../src/core/settings.ts';

describe('Detectors Unit Tests', () => {
  describe('Email Detector', () => {
    it('detects standard emails in text', () => {
      const text = 'Reach me at test.user@example.co.uk or admin@company.org';
      const findings = emailDetector.detect(text);
      expect(findings).toHaveLength(2);
      expect(findings[0].value).toBe('test.user@example.co.uk');
      expect(findings[1].value).toBe('admin@company.org');
    });

    it('does not flag invalid email fragments', () => {
      const text = 'Not an email: user@ or @domain.com or user@.com';
      const findings = emailDetector.detect(text);
      expect(findings).toHaveLength(0);
    });
  });

  describe('Phone Detector', () => {
    it('detects Indian phone formats with and without country code', () => {
      const text = 'Call +91 9876543210 or 98765-43210 or 08765432109';
      const findings = phoneDetector.detect(text);
      expect(findings.length).toBeGreaterThanOrEqual(2);
      expect(findings.some((f) => f.value.includes('9876543210'))).toBe(true);
    });

    it('detects North American and international phone formats', () => {
      const text = 'Call support at (555) 234-5678 or +1-555-234-5678';
      const findings = phoneDetector.detect(text);
      expect(findings.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Credit Card Detector & Luhn Algorithm', () => {
    it('correctly implements Luhn check', () => {
      // 4111 1111 1111 1111 is standard valid Visa test number
      expect(passesLuhnCheck('4111111111111111')).toBe(true);
      // Alter last digit to 2: should fail
      expect(passesLuhnCheck('4111111111111112')).toBe(false);
      // Random non-Luhn number: should fail
      expect(passesLuhnCheck('1234567890123456')).toBe(false);
    });

    it('detects valid credit card candidates with spaces or hyphens', () => {
      const text = 'Pay with 4111-1111-1111-1111 now';
      const findings = creditCardDetector.detect(text);
      expect(findings).toHaveLength(1);
      expect(findings[0].value).toBe('4111-1111-1111-1111');
    });

    it('rejects credit card candidates that fail the Luhn checksum', () => {
      const text = 'Invoice order number 1234-5678-9012-3456 should not be flagged';
      const findings = creditCardDetector.detect(text);
      expect(findings).toHaveLength(0);
    });
  });

  describe('Secret & Credential Detector', () => {
    it('detects AWS access keys', () => {
      const text = 'export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE';
      const findings = secretDetector.detect(text);
      expect(findings.some((f) => f.value === 'AKIAIOSFODNN7EXAMPLE')).toBe(true);
    });

    it('detects GitHub tokens and OpenAI keys', () => {
      const text = 'gh token: ghp_1234567890abcdefghijklmnopqrstuvwxyz and key sk-abcdef1234567890abcdef12';
      const findings = secretDetector.detect(text);
      expect(findings.length).toBeGreaterThanOrEqual(2);
    });

    it('detects assigned passwords and credentials in configuration', () => {
      const text = 'db_config: password = "SuperSecretPassword123!" and api_key: \'my-secret-key-1234\'';
      const findings = secretDetector.detect(text);
      expect(findings.some((f) => f.value === 'SuperSecretPassword123!')).toBe(true);
      expect(findings.some((f) => f.value === 'my-secret-key-1234')).toBe(true);
    });
  });

  describe('IP Address Detector', () => {
    it('detects valid IPv4 addresses', () => {
      const text = 'Server IP: 192.168.1.1 and 10.0.0.254';
      const findings = ipAddressDetector.detect(text);
      expect(findings).toHaveLength(2);
    });

    it('rejects invalid octets > 255', () => {
      const text = 'Invalid: 999.168.1.1 or 256.0.0.1';
      const findings = ipAddressDetector.detect(text);
      expect(findings).toHaveLength(0);
    });
  });

  describe('Identifier Detector', () => {
    it('detects US SSN', () => {
      const text = 'My SSN is 123-45-6789';
      const findings = identifierDetector.detect(text);
      expect(findings.some((f) => f.value === '123-45-6789')).toBe(true);
    });

    it('detects Indian PAN Card', () => {
      const text = 'PAN details: ABCDE1234F';
      const findings = identifierDetector.detect(text);
      expect(findings.some((f) => f.value === 'ABCDE1234F')).toBe(true);
    });
  });

  describe('Contextual Detector', () => {
    it('detects salary and compensation phrases', () => {
      const text = 'My current salary is $125,000 and expected package is 25 LPA';
      const findings = contextualDetector.detect(text);
      expect(findings.length).toBeGreaterThanOrEqual(1);
    });

    it('detects personal self-introduction name', () => {
      const text = 'Hello, my name is Aakarsh Roy. Can you review this?';
      const findings = contextualDetector.detect(text);
      expect(findings.some((f) => f.value === 'Aakarsh Roy')).toBe(true);
    });
  });

  describe('Custom Keyword Detector', () => {
    it('detects user-defined custom sensitive terms', () => {
      const text = 'Internal codename Project Chimera should remain confidential';
      const settings = {
        ...DEFAULT_SETTINGS,
        customKeywords: ['Project Chimera', 'Apollo'],
      };
      const findings = customKeywordDetector.detect(text, settings);
      expect(findings).toHaveLength(1);
      expect(findings[0].value).toBe('Project Chimera');
    });
  });
});
