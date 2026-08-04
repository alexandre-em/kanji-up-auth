import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ScansRepository } from 'src/application/repositories/scans';
import { StorageRepository } from 'src/application/repositories/storage';
import { VisionRepository } from 'src/application/repositories/vision';

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
  ) {}

  async execute(input: CreateScanInput): Promise<CreateScanResult> {
    const { text } = await this.visionRepository.recognizeText(input.imageBuffer.toString('base64'));

    const key = `scans/${randomUUID()}.${extensionFromContentType(input.contentType)}`;
    const imageUrl = await this.storageRepository.upload(key, input.imageBuffer, input.contentType);

    const scan = await this.scansRepository.create({
      userId: input.userId,
      imageUrl,
      recognizedText: text,
    });

    const tokens = await this.segmentTextUseCase.execute(text);

    return { scanId: scan.scanId, imageUrl: scan.imageUrl, recognizedText: text, tokens };
  }
}
