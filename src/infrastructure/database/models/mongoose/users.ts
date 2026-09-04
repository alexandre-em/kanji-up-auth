import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document } from 'mongoose';

export enum SubscriptionPlan {
  FREE = 'free',
  PREMIUM = 'premium',
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class User extends Document {
  @Prop({ type: String, required: true, unique: true, default: randomUUID })
  userId: string;

  // No `default: null` here on purpose: Mongoose would write an explicit null on every anonymous
  // account, and a sparse unique index only excludes documents where the field is entirely
  // absent — not ones explicitly set to null. With a default, every account after the very first
  // ever created (anonymous, no linked provider) collided on this index (E11000) since they all
  // shared the same null value. Leaving the field genuinely unset lets sparse do its job.
  @Prop({ type: String, unique: true, sparse: true })
  providerId: string | null;

  @Prop({ type: String, unique: true, sparse: true })
  email: string | null;

  @Prop({ type: Date, default: null })
  subscribedAt: Date;

  @Prop({ type: Date, default: null })
  subscribedUntil: Date;

  @Prop({ type: String, default: SubscriptionPlan.FREE })
  subscriptionPlan: SubscriptionPlan;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  macAddress: string;

  @Prop({ type: String, default: null })
  picture: string | null;

  @Prop({ type: Boolean, default: true })
  isAnonymous: boolean;

  @Prop({ type: Boolean, default: false })
  adsDeactivated: boolean;

  // Opt-in, distinct from the images already being stored for the user's own session history —
  // this only governs eligibility for a future training-set export, not whether images are sent
  // or kept at all
  @Prop({ type: Boolean, default: false })
  trainingConsent: boolean;

  @Prop({ type: Number, default: 0 })
  credits: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  lastFreeCreditDate: Date | null;

  // Bulk unlocks: keys like "jlpt:3", "grade:8" — one whole difficulty tier bought at once
  @Prop({ type: [String], default: [] })
  unlockedDifficulties: string[];

  // Individual kanji unlocked one at a time, cheaper per-item than buying the whole tier
  @Prop({ type: [String], default: [] })
  unlockedKanji: string[];

  // Shape validated at the DTO boundary, not here — client sends a full replacement per finished
  // training session
  @Prop({
    type: { totalScore: Number, dailyScores: Object, progression: Object, wordProgression: Object },
    default: () => ({ totalScore: 0, dailyScores: {}, progression: {}, wordProgression: {} }),
  })
  kanjiProgression: {
    totalScore: number;
    dailyScores: Record<string, number>;
    progression: Record<string, { correct: number; total: number } | number>;
    wordProgression: Record<string, { correct: number; total: number }>;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ userId: 1 });
UserSchema.index({ macAddress: 1 });
UserSchema.index({ providerId: 1 });
UserSchema.index({ email: 1 });
