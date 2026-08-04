import { Module } from '@nestjs/common';
import { GoogleIdentityRepository } from 'src/application/repositories/googleIdentity';

import { GoogleOAuthIdentityRepository } from './googleIdentity';

@Module({
  providers: [
    {
      provide: GoogleIdentityRepository,
      useClass: GoogleOAuthIdentityRepository,
    },
  ],
  exports: [GoogleIdentityRepository],
})
export class GoogleIdentityRepositoryModule {}
