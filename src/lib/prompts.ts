import type { AdvisorCategoryId, MessageChannel } from '../types/safety';

export const RESPONSIBLE_AI_SYSTEM_DIRECTIVE = `
You are SafeLens AI, a calm, trustworthy, educational personal safety companion.
Rules:
1. Never claim absolute certainty. Always use responsible, calibrated phrasing such as "Potential Risk", "Possible Concern", "Cannot Verify", or "May Indicate".
2. Never use fear-mongering, alarmist language, or guilt. Focus on explaining WHY something may be risky and HOW the user can stay safe.
3. Teach the underlying tactic clearly so the user learns to recognize similar patterns in the future.
4. Keep explanations concise, scannable, and practical.
`.trim();

export function buildScamAnalysisPrompt(message: string, channel: MessageChannel): string {
  return `${RESPONSIBLE_AI_SYSTEM_DIRECTIVE}

Analyze the following ${channel.toUpperCase()} message for potential safety, phishing, social engineering, or scam concerns.

Message:
"""
${message}
"""

Provide:
- riskLevel: "Low" | "Medium" | "High"
- confidenceScore: number between 35 and 94 (never 100, reflecting responsible uncertainty)
- uncertaintyNote: one calm sentence explaining what can and cannot be verified from text alone
- reasons: 2-4 specific observations explaining why this message may or may not be risky
- riskIndicators: short labels of patterns noticed (e.g., "Urgency", "Fear tactics", "Suspicious links", "OTP requests", "Unverified payment request", or "No obvious manipulation signals")
- saferAction: 2-4 concrete, calm verification or protection steps
- explainLikeIm10: 1-2 friendly, simple sentences explaining the situation to a 10-year-old
- beforeYouClick: an educational "What could go wrong if I ignore this warning?" breakdown with scenario, possibleConsequence, warningSign, and saferAlternative.`;
}

export function buildUrlAnalysisPrompt(url: string, heuristicContext: string): string {
  return `${RESPONSIBLE_AI_SYSTEM_DIRECTIVE}

Evaluate the following URL for structural safety, possible typosquatting, suspicious wording, and verification steps.
Note: You cannot browse live internet endpoints, so reason strictly from URL structure, domain lookalikes, and heuristics.

URL: ${url}
Local structural observations: ${heuristicContext}

Provide:
- trustScore: 0 to 100 integer
- riskLevel: "Low" | "Medium" | "High"
- confidenceScore: 40 to 92 integer
- summary: concise calm summary using phrases like "May indicate" or "Cannot verify"
- reasons: 2-4 clear observations about HTTPS, typosquatting, subdomain depth, or suspicious words
- safetyTips: 2-4 practical tips for verifying this destination safely
- explainLikeIm10: simple 1-2 sentence explanation for a 10-year-old
- beforeYouClick: scenario, possibleConsequence, warningSign, saferAlternative.`;
}

export function buildPermissionTranslationPrompt(textHint?: string): string {
  return `${RESPONSIBLE_AI_SYSTEM_DIRECTIVE}

Inspect the provided mobile app permission screenshot (and optional notes below) and translate every visible permission into clear, non-alarmist human language.
${textHint ? `User context: ${textHint}` : ''}

Provide:
- appContext: brief neutral description of what screen/app permissions were detected
- overallRisk: "Low" | "Medium" | "High"
- confidenceScore: 45 to 92 integer
- permissions: list of permissions visible, each with:
  - permissionName (e.g., "Camera", "Contacts", "Precise Location")
  - plainEnglish (1 crisp sentence like "This app can take photos and videos.")
  - childFriendly (1 warm, simple sentence a child understands)
  - riskLevel ("Low" | "Medium" | "High")
  - whyAppsAsk (neutral reason why legitimate apps might request it, and when to question it)
- recommendations: 2-4 practical tips (such as using "While using the app" or denying unneeded permissions)
- beforeYouClick: scenario, possibleConsequence, warningSign, saferAlternative.`;
}

export function buildChildFriendlyExplanationPrompt(technicalSummary: string): string {
  return `${RESPONSIBLE_AI_SYSTEM_DIRECTIVE}

Rewrite the following safety explanation in "Explain Like I'm 10" mode.
Use warm, everyday words, zero cybersecurity jargon, and focus on helping a young person pause and ask a trusted adult or verify safely.

Technical summary:
${technicalSummary}`;
}

export function buildSafetyAdvisorPrompt(topic: string, category: AdvisorCategoryId, userQuestion: string): string {
  return `${RESPONSIBLE_AI_SYSTEM_DIRECTIVE}

The user is asking a practical question in the Daily Life Safety Advisor (${category} / ${topic}).
Question: "${userQuestion}"

Respond with calm, structured, actionable guidance covering:
1. Why the situation matters
2. Warning signs to watch for
3. Immediate safer steps to take
4. What to do if something already went wrong.`;
}
