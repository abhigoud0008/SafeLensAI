import React, { useRef, useState } from 'react';
import jsQR from 'jsqr';
import {
  Download,
  Eye,
  Loader2,
  QrCode,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';
import { exportAnalysisPdf } from '../lib/pdfExport';
import { renderQrToDataUrl } from '../lib/qrEncoder';
import type { AnalysisHistoryItem, QrAnalysisResult } from '../types/safety';
import { BeforeYouClickPanel } from './BeforeYouClickPanel';
import { RiskSignalHeader } from './RiskSignalHeader';
import { Button, Card } from './ui/Primitives';

interface QrScannerProps {
  onRecordHistory: (item: Omit<AnalysisHistoryItem, 'id' | 'timestamp'>) => void;
}

export function QrScanner({ onRecordHistory }: QrScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [explainLike10, setExplainLike10] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QrAnalysisResult | null>(null);

  async function decodeAndAnalyzeImage(dataUrl: string) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Could not load the selected image file.'));
        img.src = dataUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas rendering is unavailable in this browser.');

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const decoded = jsQR(imageData.data, imageData.width, imageData.height);

      if (!decoded || !decoded.data) {
        throw new Error(
          'No QR code could be read from this image. Try a clearer, higher-contrast image or crop closer to the QR square.'
        );
      }

      const response = await fetch('/api/analyze/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decodedContent: decoded.data }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not evaluate QR destination.');
      }

      setResult(data as QrAnalysisResult);
      onRecordHistory({
        module: 'qr',
        title: `QR (${data.contentType.toUpperCase()}): ${decoded.data.slice(0, 42)}`,
        riskLevel: data.riskLevel,
        summary: data.safePreviewSummary,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to scan QR code.');
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewSrc(reader.result);
        decodeAndAnalyzeImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleLoadSampleQr(payload: string) {
    const dataUrl = renderQrToDataUrl(payload);
    setPreviewSrc(dataUrl);
    decodeAndAnalyzeImage(dataUrl);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          QR Code Safety Scanner
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Upload a QR code image to inspect its destination in a Safe Preview—SafeLens AI never launches links or payments automatically.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Upload a QR code photo or screenshot
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your image is decoded directly inside your browser using jsQR before the destination text is inspected.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
                aria-label="Upload QR code image"
              />
              <Button
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Scanning QR...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    <span>Upload QR Image</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLoadSampleQr('https://amaz0n-login.com/claim')}
              >
                Sample: Lookalike Link QR
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleLoadSampleQr('upi://pay?pa=refunddesk@okaxis&pn=PrizeClaim&am=2500')
                }
              >
                Sample: UPI Payment QR
              </Button>
            </div>
          </div>

          {previewSrc && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white p-3 shrink-0">
              <img
                src={previewSrc}
                alt="Uploaded QR code preview"
                className="h-28 w-28 object-contain"
              />
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </Card>

      {result && (
        <Card className="p-6 space-y-6">
          <RiskSignalHeader
            riskLevel={result.riskLevel}
            confidenceScore={result.confidenceScore}
            source={result.source}
            extraMetricLabel="Content Type"
            extraMetricValue={result.contentType.toUpperCase()}
          />

          {/* Safe Preview Box */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <span>Safe Preview (Auto-Launch Disabled)</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Held safely for inspection</span>
              </span>
            </div>

            <p className="font-mono text-xs sm:text-sm break-all text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
              {result.decodedContent}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {result.safePreviewSummary}
            </p>
          </div>

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
                exportAnalysisPdf('QR Code Safety Report', result.contentType.toUpperCase(), [
                  {
                    heading: 'Decoded Destination (Safe Preview)',
                    lines: [result.decodedContent, result.safePreviewSummary],
                  },
                  { heading: 'Potential Risks', lines: result.potentialRisks },
                  {
                    heading: 'Safety Recommendations',
                    lines: result.safetyRecommendations,
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
              <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <span>Potential Risks</span>
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {result.potentialRisks.map((risk, idx) => (
                  <li key={idx}>• {risk}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Safety Recommendations
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {result.safetyRecommendations.map((rec, idx) => (
                  <li key={idx}>
                    {idx + 1}. {rec}
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
