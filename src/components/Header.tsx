import React from "react";
import {
  Bot,
  Terminal,
  ShieldCheck,
  Sparkles,
  Code2,
  RefreshCw,
} from "lucide-react";

interface HeaderProps {
  onOpenInspector: () => void;
  onResetSession: () => void;
  hasActiveSession: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenInspector,
  onResetSession,
  hasActiveSession,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/95 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Branding */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 shadow-sm shadow-indigo-500/10">
            <Bot className="h-5 w-5 text-cyan-400" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-sm font-extrabold tracking-tight text-slate-100 sm:text-base">
                AI Interview Agent
              </h1>

              <div className="hidden items-center gap-1.5 text-[10px] font-medium text-slate-500 sm:flex">
                <Terminal className="h-3 w-3 text-indigo-400" />
                <span>31-Day AI Cohort</span>
              </div>
            </div>

            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-[10px] font-semibold text-indigo-400 sm:text-xs">
                31-Day AI Cohort
              </span>

              <span className="text-[10px] text-slate-600">•</span>

              <span className="text-[10px] text-slate-500 sm:text-xs">
                ABTalks Vibe Code Hackathon • Problem Statement 2
              </span>
            </div>

            <div className="mt-1 hidden items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-slate-600 md:flex">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              <span>Adaptive Technical Evaluation</span>
              <Sparkles className="h-3 w-3 text-violet-400" />
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-3">
          {hasActiveSession && (
            <button
              type="button"
              onClick={onResetSession}
              title="Reset current session"
              className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-slate-700 hover:text-white cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset Session</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenInspector}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-blue-500 cursor-pointer"
          >
            <Code2 className="h-4 w-4 text-cyan-300" />
            <span>Judge Inspector &amp; API Specs</span>
          </button>
        </div>
      </div>
    </header>
  );
};
//finalize

export default Header;
