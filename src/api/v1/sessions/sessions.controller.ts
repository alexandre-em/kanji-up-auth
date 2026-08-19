import { Body, Controller, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';

import { AbandonSessionUseCase } from '../../../application/use-cases/sessions/abandon';
import { CreateSessionUseCase } from '../../../application/use-cases/sessions/create';
import { FindActiveSessionUseCase } from '../../../application/use-cases/sessions/findActive';
import { FindSessionsByUserUseCase } from '../../../application/use-cases/sessions/findByUser';
import { FinishSessionUseCase } from '../../../application/use-cases/sessions/finish';
import { UpdateQuestionUseCase } from '../../../application/use-cases/sessions/updateQuestion';
import { SessionType } from '../../../domain/entities';
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
    private findSessionsByUserUseCase: FindSessionsByUserUseCase,
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

  // History listing, any status — distinct from /active above
  @UseInterceptors(new ResponseTransformInterceptor(SessionResponseDto))
  @Get('/user/:userId')
  findByUser(
    @Param('userId') userId: string,
    @Query('type') type: SessionType,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.findSessionsByUserUseCase.execute(
      userId,
      type,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
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
