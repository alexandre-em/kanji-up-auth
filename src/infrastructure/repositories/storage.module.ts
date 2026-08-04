import { Module } from '@nestjs/common';
import { StorageRepository } from 'src/application/repositories/storage';

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
