import { WordLookupRepository } from '../../repositories/wordLookup';
import { SegmentTextUseCase } from './segmentText';

class FakeWordLookupRepository extends WordLookupRepository {
  constructor(private readonly dictionary: Set<string>) {
    super();
  }

  async findExactMatch(text: string) {
    return this.dictionary.has(text) ? { wordId: `id-${text}` } : null;
  }
}

function buildUseCase(words: string[]) {
  return new SegmentTextUseCase(new FakeWordLookupRepository(new Set(words)));
}

describe('SegmentTextUseCase', () => {
  it('groups an unmatched kanji run instead of splitting it character by character', async () => {
    const useCase = buildUseCase(['そば']);

    const tokens = await useCase.execute('正油そば');

    expect(tokens).toEqual([
      { text: '正油', wordId: null },
      { text: 'そば', wordId: 'id-そば' },
    ]);
  });

  it('strips stray roman letters and digits before segmenting', async () => {
    const useCase = buildUseCase(['そば']);

    const tokens = await useCase.execute('正油そばTokyo123');

    expect(tokens).toEqual([
      { text: '正油', wordId: null },
      { text: 'そば', wordId: 'id-そば' },
    ]);
  });

  it('strips roman noise sitting between two unrelated words without merging them into one match', async () => {
    const useCase = buildUseCase(['東京', '大阪']);

    const tokens = await useCase.execute('東京X大阪');

    expect(tokens).toEqual([
      { text: '東京', wordId: 'id-東京' },
      { text: '大阪', wordId: 'id-大阪' },
    ]);
  });

  it('still prefers the longest dictionary match at each position (no regression)', async () => {
    const useCase = buildUseCase(['東京', '東京都', '都民']);

    const tokens = await useCase.execute('東京都民');

    expect(tokens).toEqual([{ text: '東京都', wordId: 'id-東京都' }, { text: '民', wordId: null }]);
  });

  it('segments back-to-back known words without merging them', async () => {
    const useCase = buildUseCase(['寿司', 'ラーメン']);

    const tokens = await useCase.execute('寿司ラーメン');

    expect(tokens).toEqual([
      { text: '寿司', wordId: 'id-寿司' },
      { text: 'ラーメン', wordId: 'id-ラーメン' },
    ]);
  });

  it('groups a long unmatched kanji compound into a single token', async () => {
    const useCase = buildUseCase([]);

    const tokens = await useCase.execute('未知漢字列');

    expect(tokens).toEqual([{ text: '未知漢字列', wordId: null }]);
  });

  it('splits an unmatched run at a script boundary between kanji and kana', async () => {
    const useCase = buildUseCase([]);

    const tokens = await useCase.execute('未知ふめい');

    expect(tokens).toEqual([
      { text: '未知', wordId: null },
      { text: 'ふめい', wordId: null },
    ]);
  });

  it('stops an unmatched run right before a position that would itself match, instead of swallowing it', async () => {
    const useCase = buildUseCase(['書']);

    const tokens = await useCase.execute('辭書');

    expect(tokens).toEqual([
      { text: '辭', wordId: null },
      { text: '書', wordId: 'id-書' },
    ]);
  });

  it('keeps Japanese punctuation, grouped as its own unmatched token', async () => {
    const useCase = buildUseCase(['寿司']);

    const tokens = await useCase.execute('寿司、美味しい');

    expect(tokens[0]).toEqual({ text: '寿司', wordId: 'id-寿司' });
    expect(tokens[1].wordId).toBeNull();
    expect(tokens[1].text.startsWith('、')).toBe(true);
  });

  it('drops whitespace entirely, independent of script grouping', async () => {
    const useCase = buildUseCase(['東京', '大阪']);

    const tokens = await useCase.execute('東京 大阪');

    expect(tokens).toEqual([
      { text: '東京', wordId: 'id-東京' },
      { text: '大阪', wordId: 'id-大阪' },
    ]);
  });

  it('returns an empty list for text that is entirely non-Japanese', async () => {
    const useCase = buildUseCase(['そば']);

    const tokens = await useCase.execute('Tokyo123!!');

    expect(tokens).toEqual([]);
  });

  it('returns an empty list for an empty string', async () => {
    const useCase = buildUseCase(['そば']);

    const tokens = await useCase.execute('');

    expect(tokens).toEqual([]);
  });

  it('caps how far a single dictionary lookup window extends (MAX_WORD_LENGTH)', async () => {
    const sevenCharWord = '一二三四五六七';
    const useCase = buildUseCase([sevenCharWord, '一二三四五六']);

    const tokens = await useCase.execute(sevenCharWord);

    // The 7-character entry is unreachable (window caps at 6), so the 6-character prefix wins,
    // leaving the 7th character as its own unmatched token
    expect(tokens).toEqual([
      { text: '一二三四五六', wordId: `id-一二三四五六` },
      { text: '七', wordId: null },
    ]);
  });
});
