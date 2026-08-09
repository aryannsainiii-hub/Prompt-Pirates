import { CandidateProfile, InterviewSession, InterviewTurn, EvaluationResult } from '../types';
import { AI_COHORT_CURRICULUM, getCurriculumDay } from '../data/curriculum';
import { getCandidateById } from '../data/candidates';
import { sessionManager } from './sessionManager';
import { generateQuestion, evaluateAnswer, generateFinalFeedback } from './geminiService';

export const MINIMUM_QUESTIONS = 8;
export const MINIMUM_DAYS = 4;

/**
 * Select 4 core curriculum days from the candidate's completed days list.
 */
export function chooseCoreDays(candidate: CandidateProfile): number[] {
  const completed = candidate.completedDays;
  if (!completed || completed.length === 0) {
    return [1, 3, 7, 10]; // Default fallback days
  }

  if (completed.length <= MINIMUM_DAYS) {
    return [...completed];
  }

  // Pick up to 4 spread across early, mid, and late curriculum
  const step = Math.floor(completed.length / MINIMUM_DAYS);
  const selected: number[] = [];

  for (let i = 0; i < MINIMUM_DAYS; i++) {
    const idx = Math.min(i * step, completed.length - 1);
    const day = completed[idx];
    if (!selected.includes(day)) {
      selected.push(day);
    }
  }

  // Fill up if duplicates occurred
  for (const day of completed) {
    if (selected.length >= MINIMUM_DAYS) break;
    if (!selected.includes(day)) {
      selected.push(day);
    }
  }

  return selected.sort((a, b) => a - b);
}

/**
 * Start a new interview session for candidate.
 */
export async function startInterview(
  candidateInput: string | CandidateProfile,
  customSessionId?: string,
  language: string = 'English'
): Promise<InterviewSession> {
  let candidate: CandidateProfile | undefined;

  if (typeof candidateInput === 'string') {
    candidate = getCandidateById(candidateInput);
  } else if (candidateInput && typeof candidateInput === 'object') {
    candidate = candidateInput;
  }

  if (!candidate) {
    throw new Error(`Candidate profile not found or invalid.`);
  }

  // Ensure minimum candidate structure fields exist
  if (!candidate.completedDays) {
    candidate.completedDays = [1, 3, 7, 10];
  }

  const plannedDays = chooseCoreDays(candidate);
  const session = sessionManager.createSession(candidate, plannedDays, customSessionId, language);

  // Generate First Question on 1st planned day
  const firstDayNum = plannedDays[0] || candidate.completedDays[0] || 1;
  const firstDay = getCurriculumDay(firstDayNum) || AI_COHORT_CURRICULUM[0];

  const firstQuestion = await generateQuestion(candidate, firstDay, [], false, undefined, language);

  const updatedSession = sessionManager.updateSession(session.sessionId, {
    currentQuestion: firstQuestion,
    currentQuestionDay: firstDayNum,
    currentTurnNumber: 1,
  });

  return updatedSession!;
}

/**
 * Process a candidate's answer to the current question.
 */
export async function processAnswer(
  sessionId: string,
  answer: string,
  languageInput?: string
): Promise<{ session: InterviewSession; lastEvaluation: EvaluationResult }> {
  const session = sessionManager.getSession(sessionId);
  if (!session) {
    throw new Error(`Session '${sessionId}' not found.`);
  }

  if (session.isCompleted) {
    throw new Error(`Interview session '${sessionId}' is already completed.`);
  }

  const activeLanguage = languageInput || session.language || 'English';
  if (languageInput && languageInput !== session.language) {
    sessionManager.updateSession(sessionId, { language: languageInput });
  }

  const currentDayNum = session.currentQuestionDay || session.plannedDays[0] || 1;
  const currentDay = getCurriculumDay(currentDayNum) || AI_COHORT_CURRICULUM[0];
  const question = session.currentQuestion || `Explain key concepts for Day ${currentDayNum}: ${currentDay.title}.`;

  // 1. Evaluate the submitted answer
  const evaluation = await evaluateAnswer(session.candidate, currentDay, question, answer, activeLanguage);

  // 2. Record this completed turn
  const turn: InterviewTurn = {
    turnNumber: session.turns.length + 1,
    day: currentDayNum,
    dayTitle: currentDay.title,
    question,
    answer: answer.trim() || '(No answer provided)',
    evaluation,
    timestamp: new Date().toISOString(),
  };

  sessionManager.addTurn(sessionId, turn);

  // Re-fetch updated session state
  let currentSession = sessionManager.getSession(sessionId)!;
  const questionCount = currentSession.questionCount;
  const daysCoveredCount = currentSession.daysCovered.length;

  // 3. Check if interview completion conditions are met
  if (questionCount >= MINIMUM_QUESTIONS && daysCoveredCount >= MINIMUM_DAYS) {
    // Generate Final Feedback Report
    const finalFeedback = await generateFinalFeedback(currentSession.candidate, currentSession.turns, activeLanguage);

    currentSession = sessionManager.updateSession(sessionId, {
      isCompleted: true,
      currentQuestion: null,
      currentQuestionDay: null,
      finalFeedback,
    })!;

    return {
      session: currentSession,
      lastEvaluation: evaluation,
    };
  }

  // 4. Decide next topic and question (Adaptive Routing)
  let nextDayNum: number;
  let isFollowUp = false;

  // If previous score < 6 AND we haven't asked 2+ questions on this same day, do a follow-up
  const turnsOnCurrentDay = currentSession.turns.filter(t => t.day === currentDayNum);
  if (evaluation.score < 6 && turnsOnCurrentDay.length < 2) {
    nextDayNum = currentDayNum;
    isFollowUp = true;
  } else {
    // Move to next planned day or pick another completed day
    const unvisitedPlanned = currentSession.plannedDays.filter(d => !currentSession.daysCovered.includes(d));

    if (unvisitedPlanned.length > 0) {
      nextDayNum = unvisitedPlanned[0];
    } else {
      // If all planned days covered, cycle through all candidate completed days or planned days
      const candidateCompleted = currentSession.candidate.completedDays;
      const unvisitedCandidateDays = candidateCompleted.filter(d => !currentSession.daysCovered.includes(d));

      if (unvisitedCandidateDays.length > 0) {
        nextDayNum = unvisitedCandidateDays[0];
      } else {
        // Pick day with lowest score or cycle
        const index = questionCount % currentSession.plannedDays.length;
        nextDayNum = currentSession.plannedDays[index];
      }
    }
  }

  const nextDay = getCurriculumDay(nextDayNum) || currentDay;
  const nextQuestion = await generateQuestion(
    currentSession.candidate,
    nextDay,
    currentSession.turns,
    isFollowUp,
    evaluation.score,
    activeLanguage
  );

  currentSession = sessionManager.updateSession(sessionId, {
    currentQuestion: nextQuestion,
    currentQuestionDay: nextDayNum,
    currentTurnNumber: questionCount + 1,
  })!;

  return {
    session: currentSession,
    lastEvaluation: evaluation,
  };
}

/**
 * Technical Specification Compliant Single-Endpoint Handler for POST /api/interview
 */
export async function handleApiInterview(body: any): Promise<{
  reply: string;
  done: boolean;
  feedback?: {
    summary: string;
    strengths: string[];
    gaps: string[];
    next: string[];
  };
}> {
  const { sessionId, candidate: rawCandidate, message, language = 'English' } = body || {};

  if (!sessionId) {
    throw new Error('sessionId is required for POST /api/interview');
  }

  // Flow 1: Start Interview (candidate provided)
  if (rawCandidate) {
    let candidateObj: CandidateProfile;

    if (typeof rawCandidate === 'string') {
      const found = getCandidateById(rawCandidate);
      candidateObj = found || {
        id: rawCandidate,
        name: 'Interview Candidate',
        role: 'Candidate',
        background: '31-Day AI Cohort Participant',
        experienceLevel: 'Cohort Member',
        completedDays: [1, 3, 7, 10],
        targetAreas: ['RAG', 'Vector Search', 'LLMs'],
        notes: '',
      };
    } else if (rawCandidate.member) {
      // Candidate object with member, missions, signals
      const found = getCandidateById(rawCandidate.member.id);
      candidateObj = found || {
        id: rawCandidate.member.id || 'CAND-000',
        name: rawCandidate.member.name || 'Candidate',
        role: rawCandidate.member.jobRole || 'Software Engineer',
        background: `${rawCandidate.member.jobRole || ''} (${rawCandidate.member.yearsExperience || 0} yrs exp, ${rawCandidate.member.education || ''})`,
        experienceLevel: `${rawCandidate.member.yearsExperience || 0} yrs exp`,
        completedDays: (rawCandidate.missions || []).filter((m: any) => m.passed).map((m: any) => m.day),
        targetAreas: (rawCandidate.missions || []).slice(0, 4).map((m: any) => m.title),
        notes: '',
        member: rawCandidate.member,
        missions: rawCandidate.missions,
        signals: rawCandidate.signals,
      };
    } else {
      // General profile object
      candidateObj = {
        id: rawCandidate.id || 'CAND-000',
        name: rawCandidate.name || rawCandidate.jobRole || 'Candidate',
        role: rawCandidate.role || rawCandidate.jobRole || 'Engineer',
        background: rawCandidate.background || 'AI Cohort Candidate',
        experienceLevel: rawCandidate.experienceLevel || 'Mid-Senior',
        completedDays: rawCandidate.completedDays || [1, 3, 7, 10],
        targetAreas: rawCandidate.targetAreas || ['AI Architecture'],
        notes: rawCandidate.notes || '',
      };
    }

    const existingSession = sessionManager.getSession(sessionId);
    if (existingSession && existingSession.currentQuestion) {
      return {
        reply: `Welcome. Let's begin your interview.\n\n${existingSession.currentQuestion}`,
        done: false,
      };
    }

    const session = await startInterview(candidateObj, sessionId, language);
    return {
      reply: `Welcome. Let's begin your interview.\n\n${session.currentQuestion}`,
      done: false,
    };
  }

  // Flow 2 & 3: Turn or End Interview (message provided)
  const existingSession = sessionManager.getSession(sessionId);
  if (!existingSession) {
    throw new Error(`Session '${sessionId}' not found. Please initialize session with candidate payload first.`);
  }

  if (existingSession.isCompleted) {
    const fb = existingSession.finalFeedback;
    return {
      reply: 'Interview completed.',
      done: true,
      feedback: fb ? {
        summary: fb.overallSummary,
        strengths: fb.strengths,
        gaps: fb.gaps,
        next: fb.recommendedNextSteps,
      } : {
        summary: 'Interview completed successfully.',
        strengths: ['Demonstrated understanding across key cohort topics.'],
        gaps: [],
        next: ['Review capstone module materials.'],
      },
    };
  }

  const { session, lastEvaluation } = await processAnswer(sessionId, message || '', language);

  if (session.isCompleted && session.finalFeedback) {
    const fb = session.finalFeedback;
    return {
      reply: 'Interview completed.',
      done: true,
      feedback: {
        summary: fb.overallSummary,
        strengths: fb.strengths,
        gaps: fb.gaps,
        next: fb.recommendedNextSteps,
      },
    };
  }

  const feedbackPrefix = lastEvaluation ? `[Score: ${lastEvaluation.score}/10] ${lastEvaluation.feedback}\n\n` : '';
  const nextQ = session.currentQuestion || 'Could you elaborate further on your technical architecture decisions?';

  return {
    reply: `${feedbackPrefix}${nextQ}`,
    done: false,
  };
}
