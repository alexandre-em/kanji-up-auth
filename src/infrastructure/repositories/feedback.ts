import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FeedbackRepository } from '../../application/repositories/feedback';
import { Feedback } from '../../domain/entities';
import { Feedback as MongooseFeedback } from '../database/models/mongoose/feedback';

@Injectable()
export class MongooseFeedbackRepository implements FeedbackRepository {
  constructor(@InjectModel(MongooseFeedback.name) private readonly feedbackModel: Model<MongooseFeedback>) {}

  async create(feedback: Omit<Feedback, 'feedbackId' | 'createdAt'>): Promise<Feedback> {
    const result = await this.feedbackModel.create(feedback);

    return result.toObject();
  }
}
