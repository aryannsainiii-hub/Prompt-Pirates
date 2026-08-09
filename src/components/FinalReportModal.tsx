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
  Sparkles
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
    const day = curriculum.find(d => d.day === dayNum);
    return day ? `Day ${dayNum}: ${day.title}` : `Day ${dayNum}`;
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
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(session, null, 2));

    const downloadAnchor = document.createElement('a');

    downloadAnchor.setAttribute('href', dataStr);

    downloadAnchor.setAttribute(
      'download',
      `interview_report_${session.candidate?.id || 'candidate'}_${session.sessionId}.json`
    );

    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const modalBg = isDarkMode
    ? 'bg-[#121215] border-[#27272a] text-zinc-100'
    : 'bg-white border-zinc-200 text-zinc-900';

  const headerBg = isDarkMode
    ? 'bg-[#121215]/95 border-[#27272a]'
    : 'bg-[#e0e2e8] border-zinc-300';

  const cardBg = isDarkMode
    ? 'bg-[#18181b] border-[#27272a]'
    : 'bg-[#f0f1f5] border-zinc-300 shadow-sm';

  const subCardBg = isDarkMode
    ? 'bg-[#09090b] border-[#27272a]'
    : 'bg-[#e5e7eb] border-zinc-300';

  const textMuted = isDarkMode
    ? 'text-zinc-400'
    : 'text-zinc-600';

  const titleText = isDarkMode
    ? 'text-white'
    : 'text-zinc-900';

  const questionCountDisplay =
    session.questionCount ?? session.turns?.length ?? 0;

  const daysCoveredCount =
    session.daysCovered?.length ?? 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div
        className={`${modalBg} border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col`}
      >

        {/* Sticky Header */}
        <div
          className={`sticky top-0 ${headerBg} border-b p-5 sm:p-6 flex items-center justify-between z-10`}
        >
          <div className="flex items-center gap-3">

            <div
              className={`w-10 h-10 rounded-lg ${
                isDarkMode
                  ? 'bg-[#18181b] border-[#27272a] text-emerald-400'
                  : 'bg-white border-zinc-300 text-emerald-600'
              } border flex items-center justify-center shadow-sm`}
            >
              <Award className="w-5 h-5" />
            </div>

            <div>
              <h2
                className={`font-extrabold text-base sm:text-lg ${titleText}`}
              >
                Technical Assessment Report
              </h2>

              <p
                className={`text-xs ${textMuted} font-mono mt-0.5`}
              >
                CANDIDATE:{' '}
                <span className="text-violet-500 font-semibold">
                  {session.candidate?.name} ({session.candidate?.id})
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? 'bg-[#18181b] text-zinc-400 hover:text-white border-[#27272a]'
                : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 border-zinc-200'
            } border transition-all cursor-pointer`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">

          {/* Overall Assessment */}
          <div
            className={`${cardBg} rounded-lg p-5 sm:p-6 space-y-4 border`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />

                <span
                  className={`text-xs font-mono uppercase font-bold tracking-wider ${titleText}`}
                >
                  Overall Architectural Assessment
                </span>
              </div>

              <div className="flex items-center gap-2">

                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-violet-500/10 text-violet-400 border border-violet-500/30">
                  {questionCountDisplay} Qs Asked · {daysCoveredCount} Days
                </span>

                <div
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold border ${
                    levelColorMap[feedback.technicalLevel] ||
                    (
                      isDarkMode
                        ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                        : 'bg-violet-100 text-violet-800 border-violet-300'
                    )
                  }`}
                >
                  LEVEL: {feedback.technicalLevel}
                </div>

              </div>
            </div>

            <p
              className={`text-xs sm:text-sm ${
                isDarkMode
                  ? 'text-zinc-200'
                  : 'text-zinc-700'
              } leading-relaxed font-normal`}
            >
              {feedback.overallSummary}
            </p>

            {/* Category Breakdown */}
            {feedback.categoryScores && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">

                <div
                  className={`${subCardBg} p-3 rounded-lg border space-y-1`}
                >
                  <div className="flex justify-between text-[11px] font-mono font-semibold text-zinc-400">
                    <span>Tech Accuracy</span>
                    <span className="text-emerald-400 font-bold">
                      {feedback.categoryScores.technicalAccuracy}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${feedback.categoryScores.technicalAccuracy}%`
                      }}
                    />
                  </div>
                </div>

                <div
                  className={`${subCardBg} p-3 rounded-lg border space-y-1`}
                >
                  <div className="flex justify-between text-[11px] font-mono font-semibold text-zinc-400">
                    <span>Tech Depth</span>
                    <span className="text-cyan-400 font-bold">
                      {feedback.categoryScores.depth}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{
                        width: `${feedback.categoryScores.depth}%`
                      }}
                    />
                  </div>
                </div>

                <div
                  className={`${subCardBg} p-3 rounded-lg border space-y-1`}
                >
                  <div className="flex justify-between text-[11px] font-mono font-semibold text-zinc-400">
                    <span>Reasoning</span>
                    <span className="text-violet-400 font-bold">
                      {feedback.categoryScores.reasoning}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full"
                      style={{
                        width: `${feedback.categoryScores.reasoning}%`
                      }}
                    />
                  </div>
                </div>

                <div
                  className={`${subCardBg} p-3 rounded-lg border space-y-1`}
                >
                  <div className="flex justify-between text-[11px] font-mono font-semibold text-zinc-400">
                    <span>Communication</span>
                    <span className="text-pink-400 font-bold">
                      {feedback.categoryScores.communication}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500 rounded-full"
                      style={{
                        width: `${feedback.categoryScores.communication}%`
                      }}
                    />
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Day-by-Day Score Breakdown */}
          {feedback.dayScores && (
            <div>

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

                    return (
                      <div
                        key={dayNum}
                        className={`${subCardBg} rounded-lg p-3.5 space-y-2 border`}
                      >

                        <span
                          className={`text-[10px] font-mono font-bold ${textMuted} block truncate`}
                        >
                          DAY {dayNum}
                        </span>

                        <p
                          className={`text-xs font-semibold ${titleText} truncate`}
                          title={title}
                        >
                          {title.split(':')[1] || title}
                        </p>

                        <div className="flex items-center justify-between pt-1 font-mono">

                          <span className={`text-xs ${textMuted}`}>
                            Score:
                          </span>

                          <span
                            className={`text-sm font-bold ${
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
                                    : 'text-amber-600'
                            }`}
                          >
                            {scoreNum} / 10
                          </span>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            </div>
          )}

          {/* Strengths & Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Strengths */}
            <div
              className={`${cardBg} rounded-lg p-5 space-y-3 border`}
            >

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />

                <h4 className="font-bold text-xs font-mono uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Key Technical Strengths
                </h4>
              </div>

              <ul
                className={`space-y-2 text-xs ${
                  isDarkMode
                    ? 'text-zinc-200'
                    : 'text-zinc-700'
                }`}
              >
                {feedback.strengths?.map((s, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

            </div>

            {/* Gaps */}
            <div
              className={`${cardBg} rounded-lg p-5 space-y-3 border`}
            >

              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />

                <h4 className="font-bold text-xs font-mono uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                  Key Growth Areas
                </h4>
              </div>

              <ul
                className={`space-y-2 text-xs ${
                  isDarkMode
                    ? 'text-zinc-200'
                    : 'text-zinc-700'
                }`}
              >
                {feedback.gaps?.map((g, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>

            </div>

          </div>

          {/* Recommended Next Steps */}
          {feedback.recommendedNextSteps && (
            <div
              className={`${cardBg} rounded-lg p-5 space-y-3 border`}
            >

              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-violet-500" />

                <h4 className="font-bold text-xs font-mono uppercase text-violet-600 dark:text-violet-400 tracking-wider">
                  Actionable Learning Roadmap
                </h4>
              </div>

              <ul
                className={`space-y-2 text-xs ${
                  isDarkMode
                    ? 'text-zinc-200'
                    : 'text-zinc-700'
                }`}
              >
                {feedback.recommendedNextSteps.map(
                  (rec, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2"
                    >
                      <span className="font-bold font-mono text-violet-500 shrink-0">
                        {idx + 1}.
                      </span>

                      <span>{rec}</span>
                    </li>
                  )
                )}
              </ul>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div
          className={`border-t ${
            isDarkMode
              ? 'border-[#27272a] bg-[#121215]/90'
              : 'border-zinc-200 bg-[#e8e8ed]'
          } p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3`}
        >

          <button
            onClick={handleExportJSON}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-lg ${
              isDarkMode
                ? 'bg-[#18181b] hover:bg-[#27272a] text-zinc-200 border-[#27272a]'
                : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300'
            } font-bold text-xs border flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm`}
          >
            <Download className="w-4 h-4 text-cyan-500" />
            <span>Export Report JSON</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">

            <button
              onClick={onClose}
              className={`w-1/2 sm:w-auto px-5 py-2.5 rounded-lg ${
                isDarkMode
                  ? 'bg-[#18181b] hover:bg-[#27272a] text-zinc-300 border-[#27272a]'
                  : 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-300'
              } font-bold text-xs border cursor-pointer shadow-sm`}
            >
              Close
            </button>

            <button
              onClick={onStartNewSession}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs border border-violet-500/50 shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Start New Session</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};