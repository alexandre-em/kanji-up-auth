import { Module } from '@nestjs/common';
import { CreateUserUseCase } from 'src/application/use-cases/users/create';
import { EarnCreditsUseCase } from 'src/application/use-cases/users/earnCredits';
import { FindByMacAddressUseCase } from 'src/application/use-cases/users/findByMacAddress';
import { LinkUserToProviderUseCase } from 'src/application/use-cases/users/linkToProvider';
import { UnlockContentUseCase } from 'src/application/use-cases/users/unlockContent';
import { UsersRepositoryModule } from 'src/infrastructure/repositories/users.module';

import { UsersController } from './users.controller';

@Module({
  imports: [UsersRepositoryModule],
  controllers: [UsersController],
  providers: [FindByMacAddressUseCase, CreateUserUseCase, LinkUserToProviderUseCase, EarnCreditsUseCase, UnlockContentUseCase],
  exports: [],
})
export class UsersModule {}
