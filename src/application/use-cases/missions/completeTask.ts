import { Injectable } from '@nestjs/common';
import { DailyMissionsRepository } from 'src/application/repositories/missions';
import { UsersRepository } from 'src/application/repositories/users';
import { DailyMission, MissionTaskKey } from 'src/domain/entities';

import { todayUTC } from './date';

// Aligned with the ad-reward amount (REWARDED_AD_CREDIT_AMOUNT in earnCredits.ts) — same trust
// level, both are client-reported "I did the thing" events with no deeper server-side proof
export const MISSION_REWARD_CREDITS = 10;

export type CompleteMissionTaskResult = {
  mission: DailyMission;
  rewardGranted: boolean;
  creditsGranted: number;
};

@Injectable()
export class CompleteMissionTaskUseCase {
  constructor(
    private missionsRepository: DailyMissionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(userId: string, task: MissionTaskKey): Promise<CompleteMissionTaskResult> {
    const date = todayUTC();
    let mission = await this.missionsRepository.findByUserIdAndDate(userId, date);
    if (!mission) mission = await this.missionsRepository.create(userId, date);

    // Idempotent: a task already marked done today doesn't re-trigger anything
    if (mission.tasks[task]) return { mission, rewardGranted: false, creditsGranted: 0 };

    mission = await this.missionsRepository.completeTask(userId, date, task);

    const allDone = Object.values(mission.tasks).every(Boolean);
    if (!allDone || mission.rewardClaimed) return { mission, rewardGranted: false, creditsGranted: 0 };

    const claimed = await this.missionsRepository.claimReward(userId, date);
    if (!claimed) return { mission, rewardGranted: false, creditsGranted: 0 };

    const id = await this.usersRepository.findIdByKey('userId', userId);
    await this.usersRepository.incrementCredits(id, MISSION_REWARD_CREDITS);

    return { mission: claimed, rewardGranted: true, creditsGranted: MISSION_REWARD_CREDITS };
  }
}
