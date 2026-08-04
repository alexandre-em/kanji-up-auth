import { DailyMission, MissionTaskKey } from 'src/domain/entities';

export abstract class DailyMissionsRepository {
  abstract findByMacAddressAndDate(macAddress: string, date: string): Promise<DailyMission | null>;
  abstract create(macAddress: string, date: string): Promise<DailyMission>;
  abstract completeTask(macAddress: string, date: string, task: MissionTaskKey): Promise<DailyMission>;
  // Atomic: only flips rewardClaimed from false to true, returns null if it was already claimed —
  // prevents a double credit grant from concurrent completion calls
  abstract claimReward(macAddress: string, date: string): Promise<DailyMission | null>;
  // Account recovery: re-points every mission record owned by the old device's macAddress. Call
  // deleteByMacAddress(toMacAddress) first — a same-day doc already existing there would collide
  // with the unique {macAddress, date} index
  abstract migrateMacAddress(fromMacAddress: string, toMacAddress: string): Promise<void>;
  abstract deleteByMacAddress(macAddress: string): Promise<void>;
}
