import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  appendHistoryItem,
  clearHistory,
  loadHistory,
  loadProgress,
  loadTheme,
  saveProgress,
  saveTheme,
} from '../lib/storage';
import { calculateHeatmapData, computeSafetyScore } from '../lib/safetyEngine';
import type { AnalysisHistoryItem, UserProgressState } from '../types/safety';

export function useSafeLensStore() {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>(() => loadHistory());
  const [progress, setProgress] = useState<UserProgressState>(() => loadProgress());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const recordAnalysis = useCallback(
    (item: Omit<AnalysisHistoryItem, 'id' | 'timestamp'>) => {
      const entry: AnalysisHistoryItem = {
        ...item,
        id: `${item.module}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
      };
      const nextHistory = appendHistoryItem(entry);
      setHistory(nextHistory);

      setProgress((prev) => {
        if (prev.modulesUsed.includes(item.module)) return prev;
        const next = {
          ...prev,
          modulesUsed: [...prev.modulesUsed, item.module],
        };
        return saveProgress(next);
      });
    },
    []
  );

  const markModuleUsed = useCallback((moduleId: string) => {
    setProgress((prev) => {
      if (prev.modulesUsed.includes(moduleId)) return prev;
      return saveProgress({
        ...prev,
        modulesUsed: [...prev.modulesUsed, moduleId],
      });
    });
  }, []);

  const markAdvisorTopicRead = useCallback((topicId: string) => {
    setProgress((prev) => {
      if (prev.advisorTopicsRead.includes(topicId)) return prev;
      return saveProgress({
        ...prev,
        advisorTopicsRead: [...prev.advisorTopicsRead, topicId],
      });
    });
  }, []);

  const completeLessonQuiz = useCallback((lessonId: string, scorePercent: number) => {
    setProgress((prev) => {
      const completedLessonIds = prev.completedLessonIds.includes(lessonId)
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, lessonId];
      const bestPrev = prev.quizScores[lessonId] ?? 0;
      return saveProgress({
        ...prev,
        completedLessonIds,
        quizScores: {
          ...prev.quizScores,
          [lessonId]: Math.max(bestPrev, scorePercent),
        },
      });
    });
  }, []);

  const resetHistory = useCallback(() => {
    setHistory(clearHistory());
  }, []);

  const safetyScore = useMemo(
    () => computeSafetyScore(progress, history),
    [progress, history]
  );

  const heatmap = useMemo(() => calculateHeatmapData(history), [history]);

  return {
    history,
    progress,
    theme,
    toggleTheme,
    recordAnalysis,
    markModuleUsed,
    markAdvisorTopicRead,
    completeLessonQuiz,
    resetHistory,
    safetyScore,
    heatmap,
  };
}
