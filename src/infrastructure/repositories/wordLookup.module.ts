import { Module } from '@nestjs/common';
import { WordLookupRepository } from '../../application/repositories/wordLookup';

import { HttpWordLookupRepository } from './wordLookup';

@Module({
  providers: [
    {
      provide: WordLookupRepository,
      useClass: HttpWordLookupRepository,
    },
  ],
  exports: [WordLookupRepository],
})
export class WordLookupRepositoryModule {}
