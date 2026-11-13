import { useEffect, useState } from 'react';
import { DailySafetyAdvisor } from './components/DailySafetyAdvisor';
import { DashboardOverview } from './components/DashboardOverview';
import { LandingPage } from './components/LandingPage';
import { MessageAnalyzer } from './components/MessageAnalyzer';
import { PermissionTranslator } from './components/PermissionTranslator';
import { QrScanner } from './components/QrScanner';
import { SafetyAcademy } from './components/SafetyAcademy';
import { SafetyScoreView } from './components/SafetyScoreView';
import { TrustTransparencyView } from './components/TrustTransparencyView';
import { UrlChecker } from './components/UrlChecker';
import { WorkspaceShell } from './components/WorkspaceShell';
import { useSafeLensStore } from './hooks/useSafeLensStore';
import type { AppSection } from './types/safety';

const VALID_SECTIONS: AppSection[] = [
  'landing',
  'dashboard',
  'message',
  'qr',
  'url',
  'permissions',
  'advisor',
  'academy',
  'score',
  'trust',
];

function getInitialSection(): AppSection {
  if (typeof window === 'undefined') return 'landing';
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('section') as AppSection | null;
  if (requested && VALID_SECTIONS.includes(requested)) {
    return requested;
  }
  if (params.get('autostart') === '1') {
    return 'dashboard';
  }
  const hash = window.location.hash.replace('#', '') as AppSection;
  if (VALID_SECTIONS.includes(hash)) {
    return hash;
  }
  return 'landing';
}

export default function App() {
  const [section, setSection] = useState<AppSection>(getInitialSection);
  const {
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
  } = useSafeLensStore();

  function navigateTo(next: AppSection) {
    setSection(next);
    if (next !== 'landing' && next !== 'dashboard') {
      markModuleUsed(next);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', next === 'landing' ? '#' : `#${next}`);
    }
  }

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppSection;
      if (VALID_SECTIONS.includes(hash)) {
        setSection(hash);
      } else if (!hash) {
        setSection('landing');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (section === 'landing') {
    return (
      <LandingPage
        onNavigate={navigateTo}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <WorkspaceShell
      activeSection={section}
      onNavigate={navigateTo}
      theme={theme}
      onToggleTheme={toggleTheme}
      overallScore={safetyScore.overall}
    >
      {section === 'dashboard' && (
        <DashboardOverview
          onNavigate={navigateTo}
          history={history}
          onClearHistory={resetHistory}
          safetyScore={safetyScore}
          progress={progress}
          heatmap={heatmap}
        />
      )}
      {section === 'message' && (
        <MessageAnalyzer onRecordHistory={recordAnalysis} />
      )}
      {section === 'qr' && <QrScanner onRecordHistory={recordAnalysis} />}
      {section === 'url' && <UrlChecker onRecordHistory={recordAnalysis} />}
      {section === 'permissions' && (
        <PermissionTranslator onRecordHistory={recordAnalysis} />
      )}
      {section === 'advisor' && (
        <DailySafetyAdvisor
          readTopicIds={progress.advisorTopicsRead}
          onMarkTopicRead={markAdvisorTopicRead}
        />
      )}
      {section === 'academy' && (
        <SafetyAcademy
          progress={progress}
          onCompleteQuiz={completeLessonQuiz}
        />
      )}
      {section === 'score' && (
        <SafetyScoreView
          safetyScore={safetyScore}
          progress={progress}
          history={history}
          onNavigate={navigateTo}
        />
      )}
      {section === 'trust' && <TrustTransparencyView />}
    </WorkspaceShell>
  );
}
