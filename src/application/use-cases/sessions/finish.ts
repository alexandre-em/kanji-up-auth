import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SessionsRepository } from 'src/application/repositories/sessions';
import { SessionStatus } from 'src/domain/entities';

@Injectable()
export class FinishSessionUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(sessionId: string, score: number): Promise<void> {
    const session = await this.sessionsRepository.findBySessionId(sessionId);
    if (!session) throw new NotFoundException('Session not found');
    if (session.status !== SessionStatus.IN_PROGRESS) throw new BadRequestException('Session is no longer in progress');

    await this.sessionsRepository.setStatus(sessionId, SessionStatus.FINISHED, score);
  }
}
