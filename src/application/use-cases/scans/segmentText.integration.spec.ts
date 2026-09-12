import { HttpWordLookupRepository } from '../../../infrastructure/repositories/wordLookup';
import { SegmentTextUseCase } from './segmentText';

// Hits the real word search API (same one the deployed app talks to) instead of a fake
// dictionary — confirms the fix against actual data, not an assumption about what's in it
const WORD_SERVICE_URL = 'https://api.word.kanjiup.alexandre-em.fr/words';

function matched(text: string) {
  return { text, wordId: expect.any(String) as string, reading: expect.any(String) as string };
}

describe('SegmentTextUseCase (integration, live word API)', () => {
  let useCase: SegmentTextUseCase;

  beforeAll(() => {
    process.env.WORD_SERVICE_URL = WORD_SERVICE_URL;
    useCase = new SegmentTextUseCase(new HttpWordLookupRepository());
  });

  it('matches 正油 (an informal 醤油 spelling) as a real dictionary entry, and そば as its own token', async () => {
    const tokens = await useCase.execute('正油そば');

    expect(tokens).toEqual([matched('正油'), matched('そば')]);
  }, 15000);

  it('reproduces the exact reported case, roman noise included', async () => {
    const tokens = await useCase.execute('正油そばTokyo123');

    expect(tokens).toEqual([matched('正油'), matched('そば')]);
  }, 15000);

  it('matches 辞書 as a single real dictionary word', async () => {
    const tokens = await useCase.execute('辞書');

    expect(tokens).toEqual([matched('辞書')]);
  }, 15000);

  it('matches 寿司 and ラーメン back to back as two real words, not merged by script grouping', async () => {
    const tokens = await useCase.execute('寿司ラーメン');

    expect(tokens).toEqual([matched('寿司'), matched('ラーメン')]);
  }, 15000);
});
