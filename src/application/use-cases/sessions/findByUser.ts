import { Injectable } from '@nestjs/common';

import { Sessions, SessionType } from '../../../domain/entities';
import { SessionsRepository } from '../../repositories/sessions';

@Injectable()
export class FindSessionsByUserUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(userId: string, type: SessionType, page = 1, limit = 20): Promise<Sessions[]> {
    return this.sessionsRepository.findByUser(userId, type, page, limit);
  }
}
