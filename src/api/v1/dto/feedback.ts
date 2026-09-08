import { Expose } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { FeedbackCategory } from '../../../domain/entities';

export class FeedbackResponseDto {
  @Expose()
  feedbackId: string;

  @Expose()
  createdAt: Date;
}

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsIn(Object.values(FeedbackCategory))
  category: FeedbackCategory;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}
