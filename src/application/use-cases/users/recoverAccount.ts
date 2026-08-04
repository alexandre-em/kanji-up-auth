import { Injectable } from '@nestjs/common';
import { GoogleIdentityRepository } from 'src/application/repositories/googleIdentity';
import { UsersRepository } from 'src/application/repositories/users';

export type RecoverAccountInput = {
  userId: string;
  idToken: string;
};

export type RecoverAccountResult = {
  // The account's stable userId — same as input.userId unless an existing account (a different
  // device) was found for this Google identity, in which case the client must adopt this one.
  // No data migration needed: sessions/missions/scans are already keyed by the recovered userId.
  userId: string;
  migrated: boolean;
};

@Injectable()
export class RecoverAccountUseCase {
  constructor(
    private googleIdentityRepository: GoogleIdentityRepository,
    private userRepository: UsersRepository,
  ) {}

  async execute(input: RecoverAccountInput): Promise<RecoverAccountResult> {
    const identity = await this.googleIdentityRepository.verifyIdToken(input.idToken);
    const existing = await this.userRepository.findByProviderId(identity.providerId);

    if (existing && existing.userId !== input.userId) {
      return { userId: existing.userId, migrated: true };
    }

    // First-time link: just attach the verified identity to this device's own account
    const id = await this.userRepository.findIdByKey('userId', input.userId);
    await this.userRepository.update(id, {
      providerId: identity.providerId,
      email: identity.email,
      picture: identity.picture,
      isAnonymous: false,
    });

    return { userId: input.userId, migrated: false };
  }
}
