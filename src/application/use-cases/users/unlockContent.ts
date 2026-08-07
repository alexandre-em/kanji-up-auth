import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/application/repositories/users';

export type UnlockScope = 'kanji' | 'tier';

// Tier key format: "jlpt:1", "grade:8" — the only two paid tiers. Every other tier (JLPT
// N5-N2, every other school grade) is free, never appears here, nothing to buy.
// Per-kanji is priced to be individually reachable by a motivated free user (~10 rewarded ads
// per kanji). Bulk is deliberately steep — ~20% off buying every single kanji in the tier
// individually (1232 kanji for jlpt:1, 1130 for grade:8) — not a realistic credits target, it's
// meant to push toward Premium (which bypasses this cost entirely) rather than be grindable.
const PER_KANJI_COST: Record<string, number> = {
  'jlpt:1': 5,
  'grade:8': 5,
};

const BULK_TIER_COST: Record<string, number> = {
  'jlpt:1': 4928,
  'grade:8': 4520,
};

export type UnlockContentInput = {
  scope: UnlockScope;
  tier: string;
  kanjiId?: string;
};

@Injectable()
export class UnlockContentUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(userId: string, input: UnlockContentInput): Promise<{ creditsSpent: number }> {
    const costTable = input.scope === 'kanji' ? PER_KANJI_COST : BULK_TIER_COST;
    const cost = costTable[input.tier];
    if (cost === undefined) throw new BadRequestException(`Unknown tier "${input.tier}"`);
    if (input.scope === 'kanji' && !input.kanjiId) throw new BadRequestException('kanjiId is required to unlock a single kanji');

    const id = await this.userRepository.findIdByKey('userId', userId);
    const field = input.scope === 'kanji' ? 'unlockedKanji' : 'unlockedDifficulties';
    const key = input.scope === 'kanji' ? input.kanjiId! : input.tier;

    const unlocked = await this.userRepository.unlockContent(id, field, key, cost);
    if (!unlocked) throw new BadRequestException('Not enough credits, or already unlocked');

    return { creditsSpent: cost };
  }
}
