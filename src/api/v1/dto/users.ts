import { Expose } from 'class-transformer';
import { IsEmail, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
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
}

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(12)
  @MaxLength(17)
  macAddress: string;
}

export class LinkUserDto {
  @IsEmail()
  email: string;

  @IsUrl()
  picture: string;

  @IsString()
  providerId: string;
}
