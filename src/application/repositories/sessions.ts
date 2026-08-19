import { Question, Sessions, SessionStatus, SessionType } from '../../domain/entities';

export abstract class SessionsRepository {
  abstract create(session: Omit<Sessions, 'sessionId' | 'createdAt' | 'updatedAt'>): Promise<Sessions>;
  abstract findBySessionId(sessionId: string): Promise<Sessions | null>;
  // One active session per user per type: the resume-or-start-fresh check on entry
  abstract findActive(userId: string, type: SessionType): Promise<Sessions | null>;
  // Safety net for create(): findActive only ever surfaces one in-progress session, so if a prior
  // client-side close-out (abandon/finish) was ever skipped — crash, force-quit — old sessions
  // could otherwise sit IN_PROGRESS forever, invisible to future checks. Closing all of them out
  // whenever a new one starts keeps "in progress" meaning at most one per user per type.
  abstract abandonAllActive(userId: string, type: SessionType): Promise<void>;
  abstract updateQuestion(sessionId: string, atIndex: number, question: Question, nextIndex: number): Promise<void>;
  abstract setStatus(sessionId: string, status: SessionStatus, score: number | null): Promise<void>;
}
