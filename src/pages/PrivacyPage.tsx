import React from 'react';
import { Lock, Cpu, AlertTriangle, Eye, Server } from 'lucide-react';

interface PrivacyPageProps {
  onOpenWorkspace: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onOpenWorkspace }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>Privacy & Security Architecture</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
          How CloakAI Protects Your Privacy
        </h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Full technical disclosure of our local-first architecture, data storage practices, network isolation, and detection limitations.
        </p>
      </div>

      {/* 1. Architecture: Local-First In-Memory */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 text-brand-400">
          <Cpu className="w-6 h-6" />
          <h2 className="text-lg font-bold text-slate-100">1. 100% In-Browser Execution</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          CloakAI operates entirely within your browser's JavaScript runtime. When you enter a prompt, the detection rules, regex parsers, Luhn checksum validator, and redaction replacers execute on your device’s CPU.
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-400 list-disc list-inside">
          <li><strong>No Backend Server:</strong> There is no API server receiving prompt payloads.</li>
          <li><strong>No Database:</strong> No database is connected to the application.</li>
          <li><strong>No Mandatory LLM API:</strong> Prompts are not routed through OpenAI, Anthropic, Gemini, or any third-party AI provider to scan them.</li>
        </ul>
      </div>

      {/* 2. Network Behavior & Verification */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 text-brand-400">
          <Server className="w-6 h-6" />
          <h2 className="text-lg font-bold text-slate-100">2. Network Behavior & Zero Telemetry</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          We clearly distinguish initial application downloads from prompt analysis:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
              Static Asset Delivery
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When you first open CloakAI, your browser downloads standard static HTML, CSS, and JS bundles from the web server.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
            <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-1">
              Runtime Prompt Lifecycle
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Once loaded, zero outbound network requests occur during prompt analysis, redaction, copying, or settings adjustments.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed pt-2">
          CloakAI enforces a Content Security Policy (<code className="text-brand-300">connect-src 'none'</code>) to physically forbid the browser from opening <code className="text-brand-300">fetch</code>, <code className="text-brand-300">XMLHttpRequest</code>, or <code className="text-brand-300">WebSocket</code> connections. There is no telemetry, tracking pixel, session replay, or analytics.
        </p>
      </div>

      {/* 3. Data Storage & Memory Handling */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 text-brand-400">
          <Eye className="w-6 h-6" />
          <h2 className="text-lg font-bold text-slate-100">3. Storage & In-Memory Data Lifecycle</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          We practice strict data minimization:
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-400 list-disc list-inside">
          <li>
            <strong>Prompts & Findings:</strong> Original prompts, finding offsets, detected values, and sanitized prompts are held exclusively in ephemeral React state in memory. They are <strong>never written</strong> to <code className="text-brand-300">localStorage</code>, <code className="text-brand-300">sessionStorage</code>, or <code className="text-brand-300">IndexedDB</code>.
          </li>
          <li>
            <strong>Preferences Only:</strong> Only non-sensitive settings (enabled detector categories, placeholder style, and custom keywords) are stored in <code className="text-brand-300">localStorage</code>.
          </li>
          <li>
            <strong>Reset Behavior & Memory Disclaimer:</strong> Clicking Clear drops JavaScript object references and resets component state. Note that dropping JavaScript references allows browser garbage collection to reclaim memory; it does not constitute guaranteed immediate cryptographic physical RAM zeroing at the operating system hardware level.
          </li>
        </ul>
      </div>

      {/* 4. Limitations & Non-Guarantees */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-amber-800/60 space-y-4">
        <div className="flex items-center gap-3 text-amber-400">
          <AlertTriangle className="w-6 h-6" />
          <h2 className="text-lg font-bold text-slate-100">4. Known Limitations & Realistic Expectations</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          CloakAI believes in transparent privacy engineering. We do not make false claims of infallible anonymity:
        </p>
        <div className="space-y-3 text-xs sm:text-sm text-slate-300">
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <strong>Deterministic Rules & Heuristics:</strong> Pattern matching covers recognized formats (such as standard emails, phone numbers, credit card Luhn checksums, and common API key signatures). Non-standard formats or obfuscated strings may bypass detection.
          </div>
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <strong>Contextual Limitations:</strong> Names, compensation, and health disclosures are identified using common English grammatical markers (e.g. "My name is..."). Indirect, nuanced, or non-English expressions cannot be guaranteed to be detected.
          </div>
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <strong>No Infallible Anonymity:</strong> True anonymity is complex. Even when personal identifiers are redacted, the semantic meaning of your prompt (e.g., specific dates, unique company scenarios, specialized project descriptions) can sometimes identify you. Always review your prompt manually before sharing it with third parties.
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onOpenWorkspace}
          className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all shadow-md shadow-brand-500/20"
        >
          Open Privacy Workspace
        </button>
      </div>
    </div>
  );
};
