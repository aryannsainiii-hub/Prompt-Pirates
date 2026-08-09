import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Target,
  ArrowRight,
  Award,
  CheckCircle2,
  Search,
  Filter,
  Flame,
  GitCommit,
  Trophy,
  User,
} from 'lucide-react';

import { CandidateProfile, CurriculumDay } from '../types';

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
    candidates[0]?.id ?? 'CAND-001'
  );

  const [searchQuery, setSearchQuery] = useState('');

  const [roleFilter, setRoleFilter] = useState<
    'ALL' | 'AI' | 'ENGINEER' | 'ANALYST_MANAGEMENT'
  >('ALL');

  // curriculum is intentionally part of the component contract.
  // It may be used by future curriculum-aware UI.
  void curriculum;

  const selectedCandidate =
    candidates.find(
      (candidate) => candidate.id === selectedCandidateId
    ) ?? candidates[0];

  const filteredCandidates = candidates.filter((candidate) => {
    const q = searchQuery.toLowerCase();

    const searchableValues = [
      candidate.name,
      candidate.id,
      candidate.role,
      candidate.member?.jobRole,
      candidate.member?.education,
    ];

    const matchesSearch = searchableValues.some((value) =>
      value?.toLowerCase().includes(q)
    );

    if (!matchesSearch) {
      return false;
    }

    const role = candidate.role.toLowerCase();

    if (roleFilter === 'AI') {
      return role.includes('ai') || role.includes('data');
    }

    if (roleFilter === 'ENGINEER') {
      return (
        role.includes('engineer') ||
        role.includes('developer') ||
        role.includes('architect')
      );
    }

    if (roleFilter === 'ANALYST_MANAGEMENT') {
      return (
        !role.includes('ai') &&
        !role.includes('engineer') &&
        !role.includes('developer')
      );
    }

    return true;
  });

  const filterTabs: Array<{
    id: 'ALL' | 'AI' | 'ENGINEER' | 'ANALYST_MANAGEMENT';
    label: string;
  }> = [
    {
      id: 'ALL',
      label: `All (${candidates.length})`,
    },
    {
      id: 'AI',
      label: 'AI & Data',
    },
    {
      id: 'ENGINEER',
      label: 'Engineering',
    },
    {
      id: 'ANALYST_MANAGEMENT',
      label: 'Analyst & Management',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      {/* ============================================================ */}
      {/* HEADER                                                        */}
      {/* ============================================================ */}
      <header className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>31-Day AI Cohort • 20 Candidates</span>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">
          Candidate Evaluation Profiles
        </h1>

        <p className="mx-auto max-w-2xl text-xs text-slate-400 sm:text-sm">
          Select a candidate from the 31-day cohort to launch an
          adaptive technical interview session based on their
          completed missions and signals.
        </p>
      </header>

      {/* ============================================================ */}
      {/* SEARCH & FILTER CONTROLS                                      */}
      {/* ============================================================ */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 sm:flex-row">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search candidate by name, ID, role, or degree..."
            className="w-full rounded-xl border border-slate-700/60 bg-slate-800/80 py-2 pl-9 pr-3 text-xs text-slate-100 transition-all placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Role Filters */}
        <div className="flex w-full items-center gap-1 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
          <Filter className="mr-1 h-4 w-4 shrink-0 text-slate-500" />

          {filterTabs.map((tab) => {
            const isActive = roleFilter === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setRoleFilter(
                    tab.id as
                      | 'ALL'
                      | 'AI'
                      | 'ENGINEER'
                      | 'ANALYST_MANAGEMENT'
                  )
                }
                className={`cursor-pointer whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* CANDIDATE GRID                                                */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        {filteredCandidates.map((candidate) => {
          const isSelected =
            candidate.id === selectedCandidateId;

          const member = candidate.member;
          const signals = candidate.signals;

          return (
            <div
              key={candidate.id}
              onClick={() =>
                setSelectedCandidateId(candidate.id)
              }
              className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-indigo-500 bg-slate-900/95 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/30'
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              {/* Candidate Identity */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    {/* Candidate ID Badge */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold tracking-wider ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {candidate.id.replace('CAND-', '')}
                    </div>

                    {/* Name & Role */}
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-slate-100">
                        {candidate.name}
                      </h3>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {member?.jobRole ?? candidate.role}
                      </p>

                      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                        {candidate.experienceLevel}
                      </p>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  <CheckCircle2
                    className={`h-5 w-5 shrink-0 ${
                      isSelected
                        ? 'text-indigo-400'
                        : 'text-slate-600'
                    }`}
                  />
                </div>

                {/* Signals */}
                {signals && (
                  <div className="mb-3.5 mt-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-800/80 bg-slate-950/60 p-2.5">
                    {/* Commits */}
                    <div className="flex flex-col items-center justify-center text-center">
                      <Flame className="mb-1 h-4 w-4 text-amber-400" />

                      <span className="text-[10px] font-medium text-slate-500">
                        Commits
                      </span>

                      <span className="mt-0.5 text-xs font-bold text-slate-200">
                        {signals.commitDays} days
                      </span>
                    </div>

                    {/* Missions */}
                    <div className="flex flex-col items-center justify-center border-x border-slate-800/80 px-2 text-center">
                      <Trophy className="mb-1 h-4 w-4 text-emerald-400" />

                      <span className="text-[10px] font-medium text-slate-500">
                        Missions
                      </span>

                      <span className="mt-0.5 text-xs font-bold text-slate-200">
                        {signals.missionsCompleted} / 31
                      </span>
                    </div>

                    {/* First Try */}
                    <div className="flex flex-col items-center justify-center text-center">
                      <GitCommit className="mb-1 h-4 w-4 text-indigo-400" />

                      <span className="text-[10px] font-medium text-slate-500">
                        1st Try
                      </span>

                      <span className="mt-0.5 text-xs font-bold text-slate-200">
                        {signals.missionsFirstTry}
                      </span>
                    </div>
                  </div>
                )}

                {/* Completed Missions */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <BookOpen className="h-3.5 w-3.5 text-emerald-400" />

                    <span>
                      Passed Missions ({candidate.completedDays.length}):
                    </span>
                  </div>

                  <div className="flex max-h-16 flex-wrap gap-1.5 overflow-y-auto">
                    {candidate.completedDays.map((dayNum) => (
                      <span
                        key={dayNum}
                        className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400"
                      >
                        Day {dayNum}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selection Action */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-2 text-xs font-semibold text-indigo-400">
                <span>
                  {isSelected
                    ? 'Selected for Interview'
                    : 'Click to select candidate'}
                </span>

                <ArrowRight
                  className={`h-3.5 w-3.5 transition-transform ${
                    isSelected ? 'translate-x-1' : ''
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* SELECTED CANDIDATE ACTION CARD                                */}
      {/* ============================================================ */}
      {selectedCandidate && (
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-6 text-left shadow-2xl shadow-indigo-950/50">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Candidate Summary */}
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
                <Award className="h-6 w-6 text-indigo-400" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-100 sm:text-lg">
                  Ready to Interview {selectedCandidate.name}{' '}
                  ({selectedCandidate.id})
                </h2>

                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-400">
                  {selectedCandidate.background}
                </p>
              </div>
            </div>

            {/* Start Interview Button */}
            <button
              type="button"
              onClick={() =>
                onStartInterview(selectedCandidate.id)
              }
              disabled={isLoading}
              className="flex w-full cursor-pointer transform items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/25 transition-all active:scale-95 hover:from-indigo-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Initializing Interview Engine...</span>
                </>
              ) : (
                <>
                  <span>Start Technical Interview</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Empty Search Result */}
      {filteredCandidates.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
          <User className="mx-auto mb-3 h-8 w-8 text-slate-600" />

          <p className="text-sm font-semibold text-slate-300">
            No candidates found
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Try changing your search query or role filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default CandidateSelector;
```
