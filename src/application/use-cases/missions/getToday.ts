import { Injectable } from '@nestjs/common';
import { DailyMissionsRepository } from 'src/application/repositories/missions';
import { DailyMission } from 'src/domain/entities';

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
