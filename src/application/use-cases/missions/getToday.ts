import { Injectable } from '@nestjs/common';
import { DailyMissionsRepository } from '../../repositories/missions';
import { DailyMission } from '../../../domain/entities';

import { todayUTC } from './date';

@Injectable()
export class GetTodayMissionsUseCase {
  constructor(private missionsRepository: DailyMissionsRepository) {}

  async execute(userId: string): Promise<DailyMission> {
    const date = todayUTC();
    const existing = await this.missionsRepository.findByUserIdAndDate(userId, date);
    if (existing) return existing;

    return this.missionsRepository.create(userId, date);
  }
}
