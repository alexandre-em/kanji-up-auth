import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateScanDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class ScanTokenDto {
  @Expose()
  text: string;

  @Expose()
  wordId: string | null;
}

export class CreateScanResponseDto {
  @Expose()
  scanId: string;

  @Expose()
  imageUrl: string;

  @Expose()
  recognizedText: string;

  @Expose()
  @Type(() => ScanTokenDto)
  tokens: ScanTokenDto[];
}

export class ScanSummaryDto {
  @Expose()
  scanId: string;

  @Expose()
  imageUrl: string;

  @Expose()
  recognizedText: string;

  @Expose()
  createdAt: Date;
}

export class ListScansResponseDto {
  @Expose()
  @Type(() => ScanSummaryDto)
  docs: ScanSummaryDto[];

  @Expose()
  totalDocs: number;
}
