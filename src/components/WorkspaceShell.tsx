import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Compass,
  Home,
  LayoutDashboard,
  Link2,
  Menu,
  MessageSquareWarning,
  Moon,
  QrCode,
  Shield,
  ShieldCheck,
  Smartphone,
  Sun,
  X,
} from 'lucide-react';
import type { AppSection } from '../types/safety';

interface WorkspaceShellProps {
  activeSection: Exclude<AppSection, 'landing'>;
  onNavigate: (section: AppSection) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  overallScore: number;
  children: React.ReactNode;
}

const NAV_ITEMS: Array<{
  id: Exclude<AppSection, 'landing'>;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'message', label: 'Message Analyzer', icon: MessageSquareWarning },
  { id: 'qr', label: 'QR Scanner', icon: QrCode },
  { id: 'url', label: 'URL Checker', icon: Link2 },
  { id: 'permissions', label: 'Permission Translator', icon: Smartphone },
  { id: 'advisor', label: 'Daily Safety Advisor', icon: Compass },
  { id: 'academy', label: 'Safety Academy', icon: BookOpen },
  { id: 'score', label: 'Safety Score', icon: Award },
  { id: 'trust', label: 'Trust & Responsible AI', icon: ShieldCheck },
];

export function WorkspaceShell({
  activeSection,
  onNavigate,
  theme,
  onToggleTheme,
  overallScore,
  children,
}: WorkspaceShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentLabel =
    NAV_ITEMS.find((n) => n.id === activeSection)?.label || 'Dashboard';

  function handleSelect(section: AppSection) {
    onNavigate(section);
    setSidebarOpen(false);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => handleSelect('landing')}
            className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 cursor-pointer"
          >
            <Shield className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <span>SafeLens AI</span>
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Workspace Navigation" className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.id === activeSection;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          type="button"
          onClick={onToggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <Sun className="h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('landing')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer"
        >
          <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Back to Landing Page</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
        <div className="sticky top-0 h-screen overflow-y-auto">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 w-72 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-14 border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open workspace navigation"
              className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
            >
              <Menu className="h-4 w-4" />
            </button>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm truncate">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer whitespace-nowrap"
              >
                SafeLens AI
              </button>
              <span className="text-slate-400" aria-hidden="true">/</span>
              <span className="font-medium text-slate-900 dark:text-white truncate">
                {currentLabel}
              </span>
            </nav>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('score')}
            className="text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 tabular-nums whitespace-nowrap shrink-0 cursor-pointer"
          >
            Safety Score: <strong>{overallScore}/100</strong>
          </button>
        </header>

        <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
