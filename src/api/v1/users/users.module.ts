import { Module } from '@nestjs/common';

import { CreateUserUseCase } from '../../../application/use-cases/users/create';
import { EarnCreditsUseCase } from '../../../application/use-cases/users/earnCredits';
import { FindByMacAddressUseCase } from '../../../application/use-cases/users/findByMacAddress';
import { FindByUserIdUseCase } from '../../../application/use-cases/users/findByUserId';
import { RecoverAccountUseCase } from '../../../application/use-cases/users/recoverAccount';
import { SignInWithGoogleUseCase } from '../../../application/use-cases/users/signInWithGoogle';
import { UnlockContentUseCase } from '../../../application/use-cases/users/unlockContent';
import { UpdateKanjiProgressionUseCase } from '../../../application/use-cases/users/updateKanjiProgression';
import { UpdateTrainingConsentUseCase } from '../../../application/use-cases/users/updateTrainingConsent';
import { GoogleIdentityRepositoryModule } from '../../../infrastructure/repositories/googleIdentity.module';
import { UsersRepositoryModule } from '../../../infrastructure/repositories/users.module';
import { UsersController } from './users.controller';

@Module({
  imports: [UsersRepositoryModule, GoogleIdentityRepositoryModule],
  controllers: [UsersController],
  providers: [
    FindByMacAddressUseCase,
    FindByUserIdUseCase,
    CreateUserUseCase,
    RecoverAccountUseCase,
    SignInWithGoogleUseCase,
    EarnCreditsUseCase,
    UnlockContentUseCase,
    UpdateKanjiProgressionUseCase,
    UpdateTrainingConsentUseCase,
  ],
  exports: [],
})
export class UsersModule {}
