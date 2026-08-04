export enum SubscriptionPlan {
  FREE = 'free',
  PREMIUM = 'premium',
}

// Per-kanji mastery score, shared between kanji and word training modes. Client owns the running
// totals (increments locally per answer) and pushes a full replacement here once per finished
// session — mirrors the existing web app's applications.kanji scoring, not a new design.
export type KanjiProgression = {
  totalScore: number;
  dailyScores: Record<string, number>;
  progression: Record<string, number>;
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
