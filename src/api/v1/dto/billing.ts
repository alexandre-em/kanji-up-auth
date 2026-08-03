import { Expose } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SubscriptionPlan } from 'src/domain/entities';

export class VerifyPurchaseDto {
  @IsString()
  @IsNotEmpty()
  macAddress: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  purchaseToken: string;

  @IsIn(['monthly', 'annual', 'lifetime'])
  planType: 'monthly' | 'annual' | 'lifetime';
}

export class VerifyPurchaseResponseDto {
  @Expose()
  subscriptionPlan: SubscriptionPlan;

  @Expose()
  subscribedUntil: Date | null;
}
