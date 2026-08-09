import React, { useState, useEffect, useRef } from 'react';
import { CandidateProfile, CurriculumDay, InterviewSession } from './types';
import { CANDIDATE_PROFILES } from './data/candidates';
import { AI_COHORT_CURRICULUM, getCurriculumDay } from './data/curriculum';
import { SAMPLE_EVALUATION_REPORTS } from './data/sampleReports';
import { startInterview, processAnswer } from './services/interviewEngine';
import { sessionManager } from './services/sessionManager';
import { FinalReportModal } from './components/FinalReportModal';
import { SplashScreen } from './components/SplashScreen';
import { ShayakLogo } from './components/ShayakLogo';
import { EngineeringGrid } from './components/EngineeringGrid';
import { BookletModal } from './components/BookletModal';
import { ThemeId, classNameThemeMap } from './theme';

import {
  Bot,
  User,
  Send,
  RefreshCw,
  Moon,
  Sun,
  Play,
  CheckCircle2,
  Clock,
  MessageSquare,
  Paperclip,
  Code,
  Lightbulb,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  FileText,
  Users,
  Settings,
  Sparkles,
  X,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Grid,
  Monitor,
  Award,
  BarChart3,
  Search,
  Globe,
  Palette,
  BookOpen,
} from 'lucide-react';

export default function App() {
  // Splash Screen state
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Theme & Language State
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('app_theme_id') as ThemeId;
    if (saved && classNameThemeMap[saved]) {
      return saved;
    }
    return 'dark-slate';
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    const saved = localStorage.getItem('app_language');
    return saved || 'English';
  });

  const [showBookletModal, setShowBookletModal] = useState<boolean>(false);

  const themeConfig = classNameThemeMap[currentThemeId] || classNameThemeMap['dark-slate'];
  const isDarkMode = themeConfig ? themeConfig.isDark : true;

  useEffect(() => {
    localStorage.setItem('app_theme_id', currentThemeId);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentThemeId, isDarkMode]);

  useEffect(() => {
    localStorage.setItem('app_language', selectedLanguage);
  }, [selectedLanguage]);

  // Main State
  const [candidates] = useState<CandidateProfile[]>(CANDIDATE_PROFILES);
  const [curriculum] = useState<CurriculumDay[]>(AI_COHORT_CURRICULUM);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('CAND-007');
  const [activeTab, setActiveTab] = useState<'interview' | 'candidates' | 'reports' | 'settings'>('interview');

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [activeReportSession, setActiveReportSession] = useState<InterviewSession | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportFilterSearch, setReportFilterSearch] = useState('');

  // Timer State
  const [secondsElapsed, setSecondsElapsed] = useState(1104);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  // Derive Interview Status Badge
  const interviewStatus: 'Ready' | 'Interview Active' | 'Completed' = !session
    ? 'Ready'
    : session.isCompleted
    ? 'Completed'
    : 'Interview Active';

  // Start live timer when session is active
  useEffect(() => {
    if (session && !session.isCompleted) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session?.sessionId, session?.isCompleted]);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.turns.length, session?.currentQuestion, isSubmitting]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Interview Handler
  const handleStartInterview = async (candidateIdToStart?: string) => {
    const id = candidateIdToStart || selectedCandidateId;
    setIsLoading(true);
    try {
      const newSession = await startInterview(id, undefined, selectedLanguage);
      setSession(newSession);
      setSecondsElapsed(0);
      setActiveTab('interview');
    } catch (err) {
      console.error('Failed to start interview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Answer Handler
  const handleSubmitAnswer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!session || !answerText.trim() || isSubmitting) return;

    const currentAns = answerText.trim();
    setAnswerText('');
    setIsSubmitting(true);

    try {
      const { session: updatedSession } = await processAnswer(session.sessionId, currentAns, selectedLanguage);
      setSession(updatedSession);
      if (updatedSession.isCompleted) {
        setActiveReportSession(updatedSession);
        setShowReportModal(true);
      }
    } catch (err) {
      console.error('Failed to process answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset Session
  const handleResetInterview = () => {
    if (session) {
      sessionManager.deleteSession(session.sessionId);
    }
    setSession(null);
    setAnswerText('');
    setSecondsElapsed(0);
  };

  // Open Report Modal for candidate or session
  const handleOpenReportModal = (reportTargetSession?: InterviewSession | null) => {
    if (reportTargetSession) {
      setActiveReportSession(reportTargetSession);
    } else if (session?.finalFeedback) {
      setActiveReportSession(session);
    } else {
      setActiveReportSession(SAMPLE_EVALUATION_REPORTS[selectedCandidateId] || SAMPLE_EVALUATION_REPORTS['CAND-007']);
    }
    setShowReportModal(true);
  };

  // Get Current Day Info
  const currentDayNum = session?.currentQuestionDay || 12;
  const currentDay = getCurriculumDay(currentDayNum) || curriculum[11];

  // Quick answer helpers
  const insertQuickAnswer = (type: 'ideal' | 'concise' | 'uncertain') => {
    if (type === 'ideal') {
      setAnswerText(
        `I would first verify that the query and document chunks use identical embedding model versions and normalization. Next, I'd check chunk size overlaps and similarity distance metrics. Then I'd inspect metadata filter logic and vector index health to ensure no quantization corruption occurred.`
      );
    } else if (type === 'concise') {
      setAnswerText(
        `I'd check embedding model consistency, review chunking strategy, and inspect vector index health and retrieval top-k parameters.`
      );
    } else {
      setAnswerText(`I'm not entirely sure. Could you clarify how chunk overlap affects retrieval precision in this context?`);
    }
  };

  // Theme styling constants mapped directly from themeConfig
  const themeClasses = {
    bg: themeConfig.bg,
    header: themeConfig.headerBg,
    card: themeConfig.cardBg,
    cardSubtle: themeConfig.cardSubtleBg,
    cardSubtleBg: themeConfig.cardSubtleBg,
    tagFollowUpBg: themeConfig.tagFollowUpBg,
    sidebarActive: isDarkMode
      ? 'bg-[#27272a] text-white border border-[#3f3f46] shadow-sm font-bold'
      : 'bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold shadow-xs',
    sidebarInactive: isDarkMode
      ? 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
      : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80',
    interviewerBubble: themeConfig.interviewerBubble,
    candidateBubble: themeConfig.candidateBubble,
    textarea: themeConfig.textareaBg,
    inputContainer: isDarkMode ? 'bg-[#121215] border-[#27272a]' : 'bg-[#e2e8f0] border-slate-300',
    select: isDarkMode
      ? 'bg-[#121215] border-[#27272a] text-zinc-200'
      : 'bg-white border-slate-300 text-slate-800 shadow-2xs',
    subtext: themeConfig.textMuted,
    border: themeConfig.border,
    pillBg: themeConfig.pillBg,
  };

  // Available Evaluation Reports (Live session + sample candidate reports)
  const allReportsList: { candidateId: string; sessionData: InterviewSession; isLive: boolean }[] = [];

  if (session && (session.isCompleted || session.finalFeedback || session.turns.length > 0)) {
    allReportsList.push({
      candidateId: session.candidate.id,
      sessionData: session.finalFeedback
        ? session
        : {
            ...session,
            isCompleted: true,
            finalFeedback: {
              overallSummary: `Live ongoing technical assessment session for ${session.candidate.name}. Evaluated across ${session.daysCovered.length} curriculum days with ${session.turns.length} responses.`,
              strengths: ['Active candidate participation', 'Structured technical responses'],
              gaps: ['Session in progress; final evaluation metrics being synthesized'],
              recommendedNextSteps: ['Complete remaining questions to calculate final level score'],
              dayScores: session.daysCovered.reduce((acc, day) => ({ ...acc, [day]: 8 }), {}),
              technicalLevel: 'Competent',
            },
          },
      isLive: true,
    });
  }

  // Append sample reports for candidates not covered by active session
  Object.entries(SAMPLE_EVALUATION_REPORTS).forEach(([candId, sampleSess]) => {
    if (!allReportsList.some((r) => r.candidateId === candId)) {
      allReportsList.push({
        candidateId: candId,
        sessionData: sampleSess,
        isLive: false,
      });
    }
  });

  const filteredReportsList = allReportsList.filter((r) => {
    const q = reportFilterSearch.toLowerCase();
    return (
      r.sessionData.candidate.name.toLowerCase().includes(q) ||
      r.sessionData.candidate.id.toLowerCase().includes(q) ||
      r.sessionData.candidate.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className={`min-h-screen ${themeClasses.bg} flex flex-col font-sans antialiased selection:bg-emerald-900 selection:text-white transition-colors duration-200 relative`}>
      {/* BACKGROUND TECHNICAL GRID */}
      <EngineeringGrid theme={themeConfig} />

      {/* SPLASH SCREEN OVERLAY */}
      {showSplash && <SplashScreen theme={themeConfig} onComplete={() => setShowSplash(false)} />}

      {/* PLATFORM BOOKLET MODAL */}
      <BookletModal theme={themeConfig} isOpen={showBookletModal} onClose={() => setShowBookletModal(false)} />

      {/* HEADER BAR */}
      <header className={`h-16 border-b ${themeClasses.header} px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200 relative`}>
        <div className="flex items-center gap-3 shrink-0">
          <ShayakLogo size="sm" showText={false} />
          <div className="flex items-center gap-2">
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-mono text-[10px] font-extrabold tracking-widest uppercase text-emerald-400 -mb-1">
                SHAYAK
              </span>
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight whitespace-nowrap">
                AI Technical Interviewer
              </h1>
            </div>

            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border font-semibold hidden xl:inline-block whitespace-nowrap ${themeClasses.pillBg}`}>
              31-Day AI Cohort
            </span>

            {/* STATUS BADGE */}
            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 whitespace-nowrap ${
              interviewStatus === 'Interview Active'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : interviewStatus === 'Completed'
                ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                : 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                interviewStatus === 'Interview Active' ? 'bg-emerald-400 animate-pulse' : interviewStatus === 'Completed' ? 'bg-violet-400' : 'bg-zinc-400'
              }`} />
              {interviewStatus.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible no-scrollbar py-1">
          {/* PLATFORM BOOKLET GUIDE BUTTON */}
          <button
            onClick={() => setShowBookletModal(true)}
            className="px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            title="Read SHAYAK Platform Guide Booklet"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">App Guide & Booklet</span>
          </button>

          {/* LANGUAGE SELECTOR */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 absolute left-2.5 text-zinc-400 pointer-events-none" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className={`pl-8 pr-3 py-1.5 rounded-lg text-xs font-semibold border ${themeClasses.select} appearance-none cursor-pointer focus:outline-none transition-all`}
              title="Select Interview Language"
            >
              <option value="English">English</option>
              <option value="Mandarin">Mandarin (中文)</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="Arabic">Arabic (العربية)</option>
            </select>
          </div>

          {/* THEME SELECTOR */}
          <div className="relative flex items-center">
            <Palette className="w-3.5 h-3.5 absolute left-2.5 text-zinc-400 pointer-events-none" />
            <select
              value={currentThemeId}
              onChange={(e) => setCurrentThemeId(e.target.value as ThemeId)}
              className={`pl-8 pr-3 py-1.5 rounded-lg text-xs font-semibold border ${themeClasses.select} appearance-none cursor-pointer focus:outline-none transition-all`}
              title="Select App Theme"
            >
              <option value="dark-slate">1. Dark Mode Neon & Slate</option>
              <option value="trust-blue">2. Trust Blue & Crisp White</option>
              <option value="vibrant-violet">3. Vibrant Violet & Soft Lilac</option>
              <option value="organic-sage">4. Organic Sage & Warm Sand</option>
              <option value="monochrome-crimson">5. Minimalist Monochrome & Crimson</option>
            </select>
          </div>

          {/* EVALUATION REPORTS QUICK ACCESS BUTTON */}
          <button
            onClick={() => handleOpenReportModal()}
            className={`px-3 py-1.5 rounded-lg border ${themeClasses.border} ${themeClasses.cardSubtleBg} hover:opacity-90 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer`}
            title="View Evaluation Reports"
          >
            <Award className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden md:inline">Reports</span>
          </button>

          {/* REPLAY SPLASH BUTTON */}
          <button
            onClick={() => setShowSplash(true)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-[#18181b] border-[#27272a] text-zinc-300 hover:bg-[#27272a]'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs'
            }`}
            title="Replay Splash Screen"
          >
            <Monitor className="w-3.5 h-3.5 text-violet-500" />
            <span className="hidden lg:inline">Splash Demo</span>
          </button>

          {/* RESET INTERVIEW BUTTON */}
          <button
            onClick={handleResetInterview}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-[#18181b] hover:bg-[#27272a] border-[#27272a] text-zinc-300'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-2xs'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden lg:inline">Reset Session</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto p-4 sm:p-6 gap-6 overflow-hidden">
        {/* LEFT NAVIGATION SIDEBAR */}
        <aside className="w-60 shrink-0 flex flex-col justify-between hidden md:flex">
          <div className="space-y-1.5">
            <button
              onClick={() => setActiveTab('interview')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'interview' ? themeClasses.sidebarActive : themeClasses.sidebarInactive
              }`}
            >
              <MessageSquare className="w-4 h-4 text-violet-500" />
              <span>Interview Arena</span>
            </button>

            <button
              onClick={() => setActiveTab('candidates')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'candidates' ? themeClasses.sidebarActive : themeClasses.sidebarInactive
              }`}
            >
              <Users className="w-4 h-4 text-cyan-500" />
              <span>Cohort Candidates</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'reports' ? themeClasses.sidebarActive : themeClasses.sidebarInactive
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Evaluation Reports</span>
              </div>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                {allReportsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'settings' ? themeClasses.sidebarActive : themeClasses.sidebarInactive
              }`}
            >
              <Settings className="w-4 h-4 text-zinc-400" />
              <span>System Settings</span>
            </button>
          </div>

          {/* ABOUT BOX AT BOTTOM OF SIDEBAR */}
          <div className={`${themeClasses.card} p-4 space-y-3`}>
            <div className="flex items-center gap-2 text-violet-500 font-bold text-xs uppercase tracking-wider">
              <Grid className="w-3.5 h-3.5" />
              <span>Engine Status</span>
            </div>
            <p className={`text-[11px] ${themeClasses.subtext} leading-relaxed`}>
              31-Day AI Cohort evaluation engine powered by Gemini. Evaluates technical depth, architectural trade-offs, and failure recovery.
            </p>
            <button
              onClick={() => setShowHowItWorks(true)}
              className={`w-full py-2 px-3 rounded-lg ${isDarkMode ? 'bg-[#18181b] hover:bg-[#27272a] border-[#27272a] text-violet-300' : 'bg-white hover:bg-zinc-100 border-zinc-300 text-violet-800 shadow-2xs'} font-semibold text-xs border transition-all flex items-center justify-center gap-2 cursor-pointer`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-violet-500" />
              <span>How System Works</span>
            </button>
          </div>
        </aside>

        {/* TAB 1: INTERVIEW MAIN DASHBOARD VIEW */}
        {activeTab === 'interview' && (
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 overflow-hidden">
            {/* COLUMN 1: CANDIDATE PANEL & CANDIDATE PROFILE (XL: 3 cols) */}
            <div className="xl:col-span-3 space-y-5 flex flex-col">
              {/* Candidate Selection Panel */}
              <div className={`${themeClasses.card} p-4 space-y-4`}>
                <div className={`flex items-center justify-between font-bold text-xs uppercase tracking-wider border-b ${themeClasses.border} pb-2.5`}>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-violet-500" />
                    <span>Candidate Selector</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20 font-bold">
                    ACTIVE
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-[11px] font-medium ${themeClasses.subtext}`}>Select Candidate ID</label>
                  <div className="relative">
                    <select
                      value={selectedCandidateId}
                      onChange={(e) => setSelectedCandidateId(e.target.value)}
                      className={`w-full appearance-none ${themeClasses.select} rounded-lg px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-violet-500 pr-8 cursor-pointer`}
                    >
                      {candidates.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.id.split('-')[1]}] {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                <button
                  onClick={() => handleStartInterview()}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs border border-violet-500/50 shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Start Interview Session</span>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </>
                  )}
                </button>
              </div>

              {/* Candidate Profile Card */}
              <div className={`${themeClasses.card} p-4 space-y-3.5 flex-1 flex flex-col justify-between`}>
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider border-b ${themeClasses.border} pb-2.5`}>
                    <User className="w-4 h-4 text-cyan-500" />
                    <span>Candidate Profile</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className={`${themeClasses.subtext} text-[11px] block font-mono`}>NAME</span>
                      <span className="font-bold text-sm">{selectedCandidate.name}</span>
                    </div>

                    <div>
                      <span className={`${themeClasses.subtext} text-[11px] block font-mono`}>ID CODE</span>
                      <span className="font-mono font-bold text-violet-500">{selectedCandidate.id}</span>
                    </div>

                    <div>
                      <span className={`${themeClasses.subtext} text-[11px] block font-mono`}>TARGET ROLE</span>
                      <span className="font-medium">{selectedCandidate.role}</span>
                    </div>

                    <div className={`flex items-center justify-between pt-1 border-t ${themeClasses.border}`}>
                      <span className={`${themeClasses.subtext} font-mono text-[11px]`}>COMPLETED MODULES</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {selectedCandidate.completedDays.length} / 31 Days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className={`w-full py-2 ${isDarkMode ? 'bg-[#18181b] hover:bg-[#27272a] border-[#27272a] text-violet-300' : 'bg-white hover:bg-zinc-100 border-zinc-300 text-violet-800 shadow-2xs'} border rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer`}
                  >
                    <span>View Full Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleOpenReportModal(SAMPLE_EVALUATION_REPORTS[selectedCandidate.id] || SAMPLE_EVALUATION_REPORTS['CAND-007'])}
                    className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View Candidate Report</span>
                  </button>
                </div>
              </div>

              {/* Live Interview Progress Card */}
              <div className={`${themeClasses.card} p-4 space-y-3`}>
                <div className={`flex items-center justify-between font-bold text-xs uppercase tracking-wider border-b ${themeClasses.border} pb-2`}>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span>Interview Progress</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {session ? `${Math.min(100, Math.round(((session.questionCount || session.turns.length) / 8) * 100))}%` : '0%'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center font-mono">
                    <span className={themeClasses.subtext}>Questions:</span>
                    <span className="font-bold text-emerald-400">
                      {session ? session.questionCount || session.turns.length : 0} / 8
                    </span>
                  </div>

                  <div className="flex justify-between items-center font-mono">
                    <span className={themeClasses.subtext}>Days Evaluated:</span>
                    <span className="font-bold text-cyan-400">
                      {session ? session.daysCovered.length : 0} / 4
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-300"
                      style={{
                        width: `${session ? Math.min(100, Math.round(((session.questionCount || session.turns.length) / 8) * 100)) : 0}%`,
                      }}
                    />
                  </div>

                  {/* Curriculum Days Evaluated List */}
                  {session && session.plannedDays.length > 0 && (
                    <div className="pt-2 space-y-1">
                      <span className={`${themeClasses.subtext} text-[10px] uppercase font-mono font-bold block`}>
                        Curriculum Days in Focus
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {session.plannedDays.map((dayNum) => {
                          const isEvaluated = session.daysCovered.includes(dayNum);
                          return (
                            <span
                              key={dayNum}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                                isEvaluated
                                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                  : 'bg-slate-800/80 border-slate-700 text-slate-400'
                              }`}
                            >
                              Day {dayNum}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMN 2: INTERVIEW CONVERSATION STREAM & INPUT (XL: 6 cols) */}
            <div className={`xl:col-span-6 flex flex-col ${themeClasses.card} overflow-hidden h-[720px]`}>
              {/* Header */}
              <div className={`px-5 py-3.5 border-b ${themeClasses.border} ${isDarkMode ? 'bg-[#121215]/80' : 'bg-[#e8e8ed]/80'} flex items-center justify-between shrink-0`}>
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-violet-500" />
                  <h3 className="font-bold text-xs uppercase tracking-wider">Interview Stream</h3>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>STREAM ONLINE</span>
                </div>
              </div>

              {/* Chat Conversation Scroll Area */}
              <div className={`flex-1 overflow-y-auto p-5 space-y-5 ${isDarkMode ? 'bg-[#09090b]/40' : 'bg-[#f4f4f6]/50'}`}>
                {/* Initial Default Interview Prompt view */}
                {!session && (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-zinc-300'} border flex items-center justify-center text-violet-500 shrink-0 shadow-2xs`}>
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2 text-[11px] font-mono">
                          <span className="font-bold text-violet-500">Interviewer AI</span>
                          <span className={themeClasses.subtext}>Day 3 Module</span>
                        </div>
                        <div className={`${themeClasses.interviewerBubble} border rounded-lg p-4 text-xs leading-relaxed`}>
                          Welcome {selectedCandidate.name}. You completed Day 3: Embeddings Explained. Suppose your vector search retrieval pipeline suddenly starts returning low-relevance document chunks in production. How would you systematically diagnose and rectify the issue?
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center justify-end gap-2 text-[11px] font-mono">
                          <span className={themeClasses.subtext}>10:32 AM</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">Candidate Response</span>
                        </div>
                        <div className={`${themeClasses.candidateBubble} border rounded-lg p-4 text-xs leading-relaxed`}>
                          I would first verify query vs document embedding model consistency. Next, I'd check chunk size overlaps and similarity distance metrics (Cosine vs L2), followed by inspecting vector index health and HNSW quantization parameters.
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-zinc-300'} border flex items-center justify-center text-emerald-500 shrink-0 shadow-2xs`}>
                        <User className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-zinc-300'} border flex items-center justify-center text-violet-500 shrink-0 shadow-2xs`}>
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2 text-[11px] font-mono">
                          <span className="font-bold text-violet-500">Interviewer AI</span>
                          <span className={themeClasses.subtext}>Adaptive Follow-Up</span>
                        </div>
                        <div className={`${themeClasses.interviewerBubble} border rounded-lg p-4 text-xs leading-relaxed`}>
                          Excellent breakdown. Assuming model weights match, how would you tune HNSW parameters like `efSearch` and `M` under high query-per-second load without blowing up latency budgets?
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Render Session Turns */}
                {session?.turns.map((turn, idx) => (
                  <div key={idx} className="space-y-4">
                    {/* Question */}
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-zinc-300'} border flex items-center justify-center text-violet-500 shrink-0 shadow-2xs`}>
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2 text-[11px] font-mono">
                          <span className="font-bold text-violet-500">Interviewer AI</span>
                          <span className={themeClasses.subtext}>
                            Day {turn.day}: {turn.dayTitle}
                          </span>
                        </div>
                        <div className={`${themeClasses.interviewerBubble} border rounded-lg p-4 text-xs leading-relaxed`}>
                          {turn.question}
                        </div>
                      </div>
                    </div>

                    {/* Answer */}
                    <div className="flex gap-3 justify-end">
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center justify-end gap-2 text-[11px] font-mono">
                          {turn.evaluation && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20">
                              Score: {turn.evaluation.score}/10
                            </span>
                          )}
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">Candidate</span>
                        </div>
                        <div className={`${themeClasses.candidateBubble} border rounded-lg p-4 text-xs leading-relaxed`}>
                          {turn.answer}
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-zinc-300'} border flex items-center justify-center text-emerald-500 shrink-0 shadow-2xs`}>
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Current Question */}
                {session && !session.isCompleted && session.currentQuestion && (
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-zinc-300'} border flex items-center justify-center text-emerald-400 shrink-0 shadow-2xs`}>
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2 text-[11px] font-mono flex-wrap">
                        <span className="font-bold text-emerald-400">SHAYAK AI</span>
                        <span className={`${themeClasses.subtext} font-bold`}>
                          DAY {session.currentQuestionDay || 1} · {getCurriculumDay(session.currentQuestionDay || 1)?.title.toUpperCase() || 'TOPIC'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
                          QUESTION {(session.questionCount || session.turns.length) + 1} / 8
                        </span>
                        {(session.currentQuestion.toLowerCase().includes('follow-up') || session.currentQuestion.toLowerCase().includes('follow up')) && (
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${themeClasses.tagFollowUpBg} animate-pulse`}>
                            ⚡ FOLLOW-UP
                          </span>
                        )}
                      </div>
                      <div className={`${themeClasses.interviewerBubble} border rounded-xl p-4 text-xs leading-relaxed shadow-md`}>
                        {session.currentQuestion}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submitting Answer Loader */}
                {isSubmitting && (
                  <div className="flex gap-3 items-center">
                    <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-zinc-300'} border flex items-center justify-center text-violet-500 shrink-0 animate-pulse`}>
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className={`${themeClasses.interviewerBubble} border rounded-lg px-4 py-3 flex items-center gap-1.5`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Technical Answer Textarea Input Box */}
              <div className={`p-4 ${themeClasses.inputContainer} border-t shrink-0`}>
                <form onSubmit={handleSubmitAnswer} className="space-y-3">
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitAnswer();
                      }
                    }}
                    placeholder="Provide your technical architecture explanation... (Press Enter ↵ to submit, Shift+Enter for new line)"
                    rows={3}
                    className={`w-full ${themeClasses.textarea} rounded-lg p-3.5 text-xs focus:outline-none transition-all resize-none font-sans`}
                  />

                  <div className="flex items-center justify-between">
                    {/* Bottom Toolbar Shortcuts */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => insertQuickAnswer('ideal')}
                        className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:text-violet-400' : 'bg-white border-zinc-300 text-zinc-600 hover:text-violet-700 shadow-2xs'} border transition-colors cursor-pointer`}
                        title="Insert Ideal High-Depth Answer"
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertQuickAnswer('concise')}
                        className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:text-cyan-400' : 'bg-white border-zinc-300 text-zinc-600 hover:text-cyan-700 shadow-2xs'} border transition-colors cursor-pointer`}
                        title="Insert Concise Code-Oriented Answer"
                      >
                        <Code className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertQuickAnswer('uncertain')}
                        className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:text-amber-400' : 'bg-white border-zinc-300 text-zinc-600 hover:text-amber-700 shadow-2xs'} border transition-colors cursor-pointer`}
                        title="Insert Probe Answer for Follow-up"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Send Answer Button */}
                    <button
                      type="submit"
                      disabled={!answerText.trim() || isSubmitting}
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs border border-violet-500/50 shadow-md shadow-violet-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
                    >
                      <span>Submit Answer</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* COLUMN 3: PROGRESS, TOPIC OBJECTIVES, & TIPS (XL: 3 cols) */}
            <div className="xl:col-span-3 space-y-5 flex flex-col">
              {/* Interview Progress */}
              <div className={`${themeClasses.card} p-4 space-y-4`}>
                <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider border-b ${themeClasses.border} pb-2.5`}>
                  <Zap className="w-4 h-4 text-violet-500" />
                  <span>Session Progress</span>
                </div>

                {/* Questions Asked Metric & Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className={`${themeClasses.subtext}`}>QUESTIONS CONDUCTED</span>
                    <span className="font-bold">
                      {session?.questionCount || 4} / 8 MIN
                    </span>
                  </div>
                  <div className={`w-full h-2 ${isDarkMode ? 'bg-[#09090b] border-[#27272a]' : 'bg-zinc-200 border-zinc-300'} rounded-full overflow-hidden border`}>
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-300 rounded-full"
                      style={{
                        width: `${Math.min(100, (((session?.questionCount || 4) / 8) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Days Covered Pills */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className={`${themeClasses.subtext}`}>COHORT DAYS COVERED</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {session?.daysCovered.length || 4} / 4+
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(session?.daysCovered.length ? session.daysCovered : [3, 7, 8, 12]).map((dayNum) => (
                      <span
                        key={dayNum}
                        className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Day {dayNum}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Time Elapsed */}
                <div className={`pt-2 border-t ${themeClasses.border} flex items-center justify-between text-xs font-mono`}>
                  <span className={`${themeClasses.subtext} flex items-center gap-1.5`}>
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>ELAPSED TIME</span>
                  </span>
                  <span className="font-bold">{formatTime(secondsElapsed)}</span>
                </div>
              </div>

              {/* Current Topic & Objectives */}
              <div className={`${themeClasses.card} p-4 space-y-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-violet-500 font-bold text-xs uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-violet-500" />
                    <span>Active Topic</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20 text-[10px] font-mono font-bold">
                    DAY {currentDay.day}
                  </span>
                </div>

                <h4 className="font-bold text-sm">{currentDay.title}</h4>

                <div className="space-y-2 pt-1">
                  <span className={`text-[11px] font-mono ${themeClasses.subtext} block`}>KEY CONCEPTS ASSESSED</span>
                  <div className="space-y-1.5 text-xs">
                    {currentDay.keyConcepts.map((concept, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="leading-tight">{concept}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tips Section */}
              <div className={`${themeClasses.card} p-4 space-y-2.5 flex-1`}>
                <div className="flex items-center gap-2 text-violet-500 font-bold text-xs uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-violet-500" />
                  <span>Evaluation Strategy</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
                    <span className={themeClasses.subtext}>Explain production latency & precision trade-offs.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Code className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
                    <span className={themeClasses.subtext}>Detail failure modes and mitigation strategies.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
                    <span className={themeClasses.subtext}>Scores below 6 trigger targeted follow-up probes.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CANDIDATES VIEW */}
        {activeTab === 'candidates' && (
          <div className="flex-1 space-y-6 overflow-y-auto">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Cohort Candidates Directory</h2>
              <p className={`text-xs ${themeClasses.subtext} mt-1`}>
                31-Day AI Cohort candidates prepared for technical assessment and adaptive evaluation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((candidate) => (
                <div key={candidate.id} className={`${themeClasses.card} p-5 space-y-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base">{candidate.name}</h3>
                      <p className="text-xs text-violet-500 font-medium">{candidate.role}</p>
                    </div>
                    <span className={`text-xs font-mono px-2.5 py-1 rounded-md border font-bold ${themeClasses.pillBg}`}>
                      {candidate.id}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed ${themeClasses.subtext}`}>{candidate.background}</p>

                  <div className="space-y-1">
                    <span className={`text-[11px] ${themeClasses.subtext} font-mono block font-medium`}>TARGET FOCUS AREAS</span>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.targetAreas.map((area, idx) => (
                        <span key={idx} className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${themeClasses.pillBg}`}>
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => {
                        setSelectedCandidateId(candidate.id);
                        handleStartInterview(candidate.id);
                      }}
                      className="py-2.5 px-3 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs border border-violet-500/50 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
                    >
                      <span>Start Interview</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenReportModal(SAMPLE_EVALUATION_REPORTS[candidate.id] || SAMPLE_EVALUATION_REPORTS['CAND-007'])}
                      className="py-2.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View Report</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REPORTS VAULT VIEW */}
        {activeTab === 'reports' && (
          <div className="flex-1 space-y-6 overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-500" />
                  <span>Evaluation Reports Vault</span>
                </h2>
                <p className={`text-xs ${themeClasses.subtext} mt-1`}>
                  Technical interview assessment reports with score breakdown, strengths, gaps, and roadmap recommendations.
                </p>
              </div>

              {/* Search filter input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={reportFilterSearch}
                  onChange={(e) => setReportFilterSearch(e.target.value)}
                  placeholder="Filter candidate reports..."
                  className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border ${themeClasses.select} focus:outline-none focus:border-violet-500`}
                />
              </div>
            </div>

            {/* Reports List Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReportsList.map(({ candidateId, sessionData, isLive }) => {
                const feedback = sessionData.finalFeedback;
                return (
                  <div key={candidateId} className={`${themeClasses.card} p-5 space-y-4 flex flex-col justify-between`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                            isLive
                              ? 'bg-violet-500/20 text-violet-600 dark:text-violet-300 border-violet-500/40 animate-pulse'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          }`}>
                            {isLive ? 'LIVE SESSION' : 'VERIFIED REPORT'}
                          </span>
                          <span className="text-xs font-mono font-bold text-violet-500">{sessionData.candidate.id}</span>
                        </div>

                        {feedback && (
                          <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            LEVEL: {feedback.technicalLevel}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-extrabold text-base">{sessionData.candidate.name}</h3>
                        <p className="text-xs text-violet-500 font-medium mt-0.5">{sessionData.candidate.role}</p>
                      </div>

                      {feedback && (
                        <p className={`text-xs ${themeClasses.subtext} leading-relaxed line-clamp-3`}>
                          {feedback.overallSummary}
                        </p>
                      )}

                      {/* Day Scores Overview Pills */}
                      {feedback && (
                        <div className="space-y-1.5 pt-1">
                          <span className={`text-[10px] font-mono ${themeClasses.subtext} block font-bold uppercase`}>
                            DAY SCORES OVERVIEW
                          </span>
                          <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                            {Object.entries(feedback.dayScores).map(([dayNum, score]) => (
                              <span key={dayNum} className={`px-2 py-0.5 rounded-md border ${themeClasses.pillBg}`}>
                                Day {dayNum}: <strong className="text-emerald-600 dark:text-emerald-400">{score}/10</strong>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenReportModal(sessionData)}
                      className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs border border-violet-500/50 shadow-md shadow-violet-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Inspect Candidate Assessment Report</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS VIEW */}
        {activeTab === 'settings' && (
          <div className="flex-1 space-y-6 overflow-y-auto">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">System Configuration</h2>
              <p className={`text-xs ${themeClasses.subtext} mt-1`}>
                Engine parameters, model settings, and theme design configuration.
              </p>
            </div>

            <div className={`${themeClasses.card} p-6 space-y-4 text-xs font-mono`}>
              <div className={`flex justify-between items-center border-b ${themeClasses.border} pb-3`}>
                <span className={themeClasses.subtext}>PRIMARY LLM ENGINE</span>
                <span className="text-violet-500 font-bold">gemini-3.6-flash</span>
              </div>
              <div className={`flex justify-between items-center border-b ${themeClasses.border} pb-3`}>
                <span className={themeClasses.subtext}>THEME PALETTE</span>
                <span className="font-bold">{isDarkMode ? 'Deep Zinc Obsidian (#09090b)' : 'Soft Neutral Gray (#f4f4f6)'}</span>
              </div>
              <div className={`flex justify-between items-center border-b ${themeClasses.border} pb-3`}>
                <span className={themeClasses.subtext}>UI STYLE</span>
                <span className="font-bold">Modern Premium AI System • Glassmorphic Depth</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeClasses.subtext}>ADAPTIVE THRESHOLD</span>
                <span className="text-amber-500 font-bold">Score &lt; 6 / 10 Triggers Probing Question</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className={`py-3 px-6 border-t ${themeClasses.border} text-center ${themeClasses.subtext} text-xs font-mono ${isDarkMode ? 'bg-[#121215]/80' : 'bg-[#e8e8ed]/80'} backdrop-blur-md`}>
        AI TECHNICAL INTERVIEWER • 31-DAY COHORT EVALUATION ENGINE
      </footer>

      {/* HOW IT WORKS MODAL */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative ${isDarkMode ? 'glass-modal border-[#27272a] text-zinc-100' : 'glass-modal-light text-zinc-900 border-zinc-300'}`}>
            <button
              onClick={() => setShowHowItWorks(false)}
              className={`absolute top-4 right-4 ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'} cursor-pointer`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-violet-500 font-bold text-base uppercase tracking-wider">
              <Sparkles className="w-5 h-5" />
              <span>How System Operates</span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <p>
                <strong className="font-mono text-violet-500">1. Curriculum Context:</strong> Analyzes candidate profiles and their completed learning modules across the 31-Day AI Cohort.
              </p>
              <p>
                <strong className="font-mono text-violet-500">2. Adaptive Questioning:</strong> Asks production-level architectural scenario questions covering curriculum modules.
              </p>
              <p>
                <strong className="font-mono text-violet-500">3. Real-Time Evaluation:</strong> Scores answers 1–10. Scores under 6 automatically trigger focused follow-up probing questions.
              </p>
              <p>
                <strong className="font-mono text-violet-500">4. Structured Feedback:</strong> Generates a full assessment report highlighting strengths, gaps, and readiness levels.
              </p>
            </div>

            <button
              onClick={() => setShowHowItWorks(false)}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs border border-violet-500/50 shadow-md cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* CANDIDATE FULL PROFILE MODAL */}
      {showProfileModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative ${isDarkMode ? 'glass-modal border-[#27272a] text-zinc-100' : 'glass-modal-light text-zinc-900 border-zinc-300'}`}>
            <button
              onClick={() => setShowProfileModal(false)}
              className={`absolute top-4 right-4 ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'} cursor-pointer`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-[#18181b] border-[#27272a] text-violet-400' : 'bg-violet-100 border-violet-300 text-violet-800'} border flex items-center justify-center font-mono font-bold`}>
                {selectedCandidate.id.split('-')[1]}
              </div>
              <div>
                <h3 className="font-bold text-base">{selectedCandidate.name}</h3>
                <p className="text-xs text-violet-500 font-medium">{selectedCandidate.role}</p>
              </div>
            </div>

            <div className={`space-y-3 text-xs border-t ${themeClasses.border} pt-3`}>
              <div>
                <span className={`${themeClasses.subtext} font-mono block`}>BACKGROUND</span>
                <p className="mt-0.5 leading-relaxed">{selectedCandidate.background}</p>
              </div>

              <div>
                <span className={`${themeClasses.subtext} font-mono block`}>TARGET EXPERTISE FOCUS</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedCandidate.targetAreas.map((area, idx) => (
                    <span key={idx} className={`px-2 py-0.5 rounded-md border font-mono ${themeClasses.pillBg}`}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className={`${themeClasses.subtext} font-mono block`}>EVALUATOR NOTES</span>
                <p className={`mt-0.5 ${themeClasses.subtext} italic`}>{selectedCandidate.notes}</p>
              </div>
            </div>

            <button
              onClick={() => setShowProfileModal(false)}
              className={`w-full py-2.5 rounded-lg ${isDarkMode ? 'bg-[#18181b] hover:bg-[#27272a] border-[#27272a] text-zinc-200' : 'bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-800'} border font-bold text-xs cursor-pointer shadow-xs`}
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* FINAL ASSESSMENT REPORT MODAL */}
      {showReportModal && activeReportSession && (
        <FinalReportModal
          session={activeReportSession}
          curriculum={curriculum}
          isDarkMode={isDarkMode}
          onClose={() => setShowReportModal(false)}
          onStartNewSession={() => {
            setShowReportModal(false);
            handleResetInterview();
          }}
        />
      )}
    </div>
  );
}
