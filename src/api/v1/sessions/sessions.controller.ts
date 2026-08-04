import { Body, Controller, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { AbandonSessionUseCase } from 'src/application/use-cases/sessions/abandon';
import { CreateSessionUseCase } from 'src/application/use-cases/sessions/create';
import { FinishSessionUseCase } from 'src/application/use-cases/sessions/finish';
import { FindActiveSessionUseCase } from 'src/application/use-cases/sessions/findActive';
import { UpdateQuestionUseCase } from 'src/application/use-cases/sessions/updateQuestion';
import { SessionType } from 'src/domain/entities';

import { CreateSessionDto, FinishSessionDto, SessionResponseDto, UpdateQuestionDto } from '../dto/sessions';
import { ResponseTransformInterceptor } from '../middlewares/responseValidationInterceptor';

@Controller('sessions')
export class SessionsController {
  constructor(
    private createSessionUseCase: CreateSessionUseCase,
    private findActiveSessionUseCase: FindActiveSessionUseCase,
    private updateQuestionUseCase: UpdateQuestionUseCase,
    private finishSessionUseCase: FinishSessionUseCase,
    private abandonSessionUseCase: AbandonSessionUseCase,
  ) {}

  @UseInterceptors(new ResponseTransformInterceptor(SessionResponseDto))
  @Post('')
  create(@Body() body: CreateSessionDto) {
    return this.createSessionUseCase.execute(body);
  }

  // Resume-or-start-fresh check on entering a training mode — null means nothing to resume
  @UseInterceptors(new ResponseTransformInterceptor(SessionResponseDto))
  @Get('/active')
  findActive(@Query('userId') userId: string, @Query('type') type: SessionType) {
    return this.findActiveSessionUseCase.execute(userId, type);
  }

  @Patch('/:sessionId/question')
  updateQuestion(@Param('sessionId') sessionId: string, @Body() body: UpdateQuestionDto) {
    return this.updateQuestionUseCase.execute(sessionId, body.question);
  }

  @Patch('/:sessionId/finish')
  finish(@Param('sessionId') sessionId: string, @Body() body: FinishSessionDto) {
    return this.finishSessionUseCase.execute(sessionId, body.score);
  }

  @Patch('/:sessionId/abandon')
  abandon(@Param('sessionId') sessionId: string) {
    return this.abandonSessionUseCase.execute(sessionId);
  }
}
