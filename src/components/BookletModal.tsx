```tsx
import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Cpu,
  Target,
  Code2,
  CheckCircle2,
  Sparkles,
  Layers,
  Brain,
  Award,
  Globe,
  Zap,
} from 'lucide-react';

import ShayakLogo from './ShayakLogo';
import ThemeConfig from '../theme';

interface BookletModalProps {
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const BookletModal: React.FC<BookletModalProps> = ({
  theme,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'engine' | 'benefits' | 'api'
  >('overview');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn sm:p-6"
    >
      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booklet-modal-title"
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.border,
          color: theme.textPrimary,
        }}
      >
        {/* Header */}
        <header
          className="flex items-center justify-between border-b px-6 py-4"
          style={{
            borderColor: theme.border,
            backgroundColor: theme.headerBg,
          }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <ShayakLogo
              size="sm"
              showText={false}
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="booklet-modal-title"
                  className="text-lg font-bold font-mono tracking-wide"
                >
                  SHAYAK PLATFORM BOOKLET
                </h2>

                <span
                  className="rounded-full border px-2 py-0.5 text-[10px] font-mono"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.pillBg,
                  }}
                >
                  v2.5 Release
                </span>
              </div>

              <p
                className="mt-1 text-xs"
                style={{
                  color: theme.textMuted,
                }}
              >
                Complete guide to understanding the AI Technical
                Interviewer &amp; Architecture
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booklet"
            className="ml-4 shrink-0 cursor-pointer rounded-lg border p-2 transition-all hover:text-primary"
            style={{
              borderColor: theme.border,
              color: theme.textMuted,
            }}
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Navigation Tabs */}
        <nav
          className="flex items-center gap-2 overflow-x-auto border-b px-6 pt-3"
          style={{
            borderColor: theme.border,
            backgroundColor: theme.cardSubtleBg,
          }}
        >
          {/* Overview */}
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-t-lg border-b-2 px-4 py-2.5 text-xs font-bold font-mono transition-all ${
              activeTab === 'overview'
                ? 'border-[#00FF66] bg-slate-900/50 text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Overview &amp; Vision</span>
          </button>

          {/* Architectural Engine */}
          <button
            type="button"
            onClick={() => setActiveTab('engine')}
            className={`flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-t-lg border-b-2 px-4 py-2.5 text-xs font-bold font-mono transition-all ${
              activeTab === 'engine'
                ? 'border-[#00FF66] bg-slate-900/50 text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>Architectural Engine</span>
          </button>

          {/* Value & Impact */}
          <button
            type="button"
            onClick={() => setActiveTab('benefits')}
            className={`flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-t-lg border-b-2 px-4 py-2.5 text-xs font-bold font-mono transition-all ${
              activeTab === 'benefits'
                ? 'border-[#00FF66] bg-slate-900/50 text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="h-4 w-4" />
            <span>Value &amp; Impact</span>
          </button>

          {/* REST API Docs */}
          <button
            type="button"
            onClick={() => setActiveTab('api')}
            className={`flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-t-lg border-b-2 px-4 py-2.5 text-xs font-bold font-mono transition-all ${
              activeTab === 'api'
                ? 'border-[#00FF66] bg-slate-900/50 text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="h-4 w-4" />
            <span>REST API Docs</span>
          </button>
        </nav>

        {/* Scrollable Content Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6 text-sm leading-relaxed">
          {/* ========================================================= */}
          {/* OVERVIEW                                                   */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <section className="space-y-6">
              {/* SHAYAK Information Card */}
              <div
                className="flex flex-col items-center gap-6 rounded-xl border p-5 md:flex-row"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.cardSubtleBg,
                }}
              >
                <ShayakLogo
                  size="lg"
                  showText={true}
                />

                <div className="min-w-0 flex-1">
                  <h3 className="mb-3 text-xl font-bold font-mono">
                    What is SHAYAK?
                  </h3>

                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: theme.textMuted,
                    }}
                  >
                    SHAYAK is a principal-level{' '}
                    <strong className="text-emerald-400">
                      AI Technical Interviewer
                    </strong>{' '}
                    designed to rigorously evaluate candidates
                    across the 31-Day AI Engineering Cohort
                    curriculum. Unlike generic chatbots, SHAYAK
                    operates with the precision of a Principal AI
                    Systems Architect.
                  </p>
                </div>
              </div>

              {/* Overview Feature Cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Adaptive Interviewing */}
                <div
                  className="space-y-2 rounded-xl border p-4"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.cardSubtleBg,
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-400">
                    <Brain className="h-4 w-4" />
                    <span>ADAPTIVE INTERVIEWING</span>
                  </div>

                  <h4 className="font-bold">
                    Probing Edge Cases
                  </h4>

                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: theme.textMuted,
                    }}
                  >
                    Detects surface-level or vague responses and
                    automatically launches targeted
                    &quot;FOLLOW-UP&quot; questions to test true
                    technical depth.
                  </p>
                </div>

                {/* Curriculum Mapped */}
                <div
                  className="space-y-2 rounded-xl border p-4"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.cardSubtleBg,
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-bold font-mono text-cyan-400">
                    <Layers className="h-4 w-4" />
                    <span>CURRICULUM MAPPED</span>
                  </div>

                  <h4 className="font-bold">
                    31-Day AI Coverage
                  </h4>

                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: theme.textMuted,
                    }}
                  >
                    Evaluates candidate mastery across RAG
                    architectures, LLM fine-tuning, autonomous
                    agents, vector search, and model serving.
                  </p>
                </div>

                {/* Multilingual Native */}
                <div
                  className="space-y-2 rounded-xl border p-4"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.cardSubtleBg,
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-bold font-mono text-violet-400">
                    <Globe className="h-4 w-4" />
                    <span>MULTILINGUAL NATIVE</span>
                  </div>

                  <h4 className="font-bold">
                    5 Global Languages
                  </h4>

                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: theme.textMuted,
                    }}
                  >
                    Seamlessly conducts technical interviews in
                    English, Mandarin, Hindi, Spanish, and Arabic
                    without losing architectural rigor.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* ARCHITECTURAL ENGINE                                      */}
          {/* ========================================================= */}
          {activeTab === 'engine' && (
            <section className="space-y-6">
              <h3 className="flex items-center gap-2 text-lg font-bold font-mono text-emerald-400">
                <Cpu className="h-5 w-5" />
                How the SHAYAK Engine Works
              </h3>

              <div className="space-y-4">
                {/* Stage 01 */}
                <div
                  className="flex items-start gap-4 rounded-xl border p-4"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.cardSubtleBg,
                  }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 font-mono text-sm font-bold text-emerald-400">
                    01
                  </div>

                  <div>
                    <h4 className="mb-1 font-bold">
                      Candidate Profile &amp; Cohort Day Ingestion
                    </h4>

                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: theme.textMuted,
                      }}
                    >
                      When an interview starts, SHAYAK analyzes
                      the candidate&apos;s target role, experience
                      level, and completed cohort days to construct
                      a customized multi-day evaluation schedule.
                    </p>
                  </div>
                </div>

                {/* Stage 02 */}
                <div
                  className="flex items-start gap-4 rounded-xl border p-4"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.cardSubtleBg,
                  }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 font-mono text-sm font-bold text-cyan-400">
                    02
                  </div>

                  <div>
                    <h4 className="mb-1 font-bold">
                      Generative Dynamic Question Synthesis
                    </h4>

                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: theme.textMuted,
                      }}
                    >
                      Utilizes Gemini model prompt templates to
                      frame production engineering scenarios rather
                      than simple trivia, evaluating trade-offs in
                      latency, accuracy, and cost.
                    </p>
                  </div>
                </div>

                {/* Stage 03 */}
                <div
                  className="flex items-start gap-4 rounded-xl border p-4"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.cardSubtleBg,
                  }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 font-mono text-sm font-bold text-violet-400">
                    03
                  </div>

                  <div>
                    <h4 className="mb-1 font-bold">
                      Real-time Turn Evaluation &amp; Adaptive
                      Branching
                    </h4>

                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: theme.textMuted,
                      }}
                    >
                      Each answer is scored on a 1-10 scale.
                      Answers lacking technical depth trigger a{' '}
                      <strong className="text-violet-400">
                        &quot;FOLLOW-UP&quot;
                      </strong>{' '}
                      branching node to help the candidate
                      elaborate before advancing topics.
                    </p>
                  </div>
                </div>

                {/* Stage 04 */}
                <div
                  className="flex items-start gap-4 rounded-xl border p-4"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.cardSubtleBg,
                  }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-400/10 font-mono text-sm font-bold text-pink-400">
                    04
                  </div>

                  <div>
                    <h4 className="mb-1 font-bold">
                      Final Competency &amp; Scorecard Generation
                    </h4>

                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: theme.textMuted,
                      }}
                    >
                      When the interview completes (minimum 8
                      questions and 4 days covered), SHAYAK
                      generates a 5-category breakdown report with
                      day-by-day scores and recommended next steps.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* VALUE & IMPACT                                             */}
          {/* ========================================================= */}
          {activeTab === 'benefits' && (
            <section className="space-y-6">
              <h3 className="flex items-center gap-2 text-lg font-bold font-mono text-emerald-400">
                <Target className="h-5 w-5" />
                Why SHAYAK Transforms Technical Hiring
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Hiring Managers & Engineering Leads */}
                <div
                  className="rounded-xl border p-5"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.cardSubtleBg,
                  }}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />

                    <h4 className="text-base font-bold">
                      For Hiring Managers &amp; Engineering Leads
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {/* Bullet 1 */}
                    <div className="flex items-start gap-3">
                      <Zap className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />

                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: theme.textMuted,
                        }}
                      >
                        <strong className="text-emerald-400">
                          Zero Engineering Screener Overhead:
                        </strong>{' '}
                        Saves 10+ engineering hours per week on
                        initial candidate screeners.
                      </p>
                    </div>

                    {/* Bullet 2 */}
                    <div className="flex items-start gap-3">
                      <Zap className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />

                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: theme.textMuted,
                        }}
                      >
                        <strong className="text-emerald-400">
                          Unbiased &amp; Standardized Signal:
                        </strong>{' '}
                        Eliminates human interviewer bias with
                        consistent, curriculum-backed metrics.
                      </p>
                    </div>

                    {/* Bullet 3 */}
                    <div className="flex items-start gap-3">
                      <Zap className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />

                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: theme.textMuted,
                        }}
                      >
                        <strong className="text-emerald-400">
                          Deep Transcript Analysis:
                        </strong>{' '}
                        Access candidate strengths, knowledge gaps,
                        and exact turn transcripts instantly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Engineering Candidates */}
                <div
                  className="rounded-xl border p-5"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.cardSubtleBg,
                  }}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <Award className="h-6 w-6 text-cyan-400" />

                    <h4 className="text-base font-bold">
                      For AI Engineering Candidates
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {/* Bullet 1 */}
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-1 h-4 w-4 shrink-0 text-cyan-400" />

                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: theme.textMuted,
                        }}
                      >
                        <strong className="text-cyan-400">
                          Realistic Architectural Scenarios:
                        </strong>{' '}
                        Practice answering real-world production
                        engineering trade-off questions.
                      </p>
                    </div>

                    {/* Bullet 2 */}
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-1 h-4 w-4 shrink-0 text-cyan-400" />

                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: theme.textMuted,
                        }}
                      >
                        <strong className="text-cyan-400">
                          Actionable Feedback &amp; Growth:
                        </strong>{' '}
                        Get instant breakdown of technical accuracy,
                        reasoning, and missing concepts.
                      </p>
                    </div>

                    {/* Bullet 3 */}
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-1 h-4 w-4 shrink-0 text-cyan-400" />

                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: theme.textMuted,
                        }}
                      >
                        <strong className="text-cyan-400">
                          Stress-free Evaluation:
                        </strong>{' '}
                        Conduct interviews in native languages with
                        interactive, non-intimidating dialog.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* REST API DOCS                                             */}
          {/* ========================================================= */}
          {activeTab === 'api' && (
            <section className="space-y-6">
              <h3 className="flex items-center gap-2 text-lg font-bold font-mono text-emerald-400">
                <Code2 className="h-5 w-5" />
                REST API Integration Specification
              </h3>

              {/* API Documentation Panel */}
              <div
                className="space-y-3 overflow-x-auto rounded-xl border bg-slate-950 p-4 font-mono text-xs text-slate-100"
                style={{
                  borderColor: theme.border,
                }}
              >
                {/* Endpoint Header */}
                <div className="flex min-w-max items-center justify-between gap-6 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-400">
                      POST
                    </span>

                    <span className="text-slate-100">
                      /api/interview
                    </span>
                  </div>

                  <span className="text-slate-400">
                    Content-Type: application/json
                  </span>
                </div>

                {/* Request Payload */}
                <div className="pt-2 text-slate-500">
                  // Request Payload (Start or Submit Answer):
                </div>

                <pre className="overflow-x-auto whitespace-pre text-cyan-400">
{`{
  "sessionId": "session_172312345_abc12",
  "candidate": "CAND-007", // or candidate object
  "message": "We use HNSW vector indexing with cosine distance...",
  "language": "English"
}`}
                </pre>

                {/* Response Payload */}
                <div className="mt-4 border-t border-slate-800 pt-4">
                  <div className="mb-3 text-slate-500">
                    // Response Payload (Interview Step):
                  </div>

                  <pre className="overflow-x-auto whitespace-pre text-emerald-400">
{`{
  "reply": "FOLLOW-UP: You mentioned HNSW indexing. How do you tune M and efConstruction for memory constraints?",
  "done": false,
  "sessionId": "session_172312345_abc12",
  "language": "English"
}`}
                  </pre>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer
          className="flex items-center justify-between border-t px-6 py-4"
          style={{
            borderColor: theme.border,
            backgroundColor: theme.cardSubtleBg,
          }}
        >
          <span
            className="text-xs"
            style={{
              color: theme.textMuted,
            }}
          >
            SHAYAK AI Technical Interviewer Platform
          </span>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl px-5 py-2 text-xs font-bold"
            style={{
              backgroundColor: theme.buttonPrimary,
            }}
          >
            Got it, Let&apos;s Interview
          </button>
        </footer>
      </div>
    </div>
  );
};

export default BookletModal;
```
