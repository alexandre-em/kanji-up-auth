import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { SessionStatus, SessionType } from 'src/domain/entities';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Session extends Document {
  @Prop({ type: String, required: true, unique: true, default: randomUUID })
  sessionId: string;

  @Prop({ type: String, required: true })
  macAddress: string;

  @Prop({ type: String, enum: Object.values(SessionType), required: true })
  type: SessionType;

  @Prop({ type: String, enum: Object.values(SessionStatus), default: SessionStatus.IN_PROGRESS })
  status: SessionStatus;

  // Shape varies by type (kanji/word/other) — validated at the DTO/use-case boundary, not here
  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  questions: Record<string, unknown>[];

  @Prop({ type: Number, default: 0 })
  currentIndex: number;

  @Prop({ type: Number, default: null })
  score: number | null;

  createdAt: Date;
  updatedAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.index({ macAddress: 1, type: 1, status: 1 });
