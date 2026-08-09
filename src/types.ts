export interface CurriculumDay {
  day: number;
  title: string;
  module: string;
  type?: string;
  description: string;
  keyConcepts: string[];
  sampleQuestions: string[];
  tools?: string[];
  objectives?: string[];
}

export interface CurriculumModule {
  n: number;
  title: string;
  days: [number, number];
}

export interface CandidateMission {
  day: number;
  title: string;
  passed?: boolean;
  attempts?: number;
  skipped?: boolean;
}

export interface CandidateSignals {
  commitDays: number;
  missionsCompleted: number;
  missionsFirstTry: number;
}

export interface CandidateMember {
  id: string;
  name: string;
  jobRole: string;
  yearsExperience: number;
  education: string;
  status: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  role: string;
  background: string;
  experienceLevel: string;
  completedDays: number[];
  targetAreas: string[];
  notes: string;
  member?: CandidateMember;
  missions?: CandidateMission[];
  signals?: CandidateSignals;
}

export interface EvaluationResult {
  score: number; // 1 to 10
  feedback: string;
  strengths: string[];
  gaps: string[];
  needsFollowUp: boolean;
  suggestedTopic?: string;
}

export interface InterviewTurn {
  turnNumber: number;
  day: number;
  dayTitle: string;
  question: string;
  answer: string;
  evaluation: EvaluationResult | null;
  timestamp: string;
}

export interface FinalFeedback {
  overallSummary: string;
  strengths: string[];
  gaps: string[];
  recommendedNextSteps: string[];
  dayScores: Record<number, number>;
  technicalLevel: 'Emerging' | 'Competent' | 'Advanced' | 'Expert';
  categoryScores?: {
    overallScore: number;
    technicalAccuracy: number;
    depth: number;
    reasoning: number;
    communication: number;
  };
}

export interface InterviewSession {
  sessionId: string;
  candidate: CandidateProfile;
  plannedDays: number[];
  turns: InterviewTurn[];
  currentQuestion: string | null;
  currentQuestionDay: number | null;
  currentTurnNumber: number;
  daysCovered: number[];
  questionCount: number;
  isCompleted: boolean;
  finalFeedback: FinalFeedback | null;
  language?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StartInterviewRequest {
  candidateId: string;
  language?: string;
}

export interface SubmitAnswerRequest {
  sessionId: string;
  answer: string;
  language?: string;
}

export interface InterviewStepResponse {
  session: InterviewSession;
  lastEvaluation?: EvaluationResult;
  isCompleted: boolean;
}

// Technical Specification API Contract Interfaces
export interface ApiInterviewRequest {
  sessionId: string;
  candidate?: CandidateProfile | CandidateMember;
  message?: string;
  language?: string;
}

export interface ApiInterviewResponse {
  reply: string;
  done: boolean;
  feedback?: {
    summary: string;
    strengths: string[];
    gaps: string[];
    next: string[];
  };
}
