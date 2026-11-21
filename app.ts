import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import {
  buildPermissionTranslationPrompt,
  buildSafetyAdvisorPrompt,
  buildScamAnalysisPrompt,
  buildUrlAnalysisPrompt,
} from './src/lib/prompts.js';
import {
  analyzeMessageHeuristics,
  analyzeQrContentHeuristics,
  analyzeUrlHeuristics,
  buildSamplePermissionAnalysis,
} from './src/lib/safetyEngine.js';
import type {
  AdvisorCategoryId,
  MessageChannel,
  RiskLevel,
} from './src/types/safety';

dotenv.config();

const MODEL_NAME = 'gemini-4-hydrogen';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function normalizeRiskLevel(value: unknown): RiskLevel {
  if (value === 'Low' || value === 'Medium' || value === 'High') {
    return value;
  }
  return 'Medium';
}

function createApp() {
  const app = express();
  app.use(express.json({ limit: '8mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, aiConfigured: Boolean(getGeminiClient()) });
  });

  app.post('/api/analyze/message', async (req, res) => {
    const { message, channel } = req.body as {
      message?: string;
      channel?: MessageChannel;
    };

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Please provide a message to analyze.' });
    }

    const safeChannel: MessageChannel =
      channel === 'whatsapp' || channel === 'email' ? channel : 'sms';
    const heuristicFallback = analyzeMessageHeuristics(message, safeChannel);
    const ai = getGeminiClient();

    if (!ai) {
      return res.json(heuristicFallback);
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: buildScamAnalysisPrompt(message, safeChannel),
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskLevel: { type: Type.STRING },
              confidenceScore: { type: Type.INTEGER },
              uncertaintyNote: { type: Type.STRING },
              reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
              riskIndicators: { type: Type.ARRAY, items: { type: Type.STRING } },
              saferAction: { type: Type.ARRAY, items: { type: Type.STRING } },
              explainLikeIm10: { type: Type.STRING },
              beforeYouClick: {
                type: Type.OBJECT,
                properties: {
                  scenario: { type: Type.STRING },
                  possibleConsequence: { type: Type.STRING },
                  warningSign: { type: Type.STRING },
                  saferAlternative: { type: Type.STRING },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      return res.json({
        riskLevel: normalizeRiskLevel(parsed.riskLevel),
        confidenceScore: Math.min(
          94,
          Math.max(35, Number(parsed.confidenceScore) || heuristicFallback.confidenceScore)
        ),
        uncertaintyNote: parsed.uncertaintyNote || heuristicFallback.uncertaintyNote,
        reasons:
          Array.isArray(parsed.reasons) && parsed.reasons.length > 0
            ? parsed.reasons
            : heuristicFallback.reasons,
        riskIndicators:
          Array.isArray(parsed.riskIndicators) && parsed.riskIndicators.length > 0
            ? parsed.riskIndicators
            : heuristicFallback.riskIndicators,
        saferAction:
          Array.isArray(parsed.saferAction) && parsed.saferAction.length > 0
            ? parsed.saferAction
            : heuristicFallback.saferAction,
        explainLikeIm10: parsed.explainLikeIm10 || heuristicFallback.explainLikeIm10,
        beforeYouClick: parsed.beforeYouClick?.possibleConsequence
          ? parsed.beforeYouClick
          : heuristicFallback.beforeYouClick,
        source: 'gemini',
      });
    } catch (err) {
      console.error('Gemini message analysis error:', err);
      return res.json(heuristicFallback);
    }
  });

  app.post('/api/analyze/url', async (req, res) => {
    const { url } = req.body as { url?: string };
    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'Please enter a URL to check.' });
    }

    const heuristic = analyzeUrlHeuristics(url);
    const ai = getGeminiClient();

    if (!ai) {
      return res.json(heuristic);
    }

    try {
      const contextSummary = `HTTPS=${heuristic.breakdown.httpsEnabled}, Typosquat=${heuristic.breakdown.typosquattingTarget ?? 'none'}, Keywords=${heuristic.breakdown.suspiciousKeywords.join(',') || 'none'}, Notes=${heuristic.breakdown.structureNotes.join('; ')}`;
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: buildUrlAnalysisPrompt(url, contextSummary),
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              trustScore: { type: Type.INTEGER },
              riskLevel: { type: Type.STRING },
              confidenceScore: { type: Type.INTEGER },
              summary: { type: Type.STRING },
              reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
              safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              explainLikeIm10: { type: Type.STRING },
              beforeYouClick: {
                type: Type.OBJECT,
                properties: {
                  scenario: { type: Type.STRING },
                  possibleConsequence: { type: Type.STRING },
                  warningSign: { type: Type.STRING },
                  saferAlternative: { type: Type.STRING },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      return res.json({
        ...heuristic,
        trustScore:
          typeof parsed.trustScore === 'number'
            ? Math.max(5, Math.min(96, Math.round(parsed.trustScore)))
            : heuristic.trustScore,
        riskLevel: normalizeRiskLevel(parsed.riskLevel ?? heuristic.riskLevel),
        confidenceScore: Math.min(
          92,
          Math.max(40, Number(parsed.confidenceScore) || heuristic.confidenceScore)
        ),
        summary: parsed.summary || heuristic.summary,
        reasons:
          Array.isArray(parsed.reasons) && parsed.reasons.length > 0
            ? parsed.reasons
            : heuristic.reasons,
        safetyTips:
          Array.isArray(parsed.safetyTips) && parsed.safetyTips.length > 0
            ? parsed.safetyTips
            : heuristic.safetyTips,
        explainLikeIm10: parsed.explainLikeIm10 || heuristic.explainLikeIm10,
        beforeYouClick: parsed.beforeYouClick?.possibleConsequence
          ? parsed.beforeYouClick
          : heuristic.beforeYouClick,
        source: 'gemini',
      });
    } catch (err) {
      console.error('Gemini URL analysis error:', err);
      return res.json(heuristic);
    }
  });

  app.post('/api/analyze/qr', async (req, res) => {
    const { decodedContent } = req.body as { decodedContent?: string };
    if (!decodedContent || typeof decodedContent !== 'string' || !decodedContent.trim()) {
      return res.status(400).json({ error: 'No decoded QR content was provided.' });
    }

    const heuristic = analyzeQrContentHeuristics(decodedContent);
    const ai = getGeminiClient();

    if (!ai || heuristic.contentType !== 'url') {
      return res.json(heuristic);
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: buildUrlAnalysisPrompt(
          decodedContent,
          `Decoded from QR image. Type=${heuristic.contentType}.`
        ),
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskLevel: { type: Type.STRING },
              confidenceScore: { type: Type.INTEGER },
              reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
              safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              explainLikeIm10: { type: Type.STRING },
              beforeYouClick: {
                type: Type.OBJECT,
                properties: {
                  scenario: { type: Type.STRING },
                  possibleConsequence: { type: Type.STRING },
                  warningSign: { type: Type.STRING },
                  saferAlternative: { type: Type.STRING },
                },
              },
            },
          },
        },
      });
      const parsed = JSON.parse((response.text ?? '{}').trim());
      return res.json({
        ...heuristic,
        riskLevel: normalizeRiskLevel(parsed.riskLevel ?? heuristic.riskLevel),
        confidenceScore: Math.min(
          92,
          Math.max(40, Number(parsed.confidenceScore) || heuristic.confidenceScore)
        ),
        potentialRisks:
          Array.isArray(parsed.reasons) && parsed.reasons.length > 0
            ? parsed.reasons
            : heuristic.potentialRisks,
        safetyRecommendations:
          Array.isArray(parsed.safetyTips) && parsed.safetyTips.length > 0
            ? parsed.safetyTips
            : heuristic.safetyRecommendations,
        explainLikeIm10: parsed.explainLikeIm10 || heuristic.explainLikeIm10,
        beforeYouClick: parsed.beforeYouClick?.possibleConsequence
          ? parsed.beforeYouClick
          : heuristic.beforeYouClick,
        source: 'gemini',
      });
    } catch (err) {
      console.error('Gemini QR analysis error:', err);
      return res.json(heuristic);
    }
  });

  app.post('/api/analyze/permissions', async (req, res) => {
    const { imageBase64, mimeType, note } = req.body as {
      imageBase64?: string;
      mimeType?: string;
      note?: string;
    };

    if (!imageBase64 && (!note || !note.trim())) {
      return res.status(400).json({
        error: 'Please upload a permission screenshot or describe the requested permissions.',
      });
    }

    const fallback = buildSamplePermissionAnalysis(note);
    const ai = getGeminiClient();

    if (!ai) {
      return res.json(fallback);
    }

    try {
      const parts: Array<
        | { text: string }
        | { inlineData: { mimeType: string; data: string } }
      > = [];

      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType: mimeType || 'image/png',
            data: cleanBase64,
          },
        });
      }
      parts.push({ text: buildPermissionTranslationPrompt(note) });

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              appContext: { type: Type.STRING },
              overallRisk: { type: Type.STRING },
              confidenceScore: { type: Type.INTEGER },
              permissions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    permissionName: { type: Type.STRING },
                    plainEnglish: { type: Type.STRING },
                    childFriendly: { type: Type.STRING },
                    riskLevel: { type: Type.STRING },
                    whyAppsAsk: { type: Type.STRING },
                  },
                },
              },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              beforeYouClick: {
                type: Type.OBJECT,
                properties: {
                  scenario: { type: Type.STRING },
                  possibleConsequence: { type: Type.STRING },
                  warningSign: { type: Type.STRING },
                  saferAlternative: { type: Type.STRING },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      return res.json({
        appContext: parsed.appContext || fallback.appContext,
        overallRisk: normalizeRiskLevel(parsed.overallRisk),
        confidenceScore: Math.min(
          92,
          Math.max(45, Number(parsed.confidenceScore) || fallback.confidenceScore)
        ),
        permissions:
          Array.isArray(parsed.permissions) && parsed.permissions.length > 0
            ? parsed.permissions.map((p: Record<string, unknown>) => ({
                permissionName: String(p.permissionName || 'Device Permission'),
                plainEnglish: String(p.plainEnglish || ''),
                childFriendly: String(p.childFriendly || ''),
                riskLevel: normalizeRiskLevel(p.riskLevel),
                whyAppsAsk: String(p.whyAppsAsk || ''),
              }))
            : fallback.permissions,
        recommendations:
          Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0
            ? parsed.recommendations
            : fallback.recommendations,
        beforeYouClick: parsed.beforeYouClick?.possibleConsequence
          ? parsed.beforeYouClick
          : fallback.beforeYouClick,
        source: 'gemini',
      });
    } catch (err) {
      console.error('Gemini permission translation error:', err);
      return res.json(fallback);
    }
  });

  app.post('/api/advisor/ask', async (req, res) => {
    const { topic, category, question } = req.body as {
      topic?: string;
      category?: AdvisorCategoryId;
      question?: string;
    };

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Please enter a safety question.' });
    }

    const ai = getGeminiClient();
    const safeCategory: AdvisorCategoryId = category || 'digital';
    const safeTopic = topic || 'Everyday Safety';

    if (!ai) {
      return res.json({
        answer: `For "${safeTopic}": Pause before sharing sensitive info or acting under urgency. Verify identity through an independent official source, keep personal accounts protected with strong passwords and multi-factor authentication, and reach out to trusted contacts or official emergency numbers if an immediate risk exists.`,
        source: 'heuristic',
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: buildSafetyAdvisorPrompt(safeTopic, safeCategory, question),
      });
      return res.json({
        answer: response.text || 'Unable to generate guidance right now. Please review the structured steps on this card.',
        source: 'gemini',
      });
    } catch (err) {
      console.error('Gemini advisor error:', err);
      return res.json({
        answer: `For "${safeTopic}": Follow the prevention steps and warning signs listed in this guide. Always verify unexpected requests independently before acting.`,
        source: 'heuristic',
      });
    }
  });


  return app;
}

export default createApp();
