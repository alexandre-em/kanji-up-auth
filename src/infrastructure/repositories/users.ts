import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersRepository } from 'src/application/repositories/users';
import { Users } from 'src/domain/entities';

import { User as MongooseUser } from '../database/models/mongoose/users';

@Injectable()
export class MongooseUserRepository implements UsersRepository {
  constructor(@InjectModel(MongooseUser.name) private readonly userModel: Model<MongooseUser>) {}

  async findIdByKey(key: string, value: string): Promise<string> {
    const result = await this.userModel.findOne({ [key]: value }).exec();

    if (!result) throw new Error('User not found');

    return result._id as string;
  }

  async findByMacAddress(macAddress: string): Promise<Users> {
    const result = await this.userModel.findOne({ macAddress }).select('-_id -__v').exec();

    if (!result) throw new Error('User not found');

    return result;
  }

  async save(payload) {
    await this.userModel.create(payload);
  }

  async update(id, payload) {
    await this.userModel.updateOne({ _id: id }, payload);
  }
}
