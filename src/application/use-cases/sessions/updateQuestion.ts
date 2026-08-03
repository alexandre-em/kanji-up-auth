import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SessionsRepository } from 'src/application/repositories/sessions';
import { Question, SessionStatus } from 'src/domain/entities';

@Injectable()
export class UpdateQuestionUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  // The client only ever answers whatever question the session is currently sitting on —
  // the server owns currentIndex so there's nothing for the client to get out of sync
  async execute(sessionId: string, question: Question): Promise<void> {
    const session = await this.sessionsRepository.findBySessionId(sessionId);
    if (!session) throw new NotFoundException('Session not found');
    if (session.status !== SessionStatus.IN_PROGRESS) throw new BadRequestException('Session is no longer in progress');

    await this.sessionsRepository.updateQuestion(sessionId, session.currentIndex, question, session.currentIndex + 1);
  }
}
