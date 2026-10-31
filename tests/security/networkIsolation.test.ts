import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runDetection } from '../../src/core/detectorEngine.ts';
import { applyRedaction } from '../../src/core/redactionEngine.ts';
import { DEFAULT_SETTINGS } from '../../src/core/settings.ts';

describe('Security: Multi-Vector Network Isolation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('guarantees zero network calls across all transport vectors during prompt analysis and redaction', () => {
    // 1. Spy on fetch
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    // 2. Spy on XMLHttpRequest
    const xhrOpenSpy = vi.fn();
    const xhrSendSpy = vi.fn();
    class MockXHR {
      open = xhrOpenSpy;
      send = xhrSendSpy;
    }
    vi.stubGlobal('XMLHttpRequest', MockXHR);

    // 3. Spy on WebSocket
    const wsConstructorSpy = vi.fn();
    class MockWebSocket {
      constructor() {
        wsConstructorSpy();
      }
    }
    vi.stubGlobal('WebSocket', MockWebSocket);

    // 4. Spy on navigator.sendBeacon
    const beaconSpy = vi.fn();
    if (typeof navigator !== 'undefined') {
      Object.defineProperty(navigator, 'sendBeacon', {
        value: beaconSpy,
        configurable: true,
        writable: true,
      });
    }

    // 5. Spy on EventSource
    const eventSourceSpy = vi.fn();
    class MockEventSource {
      constructor() {
        eventSourceSpy();
      }
    }
    vi.stubGlobal('EventSource', MockEventSource);

    // Run realistic sensitive prompt processing
    const sensitivePrompt =
      'Please assist user admin@corp.internal. Credentials: AWS key AKIAIOSFODNN7EXAMPLE, ' +
      'salary of $150,000, call +91 9876543210, credit card 4111 1111 1111 1111.';

    const detectionResult = runDetection(sensitivePrompt, DEFAULT_SETTINGS);
    expect(detectionResult.findings.length).toBeGreaterThan(0);

    const redactionResult = applyRedaction(sensitivePrompt, detectionResult.findings);
    expect(redactionResult.sanitizedText).not.toContain('AKIAIOSFODNN7EXAMPLE');

    // Assert absolute zero outbound network activity across all monitored transports
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrOpenSpy).not.toHaveBeenCalled();
    expect(xhrSendSpy).not.toHaveBeenCalled();
    expect(wsConstructorSpy).not.toHaveBeenCalled();
    expect(beaconSpy).not.toHaveBeenCalled();
    expect(eventSourceSpy).not.toHaveBeenCalled();
  });
});
