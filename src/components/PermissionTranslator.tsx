import React, { useRef, useState } from 'react';
import { Download, Loader2, Smartphone, Upload } from 'lucide-react';
import { generateSamplePermissionScreenshotDataUrl } from '../data/sampleInputs';
import { exportAnalysisPdf } from '../lib/pdfExport';
import type {
  AnalysisHistoryItem,
  PermissionAnalysisResult,
} from '../types/safety';
import { BeforeYouClickPanel } from './BeforeYouClickPanel';
import { RiskSignalHeader } from './RiskSignalHeader';
import { Button, Card, Input } from './ui/Primitives';

interface PermissionTranslatorProps {
  onRecordHistory: (item: Omit<AnalysisHistoryItem, 'id' | 'timestamp'>) => void;
}

export function PermissionTranslator({
  onRecordHistory,
}: PermissionTranslatorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/png');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PermissionAnalysisResult | null>(null);

  async function runTranslation(payload: {
    imageBase64?: string;
    mimeType?: string;
    note?: string;
  }) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not translate app permissions.');
      }
      setResult(data as PermissionAnalysisResult);
      onRecordHistory({
        module: 'permissions',
        title: `Permissions: ${data.appContext.slice(0, 40)}`,
        riskLevel: data.overallRisk,
        summary: `${data.permissions.length} permissions explained`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to analyze screenshot.');
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageMime(file.type || 'image/png');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
        runTranslation({
          imageBase64: reader.result,
          mimeType: file.type || 'image/png',
          note,
        });
      }
    };
    reader.readAsDataURL(file);
  }

  function handleLoadSample() {
    const sampleUrl = generateSamplePermissionScreenshotDataUrl();
    setImagePreview(sampleUrl);
    setImageMime('image/png');
    setNote('QuickTorch Flashlight app asking for Camera, Contacts, Precise Location, Notifications');
    runTranslation({
      imageBase64: sampleUrl,
      mimeType: 'image/png',
      note: 'QuickTorch Flashlight app asking for Camera, Contacts, Precise Location, Notifications',
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Permission Translator
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Upload an app permission prompt screenshot to translate technical mobile permissions into plain English and child-friendly language.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid gap-6 md:grid-cols-12 items-start">
          <div className="md:col-span-7 space-y-4">
            <div>
              <label
                htmlFor="permission-note-input"
                className="text-sm font-medium text-slate-900 dark:text-slate-100"
              >
                App name or requested permissions (optional alongside screenshot)
              </label>
              <Input
                id="permission-note-input"
                className="mt-1.5"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Flashlight app asking for Camera, Contacts, Location"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
                aria-label="Upload app permission screenshot"
              />
              <Button
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    <span>Upload Screenshot</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  runTranslation({
                    imageBase64: imagePreview || undefined,
                    mimeType: imageMime,
                    note: note || 'Mobile app permission review',
                  })
                }
                disabled={loading}
              >
                <Smartphone className="h-4 w-4" aria-hidden="true" />
                <span>Analyze Text Note</span>
              </Button>

              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Load Sample Prompt Screenshot
              </button>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          <div className="md:col-span-5">
            {imagePreview ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-950 p-2">
                <img
                  src={imagePreview}
                  alt="App permission prompt screenshot preview"
                  className="w-full max-h-56 object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                Uploaded permission screenshot preview will appear here.
              </div>
            )}
          </div>
        </div>
      </Card>

      {result && (
        <Card className="p-6 space-y-6">
          <RiskSignalHeader
            riskLevel={result.overallRisk}
            confidenceScore={result.confidenceScore}
            source={result.source}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {result.appContext}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportAnalysisPdf('Permission Translator Report', result.appContext, [
                  ...result.permissions.map((perm) => ({
                    heading: `${perm.permissionName} (${perm.riskLevel} Risk)`,
                    lines: [
                      `Plain English: ${perm.plainEnglish}`,
                      `Child Friendly: ${perm.childFriendly}`,
                      `Why Apps Ask: ${perm.whyAppsAsk}`,
                    ],
                  })),
                  { heading: 'Recommendations', lines: result.recommendations },
                ])
              }
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Export Report PDF</span>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {result.permissions.map((perm, idx) => (
              <div
                key={`${perm.permissionName}-${idx}`}
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                    {perm.permissionName}
                  </h2>
                  <span
                    className={`text-xs font-semibold ${
                      perm.riskLevel === 'High'
                        ? 'text-red-600 dark:text-red-400'
                        : perm.riskLevel === 'Medium'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {perm.riskLevel} Risk
                  </span>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Plain English
                  </p>
                  <p className="mt-0.5 text-sm text-slate-900 dark:text-slate-100">
                    “{perm.plainEnglish}”
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Child Friendly Version
                  </p>
                  <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-300">
                    {perm.childFriendly}
                  </p>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {perm.whyAppsAsk}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Safer Permission Habits
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              {result.recommendations.map((rec, i) => (
                <li key={i}>
                  {i + 1}. {rec}
                </li>
              ))}
            </ul>
          </div>

          <BeforeYouClickPanel data={result.beforeYouClick} />
        </Card>
      )}
    </div>
  );
}
