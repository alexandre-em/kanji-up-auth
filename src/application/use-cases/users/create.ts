import { Injectable } from '@nestjs/common';

import { SubscriptionPlan, UnregisteredUsersFields } from '../../../domain/entities';
import { UsersRepository } from '../../repositories/users';

type CreateUserInput = Omit<
  UnregisteredUsersFields,
  | 'userId'
  | 'createdAt'
  | 'updatedAt'
  | 'isAnonymous'
  | 'adsDeactivated'
  | 'trainingConsent'
  | 'subscriptionPlan'
  | 'credits'
  | 'lastFreeCreditDate'
  | 'unlockedDifficulties'
  | 'unlockedKanji'
  | 'kanjiProgression'
>;

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(input: CreateUserInput): Promise<any> {
    return await this.userRepository.save({
      ...input,
      isAnonymous: true,
      adsDeactivated: false,
      trainingConsent: false,
      subscriptionPlan: SubscriptionPlan.FREE,
      credits: 0,
      lastFreeCreditDate: null,
      unlockedDifficulties: [],
      unlockedKanji: [],
      kanjiProgression: { totalScore: 0, dailyScores: {}, progression: {}, wordProgression: {} },
    });
  }
}
