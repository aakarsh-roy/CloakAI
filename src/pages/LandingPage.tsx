import React from 'react';
import { Shield, EyeOff, Cpu, ArrowRight, AlertTriangle, Key, Mail, Phone, CreditCard, Hash, FileCode } from 'lucide-react';

interface LandingPageProps {
  onOpenWorkspace: () => void;
  onOpenPrivacy: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenWorkspace,
  onOpenPrivacy,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-6">
          <Shield className="w-3.5 h-3.5" />
          <span>100% In-Browser Privacy Protection</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
          Use AI tools freely without exposing your personal information.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
          CloakAI runs completely inside your browser to detect personal information, credentials, and identifiers. Redact them deterministically before sharing prompts with external AI models.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenWorkspace}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
          >
            <span>Protect a Prompt</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenPrivacy}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-medium text-sm transition-colors"
          >
            How CloakAI Works
          </button>
        </div>
      </div>

      {/* 3-Step Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold mb-4">
            1
          </div>
          <h3 className="font-bold text-base text-slate-100 mb-2">Write or Paste Prompt</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Enter your prompt containing sensitive data. CloakAI never sends your input to any server or backend.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold mb-4">
            2
          </div>
          <h3 className="font-bold text-base text-slate-100 mb-2">Inspect & Selective Redact</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Review masked findings. Choose which entities to replace with standardized placeholders like <code className="text-brand-300">[EMAIL_1]</code>.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold mb-4">
            3
          </div>
          <h3 className="font-bold text-base text-slate-100 mb-2">Copy Sanitized Prompt</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Copy the clean, sanitized prompt directly to your clipboard and paste it into ChatGPT, Claude, or Gemini with confidence.
          </p>
        </div>
      </div>

      {/* Supported Categories */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-100">Supported Detection Categories</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deterministic detection patterns built into CloakAI
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <Mail className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Email Addresses</h4>
              <p className="text-xs text-slate-400 mt-1">Standard and international domain formats</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <Phone className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Phone Numbers</h4>
              <p className="text-xs text-slate-400 mt-1">Indian (+91, 10-digit) and international E.164 formats</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <Key className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">API Keys & Secrets</h4>
              <p className="text-xs text-slate-400 mt-1">AWS, GitHub, OpenAI, private keys, password assignments</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Payment Cards</h4>
              <p className="text-xs text-slate-400 mt-1">Visa, Mastercard, RuPay with Luhn checksum validation</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <Hash className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Government IDs</h4>
              <p className="text-xs text-slate-400 mt-1">US SSN, Indian PAN Card, Indian Aadhaar Card</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <Cpu className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">IP Addresses</h4>
              <p className="text-xs text-slate-400 mt-1">Validated 4-octet IPv4 and standard IPv6 addresses</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <FileCode className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Contextual Details</h4>
              <p className="text-xs text-slate-400 mt-1">Compensation, salary packages, health disclosures, names</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Custom Keywords</h4>
              <p className="text-xs text-slate-400 mt-1">User-configured project names, internal codenames, terms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Honest Privacy Guarantee & Limitations Notice */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-100">
              Clear Statement of Protection & Limitations
            </h4>
            <p className="text-slate-400 leading-relaxed">
              CloakAI protects against <strong>supported detected patterns</strong> using deterministic client-side algorithms. It does not and cannot guarantee complete anonymity or perfect detection. Novel secret formats, obfuscated emails, unconventional phone numbers, or subtle identifying contextual clues may not be recognized. Always review the redacted preview before pasting into third-party AI platforms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
