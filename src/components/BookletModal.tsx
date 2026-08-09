import React, { useState } from 'react';
import { ShayakLogo } from './ShayakLogo';
import { ThemeConfig } from '../theme';
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

interface BookletModalProps {
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const BookletModal: React.FC<BookletModalProps> = ({ theme, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'engine' | 'benefits' | 'api'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border ${theme.cardBg} ${theme.border} ${theme.textPrimary} overflow-hidden shadow-2xl relative`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${theme.border} flex items-center justify-between ${theme.headerBg}`}>
          <div className="flex items-center gap-3">
            <ShayakLogo size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-mono tracking-wide">SHAYAK PLATFORM BOOKLET</h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${theme.pillBg}`}>
                  v2.5 Release
                </span>
              </div>
              <p className={`text-xs ${theme.textMuted}`}>
                Complete guide to understanding the AI Technical Interviewer & Architecture
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg border ${theme.border} ${theme.textMuted} hover:${theme.textPrimary} transition-all cursor-pointer`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`px-6 pt-3 border-b ${theme.border} flex items-center gap-2 overflow-x-auto ${theme.cardSubtleBg}`}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-t-lg text-xs font-bold font-mono flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#00FF66] text-[#00FF66] bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            1. Overview & Vision
          </button>

          <button
            onClick={() => setActiveTab('engine')}
            className={`px-4 py-2.5 rounded-t-lg text-xs font-bold font-mono flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'engine'
                ? 'border-[#00FF66] text-[#00FF66] bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            2. Architectural Engine
          </button>

          <button
            onClick={() => setActiveTab('benefits')}
            className={`px-4 py-2.5 rounded-t-lg text-xs font-bold font-mono flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'benefits'
                ? 'border-[#00FF66] text-[#00FF66] bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-4 h-4" />
            3. Value & Impact
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-2.5 rounded-t-lg text-xs font-bold font-mono flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'api'
                ? 'border-[#00FF66] text-[#00FF66] bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            4. REST API Docs
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className={`p-5 rounded-xl border ${theme.border} ${theme.cardSubtleBg} flex flex-col md:flex-row items-center gap-6`}>
                <ShayakLogo size="lg" showText={true} />
                <div className="space-y-2 text-left">
                  <h3 className="text-xl font-bold font-sans">
                    What is SHAYAK?
                  </h3>
                  <p className={`${theme.textMuted}`}>
                    SHAYAK is a principal-level <strong className="text-emerald-400">AI Technical Interviewer</strong> designed to rigorously evaluate candidates across the 31-Day AI Engineering Cohort curriculum. Unlike generic chatbots, SHAYAK operates with the precision of a Principal AI Systems Architect.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border ${theme.border} ${theme.cardSubtleBg} space-y-2`}>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs">
                    <Brain className="w-4 h-4" />
                    ADAPTIVE INTERVIEWING
                  </div>
                  <h4 className="font-bold text-sm">Probing Edge Cases</h4>
                  <p className={`text-xs ${theme.textMuted}`}>
                    Detects surface-level or vague responses and automatically launches targeted "FOLLOW-UP" questions to test true technical depth.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${theme.border} ${theme.cardSubtleBg} space-y-2`}>
                  <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-xs">
                    <Layers className="w-4 h-4" />
                    CURRICULUM MAPPED
                  </div>
                  <h4 className="font-bold text-sm">31-Day AI Coverage</h4>
                  <p className={`text-xs ${theme.textMuted}`}>
                    Evaluates candidate mastery across RAG architectures, LLM fine-tuning, autonomous agents, vector search, and model serving.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${theme.border} ${theme.cardSubtleBg} space-y-2`}>
                  <div className="flex items-center gap-2 text-violet-400 font-bold font-mono text-xs">
                    <Globe className="w-4 h-4" />
                    MULTILINGUAL NATIVE
                  </div>
                  <h4 className="font-bold text-sm">5 Global Languages</h4>
                  <p className={`text-xs ${theme.textMuted}`}>
                    Seamlessly conducts technical interviews in English, Mandarin, Hindi, Spanish, and Arabic without losing architectural rigor.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'engine' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold font-mono flex items-center gap-2 text-emerald-400">
                <Cpu className="w-5 h-5" />
                How the SHAYAK Engine Works
              </h3>

              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${theme.border} ${theme.cardSubtleBg} flex items-start gap-4`}>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono font-bold flex items-center justify-center shrink-0">
                    01
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold">Candidate Profile & Cohort Day Ingestion</h4>
                    <p className={`text-xs ${theme.textMuted}`}>
                      When an interview starts, SHAYAK analyzes the candidate's target role, experience level, and completed cohort days to construct a customized multi-day evaluation schedule.
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${theme.border} ${theme.cardSubtleBg} flex items-start gap-4`}>
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-mono font-bold flex items-center justify-center shrink-0">
                    02
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold">Generative Dynamic Question Synthesis</h4>
                    <p className={`text-xs ${theme.textMuted}`}>
                      Utilizes Gemini model prompt templates to frame production engineering scenarios rather than simple trivia, evaluating trade-offs in latency, accuracy, and cost.
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${theme.border} ${theme.cardSubtleBg} flex items-start gap-4`}>
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/40 font-mono font-bold flex items-center justify-center shrink-0">
                    03
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold">Real-time Turn Evaluation & Adaptive Branching</h4>
                    <p className={`text-xs ${theme.textMuted}`}>
                      Each answer is scored on a 1-10 scale. Answers lacking technical depth trigger a "FOLLOW-UP" branching node to help the candidate elaborate before advancing topics.
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${theme.border} ${theme.cardSubtleBg} flex items-start gap-4`}>
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/40 font-mono font-bold flex items-center justify-center shrink-0">
                    04
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold">Final Competency & Scorecard Generation</h4>
                    <p className={`text-xs ${theme.textMuted}`}>
                      When the interview completes (minimum 8 questions and 4 days covered), SHAYAK generates a 5-category breakdown report with day-by-day scores and recommended next steps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold font-mono flex items-center gap-2 text-emerald-400">
                <Target className="w-5 h-5" />
                Why SHAYAK Transforms Technical Hiring
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-5 rounded-xl border ${theme.border} ${theme.cardSubtleBg} space-y-3`}>
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    For Hiring Managers & Engineering Leads
                  </div>
                  <ul className={`space-y-2 text-xs ${theme.textMuted}`}>
                    <li className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <strong>Zero Engineering Screener Overhead:</strong> Saves 10+ engineering hours per week on initial candidate screeners.
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <strong>Unbiased & Standardized Signal:</strong> Eliminates human interviewer bias with consistent, curriculum-backed metrics.
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <strong>Deep Transcript Analysis:</strong> Access candidate strengths, knowledge gaps, and exact turn transcripts instantly.
                    </li>
                  </ul>
                </div>

                <div className={`p-5 rounded-xl border ${theme.border} ${theme.cardSubtleBg} space-y-3`}>
                  <div className="flex items-center gap-2 font-bold text-cyan-400">
                    <Award className="w-5 h-5" />
                    For AI Engineering Candidates
                  </div>
                  <ul className={`space-y-2 text-xs ${theme.textMuted}`}>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <strong>Realistic Architectural Scenarios:</strong> Practice answering real-world production engineering trade-off questions.
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <strong>Actionable Feedback & Growth:</strong> Get instant breakdown of technical accuracy, reasoning, and missing concepts.
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <strong>Stress-free Evaluation:</strong> Conduct interviews in native languages with interactive, non-intimidating dialog.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold font-mono flex items-center gap-2 text-emerald-400">
                <Code2 className="w-5 h-5" />
                REST API Integration Specification
              </h3>

              <div className={`p-4 rounded-xl border ${theme.border} bg-slate-950 text-slate-100 font-mono text-xs space-y-3 overflow-x-auto`}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-emerald-400 font-bold">POST /api/interview</span>
                  <span className="text-slate-400">Content-Type: application/json</span>
                </div>

                <div>
                  <p className="text-slate-400 mb-1">// Request Payload (Start or Submit Answer):</p>
                  <pre className="text-cyan-300">
{`{
  "sessionId": "session_172312345_abc12",
  "candidate": "CAND-007", // or candidate object
  "message": "We use HNSW vector indexing with cosine distance...",
  "language": "English"
}`}
                  </pre>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <p className="text-slate-400 mb-1">// Response Payload (Interview Step):</p>
                  <pre className="text-emerald-300">
{`{
  "reply": "FOLLOW-UP: You mentioned HNSW indexing. How do you tune M and efConstruction for memory constraints?",
  "done": false,
  "sessionId": "session_172312345_abc12",
  "language": "English"
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${theme.border} flex items-center justify-between ${theme.cardSubtleBg}`}>
          <span className={`text-xs ${theme.textMuted}`}>
            SHAYAK AI Technical Interviewer Platform
          </span>
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-xs font-bold ${theme.buttonPrimary} cursor-pointer`}
          >
            Got it, Let's Interview
          </button>
        </div>
      </div>
    </div>
  );
};
