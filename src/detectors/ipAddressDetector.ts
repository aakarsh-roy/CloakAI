import { Detector, Finding } from '../core/types.ts';

// IPv4: Validate four octets between 0 and 255
const IPV4_CANDIDATE_REGEX = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

// IPv6 candidate regex
const IPV6_REGEX = /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b|\b(?:[0-9a-fA-F]{1,4}:)*:[0-9a-fA-F]{1,4}\b/g;

function isValidIPv4(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    const num = Number(p);
    return num >= 0 && num <= 255 && String(num) === p;
  });
}

export const ipAddressDetector: Detector = {
  id: 'detector-ip-address',
  name: 'IP Address Detector',
  category: 'ip_address',
  detect(text: string): Finding[] {
    const findings: Finding[] = [];

    // 1. IPv4
    const v4Matches = text.matchAll(IPV4_CANDIDATE_REGEX);
    for (const match of v4Matches) {
      if (match.index === undefined) continue;
      const raw = match[0];
      if (isValidIPv4(raw)) {
        findings.push({
          id: `ip-v4-${match.index}`,
          category: 'ip_address',
          ruleId: 'ip-v4',
          start: match.index,
          end: match.index + raw.length,
          value: raw,
          label: 'IPv4 Address',
          confidence: 'high',
          explanation: 'Matches valid 4-octet IPv4 network address format',
          recommendedAction: 'Replace with [IP_ADDRESS_N] placeholder',
        });
      }
    }

    // 2. IPv6
    const v6Matches = text.matchAll(IPV6_REGEX);
    for (const match of v6Matches) {
      if (match.index === undefined) continue;
      const raw = match[0];
      // Exclude simple colon sequences or time formats like 12:00:00
      if (raw.includes(':') && raw.length >= 4 && !raw.match(/^\d{1,2}:\d{2}(?::\d{2})?$/)) {
        findings.push({
          id: `ip-v6-${match.index}`,
          category: 'ip_address',
          ruleId: 'ip-v6',
          start: match.index,
          end: match.index + raw.length,
          value: raw,
          label: 'IPv6 Address',
          confidence: 'medium',
          explanation: 'Matches IPv6 network address structure',
          recommendedAction: 'Replace with [IP_ADDRESS_N] placeholder',
        });
      }
    }

    return findings;
  },
};

