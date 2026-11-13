import React from 'react';
import { AlertCircle, CheckCircle2, Database, EyeOff, Scale, ShieldCheck } from 'lucide-react';
import { Card } from './ui/Primitives';

export function TrustTransparencyView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Trust & Responsible AI
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
          Safety tools earn trust by being honest about what they can verify, what they cannot verify, and how your privacy is protected.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-display text-base font-semibold">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            <span>What AI Can Do</span>
          </div>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <li>• Identify common manipulation patterns such as artificial urgency, fear tactics, and fee-first lures.</li>
            <li>• Spot structural domain tricks like typosquatting lookalikes, missing HTTPS, or misleading subdomains.</li>
            <li>• Translate dense mobile permission prompts into plain English and child-friendly explanations.</li>
            <li>• Teach practical verification steps before you click, reply, or share codes.</li>
          </ul>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-display text-base font-semibold">
            <AlertCircle className="h-5 w-5" aria-hidden="true" />
            <span>What AI Cannot Do</span>
          </div>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <li>• Cannot verify real-world sender identity, phone carrier caller ID, or live email DKIM/SPF headers.</li>
            <li>• Cannot visit or inspect live external websites behind shortened links or login walls.</li>
            <li>• Cannot guarantee a message or link is 100% safe just because it looks polite or well-written.</li>
            <li>• Cannot replace official emergency dispatchers, banks, or law enforcement during active incidents.</li>
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 space-y-2.5">
          <div className="flex items-center gap-2 font-display text-sm font-semibold text-slate-900 dark:text-white">
            <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>No Database Storage</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            SafeLens AI uses zero external databases (no Firebase, SQL, or user accounts). Your check history, quiz scores, and Safety Score remain strictly in your browser’s localStorage.
          </p>
        </Card>

        <Card className="p-6 space-y-2.5">
          <div className="flex items-center gap-2 font-display text-sm font-semibold text-slate-900 dark:text-white">
            <EyeOff className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>Privacy Promise</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            QR code images are decoded locally inside your browser canvas. Messages or permission screenshots sent for AI explanation are never saved or profiled by SafeLens AI.
          </p>
        </Card>

        <Card className="p-6 space-y-2.5">
          <div className="flex items-center gap-2 font-display text-sm font-semibold text-slate-900 dark:text-white">
            <Scale className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>Model Limitations</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Both AI models and pattern heuristics can produce false positives on urgent legitimate alerts or miss brand-new social engineering stories. Independent verification is always recommended.
          </p>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 font-display text-base font-semibold text-slate-900 dark:text-white">
          <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span>Why We Never Claim Certainty (Uncertainty Language Guide)</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Fear-based banners cause alert fatigue. Instead of declaring absolute verdicts, SafeLens AI uses transparent, calibrated phrases alongside a confidence estimate:
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          {[
            {
              term: 'Potential Risk',
              meaning: 'Multiple warning signs match known scam or lookalike tactics.',
            },
            {
              term: 'Possible Concern',
              meaning: 'One or more cues warrant verifying through an official channel first.',
            },
            {
              term: 'Cannot Verify',
              meaning: 'Context such as sender ownership or shortened link target is unavailable.',
            },
            {
              term: 'May Indicate',
              meaning: 'Language patterns suggest urgency or impersonation without proving intent.',
            },
          ].map((item) => (
            <div
              key={item.term}
              className="rounded-lg border border-slate-200 dark:border-slate-800 p-3.5"
            >
              <p className="font-semibold text-slate-900 dark:text-white">{item.term}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.meaning}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
