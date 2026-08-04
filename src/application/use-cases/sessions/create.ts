import { Injectable } from '@nestjs/common';
import { SessionsRepository } from 'src/application/repositories/sessions';
import { Question, SessionStatus, Sessions, SessionType } from 'src/domain/entities';

export type CreateSessionInput = {
  userId: string;
  type: SessionType;
  questions: Question[];
};

@Injectable()
export class CreateSessionUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(input: CreateSessionInput): Promise<Sessions> {
    return this.sessionsRepository.create({
      userId: input.userId,
      type: input.type,
      status: SessionStatus.IN_PROGRESS,
      questions: input.questions,
      currentIndex: 0,
      score: null,
    });
  }
}
