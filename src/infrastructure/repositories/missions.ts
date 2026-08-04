import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyMissionsRepository } from 'src/application/repositories/missions';
import { DailyMission, MissionTaskKey } from 'src/domain/entities';

import { DailyMission as MongooseDailyMission } from '../database/models/mongoose/missions';

@Injectable()
export class MongooseDailyMissionsRepository implements DailyMissionsRepository {
  constructor(@InjectModel(MongooseDailyMission.name) private readonly missionModel: Model<MongooseDailyMission>) {}

  async findByUserIdAndDate(userId: string, date: string): Promise<DailyMission | null> {
    const result = await this.missionModel.findOne({ userId, date }).select('-_id -__v').exec();

    return result ? result.toObject() : null;
  }

  async create(userId: string, date: string): Promise<DailyMission> {
    const result = await this.missionModel.create({ userId, date });

    return result.toObject();
  }

  async completeTask(userId: string, date: string, task: MissionTaskKey): Promise<DailyMission> {
    const result = await this.missionModel
      .findOneAndUpdate({ userId, date }, { $set: { [`tasks.${task}`]: true } }, { new: true })
      .select('-_id -__v')
      .exec();

    return result!.toObject();
  }

  async claimReward(userId: string, date: string): Promise<DailyMission | null> {
    const result = await this.missionModel
      .findOneAndUpdate({ userId, date, rewardClaimed: false }, { $set: { rewardClaimed: true } }, { new: true })
      .select('-_id -__v')
      .exec();

    return result ? result.toObject() : null;
  }
}
