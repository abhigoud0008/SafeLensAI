import { jsPDF } from 'jspdf';
import type {
  AnalysisHistoryItem,
  SafetyScoreBreakdown,
} from '../types/safety';

export interface PdfReportSection {
  heading: string;
  lines: string[];
}

export function exportAnalysisPdf(
  title: string,
  subtitle: string,
  sections: PdfReportSection[]
): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;
  let y = 56;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('SafeLens AI — Safety Explanation Report', margin, y);
  y += 22;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(`${title} · ${subtitle}`, margin, y);
  y += 16;

  doc.setFontSize(9);
  doc.text(`Generated locally on ${new Date().toLocaleString()} · Privacy-first (no cloud storage)`, margin, y);
  y += 18;

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 24;

  for (const section of sections) {
    if (y > 740) {
      doc.addPage();
      y = 56;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text(section.heading, margin, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);

    for (const rawLine of section.lines) {
      const wrapped = doc.splitTextToSize(rawLine, maxWidth);
      for (const line of wrapped) {
        if (y > 760) {
          doc.addPage();
          y = 56;
        }
        doc.text(line, margin, y);
        y += 15;
      }
      y += 4;
    }

    y += 10;
  }

  doc.save(`safelens-report-${Date.now()}.pdf`);
}

export function exportSafetyScorePdf(
  score: SafetyScoreBreakdown,
  recentHistory: AnalysisHistoryItem[]
): void {
  const sections: PdfReportSection[] = [
    {
      heading: 'Personal Safety Score Summary',
      lines: [
        `Overall Safety Score: ${score.overall} / 100`,
        `Digital Awareness: ${score.digitalAwareness} / 100`,
        `Privacy Protection: ${score.privacyProtection} / 100`,
        `Scam Resistance: ${score.scamResistance} / 100`,
        `Preparedness: ${score.preparedness} / 100`,
      ],
    },
    {
      heading: 'Recommended Next Steps',
      lines: score.suggestions.map((s, idx) => `${idx + 1}. ${s}`),
    },
    {
      heading: 'Recent Local Checks',
      lines:
        recentHistory.length > 0
          ? recentHistory.slice(0, 8).map(
              (item) =>
                `[${item.riskLevel} Risk] ${item.module.toUpperCase()} — ${item.title}: ${item.summary}`
            )
          : ['No analysis checks recorded yet in this browser.'],
    },
    {
      heading: 'Responsible AI Transparency Note',
      lines: [
        'SafeLens AI assesses patterns and structural cues rather than claiming absolute certainty.',
        'All scores and history are stored exclusively in your browser localStorage.',
      ],
    },
  ];

  exportAnalysisPdf('Personal Safety Score', 'Summary & Action Plan', sections);
}
