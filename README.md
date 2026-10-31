# CloakAI

CloakAI is a standalone, client-side, local-first web application that allows users to prepare prompts, detect sensitive personal information and credentials locally, redact them deterministically, and safely use the sanitized prompts with their preferred AI tools.

---

## 🌟 Key Architecture Decisions

- **100% In-Browser Execution**: Prompts and sensitive findings are processed strictly inside the browser runtime. No backend, database, or external LLM API is used.
- **Content Security Policy (`connect-src 'none'`)**: Enforces browser-level isolation ensuring zero outbound network requests during prompt analysis.
- **Deterministic Redaction**: Resolves overlapping findings deterministically and replaces sensitive entities with consistent placeholders (e.g., `[EMAIL_1]`, `[SECRET_1]`).
- **Explainable Risk Assessment**: Categorical, qualitative risk indicators explaining why specific findings were flagged, rather than deceptive probabilistic scores or false "Safe" badges.
- **Strict In-Memory Lifecycle**: Raw prompts, detected values, and placeholder maps reside exclusively in temporary component state. Non-sensitive settings (category toggles, custom keywords) are stored in `localStorage`.

---

## 🛡️ Supported Detection Categories

| Category | Detectors & Patterns |
| :--- | :--- |
| **Email Addresses** | Standard and international domain email formats |
| **Phone Numbers** | Indian (+91, 10-digit) and international E.164 formats |
| **Payment Cards** | Visa, Mastercard, RuPay with mandatory **Luhn checksum algorithm** validation |
| **Secrets & Keys** | AWS Access Keys (`AKIA...`), GitHub tokens, OpenAI keys, Slack tokens, private key blocks, and password assignments |
| **Government IDs** | US SSN, Indian PAN Card, Indian Aadhaar Card (formatted) |
| **IP Addresses** | Valid 4-octet IPv4 addresses (0–255) and standard IPv6 formats |
| **Contextual Details** | Compensation and salary packages (`$150,000`, `25 LPA`), health disclosures, and self-identification names |
| **Custom Keywords** | User-defined keywords and proprietary codenames configured via Settings |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x (tested on v22.23.2)
- npm >= 9.x (tested on 10.9.8)

### Installation & Local Run

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open browser at http://localhost:5173
```

### Production Build & Preview

```bash
# Compile and bundle
npm run build

# Preview production build locally
npm run preview
```

### Running Tests

```bash
# Execute unit, integration, and security test suites
npm test
```

---

## 📊 Security & Benchmark Verification

- **Multi-Vector Network Isolation**: Tested against `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, and `sendBeacon`.
- **Synthetic Benchmark Suite**: Evaluates precision, recall, and F1 score on synthetic fixtures (`tests/security/benchmark.test.ts`).
- **Threat Model**: See [SECURITY.md](SECURITY.md) for full threat modeling and mitigations.
- **Privacy Policy**: See [PRIVACY.md](PRIVACY.md) for data flow and local storage disclosures.

---

## ⚖️ Limitations & Realistic Disclaimers

CloakAI evaluates prompts using deterministic pattern rules. Automated detection:
- Cannot detect all novel, obfuscated, or non-standard credential formats.
- Contextual patterns rely on standard English grammatical markers.
- Sanitizing direct identifiers does not guarantee complete anonymity if the semantic context itself is unique.
- Always review the sanitized prompt preview prior to sharing it with third parties.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
