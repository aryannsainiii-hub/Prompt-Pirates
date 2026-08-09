// empty file
import { CandidateProfile, InterviewSession, InterviewTurn, EvaluationResult } from '../types';
import { AI_COHORT_CURRICULUM, getCurriculumDay } from '../data/curriculum';
import { getCandidateById } from '../data/candidates';
import { sessionManager } from './sessionManager';
import { generateQuestion, evaluateAnswer, generateFinalFeedback } from './geminiService';

export const MINIMUM_QUESTIONS = 8;
export const MINIMUM_DAYS = 4;

export function chooseCoreDays(candidate: CandidateProfile): number[] {
  const completed = candidate.completedDays && candidate.completedDays.length > 0 
    ? candidate.completedDays 
    : [1, 3, 7, 10];

  if (completed.length <= MINIMUM_DAYS) {
    return [...completed];
  }

  const step = Math.floor(completed.length / MINIMUM_DAYS);
  const selected: number[] = [];

  for (let i = 0; i < MINIMUM_DAYS; i++) {
    const idx = Math.min(i * step, completed.length - 1);
    const dayVal = completed[idx];
    if (!selected.includes(dayVal)) {
      selected.push(dayVal);
    }
  }

  if (selected.length < MINIMUM_DAYS) {
    for (const day of completed) {
      if (!selected.includes(day)) {
        selected.push(day);
        if (selected.length >= MINIMUM_DAYS) break;
      }
    }
  }

  return selected.sort((a, b) => a - b);
}

export async function startInterview(
  candidateInput: string | CandidateProfile,
  customSessionId?: string,
  language: string = 'English'
): Promise<InterviewSession> {
  let candidate: CandidateProfile;

  if (typeof candidateInput === 'string') {
    const found = getCandidateById(candidateInput);
    if (!found) {
      throw new Error('Candidate profile not found or invalid.');
    }
    candidate = found;
  } else {
    candidate = candidateInput;
  }

  if (!candidate.completedDays || candidate.completedDays.length === 0) {
    candidate.completedDays = [1, 3, 7, 10];
  }

  const plannedDays = chooseCoreDays(candidate);
  
  const session = sessionManager.createSession(candidate, plannedDays, customSessionId, language);

  const firstDayNum = plannedDays[0] || candidate.completedDays[0] || 1;
  const firstDay = getCurriculumDay(firstDayNum) || AI_COHORT_CURRICULUM[0];

  const question = await generateQuestion(candidate, firstDay, [], false, undefined, language);

  sessionManager.updateSession(session.sessionId, {
    currentQuestion: question,
    currentQuestionDay: firstDayNum,
    currentTurnNumber: 1
  });

  return sessionManager.getSession(session.sessionId)!;
}

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

  const trimmedAnswer = answer.trim();
  const answerToRecord = trimmedAnswer || '(No answer provided)';

  const evaluation = await evaluateAnswer(
    session.candidate,
    currentDay,
    question,
    trimmedAnswer,
    activeLanguage
  );

  const turn: InterviewTurn = {
    turnNumber: session.turns.length + 1,
    day: currentDayNum,
    dayTitle: currentDay.title,
    question,
    answer: answerToRecord,
    evaluation,
    timestamp: new Date().toISOString()
  };

  sessionManager.addTurn(sessionId, turn);

  const currentSession = sessionManager.getSession(sessionId)!;
  const questionCount = currentSession.questionCount;
  const daysCoveredCount = currentSession.daysCovered.length;

  if (questionCount >= MINIMUM_QUESTIONS && daysCoveredCount >= MINIMUM_DAYS) {
    const finalFeedback = await generateFinalFeedback(
      currentSession.candidate,
      currentSession.turns,
      activeLanguage
    );

    sessionManager.updateSession(sessionId, {
      isCompleted: true,
      currentQuestion: null,
      currentQuestionDay: null,
      finalFeedback
    });

    return {
      session: sessionManager.getSession(sessionId)!,
      lastEvaluation: evaluation
    };
  }

  const turnsOnCurrentDay = currentSession.turns.filter(t => t.day === currentDayNum).length;
  let nextDayNum: number;
  let isFollowUp = false;

  if (evaluation.score < 6 && turnsOnCurrentDay < 2) {
    nextDayNum = currentDayNum;
    isFollowUp = true;
  } else {
    const unvisitedPlanned = currentSession.plannedDays.find(d => !currentSession.daysCovered.includes(d));
    
    if (unvisitedPlanned !== undefined) {
      nextDayNum = unvisitedPlanned;
    } else {
      const unvisitedCandidate = currentSession.candidate.completedDays.find(
        d => !currentSession.daysCovered.includes(d)
      );
      
      if (unvisitedCandidate !== undefined) {
        nextDayNum = unvisitedCandidate;
      } else {
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

  sessionManager.updateSession(sessionId, {
    currentQuestion: nextQuestion,
    currentQuestionDay: nextDayNum,
    currentTurnNumber: questionCount + 1
  });

  return {
    session: sessionManager.getSession(sessionId)!,
    lastEvaluation: evaluation
  };
}

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

  if (rawCandidate) {
    let candidateObj: CandidateProfile;

    if (typeof rawCandidate === 'string') {
      const found = getCandidateById(rawCandidate);
      if (found) {
        candidateObj = found;
      } else {
        candidateObj = {
          id: rawCandidate,
          name: 'Interview Candidate',
          role: 'Candidate',
          background: '31-Day AI Cohort Participant',
          experienceLevel: 'Cohort Member',
          completedDays: [1, 3, 7, 10],
          targetAreas: ['RAG', 'Vector Search', 'LLMs'],
          notes: ''
        };
      }
    } else if (rawCandidate.member) {
      const found = getCandidateById(rawCandidate.member.id);
      if (found) {
        candidateObj = found;
      } else {
        const jobRole = rawCandidate.member.jobRole || 'Software Engineer';
        const yearsExperience = rawCandidate.member.yearsExperience || 0;
        const education = rawCandidate.member.education || 'Self-taught';
        
        candidateObj = {
          id: rawCandidate.member.id || 'CAND-000',
          name: rawCandidate.member.name || 'Candidate',
          role: jobRole,
          background: `${jobRole} (${yearsExperience} yrs exp, ${education})`,
          experienceLevel: `${yearsExperience} yrs exp`,
          completedDays: (rawCandidate.missions || [])
            .filter((m: any) => m.passed)
            .map((m: any) => m.day),
          targetAreas: (rawCandidate.missions || [])
            .slice(0, 4)
            .map((m: any) => m.title),
          notes: '',
          member: rawCandidate.member,
          missions: rawCandidate.missions,
          signals: rawCandidate.signals
        };
      }
    } else {
      candidateObj = {
        id: rawCandidate.id || 'CAND-000',
        name: rawCandidate.name || rawCandidate.jobRole || 'Candidate',
        role: rawCandidate.role || rawCandidate.jobRole || 'Engineer',
        background: rawCandidate.background || 'AI Cohort Candidate',
        experienceLevel: rawCandidate.experienceLevel || 'Mid-Senior',
        completedDays: rawCandidate.completedDays || [1, 3, 7, 10],
        targetAreas: rawCandidate.targetAreas || ['AI Architecture'],
        notes: rawCandidate.notes || ''
      };
    }

    const existingSession = sessionManager.getSession(sessionId);
    if (existingSession && existingSession.currentQuestion) {
      return {
        reply: `Welcome. Let's begin your interview.\n\n${existingSession.currentQuestion}`,
        done: false
      };
    }

    const session = await startInterview(candidateObj, sessionId, language);
    return {
      reply: `Welcome. Let's begin your interview.\n\n${session.currentQuestion}`,
      done: false
    };
  }

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
        next: fb.recommendedNextSteps
      } : {
        summary: 'Interview completed successfully.',
        strengths: ['Demonstrated understanding across key cohort topics.'],
        gaps: [],
        next: ['Review capstone module materials.']
      }
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
        next: fb.recommendedNextSteps
      }
    };
  }

  const feedbackPrefix = lastEvaluation ? `[Score: ${lastEvaluation.score}/10] ${lastEvaluation.feedback}\n\n` : '';
  const nextQ = session.currentQuestion || 'Could you elaborate further on your technical architecture decisions?';

  return {
    reply: `${feedbackPrefix}${nextQ}`,
    done: false
  };
}