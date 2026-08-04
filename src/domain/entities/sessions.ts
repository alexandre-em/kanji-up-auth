export enum SessionType {
  KANJI = 'kanji',
  WORD = 'word',
  OTHER = 'other',
}

export enum SessionStatus {
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  ABANDONED = 'abandoned',
}

export type QuestionStatus = 'idle' | 'correct' | 'incorrect' | 'review';

export type KanjiQuestion = {
  kanjiId: string;
  image: string | null;
  strokesCount: number;
  status: QuestionStatus;
  userConfirmation: boolean | null;
};

export type WordQuestionSlot = {
  image: string | null;
  predictions: { label: string; confidence: number }[];
  strokesCount: number;
};

export type WordQuestion = {
  wordId: string;
  slots: WordQuestionSlot[];
  status: QuestionStatus;
  userConfirmation: boolean | null;
};

// 'other' session types carry a shape this service doesn't know about yet — stored as-is
export type Question = KanjiQuestion | WordQuestion | Record<string, unknown>;

export type Sessions = {
  sessionId: string;
  userId: string;
  type: SessionType;
  status: SessionStatus;
  questions: Question[];
  currentIndex: number;
  score: number | null;

  createdAt: Date;
  updatedAt: Date;
};
