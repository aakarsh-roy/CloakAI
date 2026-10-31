import React from 'react';
import { Shield, Lock } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy }) => {
  return (
    <footer className="border-t border-slate-850 bg-slate-950 py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-500" />
          <span className="text-slate-300 font-medium">CloakAI</span>
          <span className="text-slate-500">|</span>
          <span>100% In-Browser Privacy Workspace</span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={onOpenPrivacy}
            className="hover:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-brand-500" />
            <span>Privacy Guarantees & Limitations</span>
          </button>
          <span className="text-slate-600">No telemetry • No database • No external LLM</span>
        </div>
      </div>
    </footer>
  );
};

