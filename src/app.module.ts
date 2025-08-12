import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './api/v1/users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(`${process.env.DATABASE_URI}/usersv2?retryWrites=true&w=majority`),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
