import { CandidateProfile, InterviewSession, InterviewTurn, FinalFeedback } from '../types';

/**
 * In-memory Session Manager for Interview Sessions.
 */
class SessionManager {
  private sessions: Map<string, InterviewSession> = new Map();

  public createSession(candidate: CandidateProfile, plannedDays: number[], customSessionId?: string, language?: string): InterviewSession {
    const sessionId = customSessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const session: InterviewSession = {
      sessionId,
      candidate,
      plannedDays,
      turns: [],
      currentQuestion: null,
      currentQuestionDay: null,
      currentTurnNumber: 1,
      daysCovered: [],
      questionCount: 0,
      isCompleted: false,
      finalFeedback: null,
      language: language || 'English',
      createdAt: now,
      updatedAt: now,
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  public getSession(sessionId: string): InterviewSession | undefined {
    return this.sessions.get(sessionId);
  }

  public updateSession(sessionId: string, updates: Partial<InterviewSession>): InterviewSession | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;

    const updatedSession: InterviewSession = {
      ...session,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  public addTurn(sessionId: string, turn: InterviewTurn): InterviewSession | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;

    const turns = [...session.turns, turn];
    const daysCovered = Array.from(new Set([...session.daysCovered, turn.day]));

    return this.updateSession(sessionId, {
      turns,
      daysCovered,
      questionCount: turns.length,
    });
  }

  public getLastTurn(sessionId: string): InterviewTurn | undefined {
    const session = this.sessions.get(sessionId);
    if (!session || session.turns.length === 0) return undefined;
    return session.turns[session.turns.length - 1];
  }

  public deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  public getAllSessions(): InterviewSession[] {
    return Array.from(this.sessions.values());
  }

  // --- Snake Case & Specification Compliant Helpers ---
  public create_session(candidate: CandidateProfile, plannedDays: number[], customSessionId?: string, language?: string): InterviewSession {
    return this.createSession(candidate, plannedDays, customSessionId, language);
  }

  public get_session(sessionId: string): InterviewSession | undefined {
    return this.getSession(sessionId);
  }

  public serialize_session(sessionId: string): string | null {
    const session = this.getSession(sessionId);
    return session ? JSON.stringify(session) : null;
  }

  public record_question(sessionId: string, question: string, day: number): InterviewSession | undefined {
    return this.updateSession(sessionId, {
      currentQuestion: question,
      currentQuestionDay: day,
    });
  }

  public add_message(sessionId: string, question: string, answer: string, day: number, dayTitle: string, evaluation: any): InterviewSession | undefined {
    const session = this.getSession(sessionId);
    if (!session) return undefined;

    const turn: InterviewTurn = {
      turnNumber: session.turns.length + 1,
      day,
      dayTitle,
      question,
      answer,
      evaluation,
      timestamp: new Date().toISOString(),
    };

    return this.addTurn(sessionId, turn);
  }

  public add_evaluation(sessionId: string, evaluation: any): InterviewSession | undefined {
    const lastTurn = this.getLastTurn(sessionId);
    if (lastTurn) {
      lastTurn.evaluation = evaluation;
    }
    return this.getSession(sessionId);
  }

  public get_evaluations(sessionId: string): any[] {
    const session = this.getSession(sessionId);
    if (!session) return [];
    return session.turns.map(t => t.evaluation).filter(Boolean);
  }

  public get_last_evaluation(sessionId: string): any | undefined {
    const lastTurn = this.getLastTurn(sessionId);
    return lastTurn?.evaluation || undefined;
  }

  public mark_completed(sessionId: string, finalFeedback?: FinalFeedback): InterviewSession | undefined {
    return this.updateSession(sessionId, {
      isCompleted: true,
      currentQuestion: null,
      currentQuestionDay: null,
      finalFeedback: finalFeedback || null,
    });
  }

  public delete_session(sessionId: string): boolean {
    return this.deleteSession(sessionId);
  }

  public set_planned_days(sessionId: string, plannedDays: number[]): InterviewSession | undefined {
    return this.updateSession(sessionId, { plannedDays });
  }
}

export const sessionManager = new SessionManager();
