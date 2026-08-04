import { Question, SessionStatus, SessionType, Sessions } from 'src/domain/entities';

export abstract class SessionsRepository {
  abstract create(session: Omit<Sessions, 'sessionId' | 'createdAt' | 'updatedAt'>): Promise<Sessions>;
  abstract findBySessionId(sessionId: string): Promise<Sessions | null>;
  // One active session per user per type: the resume-or-start-fresh check on entry
  abstract findActive(macAddress: string, type: SessionType): Promise<Sessions | null>;
  abstract updateQuestion(sessionId: string, atIndex: number, question: Question, nextIndex: number): Promise<void>;
  abstract setStatus(sessionId: string, status: SessionStatus, score: number | null): Promise<void>;
  // Account recovery: re-points every session owned by the old device's macAddress to the new one.
  // Call deleteByMacAddress(toMacAddress) first so the recovered history is what's authoritative
  abstract migrateMacAddress(fromMacAddress: string, toMacAddress: string): Promise<void>;
  abstract deleteByMacAddress(macAddress: string): Promise<void>;
}
