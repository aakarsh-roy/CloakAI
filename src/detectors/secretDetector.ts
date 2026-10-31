import { Detector, Finding } from '../core/types.ts';

const SECRET_PATTERNS: Array<{
  ruleId: string;
  name: string;
  regex: RegExp;
  confidence: 'high' | 'medium';
  valueExtractor?: (match: RegExpMatchArray) => { value: string; offset: number };
}> = [
  {
    ruleId: 'secret-aws-key',
    name: 'AWS Access Key ID',
    regex: /\b(AKIA[0-9A-Z]{16})\b/g,
    confidence: 'high',
  },
  {
    ruleId: 'secret-github-token',
    name: 'GitHub Personal Access Token',
    regex: /\b(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82})\b/g,
    confidence: 'high',
  },
  {
    ruleId: 'secret-openai-key',
    name: 'OpenAI API Key',
    regex: /\b(sk-(?:proj-)?[a-zA-Z0-9_-]{20,})\b/g,
    confidence: 'high',
  },
  {
    ruleId: 'secret-slack-token',
    name: 'Slack Token',
    regex: /\b(xox[baprs]-[a-zA-Z0-9-]{10,})\b/g,
    confidence: 'high',
  },
  {
    ruleId: 'secret-private-key',
    name: 'Private Key Block',
    regex: /-----BEGIN (?:[A-Z ]+)?PRIVATE KEY-----[\s\S]*?-----END (?:[A-Z ]+)?PRIVATE KEY-----/g,
    confidence: 'high',
  },
  {
    ruleId: 'secret-bearer-token',
    name: 'Bearer Token',
    regex: /\bBearer\s+([a-zA-Z0-9_\-\.]{20,})\b/gi,
    confidence: 'high',
    valueExtractor: (match) => ({
      value: match[1],
      offset: match[0].indexOf(match[1]),
    }),
  },
  {
    ruleId: 'secret-assigned-credential',
    name: 'Assigned Credential / Password',
    regex: /\b(?:password|passwd|api_?key|secret(?:_?key)?|access_?token|auth_?token|client_?secret)\s*[:=]\s*["']([^"'\r\n]{4,})["']/gi,
    confidence: 'high',
    valueExtractor: (match) => ({
      value: match[1],
      offset: match[0].indexOf(match[1]),
    }),
  },
];

export const secretDetector: Detector = {
  id: 'detector-secret',
  name: 'Secret & Credential Detector',
  category: 'secret',
  detect(text: string): Finding[] {
    const findings: Finding[] = [];

    for (const pattern of SECRET_PATTERNS) {
      const matches = text.matchAll(pattern.regex);
      for (const match of matches) {
        if (match.index === undefined) continue;

        let val = match[0];
        let start = match.index;
        let end = start + val.length;

        if (pattern.valueExtractor) {
          const extracted = pattern.valueExtractor(match);
          val = extracted.value;
          start = match.index + extracted.offset;
          end = start + val.length;
        }

        findings.push({
          id: `secret-${pattern.ruleId}-${start}`,
          category: 'secret',
          ruleId: pattern.ruleId,
          start,
          end,
          value: val,
          label: pattern.name,
          confidence: pattern.confidence,
          explanation: `Matches known credential pattern: ${pattern.name}`,
          recommendedAction: 'Replace with [SECRET_N] placeholder',
        });
      }
    }

    return findings;
  },
};
