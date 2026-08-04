import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionsRepository } from 'src/application/repositories/sessions';
import { Question, SessionStatus, SessionType, Sessions } from 'src/domain/entities';

import { Session as MongooseSession } from '../database/models/mongoose/sessions';

@Injectable()
export class MongooseSessionsRepository implements SessionsRepository {
  constructor(@InjectModel(MongooseSession.name) private readonly sessionModel: Model<MongooseSession>) {}

  async create(session: Omit<Sessions, 'sessionId' | 'createdAt' | 'updatedAt'>): Promise<Sessions> {
    const result = await this.sessionModel.create(session);

    return result.toObject();
  }

  async findBySessionId(sessionId: string): Promise<Sessions | null> {
    const result = await this.sessionModel.findOne({ sessionId }).select('-_id -__v').exec();

    return result ? result.toObject() : null;
  }

  async findActive(userId: string, type: SessionType): Promise<Sessions | null> {
    const result = await this.sessionModel.findOne({ userId, type, status: SessionStatus.IN_PROGRESS }).select('-_id -__v').exec();

    return result ? result.toObject() : null;
  }

  async updateQuestion(sessionId: string, atIndex: number, question: Question, nextIndex: number): Promise<void> {
    await this.sessionModel.updateOne(
      { sessionId },
      { $set: { [`questions.${atIndex}`]: question, currentIndex: nextIndex } },
    );
  }

  async setStatus(sessionId: string, status: SessionStatus, score: number | null): Promise<void> {
    await this.sessionModel.updateOne({ sessionId }, { $set: { status, score } });
  }
}
