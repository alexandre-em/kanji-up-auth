import { ForbiddenException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { SubscriptionPlan } from '../../../domain/entities';
import { ScansRepository } from '../../repositories/scans';
import { StorageRepository } from '../../repositories/storage';
import { UsersRepository } from '../../repositories/users';
import { VisionRepository } from '../../repositories/vision';
import { SegmentedToken, SegmentTextUseCase } from './segmentText';

export type CreateScanInput = {
  userId: string;
  imageBuffer: Buffer;
  contentType: string;
};

export type CreateScanResult = {
  scanId: string;
  imageUrl: string;
  recognizedText: string;
  tokens: SegmentedToken[];
};

function extensionFromContentType(contentType: string): string {
  if (contentType === 'image/png') return 'png';
  return 'jpg';
}

@Injectable()
export class CreateScanUseCase {
  constructor(
    private storageRepository: StorageRepository,
    private visionRepository: VisionRepository,
    private scansRepository: ScansRepository,
    private segmentTextUseCase: SegmentTextUseCase,
    private usersRepository: UsersRepository,
  ) {}

  async execute(input: CreateScanInput): Promise<CreateScanResult> {
    const user = await this.usersRepository.findByUserId(input.userId);
    if (user.subscriptionPlan !== SubscriptionPlan.PREMIUM)
      throw new ForbiddenException('OCR scanning requires a premium subscription');

    const { text } = await this.visionRepository.recognizeText(input.imageBuffer.toString('base64'));
    const tokens = await this.segmentTextUseCase.execute(text);

    const key = `scans/${randomUUID()}.${extensionFromContentType(input.contentType)}`;
    const imageUrl = await this.storageRepository.upload(key, input.imageBuffer, input.contentType);

    const scan = await this.scansRepository.create({
      userId: input.userId,
      imageUrl,
      recognizedText: text,
      tokens,
    });

    return { scanId: scan.scanId, imageUrl: scan.imageUrl, recognizedText: text, tokens };
  }
}
