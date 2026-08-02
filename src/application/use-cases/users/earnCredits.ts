import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/application/repositories/users';

// Fixed server-side reward: the client only reports that an ad finished, it never gets to pick
// the amount, so a tampered client can't just request an arbitrary number of credits
export const REWARDED_AD_CREDIT_AMOUNT = 10;

@Injectable()
export class EarnCreditsUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(macAddress: string): Promise<{ creditsEarned: number }> {
    const id = await this.userRepository.findIdByKey('macAddress', macAddress);

    await this.userRepository.incrementCredits(id, REWARDED_AD_CREDIT_AMOUNT);

    return { creditsEarned: REWARDED_AD_CREDIT_AMOUNT };
  }
}
