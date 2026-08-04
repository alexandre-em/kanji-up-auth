import { Injectable } from '@nestjs/common';
import { WordLookupRepository } from 'src/application/repositories/wordLookup';

// Most real words are 1-4 characters; capping the window here bounds the number of lookups per
// scan rather than trying implausibly long candidates
const MAX_WORD_LENGTH = 6;

export type SegmentedToken = {
  text: string;
  // null when this stretch of text didn't match any known word (kana, punctuation, unrecognized)
  wordId: string | null;
};

// Greedy longest-match-first segmentation against the existing word dictionary — not a real
// morphological analyzer, so ambiguous text can segment wrong, but needs no NLP dependency and
// reuses the dictionary that's already there.
@Injectable()
export class SegmentTextUseCase {
  constructor(private wordLookupRepository: WordLookupRepository) {}

  async execute(text: string): Promise<SegmentedToken[]> {
    const characters = Array.from(text.replace(/\s/g, ''));
    const tokens: SegmentedToken[] = [];
    let index = 0;

    while (index < characters.length) {
      const match = await this.findLongestMatch(characters, index);

      if (match) {
        tokens.push(match);
        index += match.text.length;
      } else {
        tokens.push({ text: characters[index], wordId: null });
        index += 1;
      }
    }

    return tokens;
  }

  private async findLongestMatch(characters: string[], index: number): Promise<SegmentedToken | null> {
    const maxLength = Math.min(MAX_WORD_LENGTH, characters.length - index);

    for (let length = maxLength; length >= 1; length--) {
      const candidate = characters.slice(index, index + length).join('');
      const match = await this.wordLookupRepository.findExactMatch(candidate);
      if (match) return { text: candidate, wordId: match.wordId };
    }

    return null;
  }
}
