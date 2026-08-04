import { Injectable } from '@nestjs/common';
import { SessionsRepository } from 'src/application/repositories/sessions';
import { Sessions, SessionType } from 'src/domain/entities';

@Injectable()
export class FindActiveSessionUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(userId: string, type: SessionType): Promise<Sessions | null> {
    return this.sessionsRepository.findActive(userId, type);
  }
}
