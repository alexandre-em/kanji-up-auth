import { Module } from '@nestjs/common';
import { GooglePlayRepository } from 'src/application/repositories/googlePlay';

import { GooglePlayApiRepository } from './googlePlay';

@Module({
  providers: [
    {
      provide: GooglePlayRepository,
      useClass: GooglePlayApiRepository,
    },
  ],
  exports: [GooglePlayRepository],
})
export class GooglePlayRepositoryModule {}
