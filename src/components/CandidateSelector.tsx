import React, { useState } from 'react';
import { CandidateProfile, CurriculumDay } from '../types';
import { Sparkles, BookOpen, Target, ArrowRight, Award, CheckCircle2, Search, Filter, Flame, GitCommit, Trophy, User } from 'lucide-react';

interface CandidateSelectorProps {
  candidates: CandidateProfile[];
  curriculum: CurriculumDay[];
  onStartInterview: (candidateId: string) => void;
  isLoading: boolean;
}

export const CandidateSelector: React.FC<CandidateSelectorProps> = ({
  candidates,
  curriculum,
  onStartInterview,
  isLoading,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    candidates[0]?.id || 'CAND-001'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'AI' | 'ENGINEER' | 'ANALYST_MANAGEMENT'>('ALL');

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

  const filteredCandidates = candidates.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      (c.member?.jobRole && c.member.jobRole.toLowerCase().includes(q)) ||
      (c.member?.education && c.member.education.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (roleFilter === 'AI') {
      return c.role.toLowerCase().includes('ai') || c.role.toLowerCase().includes('data');
    } else if (roleFilter === 'ENGINEER') {
      return c.role.toLowerCase().includes('engineer') || c.role.toLowerCase().includes('developer') || c.role.toLowerCase().includes('architect');
    } else if (roleFilter === 'ANALYST_MANAGEMENT') {
      return !c.role.toLowerCase().includes('ai') && !c.role.toLowerCase().includes('engineer') && !c.role.toLowerCase().includes('developer');
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>31-Day AI Cohort • 20 Candidates</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Candidate Evaluation Profiles
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Select a candidate from the 31-day cohort to launch an adaptive technical interview session based on their completed missions and signals.
        </p>
      </div>

      {/* Controls: Search and Role Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate by name, ID, role, or degree..."
            className="w-full bg-slate-800/80 border border-slate-700/60 text-slate-100 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: `All (${candidates.length})` },
            { id: 'AI', label: 'AI & Data' },
            { id: 'ENGINEER', label: 'Engineering' },
            { id: 'ANALYST_MANAGEMENT', label: 'Analyst & Management' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredCandidates.map((candidate) => {
          const isSelected = candidate.id === selectedCandidateId;
          const member = candidate.member;
          const signals = candidate.signals;

          return (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidateId(candidate.id)}
              className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-200 border text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900/95 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/30'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-xs tracking-wider ${
                      isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {candidate.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                        {candidate.name}
                      </h3>
                      <p className="text-xs font-semibold text-indigo-400">
                        {member ? member.jobRole : candidate.role}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {candidate.experienceLevel}
                      </p>
                    </div>
                  </div>

                  <div className={`p-1.5 rounded-full ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Signals Bar */}
                {signals && (
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/60 rounded-xl p-2.5 mb-3.5 border border-slate-800/80">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" /> Commits
                      </span>
                      <span className="text-xs font-extrabold text-slate-100">{signals.commitDays} days</span>
                    </div>
                    <div className="text-center border-x border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                        <Trophy className="w-3 h-3 text-emerald-400" /> Missions
                      </span>
                      <span className="text-xs font-extrabold text-slate-100">{signals.missionsCompleted} / 31</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                        <GitCommit className="w-3 h-3 text-indigo-400" /> 1st Try
                      </span>
                      <span className="text-xs font-extrabold text-slate-100">{signals.missionsFirstTry}</span>
                    </div>
                  </div>
                )}

                {/* Completed Missions Days */}
                <div className="space-y-1.5 mb-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-emerald-400" /> Passed Missions ({candidate.completedDays.length}):
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pr-1">
                    {candidate.completedDays.map((dayNum) => (
                      <span
                        key={dayNum}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      >
                        Day {dayNum}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action indicator */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-indigo-400">
                <span>{isSelected ? 'Selected for Interview' : 'Click to select candidate'}</span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Action Card */}
      {selectedCandidate && (
        <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl shadow-indigo-950/50 text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <h4 className="text-lg font-bold text-slate-100">
                  Ready to Interview {selectedCandidate.name} ({selectedCandidate.id})
                </h4>
              </div>
              <p className="text-xs text-slate-400">
                {selectedCandidate.background}
              </p>
            </div>

            <button
              onClick={() => onStartInterview(selectedCandidate.id)}
              disabled={isLoading}
              className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all transform active:scale-95 flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Initializing Interview Engine...</span>
                </>
              ) : (
                <>
                  <span>Start Technical Interview</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
