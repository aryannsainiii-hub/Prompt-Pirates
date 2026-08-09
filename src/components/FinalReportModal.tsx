import React from 'react';
import { InterviewSession, CurriculumDay } from '../types';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Download,
  RefreshCw,
  X,
  Sparkles,
} from 'lucide-react';

interface FinalReportModalProps {
  session: InterviewSession;
  curriculum: CurriculumDay[];
  onClose: () => void;
  onStartNewSession: () => void;
  isDarkMode?: boolean;
}

export const FinalReportModal: React.FC<FinalReportModalProps> = ({
  session,
  curriculum,
  onClose,
  onStartNewSession,
  isDarkMode = true,
}) => {
  const feedback = session.finalFeedback;

  if (!feedback) return null;

  const getDayTitle = (dayNum: number) => {
    const day = curriculum.find((item) => item.day === dayNum);

    if (day) {
      return `Day ${dayNum}: ${day.title}`;
    }

    return `Day ${dayNum}`;
  };

  const levelColorMap: Record<string, string> = {
    Expert: isDarkMode
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      : 'bg-emerald-100 text-emerald-800 border-emerald-300',

    Advanced: isDarkMode
      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
      : 'bg-cyan-100 text-cyan-800 border-cyan-300',

    Competent: isDarkMode
      ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
      : 'bg-violet-100 text-violet-800 border-violet-300',

    Emerging: isDarkMode
      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      : 'bg-amber-100 text-amber-800 border-amber-300',
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(session, null, 2);
    const dataUri =
      'data:text/json;charset=utf-8,' + encodeURIComponent(json);

    const anchor = document.createElement('a');
    anchor.href = dataUri;
    anchor.download = `interview_report_${
      session.candidate?.id || 'candidate'
    }_${session.sessionId}.json`;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const questionCountDisplay =
    session.questionCount ?? session.turns?.length ?? 0;

  const daysCoveredCount = session.daysCovered?.length ?? 0;

  const modalBg = isDarkMode
    ? 'bg-[#121215] border-[#27272a] text-zinc-100'
    : 'bg-[#f4f4f5] border-zinc-300 text-zinc-900';

  const headerBg = isDarkMode
    ? 'bg-[#121215]/95 border-[#27272a]'
    : 'bg-[#f4f4f5]/95 border-zinc-200';

  const cardBg = isDarkMode
    ? 'bg-[#18181b] border-[#27272a]'
    : 'bg-white border-zinc-200';

  const subCardBg = isDarkMode
    ? 'bg-[#09090b] border-[#27272a]'
    : 'bg-zinc-50 border-zinc-200';

  const textMuted = isDarkMode
    ? 'text-zinc-400'
    : 'text-zinc-500';

  const titleText = isDarkMode
    ? 'text-white'
    : 'text-zinc-900';

  const fallbackLevelStyle = isDarkMode
    ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
    : 'bg-violet-100 text-violet-800 border-violet-300';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans"
    >
      <div
        className={`border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col ${modalBg}`}
      >
        {/* ========================================================= */}
        {/* Sticky Header                                             */}
        {/* ========================================================= */}
        <header
          className={`sticky top-0 border-b p-5 sm:p-6 flex items-center justify-between z-10 ${headerBg}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-lg border flex items-center justify-center shadow-sm shrink-0 ${
                isDarkMode
                  ? 'bg-[#18181b] border-[#27272a] text-emerald-400'
                  : 'bg-white border-zinc-300 text-emerald-600'
              }`}
            >
              <Award className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <h2
                className={`font-extrabold text-base sm:text-lg truncate ${titleText}`}
              >
                Technical Assessment Report
              </h2>

              <p className="text-[10px] sm:text-xs font-mono mt-0.5 truncate">
                <span className={textMuted}>CANDIDATE: </span>
                <span className="text-violet-500 font-semibold">
                  {session.candidate?.name}
                </span>
                <span className={textMuted}> (</span>
                <span className="text-violet-500 font-semibold">
                  {session.candidate?.id}
                </span>
                <span className={textMuted}>)</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close report"
            className={`p-2 rounded-lg border transition-all cursor-pointer shrink-0 ${
              isDarkMode
                ? 'bg-[#18181b] text-zinc-400 hover:text-white border-[#27272a]'
                : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 border-zinc-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* ========================================================= */}
        {/* Content Body                                              */}
        {/* ========================================================= */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Overall Architectural Assessment */}
          <section
            className={`${cardBg} rounded-lg p-5 sm:p-6 space-y-4 border`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />

                <h3
                  className={`text-xs font-mono uppercase font-bold tracking-wider ${titleText}`}
                >
                  OVERALL ARCHITECTURAL ASSESSMENT
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-violet-500/10 text-violet-400 border border-violet-500/30">
                  {questionCountDisplay} Qs Asked · {daysCoveredCount} Days
                </span>

                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
                    levelColorMap[feedback.technicalLevel] ||
                    fallbackLevelStyle
                  }`}
                >
                  LEVEL: {feedback.technicalLevel}
                </span>
              </div>
            </div>

            <p
              className={`text-xs sm:text-sm leading-relaxed font-normal ${
                isDarkMode ? 'text-zinc-200' : 'text-zinc-700'
              }`}
            >
              {feedback.overallSummary}
            </p>

            {/* Category Scores */}
            {feedback.categoryScores && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div
                  className={`${subCardBg} p-3 rounded-lg border space-y-1`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      Tech Accuracy
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {feedback.categoryScores.technicalAccuracy}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{
                        width: `${feedback.categoryScores.technicalAccuracy}%`,
                      }}
                    />
                  </div>
                </div>

                <div
                  className={`${subCardBg} p-3 rounded-lg border space-y-1`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-400">
                      Tech Depth
                    </span>
                    <span className="text-xs font-bold text-cyan-400">
                      {feedback.categoryScores.depth}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500"
                      style={{
                        width: `${feedback.categoryScores.depth}%`,
                      }}
                    />
                  </div>
                </div>

                <div
                  className={`${subCardBg} p-3 rounded-lg border space-y-1`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-violet-400">
                      Reasoning
                    </span>
                    <span className="text-xs font-bold text-violet-400">
                      {feedback.categoryScores.reasoning}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500"
                      style={{
                        width: `${feedback.categoryScores.reasoning}%`,
                      }}
                    />
                  </div>
                </div>

                <div
                  className={`${subCardBg} p-3 rounded-lg border space-y-1`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-pink-400">
                      Communication
                    </span>
                    <span className="text-xs font-bold text-pink-400">
                      {feedback.categoryScores.communication}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500"
                      style={{
                        width: `${feedback.categoryScores.communication}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Curriculum Performance */}
          {feedback.dayScores && (
            <section
              className={`${cardBg} rounded-lg p-5 space-y-3 border`}
            >
              <h3
                className={`text-xs font-mono uppercase font-bold tracking-wider ${textMuted} mb-3 flex items-center gap-2`}
              >
                <BarChart3 className="w-4 h-4 text-cyan-500" />
                Curriculum Performance Breakdown
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(feedback.dayScores).map(
                  ([dayNumStr, score]) => {
                    const dayNum = parseInt(dayNumStr, 10);
                    const title = getDayTitle(dayNum);
                    const scoreNum = Number(score) || 0;

                    const scoreColor =
                      scoreNum >= 8
                        ? isDarkMode
                          ? 'text-emerald-400'
                          : 'text-emerald-600'
                        : scoreNum >= 6
                        ? isDarkMode
                          ? 'text-cyan-400'
                          : 'text-cyan-600'
                        : isDarkMode
                        ? 'text-amber-400'
                        : 'text-amber-600';

                    return (
                      <div
                        key={dayNumStr}
                        className={`${subCardBg} rounded-lg p-3.5 space-y-2 border`}
                      >
                        <div className="text-[10px] font-mono font-bold text-cyan-500">
                          DAY {dayNum}
                        </div>

                        <div
                          className={`text-xs truncate ${
                            isDarkMode
                              ? 'text-zinc-300'
                              : 'text-zinc-700'
                          }`}
                          title={title}
                        >
                          {title.split(':')[1] || title}
                        </div>

                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className={textMuted}>Score:</span>

                          <span className={`font-bold ${scoreColor}`}>
                            {scoreNum} / 10
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          )}

          {/* Strengths + Growth Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section
              className={`${cardBg} rounded-lg p-5 space-y-3 border`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />

                <h3
                  className={`text-xs font-mono uppercase font-bold tracking-wider ${titleText}`}
                >
                  Key Technical Strengths
                </h3>
              </div>

              <ul className="space-y-2">
                {feedback.strengths?.map((strength, index) => (
                  <li
                    key={`${strength}-${index}`}
                    className="flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />

                    <span
                      className={`text-xs ${
                        isDarkMode
                          ? 'text-zinc-200'
                          : 'text-zinc-700'
                      }`}
                    >
                      {strength}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className={`${cardBg} rounded-lg p-5 space-y-3 border`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />

                <h3
                  className={`text-xs font-mono uppercase font-bold tracking-wider ${titleText}`}
                >
                  Key Growth Areas
                </h3>
              </div>

              <ul className="space-y-2">
                {feedback.gaps?.map((gap, index) => (
                  <li
                    key={`${gap}-${index}`}
                    className="flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />

                    <span
                      className={`text-xs ${
                        isDarkMode
                          ? 'text-zinc-200'
                          : 'text-zinc-700'
                      }`}
                    >
                      {gap}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Actionable Learning Roadmap */}
          {feedback.recommendedNextSteps && (
            <section
              className={`${cardBg} rounded-lg p-5 space-y-3 border`}
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-violet-500" />

                <h3 className="text-xs font-mono uppercase font-bold tracking-wider text-violet-500">
                  ACTIONABLE LEARNING ROADMAP
                </h3>
              </div>

              <div className="space-y-2">
                {feedback.recommendedNextSteps.map((step, index) => (
                  <div
                    key={`${step}-${index}`}
                    className="flex items-start gap-3 text-xs"
                  >
                    <span className="font-bold font-mono text-violet-500 shrink-0">
                      {index + 1}.
                    </span>

                    <span
                      className={
                        isDarkMode
                          ? 'text-zinc-200'
                          : 'text-zinc-700'
                      }
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ========================================================= */}
        {/* Footer Actions                                            */}
        {/* ========================================================= */}
        <footer
          className={`border-t p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDarkMode
              ? 'border-[#27272a] bg-[#121215]/90'
              : 'border-zinc-200 bg-[#e8e8ed]'
          }`}
        >
          <button
            type="button"
            onClick={handleExportJSON}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-lg font-bold text-xs border flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              isDarkMode
                ? 'bg-[#18181b] border-[#27272a] text-zinc-300 hover:text-white'
                : 'bg-white border-zinc-300 text-zinc-700 hover:text-zinc-900'
            }`}
          >
            <Download className="w-4 h-4 text-cyan-500" />
            Export Report JSON
          </button>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`w-1/2 sm:w-auto px-5 py-2.5 rounded-lg font-bold text-xs border cursor-pointer shadow-sm transition-all ${
                isDarkMode
                  ? 'bg-[#18181b] border-[#27272a] text-zinc-300 hover:text-white'
                  : 'bg-white border-zinc-300 text-zinc-700 hover:text-zinc-900'
              }`}
            >
              Close
            </button>

            <button
              type="button"
              onClick={onStartNewSession}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs border border-violet-500/50 shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Start New Session
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FinalReportModal;
```
