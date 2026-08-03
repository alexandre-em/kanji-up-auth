import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { HealthController } from './api/v1/health/health.controller';
import { SessionsModule } from './api/v1/sessions/sessions.module';
import { UsersModule } from './api/v1/users/users.module';

@Module({
  imports: [
    UsersModule,
    SessionsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(`${process.env.DATABASE_URI}/usersv2?retryWrites=true&w=majority`),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
