import { Module } from '@nestjs/common';
import { CreateUserUseCase } from 'src/application/use-cases/users/create';
import { EarnCreditsUseCase } from 'src/application/use-cases/users/earnCredits';
import { FindByMacAddressUseCase } from 'src/application/use-cases/users/findByMacAddress';
import { RecoverAccountUseCase } from 'src/application/use-cases/users/recoverAccount';
import { UnlockContentUseCase } from 'src/application/use-cases/users/unlockContent';
import { UpdateKanjiProgressionUseCase } from 'src/application/use-cases/users/updateKanjiProgression';
import { GoogleIdentityRepositoryModule } from 'src/infrastructure/repositories/googleIdentity.module';
import { DailyMissionsRepositoryModule } from 'src/infrastructure/repositories/missions.module';
import { ScansRepositoryModule } from 'src/infrastructure/repositories/scans.module';
import { SessionsRepositoryModule } from 'src/infrastructure/repositories/sessions.module';
import { UsersRepositoryModule } from 'src/infrastructure/repositories/users.module';

import { UsersController } from './users.controller';

@Module({
  imports: [
    UsersRepositoryModule,
    GoogleIdentityRepositoryModule,
    SessionsRepositoryModule,
    DailyMissionsRepositoryModule,
    ScansRepositoryModule,
  ],
  controllers: [UsersController],
  providers: [
    FindByMacAddressUseCase,
    CreateUserUseCase,
    RecoverAccountUseCase,
    EarnCreditsUseCase,
    UnlockContentUseCase,
    UpdateKanjiProgressionUseCase,
  ],
  exports: [],
})
export class UsersModule {}
