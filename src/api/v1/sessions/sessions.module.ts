import { Module } from '@nestjs/common';
import { AbandonSessionUseCase } from 'src/application/use-cases/sessions/abandon';
import { CreateSessionUseCase } from 'src/application/use-cases/sessions/create';
import { FinishSessionUseCase } from 'src/application/use-cases/sessions/finish';
import { FindActiveSessionUseCase } from 'src/application/use-cases/sessions/findActive';
import { UpdateQuestionUseCase } from 'src/application/use-cases/sessions/updateQuestion';
import { SessionsRepositoryModule } from 'src/infrastructure/repositories/sessions.module';

import { SessionsController } from './sessions.controller';

@Module({
  imports: [SessionsRepositoryModule],
  controllers: [SessionsController],
  providers: [CreateSessionUseCase, FindActiveSessionUseCase, UpdateQuestionUseCase, FinishSessionUseCase, AbandonSessionUseCase],
  exports: [],
})
export class SessionsModule {}
