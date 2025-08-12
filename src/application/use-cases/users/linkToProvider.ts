import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/application/repositories/users';

type LinkUserInput = {
  email: string | null;
  picture: string | null;
  providerId: string | null;
};

@Injectable()
export class LinkUserToProviderUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(macAddress: string, input: LinkUserInput): Promise<any> {
    const id = await this.userRepository.findIdByKey('macAddress', macAddress);

    return await this.userRepository.update(id, input);
  }
}
