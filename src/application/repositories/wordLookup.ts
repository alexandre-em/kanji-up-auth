export type WordMatch = {
  wordId: string;
};

export abstract class WordLookupRepository {
  // Exact match on spelling only — text must equal one of the word's known spellings verbatim
  abstract findExactMatch(text: string): Promise<WordMatch | null>;
}
