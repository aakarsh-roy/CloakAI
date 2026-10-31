import { Finding, FindingCategory, RiskAssessment, RiskLevel } from './types.ts';

/**
 * Evaluates privacy risk qualitatively based on detected categories, rule severity,
 * and finding counts.
 *
 * IMPORTANT: This is a deterministic rule-matching indicator based solely on the
 * patterns supported by CloakAI. It is NOT a statistical, AI-based, or comprehensive
 * guarantee that a prompt is safe or free of other sensitive context.
 */
export function assessPrivacyRisk(findings: Finding[]): RiskAssessment {
  const categoryCounts: Record<FindingCategory, number> = {
    email: 0,
    phone: 0,
    secret: 0,
    credit_card: 0,
    ip_address: 0,
    identifier: 0,
    contextual: 0,
    custom: 0,
  };

  for (const f of findings) {
    if (categoryCounts[f.category] !== undefined) {
      categoryCounts[f.category]++;
    }
  }

  const activeCategories = (Object.keys(categoryCounts) as FindingCategory[]).filter(
    (cat) => categoryCounts[cat] > 0
  );

  let level: RiskLevel = 'none_detected';
  let title = 'No Supported Patterns Detected';
  let description =
    'The engine did not detect matches for any of its configured pattern rules. This does NOT guarantee complete anonymity or the total absence of sensitive or identifying context.';

  if (findings.length > 0) {
    if (categoryCounts.secret > 0) {
      level = 'critical_detected';
      title = 'Critical Credentials Detected';
      description =
        'Direct credentials, API tokens, private keys, or passwords were detected. Submitting these to external AI tools poses an immediate security and credential leak risk.';
    } else if (
      categoryCounts.credit_card > 0 ||
      categoryCounts.identifier > 0 ||
      categoryCounts.email > 0 ||
      categoryCounts.phone > 0
    ) {
      level = 'sensitive_detected';
      title = 'Sensitive Personal Information Detected';
      description =
        'Direct personal contact details, financial card numbers, or government identifiers were detected. Review and redact these before sharing.';
    } else {
      level = 'review_recommended';
      title = 'Review Recommended';
      description =
        'Contextual data (such as compensation figures, health disclosures, or custom sensitive terms) was detected. Human review is recommended.';
    }
  }

  return {
    level,
    title,
    description,
    totalFindings: findings.length,
    categoryCounts,
    activeCategories,
    disclaimer:
      'CloakAI evaluates prompts using deterministic client-side pattern rules. It cannot detect all forms of sensitive data, novel secrets, or subtle deanonymizing context.',
  };
}

