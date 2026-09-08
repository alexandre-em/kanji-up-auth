import { Module } from '@nestjs/common';

import { CreateFeedbackUseCase } from '../../../application/use-cases/feedback/create';
import { FeedbackRepositoryModule } from '../../../infrastructure/repositories/feedback.module';
import { FeedbackController } from './feedback.controller';

@Module({
  imports: [FeedbackRepositoryModule],
  controllers: [FeedbackController],
  providers: [CreateFeedbackUseCase],
  exports: [],
})
export class FeedbackModule {}
