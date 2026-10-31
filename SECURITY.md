# Security Policy & Threat Model — CloakAI

CloakAI is committed to transparent application security engineering. This document details our threat model, defensive controls, residual risks, and vulnerability reporting procedures.

---

## 1. Threat Model & Mitigations

| Threat Vector | Potential Impact | Mitigation Strategy in CloakAI |
| :--- | :--- | :--- |
| **Prompt Exfiltration / Network Interception** | Leak of sensitive tokens or credentials to external actors. | CloakAI runs **100% client-side**. Prompts never leave the browser. Enforced Content Security Policy (`connect-src 'none'`) blocks all runtime `fetch`, `XHR`, and `WebSocket` calls. |
| **Catastrophic Regular Expression Backtracking (ReDoS)** | Browser freeze or Denial of Service during prompt scanning. | All regular expressions are bounded and avoid nested quantifiers. An input limit (`MAX_PROMPT_LENGTH = 50,000`) prevents unbounded evaluations. |
| **Accidental Prompt Persistence** | Unencrypted prompt data cached in browser storage or logs. | Zero prompt text, original findings, or placeholder mappings are ever written to `localStorage`, `sessionStorage`, or `IndexedDB`. In-memory state only. |
| **Cross-Site Scripting (XSS)** | Malicious prompt content executing arbitrary script. | Strict React rendering (no `dangerouslySetInnerHTML`). Content Security Policy blocks inline script evaluation and external scripts. |
| **Malicious Custom Rules** | User-entered keywords crashing regex engines. | Custom keywords are sanitized with regex escape sequences (`escapeRegex`) before pattern compilation. Dynamic code execution (`eval`) is strictly prohibited. |
| **False Sense of Complete Anonymity** | User assumes prompt is 100% sanitized and discloses confidential data. | Clear UI disclaimers stating that automated scans identify known patterns only. Category-based qualitative risk assessment replaces deceptive "100% Safe" badges. |

---

## 2. In-Memory Lifecycle & Memory Disclaimer

When a user clears a prompt or closes the tab:
1. React component references to prompt strings, findings, and placeholder maps are dereferenced.
2. The browser JavaScript engine marks the dereferenced memory for garbage collection.
3. **Disclaimer**: Dereferencing in JavaScript does not guarantee immediate physical hardware RAM zeroing or anti-forensic memory scrubbing at the operating system kernel level. Users in high-threat environments should utilize private browsing or dedicated ephemeral sandbox environments.

---

## 3. Dependency Security & Auditing

- Dependencies are strictly locked with `package-lock.json`.
- Third-party packages are audited using `npm audit`.
- Zero external font, CDN script, or remote stylesheet references in `index.html`.

---

## 4. Reporting a Security Vulnerability

If you discover a security issue or vulnerability in CloakAI:
- Please report it responsibly by contacting the maintainers or opening a private security advisory on GitHub.
- We request that you provide reasonable time to address reported issues before public disclosure.

