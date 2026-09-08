import { Injectable } from '@nestjs/common';

import { Feedback, FeedbackCategory } from '../../../domain/entities';
import { FeedbackRepository } from '../../repositories/feedback';

export type CreateFeedbackInput = {
  userId: string;
  category: FeedbackCategory;
  message: string;
};

@Injectable()
export class CreateFeedbackUseCase {
  constructor(private feedbackRepository: FeedbackRepository) {}

  async execute(input: CreateFeedbackInput): Promise<Feedback> {
    const feedback = await this.feedbackRepository.create(input);

    this.notifyWebhook(feedback).catch(() => undefined);

    return feedback;
  }

  private async notifyWebhook(feedback: Feedback): Promise<void> {
    const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL;
    if (!webhookUrl) return;

    const text = `[${feedback.category}] ${feedback.message}\n(userId: ${feedback.userId})`;

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text, text }),
    });
  }
}
