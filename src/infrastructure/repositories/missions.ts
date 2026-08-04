import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyMissionsRepository } from 'src/application/repositories/missions';
import { DailyMission, MissionTaskKey } from 'src/domain/entities';

import { DailyMission as MongooseDailyMission } from '../database/models/mongoose/missions';

@Injectable()
export class MongooseDailyMissionsRepository implements DailyMissionsRepository {
  constructor(@InjectModel(MongooseDailyMission.name) private readonly missionModel: Model<MongooseDailyMission>) {}

  async findByMacAddressAndDate(macAddress: string, date: string): Promise<DailyMission | null> {
    const result = await this.missionModel.findOne({ macAddress, date }).select('-_id -__v').exec();

    return result ? result.toObject() : null;
  }

  async create(macAddress: string, date: string): Promise<DailyMission> {
    const result = await this.missionModel.create({ macAddress, date });

    return result.toObject();
  }

  async completeTask(macAddress: string, date: string, task: MissionTaskKey): Promise<DailyMission> {
    const result = await this.missionModel
      .findOneAndUpdate({ macAddress, date }, { $set: { [`tasks.${task}`]: true } }, { new: true })
      .select('-_id -__v')
      .exec();

    return result!.toObject();
  }

  async claimReward(macAddress: string, date: string): Promise<DailyMission | null> {
    const result = await this.missionModel
      .findOneAndUpdate({ macAddress, date, rewardClaimed: false }, { $set: { rewardClaimed: true } }, { new: true })
      .select('-_id -__v')
      .exec();

    return result ? result.toObject() : null;
  }

  async migrateMacAddress(fromMacAddress: string, toMacAddress: string): Promise<void> {
    await this.missionModel.updateMany({ macAddress: fromMacAddress }, { $set: { macAddress: toMacAddress } });
  }

  async deleteByMacAddress(macAddress: string): Promise<void> {
    await this.missionModel.deleteMany({ macAddress });
  }
}
