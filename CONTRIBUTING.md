# Contributing to CloakAI

Thank you for your interest in contributing to CloakAI!

## Core Development Principles

1. **Local-First & Zero Network**: Never introduce external backend dependencies, telemetry, or third-party cloud integrations into core prompt flows.
2. **Deterministic & Testable**: All detectors and redactions must be deterministic and covered by unit tests in `tests/unit/`.
3. **No ReDoS**: Ensure all regex patterns are bounded and free from exponential catastrophic backtracking.
4. **Strict Memory Management**: Never persist sensitive prompt data to browser storage or external caches.

## Local Setup & Development

```bash
# 1. Install dependencies
npm install

# 2. Start local dev server
npm run dev

# 3. Run unit, integration, and security tests
npm test

# 4. Verify production build
npm run build
```

## Pull Request Guidelines

- Run `npm test` and `npm run build` prior to submitting changes.
- Ensure all tests pass with zero errors.
- Document any new detection categories in `README.md` and `PRIVACY.md`.

