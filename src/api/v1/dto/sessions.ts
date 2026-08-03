import { Expose } from 'class-transformer';
import { IsArray, IsIn, IsNotEmpty, IsNumber, IsObject, IsString, Min } from 'class-validator';
import { SessionStatus, SessionType } from 'src/domain/entities';

export class SessionResponseDto {
  @Expose()
  sessionId: string;

  @Expose()
  macAddress: string;

  @Expose()
  type: SessionType;

  @Expose()
  status: SessionStatus;

  @Expose()
  questions: Record<string, unknown>[];

  @Expose()
  currentIndex: number;

  @Expose()
  score: number | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  macAddress: string;

  @IsIn(Object.values(SessionType))
  type: SessionType;

  // Shape varies by type (kanji/word/other) — not validated field-by-field here
  @IsArray()
  questions: Record<string, unknown>[];
}

export class UpdateQuestionDto {
  @IsObject()
  question: Record<string, unknown>;
}

export class FinishSessionDto {
  @IsNumber()
  @Min(0)
  score: number;
}
