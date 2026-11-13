import React, { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react';
import { ACADEMY_LESSONS } from '../data/academyData';
import type { AcademyLesson, UserProgressState } from '../types/safety';
import { Button, Card } from './ui/Primitives';

interface SafetyAcademyProps {
  progress: UserProgressState;
  onCompleteQuiz: (lessonId: string, scorePercent: number) => void;
}

export function SafetyAcademy({
  progress,
  onCompleteQuiz,
}: SafetyAcademyProps) {
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  function openLesson(lesson: AcademyLesson) {
    setSelectedLesson(lesson);
    setAnswers({});
    setSubmitted(false);
  }

  function handleSubmitQuiz(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedLesson) return;

    const total = selectedLesson.quiz.length;
    const correct = selectedLesson.quiz.filter(
      (q) => answers[q.id] === q.correctIndex
    ).length;
    const percent = Math.round((correct / total) * 100);
    setSubmitted(true);
    onCompleteQuiz(selectedLesson.id, percent);
  }

  if (selectedLesson) {
    const allAnswered = selectedLesson.quiz.every(
      (q) => typeof answers[q.id] === 'number'
    );
    const correctCount = selectedLesson.quiz.filter(
      (q) => answers[q.id] === q.correctIndex
    ).length;

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" size="sm" onClick={() => setSelectedLesson(null)}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Academy</span>
          </Button>
          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {selectedLesson.durationMinutes} min read · {selectedLesson.quiz.length} quiz{' '}
            {selectedLesson.quiz.length === 1 ? 'question' : 'questions'}
          </span>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              {selectedLesson.title}
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              {selectedLesson.summary}
            </p>
          </div>

          <div className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
            {selectedLesson.explanation.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1.5">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Real-World Example
            </p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {selectedLesson.realExample.scenario}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {selectedLesson.realExample.breakdown}
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Prevention Tips
            </h2>
            <ul className="mt-2.5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {selectedLesson.preventionTips.map((tip, i) => (
                <li key={i}>
                  {i + 1}. {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Quiz */}
          <form
            onSubmit={handleSubmitQuiz}
            className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-5"
          >
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              Quick Quiz
            </h2>

            {selectedLesson.quiz.map((q, qIdx) => (
              <fieldset key={q.id} className="space-y-2.5">
                <legend className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {qIdx + 1}. {q.question}
                </legend>
                <div className="space-y-2">
                  {q.options.map((option, optIdx) => {
                    const checked = answers[q.id] === optIdx;
                    const isCorrect = optIdx === q.correctIndex;
                    return (
                      <label
                        key={optIdx}
                        className={`flex items-start gap-3 rounded-lg border p-3 text-sm cursor-pointer transition-colors ${
                          submitted
                            ? isCorrect
                              ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30'
                              : checked
                                ? 'border-red-300 dark:border-red-800 bg-red-50/70 dark:bg-red-950/30'
                                : 'border-slate-200 dark:border-slate-800'
                            : checked
                              ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={checked}
                          onChange={() =>
                            setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                          disabled={submitted}
                          className="mt-0.5 accent-blue-600"
                        />
                        <span className="text-slate-800 dark:text-slate-200">
                          {option}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {submitted && (
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {q.explanation}
                  </p>
                )}
              </fieldset>
            ))}

            <div className="flex flex-wrap items-center justify-between gap-4">
              {submitted ? (
                <div className="text-sm font-medium text-emerald-700 dark:text-emerald-400 tabular-nums">
                  Quiz completed: {correctCount} / {selectedLesson.quiz.length} correct (
                  {Math.round((correctCount / selectedLesson.quiz.length) * 100)}%) — Safety Score updated.
                </div>
              ) : (
                <Button type="submit" variant="primary" disabled={!allAnswered}>
                  Submit Quiz & Update Safety Score
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Safety Academy
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Short, practical lessons with real-world examples and quick quizzes to sharpen everyday judgment.
          </p>
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          {progress.completedLessonIds.length} / {ACADEMY_LESSONS.length} lessons completed
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACADEMY_LESSONS.map((lesson) => {
          const completed = progress.completedLessonIds.includes(lesson.id);
          const quizScore = progress.quizScores[lesson.id];
          return (
            <Card
              key={lesson.id}
              className="p-5 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  <span>{lesson.durationMinutes} min</span>
                  {completed ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{quizScore ?? 100}%</span>
                    </span>
                  ) : (
                    <BookOpen className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                  )}
                </div>

                <h2 className="mt-3 font-display text-base font-semibold text-slate-900 dark:text-white">
                  {lesson.title}
                </h2>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lesson.summary}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant={completed ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => openLesson(lesson)}
                >
                  {completed ? 'Review Lesson' : 'Start Lesson'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
