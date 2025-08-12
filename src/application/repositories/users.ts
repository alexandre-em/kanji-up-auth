import { UnregisteredUsersFields, Users } from 'src/domain/entities';

export abstract class UsersRepository {
  abstract findIdByKey(key: keyof Users, value: string): Promise<string>;
  abstract findByMacAddress(email: string): Promise<Users>;
  abstract save(user: Omit<UnregisteredUsersFields, 'createdAt' | 'updatedAt'>): Promise<void>;
  abstract update(id: string, content: Partial<Users>): Promise<void>;
}
