import { WordLookupRepository } from '../../repositories/wordLookup';
import { SegmentTextUseCase } from './segmentText';

class FakeWordLookupRepository extends WordLookupRepository {
  constructor(private readonly dictionary: Set<string>) {
    super();
  }

  findExactMatch(text: string) {
    return Promise.resolve(this.dictionary.has(text) ? { wordId: `id-${text}`, reading: `reading-${text}` } : null);
  }
}

function buildUseCase(words: string[]) {
  return new SegmentTextUseCase(new FakeWordLookupRepository(new Set(words)));
}

function matched(text: string) {
  return { text, wordId: `id-${text}`, reading: `reading-${text}` };
}

function unmatched(text: string) {
  return { text, wordId: null, reading: null };
}

describe('SegmentTextUseCase', () => {
  it('groups an unmatched kanji run instead of splitting it character by character', async () => {
    const useCase = buildUseCase(['そば']);

    const tokens = await useCase.execute('正油そば');

    expect(tokens).toEqual([unmatched('正油'), matched('そば')]);
  });

  it('strips stray roman letters and digits before segmenting', async () => {
    const useCase = buildUseCase(['そば']);

    const tokens = await useCase.execute('正油そばTokyo123');

    expect(tokens).toEqual([unmatched('正油'), matched('そば')]);
  });

  it('strips roman noise sitting between two unrelated words without merging them into one match', async () => {
    const useCase = buildUseCase(['東京', '大阪']);

    const tokens = await useCase.execute('東京X大阪');

    expect(tokens).toEqual([matched('東京'), matched('大阪')]);
  });

  it('still prefers the longest dictionary match at each position (no regression)', async () => {
    const useCase = buildUseCase(['東京', '東京都', '都民']);

    const tokens = await useCase.execute('東京都民');

    expect(tokens).toEqual([matched('東京都'), unmatched('民')]);
  });

  it('segments back-to-back known words without merging them', async () => {
    const useCase = buildUseCase(['寿司', 'ラーメン']);

    const tokens = await useCase.execute('寿司ラーメン');

    expect(tokens).toEqual([matched('寿司'), matched('ラーメン')]);
  });

  it('groups a long unmatched kanji compound into a single token', async () => {
    const useCase = buildUseCase([]);

    const tokens = await useCase.execute('未知漢字列');

    expect(tokens).toEqual([unmatched('未知漢字列')]);
  });

  it('splits an unmatched run at a script boundary between kanji and kana', async () => {
    const useCase = buildUseCase([]);

    const tokens = await useCase.execute('未知ふめい');

    expect(tokens).toEqual([unmatched('未知'), unmatched('ふめい')]);
  });

  it('splits an unmatched run at a script boundary between hiragana and katakana', async () => {
    const useCase = buildUseCase([]);

    // Two unrelated words sitting back to back (e.g. そば + ラーメン as scanned text) must not
    // merge into one blob just because both happen to be kana
    const tokens = await useCase.execute('ふめいカタカナ');

    expect(tokens).toEqual([unmatched('ふめい'), unmatched('カタカナ')]);
  });

  it('stops an unmatched run right before a position that would itself match, instead of swallowing it', async () => {
    const useCase = buildUseCase(['書']);

    const tokens = await useCase.execute('辭書');

    expect(tokens).toEqual([unmatched('辭'), matched('書')]);
  });

  it('keeps Japanese punctuation, grouped as its own unmatched token', async () => {
    const useCase = buildUseCase(['寿司']);

    const tokens = await useCase.execute('寿司、美味しい');

    expect(tokens[0]).toEqual(matched('寿司'));
    expect(tokens[1].wordId).toBeNull();
    expect(tokens[1].text.startsWith('、')).toBe(true);
  });

  it('drops whitespace within a line, independent of script grouping', async () => {
    const useCase = buildUseCase(['東京', '大阪']);

    const tokens = await useCase.execute('東京 大阪');

    expect(tokens).toEqual([matched('東京'), matched('大阪')]);
  });

  it('treats a line break as a hard boundary, never merging text across it', async () => {
    const useCase = buildUseCase(['東京', '京都']);

    // Stripping the newline would glue 東 (line 1) to 京 (start of line 2), falsely matching
    // 東京 across two unrelated lines and burying the real 京都 match entirely
    const tokens = await useCase.execute('東\n京都民');

    expect(tokens).toEqual([unmatched('東'), matched('京都'), unmatched('民')]);
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
    expect(tokens).toEqual([matched('一二三四五六'), unmatched('七')]);
  });
});
