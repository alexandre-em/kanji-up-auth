import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/application/repositories/users';
import { KanjiProgression } from 'src/domain/entities';

@Injectable()
export class UpdateKanjiProgressionUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(userId: string, kanjiProgression: KanjiProgression): Promise<void> {
    const id = await this.userRepository.findIdByKey('userId', userId);

    await this.userRepository.update(id, { kanjiProgression });
  }
}
