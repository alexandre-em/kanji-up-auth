import { Module } from '@nestjs/common';
import { CreateScanUseCase } from 'src/application/use-cases/scans/create';
import { ListScansUseCase } from 'src/application/use-cases/scans/list';
import { SegmentTextUseCase } from 'src/application/use-cases/scans/segmentText';
import { ScansRepositoryModule } from 'src/infrastructure/repositories/scans.module';
import { StorageRepositoryModule } from 'src/infrastructure/repositories/storage.module';
import { VisionRepositoryModule } from 'src/infrastructure/repositories/vision.module';
import { WordLookupRepositoryModule } from 'src/infrastructure/repositories/wordLookup.module';

import { ScansController } from './scans.controller';

@Module({
  imports: [ScansRepositoryModule, StorageRepositoryModule, VisionRepositoryModule, WordLookupRepositoryModule],
  controllers: [ScansController],
  providers: [CreateScanUseCase, ListScansUseCase, SegmentTextUseCase],
  exports: [],
})
export class ScansModule {}
