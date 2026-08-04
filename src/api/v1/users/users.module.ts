import { Module } from '@nestjs/common';
import { CreateUserUseCase } from 'src/application/use-cases/users/create';
import { EarnCreditsUseCase } from 'src/application/use-cases/users/earnCredits';
import { FindByMacAddressUseCase } from 'src/application/use-cases/users/findByMacAddress';
import { FindByUserIdUseCase } from 'src/application/use-cases/users/findByUserId';
import { RecoverAccountUseCase } from 'src/application/use-cases/users/recoverAccount';
import { UnlockContentUseCase } from 'src/application/use-cases/users/unlockContent';
import { UpdateKanjiProgressionUseCase } from 'src/application/use-cases/users/updateKanjiProgression';
import { GoogleIdentityRepositoryModule } from 'src/infrastructure/repositories/googleIdentity.module';
import { UsersRepositoryModule } from 'src/infrastructure/repositories/users.module';

import { UsersController } from './users.controller';

@Module({
  imports: [UsersRepositoryModule, GoogleIdentityRepositoryModule],
  controllers: [UsersController],
  providers: [
    FindByMacAddressUseCase,
    FindByUserIdUseCase,
    CreateUserUseCase,
    RecoverAccountUseCase,
    EarnCreditsUseCase,
    UnlockContentUseCase,
    UpdateKanjiProgressionUseCase,
  ],
  exports: [],
})
export class UsersModule {}
