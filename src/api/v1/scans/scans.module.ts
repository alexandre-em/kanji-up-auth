import { Module } from '@nestjs/common';

import { CreateScanUseCase } from '../../../application/use-cases/scans/create';
import { ListScansUseCase } from '../../../application/use-cases/scans/list';
import { SegmentTextUseCase } from '../../../application/use-cases/scans/segmentText';
import { ScansRepositoryModule } from '../../../infrastructure/repositories/scans.module';
import { StorageRepositoryModule } from '../../../infrastructure/repositories/storage.module';
import { UsersRepositoryModule } from '../../../infrastructure/repositories/users.module';
import { VisionRepositoryModule } from '../../../infrastructure/repositories/vision.module';
import { WordLookupRepositoryModule } from '../../../infrastructure/repositories/wordLookup.module';
import { ScansController } from './scans.controller';

@Module({
  imports: [
    ScansRepositoryModule,
    StorageRepositoryModule,
    VisionRepositoryModule,
    WordLookupRepositoryModule,
    UsersRepositoryModule,
  ],
  controllers: [ScansController],
  providers: [CreateScanUseCase, ListScansUseCase, SegmentTextUseCase],
  exports: [],
})
export class ScansModule {}
