export enum FeedbackCategory {
  BUG = 'bug',
  SUGGESTION = 'suggestion',
  OTHER = 'other',
}

export type Feedback = {
  feedbackId: string;
  userId: string;
  category: FeedbackCategory;
  message: string;
  createdAt: Date;
};
