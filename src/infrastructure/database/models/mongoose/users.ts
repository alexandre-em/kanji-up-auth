import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum SubscriptionPlan {
  FREE = 'free',
  PREMIUM = 'premium',
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class User extends Document {
  @Prop({ type: String, default: null, unique: true, sparse: true })
  providerId: string | null;

  @Prop({ type: String, default: null, unique: true, sparse: true })
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

  @Prop({ type: Number, default: 0 })
  credits: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ macAddress: 1 });
UserSchema.index({ providerId: 1 });
UserSchema.index({ email: 1 });
