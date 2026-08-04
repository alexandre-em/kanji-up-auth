import { Module } from '@nestjs/common';
import { VisionRepository } from 'src/application/repositories/vision';

import { GoogleVisionRepository } from './vision';

@Module({
  providers: [
    {
      provide: VisionRepository,
      useClass: GoogleVisionRepository,
    },
  ],
  exports: [VisionRepository],
})
export class VisionRepositoryModule {}
