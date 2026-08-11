import { Module } from '@nestjs/common';
import { CompleteMissionTaskUseCase } from '../../../application/use-cases/missions/completeTask';
import { GetTodayMissionsUseCase } from '../../../application/use-cases/missions/getToday';
import { DailyMissionsRepositoryModule } from '../../../infrastructure/repositories/missions.module';
import { UsersRepositoryModule } from '../../../infrastructure/repositories/users.module';

import { MissionsController } from './missions.controller';

@Module({
  imports: [DailyMissionsRepositoryModule, UsersRepositoryModule],
  controllers: [MissionsController],
  providers: [GetTodayMissionsUseCase, CompleteMissionTaskUseCase],
  exports: [],
})
export class MissionsModule {}
