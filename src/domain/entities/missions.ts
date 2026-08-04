export type DailyMissionTasks = {
  kanjiSession: boolean;
  wordSession: boolean;
  kanjiMastery: boolean;
};

export type MissionTaskKey = keyof DailyMissionTasks;

export type DailyMission = {
  userId: string;
  // Calendar day in UTC (YYYY-MM-DD), computed server-side — never trusts a client-supplied date
  date: string;
  tasks: DailyMissionTasks;
  rewardClaimed: boolean;

  createdAt: Date;
  updatedAt: Date;
};
