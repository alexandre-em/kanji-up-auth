import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/application/repositories/users';

@Injectable()
export class FindByUserIdUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(userId: string): Promise<any> {
    return await this.userRepository.findByUserId(userId);
  }
}
