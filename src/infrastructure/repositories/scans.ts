import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedScans, ScansRepository } from 'src/application/repositories/scans';
import { ScanResult } from 'src/domain/entities';

import { Scan as MongooseScan } from '../database/models/mongoose/scans';

@Injectable()
export class MongooseScansRepository implements ScansRepository {
  constructor(@InjectModel(MongooseScan.name) private readonly scanModel: Model<MongooseScan>) {}

  async create(scan: Omit<ScanResult, 'scanId' | 'createdAt'>): Promise<ScanResult> {
    const result = await this.scanModel.create(scan);

    return result.toObject();
  }

  async findByMacAddress(macAddress: string, page: number, limit: number): Promise<PaginatedScans> {
    const [docs, totalDocs] = await Promise.all([
      this.scanModel
        .find({ macAddress })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-_id -__v')
        .exec(),
      this.scanModel.countDocuments({ macAddress }),
    ]);

    return { docs: docs.map((doc) => doc.toObject()), totalDocs };
  }

  async migrateMacAddress(fromMacAddress: string, toMacAddress: string): Promise<void> {
    await this.scanModel.updateMany({ macAddress: fromMacAddress }, { $set: { macAddress: toMacAddress } });
  }

  async deleteByMacAddress(macAddress: string): Promise<void> {
    await this.scanModel.deleteMany({ macAddress });
  }
}
