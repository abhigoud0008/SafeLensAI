import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Compass,
  Download,
  Lightbulb,
  Link2,
  MessageSquareWarning,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SAFETY_TIPS_OF_THE_DAY } from '../data/sampleInputs';
import { exportSafetyScorePdf } from '../lib/pdfExport';
import type {
  AnalysisHistoryItem,
  AppSection,
  SafetyScoreBreakdown,
  UserProgressState,
} from '../types/safety';
import { Button, Card } from './ui/Primitives';

interface DashboardOverviewProps {
  onNavigate: (section: AppSection) => void;
  history: AnalysisHistoryItem[];
  onClearHistory: () => void;
  safetyScore: SafetyScoreBreakdown;
  progress: UserProgressState;
  heatmap: Array<{
    module: string;
    label: string;
    low: number;
    medium: number;
    high: number;
    total: number;
  }>;
}

export function DashboardOverview({
  onNavigate,
  history,
  onClearHistory,
  safetyScore,
  progress,
  heatmap,
}: DashboardOverviewProps) {
  const [tipIndex, setTipIndex] = useState(0);

  const moduleCards: Array<{
    id: AppSection;
    title: string;
    description: string;
    metric: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'message',
      title: 'Message Analyzer',
      description: 'Detect urgency, OTP requests, and hidden links in SMS, WhatsApp, or emails.',
      metric: 'Includes Explain Like I’m 10',
      icon: MessageSquareWarning,
    },
    {
      id: 'qr',
      title: 'QR Scanner',
      description: 'Decode QR images locally and preview destinations safely without auto-launching.',
      metric: 'Safe Preview protection',
      icon: QrCode,
    },
    {
      id: 'url',
      title: 'URL Safety Checker',
      description: 'Check HTTPS, suspicious keywords, and lookalike typosquatting domains.',
      metric: '0–100 Trust Score',
      icon: Link2,
    },
    {
      id: 'permissions',
      title: 'Permission Translator',
      description: 'Turn mobile app permission screenshots into plain English and child-friendly tips.',
      metric: 'Multimodal image check',
      icon: Smartphone,
    },
    {
      id: 'advisor',
      title: 'Daily Safety Advisor',
      description: '22 guides across Digital, Physical, Family, and Emergency Preparedness.',
      metric: `${progress.advisorTopicsRead.length} of 22 guides read`,
      icon: Compass,
    },
    {
      id: 'academy',
      title: 'Safety Academy',
      description: 'Interactive lessons and quick quizzes on MFA, phishing, and privacy.',
      metric: `${progress.completedLessonIds.length} of 8 lessons completed`,
      icon: BookOpen,
    },
    {
      id: 'score',
      title: 'Safety Score',
      description: 'Track your Digital Awareness, Privacy, Scam Resistance, and Preparedness.',
      metric: `Current score: ${safetyScore.overall} / 100`,
      icon: Award,
    },
    {
      id: 'trust',
      title: 'Trust & Responsible AI',
      description: 'See what AI can and cannot verify, model limits, and our zero-storage privacy promise.',
      metric: 'Local-only privacy',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome & Tip of the Day */}
      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8 p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Personal Safety Workspace
            </p>
            <h1 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back to SafeLens AI
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Check suspicious messages, links, QR codes, or app permissions before taking action. Everything stays privately in your browser’s local storage.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => onNavigate('message')}>
              Analyze a Message
            </Button>
            <Button variant="outline" onClick={() => onNavigate('advisor')}>
              Browse Safety Advisor
            </Button>
            <Button
              variant="outline"
              onClick={() => exportSafetyScorePdf(safetyScore, history)}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Export PDF Summary</span>
            </Button>
          </div>
        </Card>

        <Card className="lg:col-span-4 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-400">
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                <span>Safety Tip of the Day</span>
              </span>
              <button
                type="button"
                onClick={() => setTipIndex((i) => (i + 1) % SAFETY_TIPS_OF_THE_DAY.length)}
                aria-label="Show next safety tip"
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Next</span>
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {SAFETY_TIPS_OF_THE_DAY[tipIndex]}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            <span>Personal Safety Score</span>
            <button
              type="button"
              onClick={() => onNavigate('score')}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {safetyScore.overall} / 100 →
            </button>
          </div>
        </Card>
      </div>

      {/* 7 Module Cards */}
      <section aria-labelledby="modules-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="modules-heading"
            className="font-display text-lg font-semibold text-slate-900 dark:text-white"
          >
            Safety Tools & Learning Modules
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {moduleCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <Card className="p-5 h-full flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-800 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <card.icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {card.metric}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-slate-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onNavigate(card.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
                  >
                    <span>Open {card.title}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Risk Heatmap & Recent Local History */}
      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5 p-6">
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            Local Risk Heatmap
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Distribution of risk signals observed across your local checks.
          </p>

          <div className="mt-5 space-y-3">
            {heatmap.map((row) => (
              <div
                key={row.module}
                className="grid grid-cols-12 items-center gap-3 text-xs tabular-nums"
              >
                <span className="col-span-4 font-medium text-slate-700 dark:text-slate-300 truncate">
                  {row.label}
                </span>
                <div className="col-span-8 grid grid-cols-3 gap-1.5">
                  <div
                    className={`rounded-md px-2 py-1.5 text-center border ${
                      row.low > 0
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-medium'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    Low: {row.low}
                  </div>
                  <div
                    className={`rounded-md px-2 py-1.5 text-center border ${
                      row.medium > 0
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 font-medium'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    Med: {row.medium}
                  </div>
                  <div
                    className={`rounded-md px-2 py-1.5 text-center border ${
                      row.high > 0
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 font-medium'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    High: {row.high}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-7 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                Recent Checks (Browser LocalStorage)
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Stored only on this device. Clear anytime.
              </p>
            </div>
            {history.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearHistory}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Clear History</span>
              </Button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                No checks recorded yet. Analyze a message, URL, QR code, or permission screenshot to see your history here.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => onNavigate('message')}
              >
                Run Your First Check
              </Button>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto">
              {history.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex flex-wrap items-center justify-between gap-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {item.module.toUpperCase()} · {item.summary}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium tabular-nums shrink-0 ${
                      item.riskLevel === 'High'
                        ? 'text-red-600 dark:text-red-400'
                        : item.riskLevel === 'Medium'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {item.riskLevel} Risk
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
