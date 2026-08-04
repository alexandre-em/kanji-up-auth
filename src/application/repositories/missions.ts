import { DailyMission, MissionTaskKey } from 'src/domain/entities';

export abstract class DailyMissionsRepository {
  abstract findByUserIdAndDate(userId: string, date: string): Promise<DailyMission | null>;
  abstract create(userId: string, date: string): Promise<DailyMission>;
  abstract completeTask(userId: string, date: string, task: MissionTaskKey): Promise<DailyMission>;
  // Atomic: only flips rewardClaimed from false to true, returns null if it was already claimed —
  // prevents a double credit grant from concurrent completion calls
  abstract claimReward(userId: string, date: string): Promise<DailyMission | null>;
}
