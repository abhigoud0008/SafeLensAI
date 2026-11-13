import test from 'node:test';
import assert from 'node:assert/strict';
import jsQR from 'jsqr';
import {
  analyzeMessageHeuristics,
  analyzeQrContentHeuristics,
  analyzeUrlHeuristics,
  calculateHeatmapData,
  computeSafetyScore,
} from './safetyEngine';
import { encodeQrMatrix } from './qrEncoder';

test('URL checker flags typosquatting like amaz0n-login.com with low trust score', () => {
  const result = analyzeUrlHeuristics('http://amaz0n-login.com/verify');
  assert.equal(result.riskLevel, 'High');
  assert.ok(result.trustScore < 45, `Expected low trustScore, got ${result.trustScore}`);
  assert.equal(result.breakdown.typosquattingTarget, 'amazon.com');
  assert.equal(result.breakdown.httpsEnabled, false);
  assert.ok(result.reasons.some((r) => r.includes('amazon.com')));
});

test('URL checker gives legitimate HTTPS domain a high trust score', () => {
  const result = analyzeUrlHeuristics('https://amazon.com/gp/help');
  assert.equal(result.riskLevel, 'Low');
  assert.ok(result.trustScore >= 75, `Expected high trustScore, got ${result.trustScore}`);
  assert.equal(result.breakdown.typosquattingTarget, null);
  assert.equal(result.breakdown.httpsEnabled, true);
});

test('Message analyzer detects urgency, fear tactics, OTP requests, and Explain Like I am 10 output', () => {
  const result = analyzeMessageHeuristics(
    'URGENT: Your bank account will be suspended within 2 hours! Verify your OTP at http://amaz0n-login.com/kyc immediately.',
    'sms'
  );
  assert.equal(result.riskLevel, 'High');
  assert.ok(result.riskIndicators.includes('Urgency'));
  assert.ok(result.riskIndicators.includes('Fear tactics'));
  assert.ok(result.riskIndicators.includes('OTP or credential requests'));
  assert.ok(result.explainLikeIm10.length > 20);
  assert.ok(result.beforeYouClick.possibleConsequence.length > 10);
});

test('QR content analyzer identifies UPI payment intents safely without auto-launching', () => {
  const result = analyzeQrContentHeuristics('upi://pay?pa=merchant@okaxis&pn=QuickMart&am=500');
  assert.equal(result.contentType, 'upi');
  assert.equal(result.riskLevel, 'Medium');
  assert.ok(result.safePreviewSummary.includes('QuickMart'));
});

test('Safety score stays within 0-100 and rewards completed lessons, quizzes, and checks', () => {
  const baseline = computeSafetyScore(
    {
      completedLessonIds: [],
      quizScores: {},
      modulesUsed: [],
      advisorTopicsRead: [],
    },
    []
  );
  const progressed = computeSafetyScore(
    {
      completedLessonIds: ['privacy-protection', 'mfa', 'password-security', 'job-scams'],
      quizScores: { 'privacy-protection': 100, mfa: 100 },
      modulesUsed: ['message', 'url', 'permissions', 'qr'],
      advisorTopicsRead: ['public-wifi', 'upi-fraud', 'fire'],
    },
    [
      {
        id: '1',
        module: 'message',
        title: 'Test SMS',
        riskLevel: 'High',
        timestamp: new Date().toISOString(),
        summary: 'High risk',
      },
      {
        id: '2',
        module: 'url',
        title: 'amaz0n-login.com',
        riskLevel: 'High',
        timestamp: new Date().toISOString(),
        summary: 'Lookalike',
      },
    ]
  );

  assert.ok(baseline.overall >= 0 && baseline.overall <= 100);
  assert.ok(progressed.overall > baseline.overall);
  assert.ok(progressed.overall <= 100);

  const heatmap = calculateHeatmapData([
    {
      id: '1',
      module: 'message',
      title: 'Test',
      riskLevel: 'High',
      timestamp: new Date().toISOString(),
      summary: 'High',
    },
  ]);
  const msgRow = heatmap.find((h) => h.module === 'message');
  assert.equal(msgRow?.high, 1);
  assert.equal(msgRow?.total, 1);
});

test('QR encoder produces a real matrix decoded cleanly by jsQR', () => {
  const payload = 'https://amaz0n-login.com/claim';
  const matrix = encodeQrMatrix(payload);
  const scale = 6;
  const margin = 4;
  const dim = (matrix.length + margin * 2) * scale;
  const rgba = new Uint8ClampedArray(dim * dim * 4);
  for (let y = 0; y < dim; y++) {
    for (let x = 0; x < dim; x++) {
      const mr = Math.floor(y / scale) - margin;
      const mc = Math.floor(x / scale) - margin;
      const isDark =
        mr >= 0 &&
        mr < matrix.length &&
        mc >= 0 &&
        mc < matrix.length &&
        matrix[mr][mc];
      const v = isDark ? 15 : 255;
      const idx = (y * dim + x) * 4;
      rgba[idx] = v;
      rgba[idx + 1] = v;
      rgba[idx + 2] = v;
      rgba[idx + 3] = 255;
    }
  }
  const decoded = jsQR(rgba, dim, dim);
  assert.ok(decoded, 'Expected jsQR to decode generated matrix');
  assert.equal(decoded.data, payload);
});
