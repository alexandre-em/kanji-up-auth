import { Feedback } from '../../domain/entities';

export abstract class FeedbackRepository {
  abstract create(feedback: Omit<Feedback, 'feedbackId' | 'createdAt'>): Promise<Feedback>;
}
