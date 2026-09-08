import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { CreateFeedbackUseCase } from '../../../application/use-cases/feedback/create';
import { CreateFeedbackDto, FeedbackResponseDto } from '../dto/feedback';
import { ResponseTransformInterceptor } from '../middlewares/responseValidationInterceptor';

@Controller('feedback')
export class FeedbackController {
  constructor(private createFeedbackUseCase: CreateFeedbackUseCase) {}

  @UseInterceptors(new ResponseTransformInterceptor(FeedbackResponseDto))
  @Post('')
  create(@Body() body: CreateFeedbackDto) {
    return this.createFeedbackUseCase.execute(body);
  }
}
