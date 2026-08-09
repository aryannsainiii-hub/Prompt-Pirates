/* =========================================================
   SHAYAK - APPLICATION TYPES
========================================================= */

/* ---------------------------------------------------------
   THEME & LANGUAGE
--------------------------------------------------------- */

export type ThemeMode = "light" | "dark";

export type Language = "English" | "Hindi";


/* ---------------------------------------------------------
   NAVIGATION
--------------------------------------------------------- */

export type View =
  | "arena"
  | "candidates"
  | "reports"
  | "settings";


/* ---------------------------------------------------------
   MODALS
--------------------------------------------------------- */

export type ModalType =
  | "none"
  | "howItWorks"
  | "candidate"
  | "finalReport";


/* ---------------------------------------------------------
   CANDIDATE
--------------------------------------------------------- */

export type CandidateStatus =
  | "Ready"
  | "In Progress"
  | "Completed";

export type Candidate = {
  id: number;

  name: string;

  role: string;

  email: string;

  experience: string;

  skills: string[];

  avatar: string;

  status: CandidateStatus;

  score?: number;
};


/* ---------------------------------------------------------
   INTERVIEW QUESTIONS
--------------------------------------------------------- */

export type QuestionDifficulty =
  | "Easy"
  | "Medium"
  | "Hard";

export type Question = {
  id: number;

  category: string;

  difficulty: QuestionDifficulty;

  question: string;

  expectedTime: number;
};


/* ---------------------------------------------------------
   INTERVIEW CHAT
--------------------------------------------------------- */

export type MessageSender =
  | "system"
  | "candidate"
  | "interviewer";

export type Message = {
  id: number;

  sender: MessageSender;

  text: string;

  timestamp: string;
};


/* ---------------------------------------------------------
   INTERVIEW SESSION
--------------------------------------------------------- */

export type SessionStatus =
  | "idle"
  | "active"
  | "completed";

export type InterviewSession = {
  id: string;

  candidateId: number;

  startedAt: number | null;

  currentQuestion: number;

  answeredQuestions: number;

  totalQuestions: number;

  score: number;

  status: SessionStatus;
};


/* ---------------------------------------------------------
   EVALUATION REPORT
--------------------------------------------------------- */

export type Recommendation =
  | "Strong Hire"
  | "Hire"
  | "Review";

export type Report = {
  id: number;

  candidateId: number;

  candidateName: string;

  role: string;

  score: number;

  technical: number;

  communication: number;

  problemSolving: number;

  recommendation: Recommendation;

  date: string;
};


/* ---------------------------------------------------------
   FINAL ASSESSMENT
--------------------------------------------------------- */

export type FinalAssessment = {
  score: number;

  technical: number;

  communication: number;

  problemSolving: number;
};


/* ---------------------------------------------------------
   QUICK ANSWERS
--------------------------------------------------------- */

export type QuickAnswer = {
  id: number;

  label: string;

  text: string;
};


/* ---------------------------------------------------------
   APPLICATION STATE
--------------------------------------------------------- */

export type AppState = {
  theme: ThemeMode;

  language: Language;

  activeView: View;

  selectedCandidate: Candidate | null;

  modal: ModalType;

  searchQuery: string;

  answer: string;

  elapsedTime: number;

  messages: Message[];

  session: InterviewSession;
};


/* ---------------------------------------------------------
   INTERVIEW METRICS
--------------------------------------------------------- */

export type InterviewMetrics = {
  progress: number;

  score: number;

  answered: number;

  totalQuestions: number;

  elapsedTime: number;
};