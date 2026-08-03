import { Injectable } from '@nestjs/common';
import { DailyMissionsRepository } from 'src/application/repositories/missions';
import { DailyMission } from 'src/domain/entities';

import { todayUTC } from './date';

@Injectable()
export class GetTodayMissionsUseCase {
  constructor(private missionsRepository: DailyMissionsRepository) {}

  async execute(macAddress: string): Promise<DailyMission> {
    const date = todayUTC();
    const existing = await this.missionsRepository.findByMacAddressAndDate(macAddress, date);
    if (existing) return existing;

    return this.missionsRepository.create(macAddress, date);
  }
}
