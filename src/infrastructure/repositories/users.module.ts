import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from 'src/application/repositories/users';

import { User, UserSchema } from '../database/models/mongoose/users';
import { MongooseUserRepository } from './users';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [
    {
      provide: UsersRepository,
      useClass: MongooseUserRepository,
    },
  ],
  exports: [UsersRepository],
})
export class UsersRepositoryModule {}
