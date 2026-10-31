import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2, Info } from 'lucide-react';
import { RiskAssessment } from '../../core/types.ts';
import { getCategoryDisplayName } from '../../core/detectorRegistry.ts';

interface RiskAssessmentCardProps {
  assessment: RiskAssessment;
}

export const RiskAssessmentCard: React.FC<RiskAssessmentCardProps> = ({ assessment }) => {
  const getBadgeStyle = () => {
    switch (assessment.level) {
      case 'critical_detected':
        return {
          icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
          badgeClass: 'bg-red-950/60 text-red-300 border-red-800/80',
          titleColor: 'text-red-400',
        };
      case 'sensitive_detected':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-800/80',
          titleColor: 'text-amber-400',
        };
      case 'review_recommended':
        return {
          icon: <Info className="w-5 h-5 text-blue-400" />,
          badgeClass: 'bg-blue-950/60 text-blue-300 border-blue-800/80',
          titleColor: 'text-blue-400',
        };
      case 'none_detected':
      default:
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-slate-400" />,
          badgeClass: 'bg-slate-850 text-slate-300 border-slate-700',
          titleColor: 'text-slate-300',
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div className={`p-4 rounded-xl border ${style.badgeClass} transition-all`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/50 mt-0.5">
          {style.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className={`font-semibold text-sm ${style.titleColor}`}>
              {assessment.title}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-950/60 border border-slate-800 text-slate-300 font-medium">
              {assessment.totalFindings} {assessment.totalFindings === 1 ? 'Finding' : 'Findings'}
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {assessment.description}
          </p>

          {/* Active Categories Tags */}
          {assessment.activeCategories.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
              {assessment.activeCategories.map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-950/80 border border-slate-700 text-slate-300"
                >
                  {getCategoryDisplayName(cat)}: {assessment.categoryCounts[cat]}
                </span>
              ))}
            </div>
          )}

          {/* Transparent Heuristic Disclaimer */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>{assessment.disclaimer}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
