import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsRepository } from 'src/application/repositories/sessions';

import { Session, SessionSchema } from '../database/models/mongoose/sessions';
import { MongooseSessionsRepository } from './sessions';

@Module({
  imports: [MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }])],
  providers: [
    {
      provide: SessionsRepository,
      useClass: MongooseSessionsRepository,
    },
  ],
  exports: [SessionsRepository],
})
export class SessionsRepositoryModule {}
