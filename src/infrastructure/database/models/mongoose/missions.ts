import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class DailyMission extends Document {
  @Prop({ type: String, required: true })
  macAddress: string;

  @Prop({ type: String, required: true })
  date: string;

  @Prop({
    type: { kanjiSession: Boolean, wordSession: Boolean, kanjiMastery: Boolean },
    default: () => ({ kanjiSession: false, wordSession: false, kanjiMastery: false }),
  })
  tasks: { kanjiSession: boolean; wordSession: boolean; kanjiMastery: boolean };

  @Prop({ type: Boolean, default: false })
  rewardClaimed: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const DailyMissionSchema = SchemaFactory.createForClass(DailyMission);

DailyMissionSchema.index({ macAddress: 1, date: 1 }, { unique: true });
