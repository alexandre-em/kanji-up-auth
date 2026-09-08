import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FeedbackRepository } from '../../application/repositories/feedback';
import { Feedback, FeedbackSchema } from '../database/models/mongoose/feedback';
import { MongooseFeedbackRepository } from './feedback';

@Module({
  imports: [MongooseModule.forFeature([{ name: Feedback.name, schema: FeedbackSchema }])],
  providers: [
    {
      provide: FeedbackRepository,
      useClass: MongooseFeedbackRepository,
    },
  ],
  exports: [FeedbackRepository],
})
export class FeedbackRepositoryModule {}
