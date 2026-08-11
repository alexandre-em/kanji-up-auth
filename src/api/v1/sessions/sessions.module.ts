import { Module } from '@nestjs/common';
import { AbandonSessionUseCase } from '../../../application/use-cases/sessions/abandon';
import { CreateSessionUseCase } from '../../../application/use-cases/sessions/create';
import { FinishSessionUseCase } from '../../../application/use-cases/sessions/finish';
import { FindActiveSessionUseCase } from '../../../application/use-cases/sessions/findActive';
import { UpdateQuestionUseCase } from '../../../application/use-cases/sessions/updateQuestion';
import { SessionsRepositoryModule } from '../../../infrastructure/repositories/sessions.module';

import { SessionsController } from './sessions.controller';

@Module({
  imports: [SessionsRepositoryModule],
  controllers: [SessionsController],
  providers: [CreateSessionUseCase, FindActiveSessionUseCase, UpdateQuestionUseCase, FinishSessionUseCase, AbandonSessionUseCase],
  exports: [],
})
export class SessionsModule {}
