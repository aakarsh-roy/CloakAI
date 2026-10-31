# Privacy Policy & Data Guarantees — CloakAI

CloakAI is built on a **zero-knowledge, local-first** privacy architecture.

---

## 1. Core Privacy Guarantees

1. **No External Network Calls**: During prompt scanning, analysis, redaction, and copying, CloakAI issues **zero network requests**.
2. **No Analytics or Telemetry**: CloakAI includes no Google Analytics, PostHog, telemetry trackers, session replay libraries, or tracking beacons.
3. **No Database or Cloud Accounts**: There is no user account system, cloud database, or server-side synchronization.
4. **No Hidden LLM API Calls**: Prompts are analyzed using deterministic, client-side pattern matching rules. We never send your prompt to OpenAI, Anthropic, or any third-party model.

---

## 2. Browser Storage Practices

- **What We Store**:
  - `cloakai_preferences_v1`: Contains ONLY non-sensitive UI settings:
    - Enabled detector category toggles (`email`, `phone`, `secret`, etc.)
    - Preferred placeholder style (`bracket_counter` vs `generic_tag`)
    - Custom keywords defined by the user
- **What We NEVER Store**:
  - Raw prompt text
  - Detected sensitive entities
  - Sanitized prompt outputs
  - Mapping tables connecting placeholders back to original values

---

## 3. Network Architecture & Content Security Policy (CSP)

CloakAI declares the following Content Security Policy header in `index.html`:

```http
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
connect-src 'none';
font-src 'self' data:;
object-src 'none';
base-uri 'self';
```

The directive `connect-src 'none'` strictly disables outbound runtime connections via `fetch`, `XMLHttpRequest`, `WebSocket`, and `EventSource`.

---

## 4. Detection Limitations

Automated pattern matching cannot guarantee absolute anonymity:
- Complex or obfuscated formats (e.g., misspelled emails, encoded tokens) may evade regex detection.
- Contextual data (such as compensation numbers or personal names) relies on specific English language markers.
- Unique situational details in a prompt may still be deanonymizing even if direct identifiers are removed.

**Always review the sanitized preview before sharing it with an AI model.**
