import { Question, SessionStatus, SessionType, Sessions } from 'src/domain/entities';

export abstract class SessionsRepository {
  abstract create(session: Omit<Sessions, 'sessionId' | 'createdAt' | 'updatedAt'>): Promise<Sessions>;
  abstract findBySessionId(sessionId: string): Promise<Sessions | null>;
  // One active session per user per type: the resume-or-start-fresh check on entry
  abstract findActive(userId: string, type: SessionType): Promise<Sessions | null>;
  abstract updateQuestion(sessionId: string, atIndex: number, question: Question, nextIndex: number): Promise<void>;
  abstract setStatus(sessionId: string, status: SessionStatus, score: number | null): Promise<void>;
}
