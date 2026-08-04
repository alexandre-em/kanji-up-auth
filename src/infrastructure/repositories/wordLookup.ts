import { Injectable } from '@nestjs/common';
import { WordLookupRepository, WordMatch } from 'src/application/repositories/wordLookup';

type WordSearchResponse = {
  docs: { word: string[]; word_id: string }[];
};

// back/word has no exact-match-by-spelling HTTP endpoint (only fuzzy Atlas Search, and an
// internal-only service method) — reuses the existing public search endpoint and filters for an
// exact spelling match client-side. Native fetch, no new HTTP client dependency.
@Injectable()
export class HttpWordLookupRepository implements WordLookupRepository {
  private baseUrl = process.env.WORD_SERVICE_URL ?? '';

  async findExactMatch(text: string): Promise<WordMatch | null> {
    const response = await fetch(`${this.baseUrl}/search/word?query=${encodeURIComponent(text)}&page=1&limit=5`);
    if (!response.ok) return null;

    const { docs } = (await response.json()) as WordSearchResponse;
    const exact = docs.find((doc) => doc.word.includes(text));

    return exact ? { wordId: exact.word_id } : null;
  }
}
