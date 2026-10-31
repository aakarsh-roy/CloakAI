import { Finding, FindingCategory, RedactionStyle } from './types.ts';

const CATEGORY_TAG_MAP: Record<FindingCategory, string> = {
  email: 'EMAIL',
  phone: 'PHONE',
  credit_card: 'CREDIT_CARD',
  secret: 'SECRET',
  ip_address: 'IP_ADDRESS',
  identifier: 'GOV_ID',
  contextual: 'CONTEXT',
  custom: 'SENSITIVE',
};

export class PlaceholderManager {
  private style: RedactionStyle;
  // Maps original sensitive value -> generated placeholder
  private valueToPlaceholder: Map<string, string> = new Map();
  // Maps generated placeholder -> original sensitive value
  private placeholderToValue: Map<string, string> = new Map();
  // Category occurrence counters
  private categoryCounters: Map<FindingCategory, number> = new Map();

  constructor(style: RedactionStyle = 'bracket_counter') {
    this.style = style;
  }

  /**
   * Returns or generates a placeholder for the given finding.
   * If the exact same value was previously encountered, returns the existing placeholder.
   */
  getOrCreatePlaceholder(finding: Finding): string {
    const existing = this.valueToPlaceholder.get(finding.value);
    if (existing) {
      return existing;
    }

    const tag = CATEGORY_TAG_MAP[finding.category] || 'REDACTED';
    let placeholder = '';

    if (this.style === 'generic_tag') {
      placeholder = `[${tag}]`;
    } else {
      const currentCount = (this.categoryCounters.get(finding.category) || 0) + 1;
      this.categoryCounters.set(finding.category, currentCount);
      placeholder = `[${tag}_${currentCount}]`;
    }

    this.valueToPlaceholder.set(finding.value, placeholder);
    this.placeholderToValue.set(placeholder, finding.value);
    return placeholder;
  }

  /**
   * Returns the ephemeral in-memory mapping from placeholder to original value.
   */
  getPlaceholderMap(): Map<string, string> {
    return new Map(this.placeholderToValue);
  }

  /**
   * Explicitly drops all references in memory.
   */
  clear(): void {
    this.valueToPlaceholder.clear();
    this.placeholderToValue.clear();
    this.categoryCounters.clear();
  }
}

