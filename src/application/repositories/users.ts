import { UnregisteredUsersFields, Users } from 'src/domain/entities';

export abstract class UsersRepository {
  abstract findIdByKey(key: keyof Users, value: string): Promise<string>;
  abstract findByMacAddress(email: string): Promise<Users>;
  abstract save(user: Omit<UnregisteredUsersFields, 'createdAt' | 'updatedAt'>): Promise<void>;
  abstract update(id: string, content: Partial<Users>): Promise<void>;
  abstract incrementCredits(id: string, amount: number): Promise<void>;
  // Atomic: only spends credits and grants the unlock if the user can afford it and doesn't
  // already own it — returns false instead of throwing so the use-case can turn that into a
  // clean 4xx rather than treating "can't afford it" as a server error
  abstract unlockContent(id: string, field: 'unlockedDifficulties' | 'unlockedKanji', key: string, cost: number): Promise<boolean>;
}
