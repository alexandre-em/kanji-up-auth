import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/application/repositories/users';
import { SubscriptionPlan, UnregisteredUsersFields } from 'src/domain/entities';

type CreateUserInput = Omit<
  UnregisteredUsersFields,
  | 'createdAt'
  | 'updatedAt'
  | 'isAnonymous'
  | 'adsDeactivated'
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
      subscriptionPlan: SubscriptionPlan.FREE,
      credits: 0,
      lastFreeCreditDate: null,
      unlockedDifficulties: [],
      unlockedKanji: [],
      kanjiProgression: { totalScore: 0, dailyScores: {}, progression: {} },
    });
  }
}
