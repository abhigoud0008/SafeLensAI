import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import type { BeforeYouClickData } from '../types/safety';
import { Button } from './ui/Primitives';

interface BeforeYouClickPanelProps {
  data: BeforeYouClickData;
}

export function BeforeYouClickPanel({ data }: BeforeYouClickPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Before You Click
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="border-amber-300 dark:border-amber-800/80"
        >
          <span>What could go wrong if I ignore this warning?</span>
          {open ? (
            <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </Button>
      </div>

      {open && (
        <div className="mt-4 pt-4 border-t border-amber-200/80 dark:border-amber-900/50 grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Scenario
            </p>
            <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
              {data.scenario}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Possible consequence
            </p>
            <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
              {data.possibleConsequence}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Warning sign
            </p>
            <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
              {data.warningSign}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Safer alternative</span>
            </p>
            <p className="mt-1 text-slate-800 dark:text-slate-200 leading-relaxed">
              {data.saferAlternative}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
