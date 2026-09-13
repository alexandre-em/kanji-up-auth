export enum SubscriptionPlan {
  FREE = 'free',
  PREMIUM = 'premium',
}

// Per-kanji / per-word accuracy (correct / total attempts), tracked separately. Client owns the
// running totals (increments locally per answer) and pushes a full replacement here once per
// finished session. progression values may still be a plain number for accounts predating this
// shape (the old momentum score); the client normalizes those on read, nothing to migrate
// server-side. wordProgression is new and never has that legacy shape.
export type KanjiProgression = {
  totalScore: number;
  dailyScores: Record<string, number>;
  progression: Record<string, { correct: number; total: number; lastSeenAtCount?: number } | number>;
  wordProgression: Record<string, { correct: number; total: number }>;
  // Total kanji questions ever answered, across every session — the shared clock a kanji's
  // lastSeenAtCount is measured against, so a review can be spaced by "how many other questions
  // happened since" rather than wall-clock time. Absent on accounts predating this field, treated
  // as 0 client-side.
  questionCount: number;
};

export type UnregisteredUsersFields = {
  // Stable identity, independent of the device — every route past the initial bootstrap
  // (GET /users/mac-address/:macAddress) uses this, never macAddress directly
  userId: string;
  name: string;
  macAddress: string;
  isAnonymous: boolean;
  adsDeactivated: boolean;
  // Opt-in, distinct from the images already being stored for the user's own session history —
  // this only governs eligibility for a future training-set export, not whether images are sent
  // or kept at all
  trainingConsent: boolean;
  subscriptionPlan: SubscriptionPlan;
  credits: number;
  lastFreeCreditDate: Date | null;
  unlockedDifficulties: string[];
  unlockedKanji: string[];
  kanjiProgression: KanjiProgression;

  createdAt: Date;
  updatedAt: Date;
};

export type RegisteredUsersFields = {
  // if registered
  email: string | null;
  picture: string | null;
  providerId: string | null;
  subscribedAt: Date | null;
  subscribedUntil: Date | null;
};

export type Users = UnregisteredUsersFields & RegisteredUsersFields;
