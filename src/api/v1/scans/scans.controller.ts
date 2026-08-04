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
import { CreateScanUseCase } from 'src/application/use-cases/scans/create';
import { ListScansUseCase } from 'src/application/use-cases/scans/list';

import { CreateScanDto, CreateScanResponseDto, ListScansResponseDto } from '../dto/scans';
import { ResponseTransformInterceptor } from '../middlewares/responseValidationInterceptor';

@Controller('scans')
export class ScansController {
  constructor(
    private createScanUseCase: CreateScanUseCase,
    private listScansUseCase: ListScansUseCase,
  ) {}

  @UseInterceptors(FileInterceptor('image'))
  @UseInterceptors(new ResponseTransformInterceptor(CreateScanResponseDto))
  @Post('')
  create(@UploadedFile() image: Express.Multer.File, @Body() body: CreateScanDto) {
    if (!image) throw new BadRequestException('An image file is required');

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
