import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/application/repositories/users';

@Injectable()
export class FindByMacAddressUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(macAddress: string): Promise<any> {
    return await this.userRepository.findByMacAddress(macAddress);
  }
}
