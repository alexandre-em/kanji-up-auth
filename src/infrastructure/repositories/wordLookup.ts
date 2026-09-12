import { Injectable } from '@nestjs/common';

import { WordLookupRepository, WordMatch } from '../../application/repositories/wordLookup';

type WordExactMatchResponse = {
  word_id: string;
} | null;

@Injectable()
export class HttpWordLookupRepository implements WordLookupRepository {
  private baseUrl = process.env.WORD_SERVICE_URL ?? '';

  async findExactMatch(text: string): Promise<WordMatch | null> {
    try {
      const response = await fetch(`${this.baseUrl}/exact/word?query=${encodeURIComponent(text)}`);
      if (!response.ok) return null;

      const match = (await response.json()) as WordExactMatchResponse;

      return match ? { wordId: match.word_id } : null;
    } catch {
      return null;
    }
  }
}
