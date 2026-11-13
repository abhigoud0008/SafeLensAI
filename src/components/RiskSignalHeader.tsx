import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { RiskLevel } from '../types/safety';

export function RiskSignalHeader({
  riskLevel,
  confidenceScore,
  source,
  extraMetricLabel,
  extraMetricValue,
}: {
  riskLevel: RiskLevel;
  confidenceScore: number;
  source: 'gemini' | 'heuristic';
  extraMetricLabel?: string;
  extraMetricValue?: string;
}) {
  const config: Record<
    RiskLevel,
    { label: string; colorClass: string; Icon: React.ComponentType<{ className?: string }> }
  > = {
    Low: {
      label: 'Low Potential Risk',
      colorClass: 'text-emerald-700 dark:text-emerald-400',
      Icon: CheckCircle2,
    },
    Medium: {
      label: 'Medium Potential Risk',
      colorClass: 'text-amber-700 dark:text-amber-400',
      Icon: AlertTriangle,
    },
    High: {
      label: 'High Potential Risk',
      colorClass: 'text-red-700 dark:text-red-400',
      Icon: AlertCircle,
    },
  };

  const { label, colorClass, Icon } = config[riskLevel];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2.5">
        <Icon className={`h-5 w-5 ${colorClass}`} aria-hidden="true" />
        <span className={`text-base font-semibold font-display ${colorClass}`}>
          {label}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 tabular-nums">
        {extraMetricLabel && extraMetricValue && (
          <>
            <span>
              {extraMetricLabel}:{' '}
              <strong className="font-semibold text-slate-900 dark:text-slate-100">
                {extraMetricValue}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
          </>
        )}
        <span>
          Assessment confidence:{' '}
          <strong className="font-semibold text-slate-900 dark:text-slate-100">
            {confidenceScore}%
          </strong>
        </span>
        <span aria-hidden="true">·</span>
        <span>{source === 'gemini' ? 'Gemini AI analysis' : 'Local pattern check'}</span>
      </div>
    </div>
  );
}
