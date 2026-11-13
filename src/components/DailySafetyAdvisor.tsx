import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, Search, Send } from 'lucide-react';
import {
  ADVISOR_CATEGORIES,
  DAILY_SAFETY_TOPICS,
} from '../data/dailyAdvisorData';
import type { AdvisorCategoryId, SafetyTopic } from '../types/safety';
import { Button, Card, Input, SegmentedTabs } from './ui/Primitives';

interface DailySafetyAdvisorProps {
  readTopicIds: string[];
  onMarkTopicRead: (topicId: string) => void;
}

export function DailySafetyAdvisor({
  readTopicIds,
  onMarkTopicRead,
}: DailySafetyAdvisorProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | AdvisorCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<SafetyTopic | null>(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);

  const filteredTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return DAILY_SAFETY_TOPICS.filter((topic) => {
      const catMatch = activeCategory === 'all' || topic.category === activeCategory;
      const textMatch =
        !q ||
        topic.title.toLowerCase().includes(q) ||
        topic.summary.toLowerCase().includes(q) ||
        topic.categoryLabel.toLowerCase().includes(q);
      return catMatch && textMatch;
    });
  }, [activeCategory, searchQuery]);

  function openTopic(topic: SafetyTopic) {
    setSelectedTopic(topic);
    setAnswer(null);
    setQuestion('');
    onMarkTopicRead(topic.id);
  }

  async function handleAskAdvisor(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTopic || !question.trim()) return;
    setAsking(true);
    try {
      const response = await fetch('/api/advisor/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic.title,
          category: selectedTopic.category,
          question,
        }),
      });
      const data = await response.json();
      setAnswer(data.answer || 'Please review the structured prevention steps above.');
    } catch {
      setAnswer('Unable to reach advisor right now. Follow the prevention checklist above.');
    } finally {
      setAsking(false);
    }
  }

  if (selectedTopic) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button variant="outline" size="sm" onClick={() => setSelectedTopic(null)}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>All Safety Guides</span>
          </Button>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {selectedTopic.categoryLabel} · 5-Part Safety Playbook
          </span>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              {selectedTopic.title}
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              {selectedTopic.summary}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
            <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
              1. Situation
            </h2>
            <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedTopic.situation}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                2. Common Risks
              </h2>
              <ul className="mt-2.5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {selectedTopic.commonRisks.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-sm font-semibold text-amber-700 dark:text-amber-400">
                3. Warning Signs
              </h2>
              <ul className="mt-2.5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {selectedTopic.warningSigns.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                4. Prevention Steps
              </h2>
              <ul className="mt-2.5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {selectedTopic.preventionSteps.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {i + 1}. {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-sm font-semibold text-blue-700 dark:text-blue-400">
                5. What To Do If It Happens
              </h2>
              <ul className="mt-2.5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {selectedTopic.whatToDoIfItHappens.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {i + 1}. {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Topic Q&A */}
          <div className="pt-5 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
              Ask a practical question about {selectedTopic.title}
            </h2>
            <form onSubmit={handleAskAdvisor} className="flex flex-col sm:flex-row gap-3">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={`Ask about a specific ${selectedTopic.title.toLowerCase()} scenario...`}
              />
              <Button type="submit" variant="primary" disabled={asking}>
                {asking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>Ask Advisor</span>
                  </>
                )}
              </Button>
            </form>

            {answer && (
              <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/25 p-4 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                {answer}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Daily Life Safety Advisor
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Actionable guides for digital life, physical commuting, family protection, and emergency readiness.
          </p>
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          {readTopicIds.length} / {DAILY_SAFETY_TOPICS.length} guides reviewed
        </span>
      </div>

      {/* Category Filter + Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div>
          <SegmentedTabs
            ariaLabel="Safety advisor categories"
            value={activeCategory}
            onChange={setActiveCategory}
            options={[
              { value: 'all', label: 'All Topics (22)' },
              ...ADVISOR_CATEGORIES.map((c) => ({
                value: c.id,
                label: c.title,
              })),
            ]}
          />
        </div>

        <div className="relative w-full lg:w-72">
          <Search
            className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides (e.g. WiFi, Fire, UPI)"
            aria-label="Search safety advisor topics"
            className="pl-9"
          />
        </div>
      </div>

      {filteredTopics.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No safety guides matched "{searchQuery}".
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTopics.map((topic) => {
            const isRead = readTopicIds.includes(topic.id);
            return (
              <Card
                key={topic.id}
                className="p-5 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{topic.categoryLabel}</span>
                    {isRead && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Read</span>
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 font-display text-base font-semibold text-slate-900 dark:text-white">
                    {topic.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {topic.summary}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openTopic(topic)}
                  >
                    Open 5-Step Guide
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
