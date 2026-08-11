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
  progression: Record<string, { correct: number; total: number } | number>;
  wordProgression: Record<string, { correct: number; total: number }>;
};

export type UnregisteredUsersFields = {
  // Stable identity, independent of the device — every route past the initial bootstrap
  // (GET /users/mac-address/:macAddress) uses this, never macAddress directly
  userId: string;
  name: string;
  macAddress: string;
  isAnonymous: boolean;
  adsDeactivated: boolean;
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
