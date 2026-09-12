import { Injectable } from '@nestjs/common';

import { WordLookupRepository } from '../../repositories/wordLookup';

// Most real words are 1-4 characters; capping the window here bounds the number of lookups per
// scan rather than trying implausibly long candidates
const MAX_WORD_LENGTH = 6;

// Kana, kanji, and Japanese punctuation only — OCR sometimes picks up stray roman letters/digits
// from a photo's background or a watermark, which have no business being segmented as tokens
const JAPANESE_CHARACTER_PATTERN = /[^\u3000-\u303F\u3040-\u30FF\u4E00-\u9FFF]/g;

// Hiragana and katakana kept separate — grouping an unmatched run across both would merge two
// unrelated words sitting back to back (e.g. そば + ラーメン becoming one そばラーメン blob)
type Script = 'kanji' | 'hiragana' | 'katakana' | 'punctuation';

function scriptOf(character: string): Script {
  const codePoint = character.codePointAt(0) ?? 0;
  if (codePoint >= 0x4e00 && codePoint <= 0x9fff) return 'kanji';
  if (codePoint >= 0x3040 && codePoint <= 0x309f) return 'hiragana';
  if (codePoint >= 0x30a0 && codePoint <= 0x30ff) return 'katakana';
  return 'punctuation';
}

export type SegmentedToken = {
  text: string;
  // null when this stretch of text didn't match any known word (kana, punctuation, unrecognized)
  wordId: string | null;
  // Furigana for a matched token — null when unmatched, since there's nothing to read it as
  reading: string | null;
};

// Greedy longest-match-first segmentation against the existing word dictionary — not a real
// morphological analyzer, so ambiguous text can segment wrong, but needs no NLP dependency and
// reuses the dictionary that's already there.
@Injectable()
export class SegmentTextUseCase {
  constructor(private wordLookupRepository: WordLookupRepository) {}

  async execute(text: string): Promise<SegmentedToken[]> {
    // A line break in OCR output separates unrelated text regions (different lines of a menu, a
    // sign, ...) — treated as a hard boundary so a word is never built out of characters that
    // never actually sat next to each other in the photo. Other whitespace (stray spaces OCR
    // sometimes inserts mid-word) is still stripped within a line, as before.
    const lines = text.split('\n').map((line) => Array.from(line.replace(/\s/g, '').replace(JAPANESE_CHARACTER_PATTERN, '')));

    const tokens: SegmentedToken[] = [];
    for (const characters of lines) {
      tokens.push(...(await this.segmentLine(characters)));
    }

    return tokens;
  }

  private async segmentLine(characters: string[]): Promise<SegmentedToken[]> {
    const tokens: SegmentedToken[] = [];
    let index = 0;

    while (index < characters.length) {
      const match = await this.findLongestMatch(characters, index);

      if (match) {
        tokens.push(match);
        index += match.text.length;
        continue;
      }

      // No dictionary hit here — group the run of unmatched characters of the same script (e.g.
      // 正油, an informal 醤油 spelling absent from the dictionary) into one token instead of
      // emitting a separate token per character, stopping as soon as a real match becomes
      // possible again so a legitimate word start is never swallowed into the unmatched run
      const runScript = scriptOf(characters[index]);
      let end = index + 1;
      while (
        end < characters.length &&
        scriptOf(characters[end]) === runScript &&
        !(await this.findLongestMatch(characters, end))
      ) {
        end += 1;
      }

      tokens.push({ text: characters.slice(index, end).join(''), wordId: null, reading: null });
      index = end;
    }

    return tokens;
  }

  private async findLongestMatch(characters: string[], index: number): Promise<SegmentedToken | null> {
    const maxLength = Math.min(MAX_WORD_LENGTH, characters.length - index);

    // All candidate lengths looked up at once instead of shortening one at a time — a text with
    // N characters previously meant up to 6×N sequential round-trips to the word service, easily
    // enough to stack into several seconds of pure network latency on a real scan
    const candidates = Array.from({ length: maxLength }, (_, i) => characters.slice(index, index + maxLength - i).join(''));
    const matches = await Promise.all(candidates.map((candidate) => this.wordLookupRepository.findExactMatch(candidate)));

    const longestMatchIndex = matches.findIndex((match) => !!match);
    if (longestMatchIndex === -1) return null;

    const match = matches[longestMatchIndex]!;
    return { text: candidates[longestMatchIndex], wordId: match.wordId, reading: match.reading };
  }
}
