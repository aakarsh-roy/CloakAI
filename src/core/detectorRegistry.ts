import { Detector, FindingCategory, PrivacySettings } from './types.ts';
import { emailDetector } from '../detectors/emailDetector.ts';
import { phoneDetector } from '../detectors/phoneDetector.ts';
import { creditCardDetector } from '../detectors/creditCardDetector.ts';
import { secretDetector } from '../detectors/secretDetector.ts';
import { ipAddressDetector } from '../detectors/ipAddressDetector.ts';
import { identifierDetector } from '../detectors/identifierDetector.ts';
import { contextualDetector } from '../detectors/contextualDetector.ts';
import { customKeywordDetector } from '../detectors/customKeywordDetector.ts';

export const ALL_DETECTORS: Detector[] = [
  emailDetector,
  phoneDetector,
  creditCardDetector,
  secretDetector,
  ipAddressDetector,
  identifierDetector,
  contextualDetector,
  customKeywordDetector,
];

export function getActiveDetectors(settings?: PrivacySettings): Detector[] {
  if (!settings) return ALL_DETECTORS;
  return ALL_DETECTORS.filter((d) => settings.enabledCategories[d.category] !== false);
}

export function getCategoryDisplayName(category: FindingCategory): string {
  switch (category) {
    case 'email':
      return 'Email Addresses';
    case 'phone':
      return 'Phone Numbers';
    case 'credit_card':
      return 'Payment & Card Details';
    case 'secret':
      return 'Secrets & API Keys';
    case 'ip_address':
      return 'IP Addresses';
    case 'identifier':
      return 'Government Identifiers';
    case 'contextual':
      return 'Contextual & Compensation';
    case 'custom':
      return 'Custom Sensitive Terms';
    default:
      return category;
  }
}

