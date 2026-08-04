import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Scan extends Document {
  @Prop({ type: String, required: true, unique: true, default: randomUUID })
  scanId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  imageUrl: string;

  @Prop({ type: String, required: true })
  recognizedText: string;

  createdAt: Date;
}

export const ScanSchema = SchemaFactory.createForClass(Scan);

ScanSchema.index({ userId: 1 });
