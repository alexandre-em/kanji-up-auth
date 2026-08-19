import { Injectable } from '@nestjs/common';

import { Question, Sessions, SessionStatus, SessionType } from '../../../domain/entities';
import { SessionsRepository } from '../../repositories/sessions';

export type CreateSessionInput = {
  userId: string;
  type: SessionType;
  questions: Question[];
};

@Injectable()
export class CreateSessionUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(input: CreateSessionInput): Promise<Sessions> {
    // Closes out anything left IN_PROGRESS for this user/type before starting fresh — normally
    // the client already does this itself (finalizeAsIncomplete / explicit "start over"), but
    // relying solely on that would let a skipped close-out (crash, force-quit) leave sessions
    // silently open forever, invisible to findActive's single-result lookup. Easy to otherwise
    // exploit for unlimited retries without ever properly finishing a run.
    await this.sessionsRepository.abandonAllActive(input.userId, input.type);

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
