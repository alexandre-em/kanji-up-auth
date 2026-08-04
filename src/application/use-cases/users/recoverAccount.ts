import { Injectable } from '@nestjs/common';
import { GoogleIdentityRepository } from 'src/application/repositories/googleIdentity';
import { DailyMissionsRepository } from 'src/application/repositories/missions';
import { ScansRepository } from 'src/application/repositories/scans';
import { SessionsRepository } from 'src/application/repositories/sessions';
import { UsersRepository } from 'src/application/repositories/users';

export type RecoverAccountInput = {
  macAddress: string;
  idToken: string;
};

export type RecoverAccountResult = {
  // true when an existing account (a different device) was found and adopted by this one
  migrated: boolean;
};

@Injectable()
export class RecoverAccountUseCase {
  constructor(
    private googleIdentityRepository: GoogleIdentityRepository,
    private userRepository: UsersRepository,
    private sessionsRepository: SessionsRepository,
    private missionsRepository: DailyMissionsRepository,
    private scansRepository: ScansRepository,
  ) {}

  async execute(input: RecoverAccountInput): Promise<RecoverAccountResult> {
    const identity = await this.googleIdentityRepository.verifyIdToken(input.idToken);
    const existing = await this.userRepository.findByProviderId(identity.providerId);

    if (!existing) {
      // First-time link: just attach the verified identity to this device's own account
      const id = await this.userRepository.findIdByKey('macAddress', input.macAddress);
      await this.userRepository.update(id, {
        providerId: identity.providerId,
        email: identity.email,
        picture: identity.picture,
        isAnonymous: false,
      });

      return { migrated: false };
    }

    if (existing.macAddress === input.macAddress) return { migrated: false };

    const oldMacAddress = existing.macAddress;

    // The recovered account is authoritative — drop whatever stub activity happened on this
    // device before signing in. Otherwise migrating could collide with today's mission doc
    // (unique per macAddress+date) or leave two "in progress" sessions of the same type
    await Promise.all([
      this.userRepository.deleteByMacAddress(input.macAddress),
      this.sessionsRepository.deleteByMacAddress(input.macAddress),
      this.missionsRepository.deleteByMacAddress(input.macAddress),
      this.scansRepository.deleteByMacAddress(input.macAddress),
    ]);

    const existingId = await this.userRepository.findIdByKey('macAddress', oldMacAddress);
    await this.userRepository.update(existingId, { macAddress: input.macAddress });

    await Promise.all([
      this.sessionsRepository.migrateMacAddress(oldMacAddress, input.macAddress),
      this.missionsRepository.migrateMacAddress(oldMacAddress, input.macAddress),
      this.scansRepository.migrateMacAddress(oldMacAddress, input.macAddress),
    ]);

    return { migrated: true };
  }
}
