import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/application/repositories/users';

export type UnlockScope = 'kanji' | 'tier';

// Tier key format: "jlpt:3", "jlpt:2", "jlpt:1", "grade:8" — free tiers (JLPT N5/N4, grade 1-6)
// never appear here, there's nothing to buy.
// Per-kanji is cheaper than the tier it belongs to; buying more than ~10 individually costs more
// than just buying the whole tier, which is the intended nudge toward the bulk option.
const PER_KANJI_COST: Record<string, number> = {
  'jlpt:3': 2,
  'jlpt:2': 4,
  'jlpt:1': 8,
  'grade:8': 3,
};

const BULK_TIER_COST: Record<string, number> = {
  'jlpt:3': 20,
  'jlpt:2': 50,
  'jlpt:1': 100,
  'grade:8': 50,
};

export type UnlockContentInput = {
  scope: UnlockScope;
  tier: string;
  kanjiId?: string;
};

@Injectable()
export class UnlockContentUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(macAddress: string, input: UnlockContentInput): Promise<{ creditsSpent: number }> {
    const costTable = input.scope === 'kanji' ? PER_KANJI_COST : BULK_TIER_COST;
    const cost = costTable[input.tier];
    if (cost === undefined) throw new BadRequestException(`Unknown tier "${input.tier}"`);
    if (input.scope === 'kanji' && !input.kanjiId) throw new BadRequestException('kanjiId is required to unlock a single kanji');

    const id = await this.userRepository.findIdByKey('macAddress', macAddress);
    const field = input.scope === 'kanji' ? 'unlockedKanji' : 'unlockedDifficulties';
    const key = input.scope === 'kanji' ? input.kanjiId! : input.tier;

    const unlocked = await this.userRepository.unlockContent(id, field, key, cost);
    if (!unlocked) throw new BadRequestException('Not enough credits, or already unlocked');

    return { creditsSpent: cost };
  }
}
