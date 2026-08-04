import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScansRepository } from 'src/application/repositories/scans';

import { Scan, ScanSchema } from '../database/models/mongoose/scans';
import { MongooseScansRepository } from './scans';

@Module({
  imports: [MongooseModule.forFeature([{ name: Scan.name, schema: ScanSchema }])],
  providers: [
    {
      provide: ScansRepository,
      useClass: MongooseScansRepository,
    },
  ],
  exports: [ScansRepository],
})
export class ScansRepositoryModule {}
