import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

import {
  InterviewSession,
  CurriculumDay,
  EvaluationResult,
} from '../types';

import {
  Bot,
  User,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Target,
  BarChart3,
  MessageSquare,
  RefreshCw,
  Layers,
} from 'lucide-react';

interface InterviewDashboardProps {
  session: InterviewSession;
  curriculum: CurriculumDay[];
  onSubmitAnswer: (answer: string) => Promise<void>;
  isSubmitting: boolean;
  onViewFinalReport: () => void;
}

export const InterviewDashboard: React.FC<InterviewDashboardProps> = ({
  session,
  curriculum,
  onSubmitAnswer,
  isSubmitting,
  onViewFinalReport,
}) => {
  const [answerText, setAnswerText] = useState('');
  const [expandedEvaluationIndex, setExpandedEvaluationIndex] =
    useState<number | null>(null);

  const turnsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    turnsEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [session.turns.length, session.currentQuestion]);

  const getDayInfo = (dayNum: number): CurriculumDay | undefined => {
    return curriculum.find((d) => d.day === dayNum);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answerText.trim() || isSubmitting) return;

    const current = answerText;

    setAnswerText('');

    await onSubmitAnswer(current);
  };

  const handleInsertSampleAnswer = (
    sampleType: 'detailed' | 'concise' | 'uncertain'
  ) => {
    const dayInfo = getDayInfo(session.currentQuestionDay || 1);

    const dayTitle = dayInfo?.title || 'this architecture';
    const keyConcept =
      dayInfo?.keyConcepts[0] || 'retrieval metrics';

    if (sampleType === 'detailed') {
      setAnswerText(
        `In production systems dealing with ${dayTitle}, I would first inspect token alignment and ${keyConcept}. Next, I'd evaluate vector similarity thresholds, chunk overlap boundaries, and implement circuit breakers to gracefully fall back if latency spikes above SLA.`
      );
    }

    if (sampleType === 'concise') {
      setAnswerText(
        `I would focus on ${keyConcept}, checking index parameters and verifying metadata filters to isolate the issue.`
      );
    }

    if (sampleType === 'uncertain') {
      setAnswerText(
        `I'm not fully certain about ${keyConcept}. Could you explain how it handles high concurrency?`
      );
    }
  };

  const currentDayInfo = getDayInfo(
    session.currentQuestionDay || 1
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">

      {/* =========================================================
          SESSION PROGRESS HEADER
      ========================================================= */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          {/* Candidate Profile */}
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-sm font-extrabold tracking-wider text-indigo-300">
              {session.candidate.id.split('-')[1]}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 shrink-0 text-indigo-400" />

                <h2 className="truncate text-base font-bold text-slate-100">
                  {session.candidate.name}
                </h2>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                <span className="font-mono text-slate-400">
                  {session.candidate.id}
                </span>

                <span className="text-slate-700">•</span>

                <span className="text-slate-400">
                  {session.candidate.role}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">

            {/* Questions Asked */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5">
              <MessageSquare className="h-4 w-4 text-indigo-400" />

              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  Questions Asked
                </p>

                <p className="text-sm font-extrabold text-slate-100">
                  {session.questionCount}
                  <span className="font-normal text-slate-500">
                    {' '}
                    / 8 (Min)
                  </span>
                </p>
              </div>
            </div>

            {/* Cohort Days Covered */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5">
              <BookOpen className="h-4 w-4 text-emerald-400" />

              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  Cohort Days Covered
                </p>

                <p className="text-sm font-extrabold text-emerald-400">
                  {session.daysCovered.length}
                  <span className="font-normal text-slate-500">
                    {' '}
                    / 4 (Min)
                  </span>
                </p>
              </div>
            </div>

            {/* Completion / Active Status */}
            {session.isCompleted ? (
              <button
                type="button"
                onClick={onViewFinalReport}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-500"
              >
                <CheckCircle2 className="h-4 w-4" />
                View Evaluation Report
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 font-semibold text-indigo-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
                </span>

                <span className="text-xs">Interview Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Covered Days Strip */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4">
          <div className="mr-1 flex items-center gap-1 text-xs font-medium text-slate-400">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            Days Covered:
          </div>

          {session.daysCovered.length === 0 ? (
            <span className="text-xs italic text-slate-500">
              None yet (First question active)
            </span>
          ) : (
            session.daysCovered.map((dayNum) => {
              const dayObj = getDayInfo(dayNum);

              return (
                <span
                  key={dayNum}
                  title={dayObj?.title}
                  className="flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Day {dayNum}: {dayObj?.module || 'Cohort Topic'}
                </span>
              );
            })
          )}
        </div>
      </section>

      {/* =========================================================
          MAIN CONVERSATION THREAD
      ========================================================= */}
      <section className="space-y-6">
        {session.turns.map((turn, index) => {
          const dayObj = getDayInfo(turn.day);
          const evaluation: EvaluationResult | undefined =
            turn.evaluation;

          const isExpanded =
            expandedEvaluationIndex === index;

          return (
            <div key={index} className="space-y-3">

              {/* Interviewer Question */}
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                      <Bot className="h-4 w-4 text-indigo-400" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">
                          Interviewer
                        </span>

                        <span className="text-[10px] text-slate-600">
                          •
                        </span>

                        <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                          Technical Evaluation
                        </span>
                      </div>

                      <div className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-1 text-[10px] font-mono font-semibold text-indigo-300">
                        Turn {turn.turnNumber} • Day {turn.day}: {dayObj?.title}
                      </div>
                    </div>
                  </div>

                  <Sparkles className="h-4 w-4 shrink-0 text-indigo-400" />
                </div>

                <p className="pl-9 text-sm font-medium leading-relaxed text-slate-100">
                  {turn.question}
                </p>
              </div>

              {/* Candidate Answer */}
              <div className="ml-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-md sm:ml-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                  </div>

                  <span className="text-xs font-semibold text-slate-300">
                    {session.candidate.name}
                  </span>
                </div>

                <p className="pl-9 pt-3 text-sm italic leading-relaxed text-slate-200">
                  "{turn.answer}"
                </p>

                {/* Evaluation Controls */}
                {evaluation && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4">
                    <span
                      className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${
                        evaluation.score >= 8
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                          : evaluation.score >= 6
                            ? 'border-blue-500/30 bg-blue-500/10 text-blue-300'
                            : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                      }`}
                    >
                      Score: {evaluation.score} / 10
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedEvaluationIndex(
                          isExpanded ? null : index
                        )
                      }
                      className="flex cursor-pointer items-center gap-1 text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                    >
                      {isExpanded ? (
                        <>
                          Hide Notes
                          <ChevronUp className="h-3.5 w-3.5" />
                        </>
                      ) : (
                        <>
                          Evaluation Notes
                          <ChevronDown className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Evaluation Notes */}
                {evaluation && isExpanded && (
                  <div className="mt-4 space-y-3 rounded-xl bg-slate-950/60 p-4">
                    <div className="border-t border-slate-800/80 pt-4">
                      <p className="text-xs leading-relaxed text-slate-300">
                        <span className="font-bold text-indigo-400">
                          Feedback:
                        </span>{' '}
                        {evaluation.feedback}
                      </p>

                      {/* Strengths */}
                      {evaluation.strengths.length > 0 && (
                        <div className="mt-3 rounded-lg border border-emerald-500/15 bg-emerald-500/5 p-2.5">
                          <p className="mb-1 text-xs font-bold text-emerald-400">
                            Strengths Demonstrated:
                          </p>

                          <ul className="list-inside list-disc space-y-0.5 text-xs text-slate-300">
                            {evaluation.strengths.map(
                              (strength, idx) => (
                                <li key={idx}>{strength}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Gaps */}
                      {evaluation.gaps.length > 0 && (
                        <div className="mt-3 rounded-lg border border-amber-500/15 bg-amber-500/5 p-2.5">
                          <p className="mb-1 text-xs font-bold text-amber-400">
                            Gaps / Missed Points:
                          </p>

                          <ul className="list-inside list-disc space-y-0.5 text-xs text-slate-300">
                            {evaluation.gaps.map((gap, idx) => (
                              <li key={idx}>{gap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={turnsEndRef} />
      </section>

      {/* =========================================================
          ACTIVE QUESTION BOX
      ========================================================= */}
      {!session.isCompleted && session.currentQuestion && (
        <section className="space-y-4 rounded-2xl border border-indigo-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl shadow-indigo-950/50">

          {/* Question Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-400" />
              </span>

              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Current Question • Question {session.questionCount + 1}
              </span>
            </div>

            <span className="inline-flex w-fit items-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-300">
              Day {session.currentQuestionDay}: {currentDayInfo?.title}
            </span>
          </div>

          {/* Current Question */}
          <p className="text-base font-semibold leading-snug text-slate-100 sm:text-lg">
            {session.currentQuestion}
          </p>

          {/* Quick Test Answers */}
          <div className="flex flex-col gap-2 border-t border-slate-800/80 pt-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Target className="h-3.5 w-3.5 text-indigo-400" />
              Quick Test Answers:
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  handleInsertSampleAnswer('detailed')
                }
                className="cursor-pointer rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-indigo-300 hover:bg-slate-700"
              >
                + Detailed Response
              </button>

              <button
                type="button"
                onClick={() =>
                  handleInsertSampleAnswer('concise')
                }
                className="cursor-pointer rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700"
              >
                + Concise Response
              </button>

              <button
                type="button"
                onClick={() =>
                  handleInsertSampleAnswer('uncertain')
                }
                className="cursor-pointer rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-amber-300 hover:bg-slate-700"
              >
                + Weak/Uncertain Response
              </button>
            </div>
          </div>

          {/* Answer Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type candidate's technical response here... (Explain architectural decisions, key trade-offs, and failure modes)"
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            {/* Form Footer */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-slate-500">
                {answerText.trim().length} characters
              </span>

              <button
                type="submit"
                disabled={!answerText.trim() || isSubmitting}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:from-indigo-500 hover:to-blue-500 disabled:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Evaluating Response...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Submit Answer
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =========================================================
          COMPLETION BANNER
      ========================================================= */}
      {session.isCompleted && (
        <section className="space-y-3 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 p-6 text-center shadow-2xl">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <h2 className="text-xl font-bold text-slate-100">
            Interview Session Completed!
          </h2>

          <p className="mx-auto max-w-lg text-xs text-slate-300">
            Successfully conducted{' '}
            <span className="font-bold text-emerald-400">
              {session.questionCount}
            </span>{' '}
            questions across{' '}
            <span className="font-bold text-emerald-400">
              {session.daysCovered.length}
            </span>{' '}
            cohort days.
          </p>

          <button
            type="button"
            onClick={onViewFinalReport}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-500"
          >
            <BarChart3 className="h-4 w-4" />
            Open Comprehensive Evaluation Report
          </button>
        </section>
      )}

      {/* Small visual status when there is no conversation yet */}
      {session.turns.length === 0 && !session.currentQuestion && !session.isCompleted && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-xs text-slate-500">
          <AlertCircle className="h-4 w-4 text-slate-600" />
          Waiting for the interview engine to generate the first question...
        </div>
      )}

      {/* Decorative refresh indicator for active sessions */}
      {!session.isCompleted && session.currentQuestion && isSubmitting && (
        <div className="pointer-events-none fixed bottom-4 right-4 hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/95 px-3 py-2 text-[10px] font-medium text-slate-500 shadow-xl sm:flex">
          <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />
          Interview engine processing
        </div>
      )}
    </div>
  );
};
//finishing

export default InterviewDashboard;
```
