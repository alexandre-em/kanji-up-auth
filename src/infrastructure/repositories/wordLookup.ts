import { Injectable } from '@nestjs/common';

import { WordLookupRepository, WordMatch } from '../../application/repositories/wordLookup';

type WordExactMatchResponse = {
  word_id: string;
  reading: string | null;
} | null;

@Injectable()
export class HttpWordLookupRepository implements WordLookupRepository {
  private baseUrl = process.env.WORD_SERVICE_URL ?? '';

  async findExactMatch(text: string): Promise<WordMatch | null> {
    try {
      const response = await fetch(`${this.baseUrl}/exact/word?query=${encodeURIComponent(text)}`);
      if (!response.ok) {
        console.error('findExactMatch: non-ok response', this.baseUrl, response.status, await response.text());
        return null;
      }

      const match = (await response.json()) as WordExactMatchResponse;

      return match ? { wordId: match.word_id, reading: match.reading } : null;
    } catch (error) {
      console.error('findExactMatch: request failed', this.baseUrl, error);
      return null;
    }
  }
}
