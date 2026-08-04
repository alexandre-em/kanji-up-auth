import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateScanUseCase } from 'src/application/use-cases/scans/create';

import { CreateScanDto, CreateScanResponseDto } from '../dto/scans';
import { ResponseTransformInterceptor } from '../middlewares/responseValidationInterceptor';

@Controller('scans')
export class ScansController {
  constructor(private createScanUseCase: CreateScanUseCase) {}

  @UseInterceptors(FileInterceptor('image'))
  @UseInterceptors(new ResponseTransformInterceptor(CreateScanResponseDto))
  @Post('')
  create(@UploadedFile() image: Express.Multer.File, @Body() body: CreateScanDto) {
    if (!image) throw new BadRequestException('An image file is required');

    return this.createScanUseCase.execute({
      macAddress: body.macAddress,
      imageBuffer: image.buffer,
      contentType: image.mimetype,
    });
  }
}
