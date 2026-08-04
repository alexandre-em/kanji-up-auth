import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateScanDto {
  @IsString()
  @IsNotEmpty()
  macAddress: string;
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
