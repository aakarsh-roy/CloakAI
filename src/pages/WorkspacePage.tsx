import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PromptEditor } from '../components/editor/PromptEditor.tsx';
import { RiskAssessmentCard } from '../components/analysis/RiskAssessmentCard.tsx';
import { FindingsList } from '../components/findings/FindingsList.tsx';
import { RedactionPreview } from '../components/review/RedactionPreview.tsx';
import { CopyControls } from '../components/review/CopyControls.tsx';
import { Finding, PrivacySettings } from '../core/types.ts';
import { runDetection } from '../core/detectorEngine.ts';
import { applyRedaction } from '../core/redactionEngine.ts';
import { assessPrivacyRisk } from '../core/riskAssessment.ts';

interface WorkspacePageProps {
  settings: PrivacySettings;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ settings }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanDurationMs, setScanDurationMs] = useState<number>(0);

  // Debounced scan whenever prompt or settings change
  useEffect(() => {
    if (!prompt.trim()) {
      setFindings([]);
      setScanDurationMs(0);
      return;
    }

    setIsScanning(true);
    const timer = setTimeout(() => {
      const result = runDetection(prompt, settings);
      setFindings(result.findings);
      setScanDurationMs(result.scanDurationMs);
      setIsScanning(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [prompt, settings]);

  // Toggle exclusion of an individual finding
  const handleToggleExclude = useCallback((id: string) => {
    setFindings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, excluded: !f.excluded } : f))
    );
  }, []);

  // Batch toggle exclusion
  const handleSetAllExcluded = useCallback((excluded: boolean) => {
    setFindings((prev) => prev.map((f) => ({ ...f, excluded })));
  }, []);

  // Compute Redaction
  const redactionResult = useMemo(() => {
    return applyRedaction(prompt, findings, settings.redactionStyle);
  }, [prompt, findings, settings.redactionStyle]);

  // Compute Qualitative Risk Assessment
  const riskAssessment = useMemo(() => {
    return assessPrivacyRisk(findings);
  }, [findings]);

  // Complete reset function (clears in-memory prompt and findings)
  const handleClear = useCallback(() => {
    setPrompt('');
    setFindings([]);
    setScanDurationMs(0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <span>Privacy Redaction Workspace</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Detect sensitive data, review matches, and sanitize your prompt in-memory before submitting it to AI tools.
        </p>
      </div>

      {/* Main Dual-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt Editor (5 cols on large screens) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <PromptEditor
            prompt={prompt}
            setPrompt={setPrompt}
            onClear={handleClear}
            isScanning={isScanning}
            scanDurationMs={scanDurationMs}
          />
        </div>

        {/* Right Column: Privacy Analysis & Review (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Risk Card */}
          <RiskAssessmentCard assessment={riskAssessment} />

          {/* Detected Entities List */}
          <FindingsList
            findings={findings}
            onToggleExclude={handleToggleExclude}
            onSetAllExcluded={handleSetAllExcluded}
          />

          {/* Sanitized Output Preview */}
          <RedactionPreview
            sanitizedText={redactionResult.sanitizedText}
            appliedCount={redactionResult.appliedFindings.length}
            excludedCount={redactionResult.excludedCount}
          />

          {/* Copy Controls */}
          <CopyControls
            sanitizedPrompt={redactionResult.sanitizedText}
            originalPrompt={prompt}
            totalFindings={findings.length}
          />
        </div>
      </div>
    </div>
  );
};

