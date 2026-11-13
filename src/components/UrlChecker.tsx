import React, { useState } from 'react';
import { CheckCircle2, Download, Link2, Loader2, ShieldAlert, Sparkles } from 'lucide-react';
import { SAMPLE_URLS } from '../data/sampleInputs';
import { exportAnalysisPdf } from '../lib/pdfExport';
import type { AnalysisHistoryItem, UrlAnalysisResult } from '../types/safety';
import { BeforeYouClickPanel } from './BeforeYouClickPanel';
import { RiskSignalHeader } from './RiskSignalHeader';
import { Button, Card, Input } from './ui/Primitives';

interface UrlCheckerProps {
  onRecordHistory: (item: Omit<AnalysisHistoryItem, 'id' | 'timestamp'>) => void;
}

export function UrlChecker({ onRecordHistory }: UrlCheckerProps) {
  const [urlInput, setUrlInput] = useState('');
  const [explainLike10, setExplainLike10] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);

  async function handleCheck(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    if (!urlInput.trim()) {
      setError('Please enter a website URL or domain name to inspect.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/analyze/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not analyze this URL.');
      }
      setResult(data as UrlAnalysisResult);
      onRecordHistory({
        module: 'url',
        title: data.hostname || urlInput.trim(),
        riskLevel: data.riskLevel,
        summary: `Trust Score ${data.trustScore}/100`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to evaluate URL.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          URL Safety Checker
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Inspect HTTPS encryption, suspicious keywords, typosquatting lookalikes, and URL structure before opening a link.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleCheck} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="url-checker-input"
              className="text-sm font-medium text-slate-900 dark:text-slate-100"
            >
              Website URL or domain
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Try sample:
              </span>
              {SAMPLE_URLS.map((item) => (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => {
                    setUrlInput(item.url);
                    setError(null);
                  }}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              id="url-checker-input"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. amaz0n-login.com or https://paypal.security-check.com"
              className="font-mono text-sm"
            />
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" aria-hidden="true" />
                  <span>Check URL</span>
                </>
              )}
            </Button>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </form>
      </Card>

      {result && (
        <Card className="p-6 space-y-6">
          <RiskSignalHeader
            riskLevel={result.riskLevel}
            confidenceScore={result.confidenceScore}
            source={result.source}
            extraMetricLabel="Trust Score"
            extraMetricValue={`${result.trustScore} / 100`}
          />

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
                exportAnalysisPdf('URL Safety Report', result.hostname, [
                  {
                    heading: 'Summary',
                    lines: [
                      result.summary,
                      `Trust Score: ${result.trustScore} / 100`,
                      `HTTPS Enabled: ${result.breakdown.httpsEnabled ? 'Yes' : 'No'}`,
                      `Typosquatting Target: ${result.breakdown.typosquattingTarget ?? 'None detected'}`,
                    ],
                  },
                  { heading: 'Risk Explanation', lines: result.reasons },
                  { heading: 'Safety Tips', lines: result.safetyTips },
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

          {/* Structural Check Matrix */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">HTTPS Encryption</p>
              <p className="mt-1 font-medium flex items-center gap-1.5">
                {result.breakdown.httpsEnabled ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    <span>HTTPS Present</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-4 w-4 text-red-600" aria-hidden="true" />
                    <span>Missing HTTPS</span>
                  </>
                )}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Typosquatting Check</p>
              <p className="mt-1 font-medium">
                {result.breakdown.typosquattingTarget
                  ? `Similar to ${result.breakdown.typosquattingTarget}`
                  : 'No imitation detected'}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Suspicious Keywords</p>
              <p className="mt-1 font-medium">
                {result.breakdown.suspiciousKeywords.length > 0
                  ? result.breakdown.suspiciousKeywords.join(', ')
                  : 'None spotted'}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Analyzed Hostname</p>
              <p className="mt-1 font-mono text-xs break-all text-slate-900 dark:text-slate-100">
                {result.hostname}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                Risk Explanation
              </h2>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {result.summary}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {result.reasons.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Safety Tips
              </h2>
              <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {result.safetyTips.map((tip, i) => (
                  <li key={i}>
                    {i + 1}. {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <BeforeYouClickPanel data={result.beforeYouClick} />
        </Card>
      )}
    </div>
  );
}
