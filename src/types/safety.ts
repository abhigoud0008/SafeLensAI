export type RiskLevel = 'Low' | 'Medium' | 'High';

export type AppSection =
  | 'landing'
  | 'dashboard'
  | 'message'
  | 'qr'
  | 'url'
  | 'permissions'
  | 'advisor'
  | 'academy'
  | 'score'
  | 'trust';

export type MessageChannel = 'sms' | 'whatsapp' | 'email';

export interface BeforeYouClickData {
  scenario: string;
  possibleConsequence: string;
  warningSign: string;
  saferAlternative: string;
}

export interface MessageAnalysisResult {
  riskLevel: RiskLevel;
  confidenceScore: number;
  uncertaintyNote: string;
  reasons: string[];
  riskIndicators: string[];
  saferAction: string[];
  explainLikeIm10: string;
  beforeYouClick: BeforeYouClickData;
  source: 'gemini' | 'heuristic';
}

export interface UrlCheckBreakdown {
  httpsEnabled: boolean;
  suspiciousKeywords: string[];
  typosquattingTarget: string | null;
  structureNotes: string[];
}

export interface UrlAnalysisResult {
  normalizedUrl: string;
  hostname: string;
  trustScore: number;
  riskLevel: RiskLevel;
  confidenceScore: number;
  summary: string;
  reasons: string[];
  safetyTips: string[];
  breakdown: UrlCheckBreakdown;
  explainLikeIm10: string;
  beforeYouClick: BeforeYouClickData;
  source: 'gemini' | 'heuristic';
}

export interface QrAnalysisResult {
  decodedContent: string;
  contentType: 'url' | 'upi' | 'wifi' | 'text';
  riskLevel: RiskLevel;
  confidenceScore: number;
  potentialRisks: string[];
  safetyRecommendations: string[];
  safePreviewSummary: string;
  explainLikeIm10: string;
  beforeYouClick: BeforeYouClickData;
  urlDetails?: UrlAnalysisResult;
  source: 'gemini' | 'heuristic';
}

export interface TranslatedPermission {
  permissionName: string;
  plainEnglish: string;
  childFriendly: string;
  riskLevel: RiskLevel;
  whyAppsAsk: string;
}

export interface PermissionAnalysisResult {
  appContext: string;
  overallRisk: RiskLevel;
  confidenceScore: number;
  permissions: TranslatedPermission[];
  recommendations: string[];
  beforeYouClick: BeforeYouClickData;
  source: 'gemini' | 'heuristic';
}

export type AdvisorCategoryId =
  | 'digital'
  | 'physical'
  | 'family'
  | 'emergency';

export interface SafetyTopic {
  id: string;
  category: AdvisorCategoryId;
  categoryLabel: string;
  title: string;
  summary: string;
  situation: string;
  commonRisks: string[];
  warningSigns: string[];
  preventionSteps: string[];
  whatToDoIfItHappens: string[];
}

export interface AcademyQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AcademyLesson {
  id: string;
  title: string;
  durationMinutes: number;
  category: 'digital' | 'privacy' | 'scam' | 'preparedness';
  summary: string;
  explanation: string[];
  realExample: {
    scenario: string;
    breakdown: string;
  };
  preventionTips: string[];
  quiz: AcademyQuizQuestion[];
}

export interface AnalysisHistoryItem {
  id: string;
  module: 'message' | 'url' | 'qr' | 'permissions';
  title: string;
  riskLevel: RiskLevel;
  timestamp: string;
  summary: string;
}

export interface UserProgressState {
  completedLessonIds: string[];
  quizScores: Record<string, number>;
  modulesUsed: string[];
  advisorTopicsRead: string[];
}

export interface SafetyScoreBreakdown {
  overall: number;
  digitalAwareness: number;
  privacyProtection: number;
  scamResistance: number;
  preparedness: number;
  suggestions: string[];
}
