import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateScanUseCase } from '../../../application/use-cases/scans/create';
import { ListScansUseCase } from '../../../application/use-cases/scans/list';
import { CreateScanDto, CreateScanResponseDto, ListScansResponseDto } from '../dto/scans';
import { ResponseTransformInterceptor } from '../middlewares/responseValidationInterceptor';

// Vision + R2 both bill per call/byte — an unbounded upload lets a single request drive both
// costs arbitrarily high, so both size and type are capped before anything downstream runs.
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

@Controller('scans')
export class ScansController {
  constructor(
    private createScanUseCase: CreateScanUseCase,
    private listScansUseCase: ListScansUseCase,
  ) {}

  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
      fileFilter: (_req, file, callback) => callback(null, ALLOWED_MIME_TYPES.includes(file.mimetype)),
    }),
  )
  @UseInterceptors(new ResponseTransformInterceptor(CreateScanResponseDto))
  @Post('')
  create(@UploadedFile() image: Express.Multer.File, @Body() body: CreateScanDto) {
    if (!image) throw new BadRequestException('A valid image file (jpeg, png, webp or heic, max 8MB) is required');

    return this.createScanUseCase.execute({
      userId: body.userId,
      imageBuffer: image.buffer,
      contentType: image.mimetype,
    });
  }

  @UseInterceptors(new ResponseTransformInterceptor(ListScansResponseDto))
  @Get('')
  list(
    @Query('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.listScansUseCase.execute(userId, page, limit);
  }
}
