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
> & {
  // Opt-in chosen during onboarding — absent (not just false) whenever a caller predates this
  // field, e.g. any future direct repository use, so it still needs its own default below
  trainingConsent?: boolean;
};

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(input: CreateUserInput): Promise<any> {
    return await this.userRepository.save({
      ...input,
      isAnonymous: true,
      adsDeactivated: false,
      trainingConsent: input.trainingConsent ?? false,
      subscriptionPlan: SubscriptionPlan.FREE,
      credits: 0,
      lastFreeCreditDate: null,
      unlockedDifficulties: [],
      unlockedKanji: [],
      kanjiProgression: { totalScore: 0, dailyScores: {}, progression: {}, wordProgression: {}, questionCount: 0 },
    });
  }
}
