import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  FileText,
  Filter,
  Globe2,
  GraduationCap,
  HelpCircle,
  Home,
  Languages,
  Menu,
  MessageSquare,
  Moon,
  MoreVertical,
  Play,
  Plus,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Timer,
  User,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type ThemeMode = "light" | "dark";

type Language = "English" | "Hindi";

type View =
  | "arena"
  | "candidates"
  | "reports"
  | "settings";

type ModalType =
  | "none"
  | "howItWorks"
  | "candidate"
  | "finalReport";

type Candidate = {
  id: number;
  name: string;
  role: string;
  email: string;
  experience: string;
  skills: string[];
  avatar: string;
  status: "Ready" | "In Progress" | "Completed";
  score?: number;
};

type Question = {
  id: number;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  expectedTime: number;
};

type Message = {
  id: number;
  sender: "system" | "candidate" | "interviewer";
  text: string;
  timestamp: string;
};

type InterviewSession = {
  id: string;
  candidateId: number;
  startedAt: number | null;
  currentQuestion: number;
  answeredQuestions: number;
  totalQuestions: number;
  score: number;
  status: "idle" | "active" | "completed";
};

type Report = {
  id: number;
  candidateId: number;
  candidateName: string;
  role: string;
  score: number;
  technical: number;
  communication: number;
  problemSolving: number;
  recommendation: "Strong Hire" | "Hire" | "Review";
  date: string;
};


/* =========================================================
   MOCK DATA
========================================================= */

const candidates: Candidate[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Frontend Engineer",
    email: "aarav.sharma@example.com",
    experience: "2 years",
    skills: ["React", "TypeScript", "JavaScript", "CSS"],
    avatar: "AS",
    status: "Ready",
  },
  {
    id: 2,
    name: "Priya Mehta",
    role: "Full Stack Developer",
    email: "priya.mehta@example.com",
    experience: "3 years",
    skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    avatar: "PM",
    status: "Completed",
    score: 86,
  },
  {
    id: 3,
    name: "Rohan Verma",
    role: "Backend Engineer",
    email: "rohan.verma@example.com",
    experience: "1.5 years",
    skills: ["Python", "FastAPI", "PostgreSQL", "Docker"],
    avatar: "RV",
    status: "In Progress",
    score: 74,
  },
  {
    id: 4,
    name: "Ananya Singh",
    role: "Software Engineer",
    email: "ananya.singh@example.com",
    experience: "2.5 years",
    skills: ["C++", "Java", "DSA", "System Design"],
    avatar: "AS",
    status: "Ready",
  },
];

const questions: Question[] = [
  {
    id: 1,
    category: "Frontend",
    difficulty: "Easy",
    question:
      "Can you explain the difference between state and props in React?",
    expectedTime: 120,
  },
  {
    id: 2,
    category: "JavaScript",
    difficulty: "Medium",
    question:
      "How does the JavaScript event loop work, and why is it important?",
    expectedTime: 180,
  },
  {
    id: 3,
    category: "Architecture",
    difficulty: "Medium",
    question:
      "How would you design a scalable frontend application for millions of users?",
    expectedTime: 240,
  },
  {
    id: 4,
    category: "Problem Solving",
    difficulty: "Hard",
    question:
      "Imagine an application suddenly becomes slow after a new release. How would you debug it?",
    expectedTime: 240,
  },
  {
    id: 5,
    category: "System Design",
    difficulty: "Hard",
    question:
      "Design a real-time notification system for a large web application.",
    expectedTime: 300,
  },
];

const sampleReports: Report[] = [
  {
    id: 1,
    candidateId: 2,
    candidateName: "Priya Mehta",
    role: "Full Stack Developer",
    score: 86,
    technical: 90,
    communication: 82,
    problemSolving: 86,
    recommendation: "Strong Hire",
    date: "Aug 08, 2026",
  },
  {
    id: 2,
    candidateId: 3,
    candidateName: "Rohan Verma",
    role: "Backend Engineer",
    score: 74,
    technical: 78,
    communication: 70,
    problemSolving: 74,
    recommendation: "Hire",
    date: "Aug 07, 2026",
  },
];


/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  /* -------------------------------------------------------
     APPLICATION STATE
  ------------------------------------------------------- */

  const [showSplash, setShowSplash] = useState(true);

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("shayak-theme");
    return saved === "dark" ? "dark" : "light";
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("shayak-language");
    return saved === "Hindi" ? "Hindi" : "English";
  });

  const [activeView, setActiveView] =
    useState<View>("arena");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate>(candidates[0]);

  const [modal, setModal] =
    useState<ModalType>("none");

  const [searchQuery, setSearchQuery] = useState("");

  const [answer, setAnswer] = useState("");

  const [elapsedTime, setElapsedTime] = useState(0);

  const [messages, setMessages] = useState<Message[]>([]);

  const [session, setSession] =
    useState<InterviewSession>({
      id: "SESSION-001",
      candidateId: candidates[0].id,
      startedAt: null,
      currentQuestion: 0,
      answeredQuestions: 0,
      totalQuestions: questions.length,
      score: 0,
      status: "idle",
    });

  const chatEndRef = useRef<HTMLDivElement | null>(null);


  /* =======================================================
     SPLASH SCREEN LIFECYCLE
  ======================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);


  /* =======================================================
     PERSISTENT SETTINGS
  ======================================================= */

  useEffect(() => {
    localStorage.setItem("shayak-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("shayak-language", language);
  }, [language]);


  /* =======================================================
     LIVE TIMER
  ======================================================= */

  useEffect(() => {
    if (session.status !== "active") return;

    const timer = setInterval(() => {
      if (session.startedAt) {
        setElapsedTime(
          Math.floor((Date.now() - session.startedAt) / 1000)
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session.status, session.startedAt]);


  /* =======================================================
     AUTOMATIC CHAT SCROLLING
  ======================================================= */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  /* =======================================================
     THEME CLASS
  ======================================================= */

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );
  }, [theme]);


  /* =======================================================
     CURRENT QUESTION
  ======================================================= */

  const currentQuestion =
    questions[session.currentQuestion] ?? questions[0];


  /* =======================================================
     PROGRESS
  ======================================================= */

  const progress =
    (session.answeredQuestions /
      session.totalQuestions) *
    100;


  /* =======================================================
     FORMAT TIME
  ======================================================= */

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const secs = (seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${secs}`;
  };


  /* =======================================================
     START INTERVIEW
  ======================================================= */

  const startInterview = () => {
    const now = Date.now();

    setElapsedTime(0);

    setSession({
      id: `SESSION-${Date.now()}`,
      candidateId: selectedCandidate.id,
      startedAt: now,
      currentQuestion: 0,
      answeredQuestions: 0,
      totalQuestions: questions.length,
      score: 0,
      status: "active",
    });

    setMessages([
      {
        id: 1,
        sender: "system",
        text: `Interview session started for ${selectedCandidate.name}.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
        id: 2,
        sender: "interviewer",
        text: questions[0].question,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setAnswer("");
  };


  /* =======================================================
     RESET INTERVIEW
  ======================================================= */

  const resetInterview = () => {
    setSession({
      id: "SESSION-001",
      candidateId: selectedCandidate.id,
      startedAt: null,
      currentQuestion: 0,
      answeredQuestions: 0,
      totalQuestions: questions.length,
      score: 0,
      status: "idle",
    });

    setElapsedTime(0);
    setAnswer("");
    setMessages([]);
  };


  /* =======================================================
     ANSWER PROCESSING
  ======================================================= */

  const submitAnswer = () => {
    if (!answer.trim()) return;

    const candidateMessage: Message = {
      id: Date.now(),
      sender: "candidate",
      text: answer,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [
      ...prev,
      candidateMessage,
    ]);

    const answerScore = Math.min(
      100,
      Math.max(45, 60 + answer.trim().length / 8)
    );

    const newScore =
      session.answeredQuestions === 0
        ? answerScore
        : (session.score + answerScore) / 2;

    const nextQuestionIndex =
      session.currentQuestion + 1;

    const completed =
      nextQuestionIndex >= questions.length;

    setSession((prev) => ({
      ...prev,
      currentQuestion: completed
        ? prev.currentQuestion
        : nextQuestionIndex,
      answeredQuestions:
        prev.answeredQuestions + 1,
      score: Math.round(newScore),
      status: completed
        ? "completed"
        : "active",
    }));

    if (completed) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "system",
          text:
            "Interview completed. Your final assessment is being prepared.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "interviewer",
            text: questions[nextQuestionIndex].question,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }, 350);
    }

    setAnswer("");
  };


  /* =======================================================
     QUICK ANSWERS
  ======================================================= */

  const quickAnswers = [
    "I would start by understanding the requirements.",
    "I would break the problem into smaller components.",
    "I would first analyze the time and space complexity.",
    "I would test the solution with edge cases.",
  ];

  const insertQuickAnswer = (text: string) => {
    setAnswer(text);
  };


  /* =======================================================
     REPORT FILTERING
  ======================================================= */

  const filteredReports = useMemo(() => {
    return sampleReports.filter((report) =>
      `${report.candidateName} ${report.role}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);


  /* =======================================================
     CANDIDATE FILTERING
  ======================================================= */

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) =>
      `${candidate.name} ${candidate.role} ${candidate.skills.join(
        " "
      )}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);


  /* =======================================================
     FINAL REPORT
  ======================================================= */

  const finalReport = {
    score: session.score,
    technical: Math.min(100, session.score + 3),
    communication: Math.max(
      0,
      Math.min(100, session.score - 2)
    ),
    problemSolving: session.score,
  };


  /* =======================================================
     SPLASH SCREEN
  ======================================================= */

  if (showSplash) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark"
            ? "bg-slate-950 text-white"
            : "bg-white text-slate-900"
        }`}
      >
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-xl">
            <Bot size={38} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Shayak
          </h1>

          <p className="mt-2 text-sm opacity-60">
            Intelligent Interview Evaluation Platform
          </p>

          <div className="mt-8 flex justify-center">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-indigo-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }


  /* =======================================================
     MAIN APPLICATION
  ======================================================= */

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-[#0b1020] text-slate-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >

      {/* ===================================================
          HEADER
      =================================================== */}

      <header
        className={`fixed left-0 right-0 top-0 z-40 h-16 border-b backdrop-blur-xl ${
          theme === "dark"
            ? "border-white/10 bg-[#0b1020]/90"
            : "border-slate-200 bg-white/90"
        }`}
      >
        <div className="flex h-full items-center justify-between px-4">

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
              className="rounded-lg p-2 hover:bg-slate-500/10"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Bot size={20} />
              </div>

              <div>
                <div className="font-bold">
                  Shayak
                </div>

                <div className="hidden text-[10px] opacity-50 sm:block">
                  Interview Intelligence
                </div>
              </div>
            </div>
          </div>


          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                setLanguage(
                  language === "English"
                    ? "Hindi"
                    : "English"
                )
              }
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-500/10 sm:flex"
            >
              <Languages size={16} />
              {language}
            </button>

            <button
              onClick={() =>
                setTheme(
                  theme === "light"
                    ? "dark"
                    : "light"
                )
              }
              className="rounded-lg p-2 hover:bg-slate-500/10"
            >
              {theme === "light" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </button>

            <button className="rounded-lg p-2 hover:bg-slate-500/10">
              <Bell size={18} />
            </button>

            <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
              AY
            </div>
          </div>
        </div>
      </header>


      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside
        className={`fixed bottom-0 left-0 top-16 z-30 border-r transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } ${
          theme === "dark"
            ? "border-white/10 bg-[#0e1427]"
            : "border-slate-200 bg-white"
        }`}
      >
        <nav className="flex flex-col gap-2 p-3">

          {[
            {
              id: "arena",
              label: "Interview Arena",
              icon: <Activity size={19} />,
            },
            {
              id: "candidates",
              label: "Cohort Candidates",
              icon: <Users size={19} />,
            },
            {
              id: "reports",
              label: "Evaluation Reports",
              icon: <BarChart3 size={19} />,
            },
            {
              id: "settings",
              label: "System Settings",
              icon: <Settings size={19} />,
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() =>
                setActiveView(item.id as View)
              }
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                activeView === item.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "hover:bg-slate-500/10"
              }`}
            >
              {item.icon}

              {sidebarOpen && (
                <span>{item.label}</span>
              )}
            </button>
          ))}

        </nav>

        {sidebarOpen && (
          <div className="absolute bottom-4 left-3 right-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles
                size={16}
                className="text-indigo-500"
              />
              AI Interview Engine
            </div>

            <p className="mt-2 text-xs leading-5 opacity-60">
              Adaptive questions and intelligent
              evaluation for every candidate.
            </p>
          </div>
        )}
      </aside>


      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? "pl-64" : "pl-20"
        }`}
      >

        <div className="min-h-[calc(100vh-4rem)] p-4 md:p-6">

          {/* =================================================
              INTERVIEW ARENA
          ================================================= */}

          {activeView === "arena" && (
            <div className="mx-auto max-w-[1600px]">

              {/* PAGE HEADER */}

              <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

                <div>
                  <div className="mb-1 flex items-center gap-2 text-sm text-indigo-500">
                    <Activity size={15} />
                    Interview Arena
                  </div>

                  <h1 className="text-2xl font-bold md:text-3xl">
                    Technical Interview
                  </h1>

                  <p className="mt-1 text-sm opacity-60">
                    Conduct adaptive, AI-assisted
                    technical interviews.
                  </p>
                </div>

                <div className="flex gap-2">

                  {session.status === "idle" && (
                    <button
                      onClick={startInterview}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
                    >
                      <Play size={17} />
                      Start Interview
                    </button>
                  )}

                  {session.status === "active" && (
                    <button
                      onClick={resetInterview}
                      className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium dark:border-white/10"
                    >
                      <RotateCcw size={16} />
                      Reset
                    </button>
                  )}

                  {session.status === "completed" && (
                    <button
                      onClick={() =>
                        setModal("finalReport")
                      }
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
                    >
                      <FileText size={17} />
                      View Report
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setModal("howItWorks")
                    }
                    className="rounded-xl border border-slate-300 p-3 dark:border-white/10"
                  >
                    <HelpCircle size={18} />
                  </button>

                </div>
              </div>


              {/* THREE COLUMN DASHBOARD */}

              <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_300px]">

                {/* LEFT COLUMN */}

                <section
                  className={`rounded-2xl border p-4 ${
                    theme === "dark"
                      ? "border-white/10 bg-[#11182b]"
                      : "border-slate-200 bg-white"
                  }`}
                >

                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-semibold">
                      Candidate
                    </h2>

                    <button
                      onClick={() =>
                        setActiveView(
                          "candidates"
                        )
                      }
                      className="text-xs text-indigo-500"
                    >
                      Change
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      setModal("candidate")
                    }
                    className="w-full rounded-xl border border-slate-200 p-4 text-left hover:border-indigo-400 dark:border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                        {selectedCandidate.avatar}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate font-semibold">
                          {selectedCandidate.name}
                        </div>

                        <div className="truncate text-xs opacity-50">
                          {selectedCandidate.role}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="opacity-50">
                        Experience
                      </span>
                      <span>
                        {selectedCandidate.experience}
                      </span>
                    </div>
                  </button>


                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium opacity-60">
                        Candidate Skills
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map(
                        (skill) => (
                          <span
                            key={skill}
                            className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] dark:bg-white/5"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>


                  <div className="mt-7 border-t pt-5 dark:border-white/10">
                    <div className="mb-3 flex items-center gap-2">
                      <Target
                        size={16}
                        className="text-indigo-500"
                      />
                      <span className="text-sm font-semibold">
                        Interview Progress
                      </span>
                    </div>

                    <div className="mb-2 flex justify-between text-xs">
                      <span className="opacity-50">
                        Questions
                      </span>

                      <span>
                        {session.answeredQuestions}/
                        {session.totalQuestions}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                </section>


                {/* CENTER COLUMN */}

                <section
                  className={`flex min-h-[650px] flex-col overflow-hidden rounded-2xl border ${
                    theme === "dark"
                      ? "border-white/10 bg-[#11182b]"
                      : "border-slate-200 bg-white"
                  }`}
                >

                  {/* INTERVIEW HEADER */}

                  <div className="flex items-center justify-between border-b p-4 dark:border-white/10">

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                        <Bot size={20} />
                      </div>

                      <div>
                        <div className="text-sm font-semibold">
                          AI Interviewer
                        </div>

                        <div className="flex items-center gap-1 text-xs opacity-50">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          System ready
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs dark:bg-white/5">
                      <Timer size={14} />
                      {formatTime(elapsedTime)}
                    </div>

                  </div>


                  {/* CHAT */}

                  <div className="flex-1 space-y-5 overflow-y-auto p-5">

                    {messages.length === 0 ? (
                      <div className="flex min-h-[430px] items-center justify-center text-center">
                        <div className="max-w-sm">
                          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
                            <MessageSquare size={28} />
                          </div>

                          <h3 className="text-lg font-semibold">
                            Ready for the interview?
                          </h3>

                          <p className="mt-2 text-sm leading-6 opacity-50">
                            Select a candidate and start
                            the interview. Shayak will
                            dynamically progress through
                            the curriculum.
                          </p>
                        </div>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender ===
                            "candidate"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] ${
                              message.sender ===
                              "candidate"
                                ? "items-end"
                                : "items-start"
                            }`}
                          >
                            <div
                              className={`mb-1 text-[10px] uppercase tracking-wider opacity-40 ${
                                message.sender ===
                                "candidate"
                                  ? "text-right"
                                  : ""
                              }`}
                            >
                              {message.sender}
                            </div>

                            <div
                              className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                                message.sender ===
                                "candidate"
                                  ? "rounded-br-md bg-indigo-600 text-white"
                                  : "rounded-bl-md bg-slate-100 dark:bg-white/5"
                              }`}
                            >
                              {message.text}
                            </div>

                            <div
                              className={`mt-1 text-[10px] opacity-30 ${
                                message.sender ===
                                "candidate"
                                  ? "text-right"
                                  : ""
                              }`}
                            >
                              {message.timestamp}
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    <div ref={chatEndRef} />

                  </div>


                  {/* ANSWER AREA */}

                  {session.status === "active" && (
                    <div className="border-t p-4 dark:border-white/10">

                      <div className="mb-3 flex items-center gap-2 overflow-x-auto">
                        {quickAnswers.map(
                          (quickAnswer, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                insertQuickAnswer(
                                  quickAnswer
                                )
                              }
                              className="whitespace-nowrap rounded-lg border px-3 py-1.5 text-[11px] opacity-70 hover:border-indigo-400 hover:text-indigo-500 dark:border-white/10"
                            >
                              {index === 0
                                ? "Structure"
                                : index === 1
                                ? "Break down"
                                : index === 2
                                ? "Complexity"
                                : "Edge cases"}
                            </button>
                          )
                        )}
                      </div>

                      <div className="relative">

                        <textarea
                          value={answer}
                          onChange={(event) =>
                            setAnswer(
                              event.target.value
                            )
                          }
                          onKeyDown={(event) => {
                            if (
                              event.key === "Enter" &&
                              !event.shiftKey
                            ) {
                              event.preventDefault();
                              submitAnswer();
                            }
                          }}
                          placeholder="Type your answer here..."
                          className="min-h-[120px] w-full resize-none rounded-xl border bg-transparent p-4 pr-14 text-sm outline-none focus:border-indigo-500 dark:border-white/10"
                        />

                        <button
                          onClick={submitAnswer}
                          disabled={!answer.trim()}
                          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ArrowRight size={17} />
                        </button>

                      </div>

                      <div className="mt-2 text-[10px] opacity-40">
                        Press Enter to submit · Shift +
                        Enter for a new line
                      </div>

                    </div>
                  )}

                </section>


                {/* RIGHT COLUMN */}

                <section
                  className={`space-y-4`}
                >

                  {/* CURRENT QUESTION */}

                  <div
                    className={`rounded-2xl border p-5 ${
                      theme === "dark"
                        ? "border-white/10 bg-[#11182b]"
                        : "border-slate-200 bg-white"
                    }`}
                  >

                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                        Current Question
                      </span>

                      <span
                        className={`rounded-lg px-2 py-1 text-[10px] ${
                          currentQuestion.difficulty ===
                          "Hard"
                            ? "bg-red-500/10 text-red-500"
                            : currentQuestion.difficulty ===
                              "Medium"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-emerald-500/10 text-emerald-500"
                        }`}
                      >
                        {currentQuestion.difficulty}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold leading-6">
                      {currentQuestion.question}
                    </h3>

                    <div className="mt-5 flex items-center justify-between text-xs opacity-50">
                      <span className="flex items-center gap-1.5">
                        <BookOpen size={13} />
                        {currentQuestion.category}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock3 size={13} />
                        {Math.round(
                          currentQuestion.expectedTime /
                            60
                        )}{" "}
                        min
                      </span>
                    </div>

                  </div>


                  {/* CURRICULUM */}

                  <div
                    className={`rounded-2xl border p-5 ${
                      theme === "dark"
                        ? "border-white/10 bg-[#11182b]"
                        : "border-slate-200 bg-white"
                    }`}
                  >

                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap
                          size={18}
                          className="text-indigo-500"
                        />
                        <h3 className="text-sm font-semibold">
                          Curriculum
                        </h3>
                      </div>

                      <span className="text-xs opacity-40">
                        {session.currentQuestion + 1}/
                        {questions.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {questions.map(
                        (question, index) => (
                          <div
                            key={question.id}
                            className={`flex items-center gap-3 rounded-xl p-3 ${
                              index ===
                              session.currentQuestion
                                ? "bg-indigo-500/10"
                                : ""
                            }`}
                          >
                            <div
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs ${
                                index <
                                session.answeredQuestions
                                  ? "bg-emerald-500 text-white"
                                  : index ===
                                    session.currentQuestion
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-100 dark:bg-white/5"
                              }`}
                            >
                              {index <
                              session.answeredQuestions ? (
                                <CheckCircle2
                                  size={14}
                                />
                              ) : (
                                index + 1
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="truncate text-xs font-medium">
                                {question.category}
                              </div>

                              <div className="truncate text-[10px] opacity-40">
                                {question.difficulty}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                  </div>


                  {/* LIVE METRICS */}

                  <div
                    className={`rounded-2xl border p-5 ${
                      theme === "dark"
                        ? "border-white/10 bg-[#11182b]"
                        : "border-slate-200 bg-white"
                    }`}
                  >

                    <div className="mb-4 flex items-center gap-2">
                      <BarChart3
                        size={18}
                        className="text-indigo-500"
                      />
                      <h3 className="text-sm font-semibold">
                        Live Metrics
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">

                      <Metric
                        label="Progress"
                        value={`${Math.round(
                          progress
                        )}%`}
                      />

                      <Metric
                        label="Score"
                        value={
                          session.score
                            ? `${session.score}`
                            : "--"
                        }
                      />

                      <Metric
                        label="Answered"
                        value={`${session.answeredQuestions}`}
                      />

                      <Metric
                        label="Time"
                        value={formatTime(
                          elapsedTime
                        )}
                      />

                    </div>

                  </div>

                </section>

              </div>
            </div>
          )}


          {/* =================================================
              CANDIDATES
          ================================================= */}

          {activeView === "candidates" && (
            <div className="mx-auto max-w-7xl">

              <PageHeading
                icon={<Users size={18} />}
                eyebrow="Cohort Management"
                title="Cohort Candidates"
                description="Browse and manage candidates available for interview."
              />

              <div className="mb-5 flex flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
                  />

                  <input
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(
                        event.target.value
                      )
                    }
                    placeholder="Search candidates..."
                    className="w-full rounded-xl border bg-transparent py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-white/10"
                  />
                </div>

                <button className="flex items-center justify-center gap-2 rounded-xl border px-4 text-sm dark:border-white/10">
                  <Filter size={16} />
                  Filter
                </button>

              </div>


              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                {filteredCandidates.map(
                  (candidate) => (
                    <div
                      key={candidate.id}
                      className={`rounded-2xl border p-5 ${
                        theme === "dark"
                          ? "border-white/10 bg-[#11182b]"
                          : "border-slate-200 bg-white"
                      }`}
                    >

                      <div className="flex items-start justify-between">

                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                            {candidate.avatar}
                          </div>

                          <div>
                            <h3 className="font-semibold">
                              {candidate.name}
                            </h3>

                            <p className="text-xs opacity-50">
                              {candidate.role}
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-500">
                          {candidate.status}
                        </span>

                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {candidate.skills.map(
                          (skill) => (
                            <span
                              key={skill}
                              className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] dark:bg-white/5"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>

                      <div className="mt-5 flex gap-2">

                        <button
                          onClick={() => {
                            setSelectedCandidate(
                              candidate
                            );
                            setActiveView(
                              "arena"
                            );
                          }}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white"
                        >
                          Select Candidate
                          <ChevronRight
                            size={14}
                          />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedCandidate(
                              candidate
                            );
                            setModal(
                              "candidate"
                            );
                          }}
                          className="rounded-xl border px-3 dark:border-white/10"
                        >
                          <UserRound size={15} />
                        </button>

                      </div>

                    </div>
                  )
                )}

              </div>
            </div>
          )}


          {/* =================================================
              REPORTS
          ================================================= */}

          {activeView === "reports" && (
            <div className="mx-auto max-w-7xl">

              <PageHeading
                icon={<BarChart3 size={18} />}
                eyebrow="Assessment Vault"
                title="Evaluation Reports"
                description="Review candidate performance and interview outcomes."
              />

              <div className="mb-5 relative max-w-xl">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
                />

                <input
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(
                      event.target.value
                    )
                  }
                  placeholder="Search reports..."
                  className="w-full rounded-xl border bg-transparent py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-white/10"
                />
              </div>


              <div className="overflow-hidden rounded-2xl border dark:border-white/10">

                <div className="overflow-x-auto">

                  <table className="w-full text-left text-sm">

                    <thead className="bg-slate-100 text-xs uppercase tracking-wider dark:bg-white/5">
                      <tr>
                        <th className="px-5 py-4">
                          Candidate
                        </th>
                        <th className="px-5 py-4">
                          Role
                        </th>
                        <th className="px-5 py-4">
                          Score
                        </th>
                        <th className="px-5 py-4">
                          Recommendation
                        </th>
                        <th className="px-5 py-4">
                          Date
                        </th>
                        <th />
                      </tr>
                    </thead>

                    <tbody>
                      {filteredReports.map(
                        (report) => (
                          <tr
                            key={report.id}
                            className="border-t dark:border-white/10"
                          >
                            <td className="px-5 py-5 font-medium">
                              {report.candidateName}
                            </td>

                            <td className="px-5 py-5 opacity-60">
                              {report.role}
                            </td>

                            <td className="px-5 py-5">
                              <span className="font-bold">
                                {report.score}
                              </span>
                              <span className="opacity-40">
                                /100
                              </span>
                            </td>

                            <td className="px-5 py-5">
                              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1.5 text-xs text-emerald-500">
                                {report.recommendation}
                              </span>
                            </td>

                            <td className="px-5 py-5 opacity-50">
                              {report.date}
                            </td>

                            <td className="px-5 py-5">
                              <button className="rounded-lg p-2 hover:bg-slate-500/10">
                                <MoreVertical
                                  size={16}
                                />
                              </button>
                            </td>

                          </tr>
                        )
                      )}
                    </tbody>

                  </table>

                </div>

              </div>
            </div>
          )}


          {/* =================================================
              SETTINGS
          ================================================= */}

          {activeView === "settings" && (
            <div className="mx-auto max-w-4xl">

              <PageHeading
                icon={<Settings size={18} />}
                eyebrow="Configuration"
                title="System Settings"
                description="Configure the Shayak interview environment."
              />

              <div className="space-y-4">

                <SettingCard
                  icon={<Sun size={18} />}
                  title="Appearance"
                  description="Choose how Shayak looks across the application."
                >
                  <button
                    onClick={() =>
                      setTheme(
                        theme === "light"
                          ? "dark"
                          : "light"
                      )
                    }
                    className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm dark:border-white/10"
                  >
                    {theme === "light" ? (
                      <>
                        <Sun size={16} />
                        Light
                      </>
                    ) : (
                      <>
                        <Moon size={16} />
                        Dark
                      </>
                    )}
                  </button>
                </SettingCard>


                <SettingCard
                  icon={<Globe2 size={18} />}
                  title="Language"
                  description="Set the primary interface language."
                >
                  <button
                    onClick={() =>
                      setLanguage(
                        language === "English"
                          ? "Hindi"
                          : "English"
                      )
                    }
                    className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm dark:border-white/10"
                  >
                    <Languages size={16} />
                    {language}
                  </button>
                </SettingCard>


                <SettingCard
                  icon={<ShieldCheck size={18} />}
                  title="Interview Security"
                  description="Candidate sessions are isolated and tracked individually."
                >
                  <div className="rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-500">
                    Protected
                  </div>
                </SettingCard>


                <SettingCard
                  icon={<Zap size={18} />}
                  title="AI Engine"
                  description="Adaptive interview engine status."
                >
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Online
                  </div>
                </SettingCard>

              </div>
            </div>
          )}

        </div>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="border-t px-6 py-5 text-xs opacity-40 dark:border-white/10">
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <span>
              Shayak Interview Intelligence Platform
            </span>

            <span>
              System v1.0 · {new Date().getFullYear()}
            </span>
          </div>
        </footer>

      </main>


      {/* ===================================================
          HOW IT WORKS MODAL
      =================================================== */}

      {modal === "howItWorks" && (
        <Modal
          title="How Shayak Works"
          onClose={() => setModal("none")}
        >
          <div className="space-y-5">

            <InfoStep
              number="01"
              icon={<User size={18} />}
              title="Select a candidate"
              description="Choose a candidate from the cohort directory and review their profile."
            />

            <InfoStep
              number="02"
              icon={<Play size={18} />}
              title="Start the interview"
              description="Shayak creates a session and begins with an appropriate technical question."
            />

            <InfoStep
              number="03"
              icon={<MessageSquare size={18} />}
              title="Answer dynamically"
              description="Candidates answer questions while the interview progresses through the curriculum."
            />

            <InfoStep
              number="04"
              icon={<BarChart3 size={18} />}
              title="Generate assessment"
              description="Performance metrics are aggregated into a final evaluation report."
            />

          </div>
        </Modal>
      )}


      {/* ===================================================
          CANDIDATE MODAL
      =================================================== */}

      {modal === "candidate" && (
        <Modal
          title="Candidate Profile"
          onClose={() => setModal("none")}
        >
          <div className="space-y-6">

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                {selectedCandidate.avatar}
              </div>

              <div>
                <h3 className="text-lg font-bold">
                  {selectedCandidate.name}
                </h3>

                <p className="text-sm opacity-50">
                  {selectedCandidate.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ProfileField
                label="Experience"
                value={
                  selectedCandidate.experience
                }
              />

              <ProfileField
                label="Status"
                value={
                  selectedCandidate.status
                }
              />

              <ProfileField
                label="Email"
                value={
                  selectedCandidate.email
                }
              />

              <ProfileField
                label="Skills"
                value={`${selectedCandidate.skills.length} skills`}
              />
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-40">
                Technical Skills
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedCandidate.skills.map(
                  (skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-500"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setModal("none");
                setActiveView("arena");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white"
            >
              Select Candidate
              <ArrowRight size={16} />
            </button>

          </div>
        </Modal>
      )}


      {/* ===================================================
          FINAL REPORT MODAL
      =================================================== */}

      {modal === "finalReport" && (
        <Modal
          title="Final Assessment Report"
          onClose={() => setModal("none")}
        >
          <div className="space-y-5">

            <div className="rounded-2xl bg-indigo-500/10 p-6 text-center">

              <div className="text-sm opacity-50">
                Overall Score
              </div>

              <div className="mt-1 text-5xl font-bold text-indigo-500">
                {finalReport.score}
              </div>

              <div className="mt-1 text-xs opacity-40">
                out of 100
              </div>

            </div>


            <div className="grid grid-cols-3 gap-3">

              <ScoreCard
                label="Technical"
                score={finalReport.technical}
              />

              <ScoreCard
                label="Communication"
                score={
                  finalReport.communication
                }
              />

              <ScoreCard
                label="Problem Solving"
                score={
                  finalReport.problemSolving
                }
              />

            </div>


            <div className="rounded-xl border p-4 dark:border-white/10">

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={18}
                  className="text-emerald-500"
                />

                <div className="font-semibold">
                  Assessment Complete
                </div>
              </div>

              <p className="mt-2 text-sm leading-6 opacity-50">
                The candidate successfully completed
                the interview curriculum. The final
                score is based on the aggregated
                responses during this session.
              </p>

            </div>

          </div>
        </Modal>
      )}

    </div>
  );
}


/* =========================================================
   REUSABLE UI
========================================================= */

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/5">
      <div className="text-[10px] uppercase tracking-wider opacity-40">
        {label}
      </div>

      <div className="mt-1 text-lg font-bold">
        {value}
      </div>
    </div>
  );
}


function PageHeading({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <div className="mb-1 flex items-center gap-2 text-sm text-indigo-500">
        {icon}
        {eyebrow}
      </div>

      <h1 className="text-2xl font-bold md:text-3xl">
        {title}
      </h1>

      <p className="mt-1 text-sm opacity-50">
        {description}
      </p>
    </div>
  );
}


function SettingCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border bg-white p-5 dark:border-white/10 dark:bg-[#11182b] sm:flex-row sm:items-center">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-semibold">
            {title}
          </h3>

          <p className="mt-1 max-w-xl text-xs leading-5 opacity-50">
            {description}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}


function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border bg-white shadow-2xl dark:border-white/10 dark:bg-[#11182b]">

        <div className="sticky top-0 flex items-center justify-between border-b bg-inherit px-5 py-4 dark:border-white/10">
          <h2 className="font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 opacity-60 hover:bg-slate-500/10 hover:opacity-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>

      </div>
    </div>
  );
}


function InfoStep({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
        {icon}
      </div>

      <div>
        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-indigo-500">
          Step {number}
        </div>

        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 opacity-50">
          {description}
        </p>
      </div>
    </div>
  );
}


function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/5">
      <div className="text-[10px] uppercase tracking-wider opacity-40">
        {label}
      </div>

      <div className="mt-1 truncate text-xs font-medium">
        {value}
      </div>
    </div>
  );
}


function ScoreCard({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 text-center dark:bg-white/5">
      <div className="text-[10px] opacity-40">
        {label}
      </div>

      <div className="mt-1 text-xl font-bold">
        {score}
      </div>
    </div>
  );
}