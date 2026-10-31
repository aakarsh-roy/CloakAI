export type FindingCategory =
  | 'email'
  | 'phone'
  | 'secret'
  | 'credit_card'
  | 'ip_address'
  | 'identifier'
  | 'contextual'
  | 'custom';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface Finding {
  id: string;
  category: FindingCategory;
  ruleId: string;
  start: number;
  end: number;
  value: string;
  label: string;
  confidence: ConfidenceLevel;
  explanation: string;
  recommendedAction: string;
  excluded?: boolean;
}

export type RiskLevel =
  | 'none_detected'
  | 'review_recommended'
  | 'sensitive_detected'
  | 'critical_detected';

export interface RiskAssessment {
  level: RiskLevel;
  title: string;
  description: string;
  totalFindings: number;
  categoryCounts: Record<FindingCategory, number>;
  activeCategories: FindingCategory[];
  disclaimer: string;
}

export type RedactionStyle = 'bracket_counter' | 'generic_tag';

export interface PrivacySettings {
  enabledCategories: Record<FindingCategory, boolean>;
  redactionStyle: RedactionStyle;
  customKeywords: string[];
}

export interface Detector {
  id: string;
  name: string;
  category: FindingCategory;
  detect: (text: string, settings?: PrivacySettings) => Finding[];
}

export interface RedactionResult {
  sanitizedText: string;
  placeholderMap: Map<string, string>; // In-memory placeholder to original value
  appliedFindings: Finding[];
  excludedCount: number;
}

