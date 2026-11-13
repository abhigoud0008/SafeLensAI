import React, { useState } from 'react';
import { Download, Loader2, MessageSquareWarning, Sparkles } from 'lucide-react';
import { SAMPLE_MESSAGES } from '../data/sampleInputs';
import { exportAnalysisPdf } from '../lib/pdfExport';
import type {
  AnalysisHistoryItem,
  MessageAnalysisResult,
  MessageChannel,
} from '../types/safety';
import { BeforeYouClickPanel } from './BeforeYouClickPanel';
import { RiskSignalHeader } from './RiskSignalHeader';
import { Button, Card, SegmentedTabs, Textarea } from './ui/Primitives';

interface MessageAnalyzerProps {
  onRecordHistory: (item: Omit<AnalysisHistoryItem, 'id' | 'timestamp'>) => void;
}

export function MessageAnalyzer({ onRecordHistory }: MessageAnalyzerProps) {
  const [channel, setChannel] = useState<MessageChannel>('whatsapp');
  const [messageText, setMessageText] = useState('');
  const [explainLike10, setExplainLike10] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MessageAnalysisResult | null>(null);

  async function handleAnalyze(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    if (!messageText.trim()) {
      setError('Please paste an SMS, WhatsApp message, or email first.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/analyze/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, channel }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not analyze this message.');
      }
      setResult(data as MessageAnalysisResult);
      onRecordHistory({
        module: 'message',
        title: `${channel.toUpperCase()} check: ${messageText.trim().slice(0, 46)}${messageText.length > 46 ? '...' : ''}`,
        riskLevel: data.riskLevel,
        summary: (data.riskIndicators || []).slice(0, 2).join(', '),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while analyzing.');
    } finally {
      setLoading(false);
    }
  }

  function loadSample(sampleId: string) {
    const sample = SAMPLE_MESSAGES.find((s) => s.id === sampleId);
    if (!sample) return;
    setChannel(sample.channel);
    setMessageText(sample.text);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Message Analyzer
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Paste an SMS, WhatsApp message, or email to understand potential manipulation tactics and safer next steps.
          </p>
        </div>

        <SegmentedTabs
          ariaLabel="Message channel"
          value={channel}
          onChange={setChannel}
          options={[
            { value: 'sms', label: 'SMS' },
            { value: 'whatsapp', label: 'WhatsApp' },
            { value: 'email', label: 'Email' },
          ]}
        />
      </div>

      <Card className="p-6">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="message-input"
              className="text-sm font-medium text-slate-900 dark:text-slate-100"
            >
              Suspicious or unfamiliar message text
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Try sample:
              </span>
              {SAMPLE_MESSAGES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => loadSample(sample.id)}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            id="message-input"
            rows={5}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Paste the SMS, WhatsApp message, or email content here..."
          />

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              SafeLens AI explains warning signs calmly and does not store your messages on external servers.
            </p>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <MessageSquareWarning className="h-4 w-4" aria-hidden="true" />
                  <span>Analyze Message</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {result && (
        <Card className="p-6 space-y-6">
          <RiskSignalHeader
            riskLevel={result.riskLevel}
            confidenceScore={result.confidenceScore}
            source={result.source}
          />

          {/* Mode Toggle + Export */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={explainLike10}
              onClick={() => setExplainLike10((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                explainLike10
                  ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Explain Like I’m 10 Mode: {explainLike10 ? 'On' : 'Off'}</span>
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportAnalysisPdf('Message Analyzer Report', `${channel.toUpperCase()} Assessment`, [
                  {
                    heading: 'Assessment Summary',
                    lines: [
                      `Risk Level: ${result.riskLevel} Potential Risk`,
                      `Confidence Score: ${result.confidenceScore}%`,
                      `Uncertainty Note: ${result.uncertaintyNote}`,
                    ],
                  },
                  {
                    heading: 'Risk Indicators Observed',
                    lines: result.riskIndicators,
                  },
                  {
                    heading: 'Reasons Explained',
                    lines: result.reasons,
                  },
                  {
                    heading: 'Safer Action Steps',
                    lines: result.saferAction,
                  },
                  {
                    heading: 'Simple Explanation (Explain Like I’m 10)',
                    lines: [result.explainLikeIm10],
                  },
                ])
              }
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Export Report PDF</span>
            </Button>
          </div>

          {explainLike10 && (
            <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/25 p-4">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                Simple Explanation (Explain Like I’m 10)
              </p>
              <p className="mt-1.5 text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed">
                {result.explainLikeIm10}
              </p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                Why This May Be Risky
              </h2>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                {result.reasons.map((reason, idx) => (
                  <li key={idx} className="leading-relaxed">
                    • {reason}
                  </li>
                ))}
              </ul>

              <h3 className="mt-5 font-display text-sm font-semibold text-slate-900 dark:text-white">
                Risk Indicators Spotted
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {result.riskIndicators.join(' · ')}
              </p>
            </div>

            <div>
              <h2 className="font-display text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Safer Action Steps
              </h2>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                {result.saferAction.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {idx + 1}. {step}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {result.uncertaintyNote}
              </p>
            </div>
          </div>

          <BeforeYouClickPanel data={result.beforeYouClick} />
        </Card>
      )}
    </div>
  );
}
