import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document } from 'mongoose';

import { FeedbackCategory } from '../../../../domain/entities';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Feedback extends Document {
  @Prop({ type: String, required: true, unique: true, default: randomUUID })
  feedbackId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, enum: Object.values(FeedbackCategory), required: true })
  category: FeedbackCategory;

  @Prop({ type: String, required: true })
  message: string;

  createdAt: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
