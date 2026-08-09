import React from 'react';
import { Bot, Terminal, ShieldCheck, Sparkles, Code2, RefreshCw } from 'lucide-react';

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
    <header>
      {/* Left Branding */}

      <div>
        <div>
          <Bot />
          <span>AI Interview Agent</span>
        </div>

        <div>
          <Terminal />
          <span>31-Day AI Cohort</span>
        </div>

        <div>
          <ShieldCheck />
          <span>ABTalks Vibe Code Hackathon • Problem Statement 2</span>
        </div>
      </div>

      {/* Right Badges & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
        {hasActiveSession && (
          <button
            onClick={onResetSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
            title="Reset current session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Session</span>
          </button>
        )}

        <button
          onClick={onOpenInspector}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
        >
          <Code2 className="w-4 h-4 text-cyan-300" />
          <span>Judge Inspector & API Specs</span>
        </button>
      </div>
    </header>
  );
};