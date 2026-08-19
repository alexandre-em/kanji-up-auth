import { Injectable } from '@nestjs/common';

import { SubscriptionPlan } from '../../../domain/entities';
import { GoogleIdentityRepository } from '../../repositories/googleIdentity';
import { UsersRepository } from '../../repositories/users';

export type SignInWithGoogleInput = {
  idToken: string;
  macAddress: string;
};

export type SignInWithGoogleResult = {
  userId: string;
};

@Injectable()
export class SignInWithGoogleUseCase {
  constructor(
    private googleIdentityRepository: GoogleIdentityRepository,
    private userRepository: UsersRepository,
  ) {}

  async execute(input: SignInWithGoogleInput): Promise<SignInWithGoogleResult> {
    const identity = await this.googleIdentityRepository.verifyIdToken(input.idToken);
    const existing = await this.userRepository.findByProviderId(identity.providerId);

    if (existing) {
      return { userId: existing.userId };
    }

    // No account tied to this Google identity yet — this device is signing in fresh, not linking
    // an already-existing local account (that's recoverAccount's job), so create one directly.
    // save() doesn't hand back the created document, hence the re-fetch by macAddress right after.
    await this.userRepository.save({
      name: identity.name ?? 'Player',
      macAddress: input.macAddress,
      isAnonymous: true,
      adsDeactivated: false,
      subscriptionPlan: SubscriptionPlan.FREE,
      credits: 0,
      lastFreeCreditDate: null,
      unlockedDifficulties: [],
      unlockedKanji: [],
      kanjiProgression: { totalScore: 0, dailyScores: {}, progression: {}, wordProgression: {} },
    });
    const created = await this.userRepository.findByMacAddress(input.macAddress);
    const id = await this.userRepository.findIdByKey('userId', created.userId);
    await this.userRepository.update(id, {
      providerId: identity.providerId,
      email: identity.email,
      picture: identity.picture,
      isAnonymous: false,
    });

    return { userId: created.userId };
  }
}
