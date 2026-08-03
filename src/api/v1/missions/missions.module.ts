import { Module } from '@nestjs/common';
import { CompleteMissionTaskUseCase } from 'src/application/use-cases/missions/completeTask';
import { GetTodayMissionsUseCase } from 'src/application/use-cases/missions/getToday';
import { DailyMissionsRepositoryModule } from 'src/infrastructure/repositories/missions.module';
import { UsersRepositoryModule } from 'src/infrastructure/repositories/users.module';

import { MissionsController } from './missions.controller';

@Module({
  imports: [DailyMissionsRepositoryModule, UsersRepositoryModule],
  controllers: [MissionsController],
  providers: [GetTodayMissionsUseCase, CompleteMissionTaskUseCase],
  exports: [],
})
export class MissionsModule {}
