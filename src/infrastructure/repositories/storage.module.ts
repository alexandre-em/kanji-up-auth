import { Module } from '@nestjs/common';
import { StorageRepository } from '../../application/repositories/storage';

import { R2StorageRepository } from './storage';

@Module({
  providers: [
    {
      provide: StorageRepository,
      useClass: R2StorageRepository,
    },
  ],
  exports: [StorageRepository],
})
export class StorageRepositoryModule {}
