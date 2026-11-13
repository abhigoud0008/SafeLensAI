import type { AnalysisHistoryItem, UserProgressState } from '../types/safety';

const HISTORY_KEY = 'safelens_history_v1';
const PROGRESS_KEY = 'safelens_progress_v1';
const THEME_KEY = 'safelens_theme_v1';

const DEFAULT_PROGRESS: UserProgressState = {
  completedLessonIds: [],
  quizScores: {},
  modulesUsed: [],
  advisorTopicsRead: [],
};

function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota or private mode restrictions gracefully
  }
}

export function loadHistory(): AnalysisHistoryItem[] {
  const raw = safeGetItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendHistoryItem(item: AnalysisHistoryItem): AnalysisHistoryItem[] {
  const current = loadHistory();
  const next = [item, ...current].slice(0, 30);
  safeSetItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function clearHistory(): AnalysisHistoryItem[] {
  safeSetItem(HISTORY_KEY, JSON.stringify([]));
  return [];
}

export function loadProgress(): UserProgressState {
  const raw = safeGetItem(PROGRESS_KEY);
  if (!raw) return DEFAULT_PROGRESS;
  try {
    const parsed = JSON.parse(raw);
    return {
      completedLessonIds: Array.isArray(parsed.completedLessonIds)
        ? parsed.completedLessonIds
        : [],
      quizScores:
        parsed.quizScores && typeof parsed.quizScores === 'object'
          ? parsed.quizScores
          : {},
      modulesUsed: Array.isArray(parsed.modulesUsed) ? parsed.modulesUsed : [],
      advisorTopicsRead: Array.isArray(parsed.advisorTopicsRead)
        ? parsed.advisorTopicsRead
        : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(next: UserProgressState): UserProgressState {
  safeSetItem(PROGRESS_KEY, JSON.stringify(next));
  return next;
}

export function loadTheme(): 'light' | 'dark' {
  const stored = safeGetItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  safeSetItem(THEME_KEY, theme);
}
