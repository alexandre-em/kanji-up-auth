import { Expose } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { SubscriptionPlan } from 'src/domain/entities';

export class FindUserResponseDto {
  @Expose()
  email: string;

  @Expose()
  picture: string;

  @Expose()
  providerId: string;

  @Expose()
  name: string;

  @Expose()
  macAddress: string;

  @Expose()
  isAnonymous: boolean;

  @Expose()
  adsDeactivated: boolean;

  @Expose()
  subscriptionPlan: SubscriptionPlan;

  @Expose()
  subscribedAt: Date | null;

  @Expose()
  subscribedUntil: Date | null;

  @Expose()
  credits: number;

  @Expose()
  unlockedDifficulties: string[];

  @Expose()
  unlockedKanji: string[];

  @Expose()
  kanjiProgression: {
    totalScore: number;
    dailyScores: Record<string, number>;
    progression: Record<string, number>;
  };
}

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  macAddress: string;
}

export class RecoverAccountDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export class RecoverAccountResponseDto {
  @Expose()
  migrated: boolean;
}

export class UnlockContentDto {
  @IsIn(['kanji', 'tier'])
  scope: 'kanji' | 'tier';

  @IsString()
  tier: string;

  @IsOptional()
  @IsString()
  kanjiId?: string;
}

export class UpdateKanjiProgressionDto {
  @IsNumber()
  totalScore: number;

  @IsObject()
  dailyScores: Record<string, number>;

  @IsObject()
  progression: Record<string, number>;
}
