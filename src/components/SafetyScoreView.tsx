import React from 'react';
import { Award, Download } from 'lucide-react';
import { exportSafetyScorePdf } from '../lib/pdfExport';
import type {
  AnalysisHistoryItem,
  AppSection,
  SafetyScoreBreakdown,
  UserProgressState,
} from '../types/safety';
import { Button, Card } from './ui/Primitives';

interface SafetyScoreViewProps {
  safetyScore: SafetyScoreBreakdown;
  progress: UserProgressState;
  history: AnalysisHistoryItem[];
  onNavigate: (section: AppSection) => void;
}

export function SafetyScoreView({
  safetyScore,
  progress,
  history,
  onNavigate,
}: SafetyScoreViewProps) {
  const categories = [
    {
      label: 'Digital Awareness',
      value: safetyScore.digitalAwareness,
      description: 'Built from using analyzers and inspecting unfamiliar messages, URLs, and QRs.',
    },
    {
      label: 'Privacy Protection',
      value: safetyScore.privacyProtection,
      description: 'Reflects Permission Translator usage and password/MFA/privacy lessons.',
    },
    {
      label: 'Scam Resistance',
      value: safetyScore.scamResistance,
      description: 'Driven by Safety Academy quiz accuracy and real-world scam pattern checks.',
    },
    {
      label: 'Preparedness',
      value: safetyScore.preparedness,
      description: 'Grows as you review Daily Life Safety Advisor and emergency checklists.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Personal Safety Score
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Calculated locally from your completed lessons, quiz results, guides read, and analyses performed.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => exportSafetyScorePdf(safetyScore, history)}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span>Export PDF Report</span>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
              <Award className="h-4 w-4" aria-hidden="true" />
              <span>Overall Readiness</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2 tabular-nums">
              <span className="font-display text-5xl font-bold text-slate-900 dark:text-white">
                {safetyScore.overall}
              </span>
              <span className="text-lg text-slate-500 dark:text-slate-400">/ 100</span>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              This score tracks your active safety habits inside this browser—not a judgment, just a helpful guide for what to explore next.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-3 text-xs tabular-nums">
            <div>
              <p className="text-slate-500 dark:text-slate-400">Lessons</p>
              <p className="mt-0.5 font-semibold text-slate-900 dark:text-white">
                {progress.completedLessonIds.length} / 8
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Guides Read</p>
              <p className="mt-0.5 font-semibold text-slate-900 dark:text-white">
                {progress.advisorTopicsRead.length} / 22
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Checks Run</p>
              <p className="mt-0.5 font-semibold text-slate-900 dark:text-white">
                {history.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-7 p-6 space-y-5">
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            Category Breakdown
          </h2>

          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm tabular-nums">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {cat.label}
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {cat.value} / 100
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${cat.value}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
          Suggestions for Improvement
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          {safetyScore.suggestions.map((tip, i) => (
            <li key={i}>
              {i + 1}. {tip}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="primary" size="sm" onClick={() => onNavigate('academy')}>
            Go to Safety Academy
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('advisor')}>
            Open Daily Safety Advisor
          </Button>
        </div>
      </Card>
    </div>
  );
}
