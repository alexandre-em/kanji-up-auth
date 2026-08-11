import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyMissionsRepository } from '../../application/repositories/missions';

import { DailyMission, DailyMissionSchema } from '../database/models/mongoose/missions';
import { MongooseDailyMissionsRepository } from './missions';

@Module({
  imports: [MongooseModule.forFeature([{ name: DailyMission.name, schema: DailyMissionSchema }])],
  providers: [
    {
      provide: DailyMissionsRepository,
      useClass: MongooseDailyMissionsRepository,
    },
  ],
  exports: [DailyMissionsRepository],
})
export class DailyMissionsRepositoryModule {}
