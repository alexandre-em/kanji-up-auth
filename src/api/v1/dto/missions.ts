import { Expose, Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class DailyMissionResponseDto {
  @Expose()
  userId: string;

  @Expose()
  date: string;

  @Expose()
  tasks: Record<string, boolean>;

  @Expose()
  rewardClaimed: boolean;
}

export class CompleteMissionTaskDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsIn(['kanjiSession', 'wordSession', 'kanjiMastery'])
  task: 'kanjiSession' | 'wordSession' | 'kanjiMastery';
}

export class CompleteMissionResponseDto {
  @Expose()
  @Type(() => DailyMissionResponseDto)
  mission: DailyMissionResponseDto;

  @Expose()
  rewardGranted: boolean;

  @Expose()
  creditsGranted: number;
}
