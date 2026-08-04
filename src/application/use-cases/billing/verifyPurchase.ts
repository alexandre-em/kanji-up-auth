import { BadRequestException, Injectable } from '@nestjs/common';
import { GooglePlayRepository } from 'src/application/repositories/googlePlay';
import { UsersRepository } from 'src/application/repositories/users';
import { SubscriptionPlan } from 'src/domain/entities';

export type VerifyPurchaseInput = {
  userId: string;
  productId: string;
  purchaseToken: string;
  planType: 'monthly' | 'annual' | 'lifetime';
};

export type VerifyPurchaseResult = {
  subscriptionPlan: SubscriptionPlan;
  subscribedUntil: Date | null;
};

@Injectable()
export class VerifyPurchaseUseCase {
  constructor(
    private googlePlayRepository: GooglePlayRepository,
    private userRepository: UsersRepository,
  ) {}

  async execute(input: VerifyPurchaseInput): Promise<VerifyPurchaseResult> {
    let subscribedUntil: Date | null = null;

    if (input.planType === 'lifetime') {
      const { isPurchased } = await this.googlePlayRepository.verifyProduct(input.productId, input.purchaseToken);
      if (!isPurchased) throw new BadRequestException('Purchase could not be verified');
    } else {
      const { isActive, expiryTime } = await this.googlePlayRepository.verifySubscription(input.purchaseToken);
      if (!isActive) throw new BadRequestException('Subscription is not active');
      subscribedUntil = expiryTime;
    }

    const id = await this.userRepository.findIdByKey('userId', input.userId);
    await this.userRepository.update(id, {
      subscriptionPlan: SubscriptionPlan.PREMIUM,
      subscribedAt: new Date(),
      subscribedUntil,
    });

    return { subscriptionPlan: SubscriptionPlan.PREMIUM, subscribedUntil };
  }
}
