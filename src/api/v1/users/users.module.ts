import { Module } from '@nestjs/common';
import { CreateUserUseCase } from 'src/application/use-cases/users/create';
import { FindByMacAddressUseCase } from 'src/application/use-cases/users/findByMacAddress';
import { LinkUserToProviderUseCase } from 'src/application/use-cases/users/linkToProvider';
import { UsersRepositoryModule } from 'src/infrastructure/repositories/users.module';

import { UsersController } from './users.controller';

@Module({
  imports: [UsersRepositoryModule],
  controllers: [UsersController],
  providers: [FindByMacAddressUseCase, CreateUserUseCase, LinkUserToProviderUseCase],
  exports: [],
})
export class UsersModule {}
