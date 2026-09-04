import { Injectable } from '@nestjs/common';

import { UsersRepository } from '../../repositories/users';

@Injectable()
export class UpdateTrainingConsentUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(userId: string, trainingConsent: boolean): Promise<{ trainingConsent: boolean }> {
    const id = await this.userRepository.findIdByKey('userId', userId);

    await this.userRepository.update(id, { trainingConsent });

    return { trainingConsent };
  }
}
