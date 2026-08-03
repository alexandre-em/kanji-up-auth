import { Body, Controller, Get, Patch, Query, UseInterceptors } from '@nestjs/common';
import { CompleteMissionTaskUseCase } from 'src/application/use-cases/missions/completeTask';
import { GetTodayMissionsUseCase } from 'src/application/use-cases/missions/getToday';

import { CompleteMissionResponseDto, CompleteMissionTaskDto, DailyMissionResponseDto } from '../dto/missions';
import { ResponseTransformInterceptor } from '../middlewares/responseValidationInterceptor';

@Controller('missions')
export class MissionsController {
  constructor(
    private getTodayMissionsUseCase: GetTodayMissionsUseCase,
    private completeMissionTaskUseCase: CompleteMissionTaskUseCase,
  ) {}

  @UseInterceptors(new ResponseTransformInterceptor(DailyMissionResponseDto))
  @Get('today')
  getToday(@Query('macAddress') macAddress: string) {
    return this.getTodayMissionsUseCase.execute(macAddress);
  }

  @UseInterceptors(new ResponseTransformInterceptor(CompleteMissionResponseDto))
  @Patch('complete')
  complete(@Body() body: CompleteMissionTaskDto) {
    return this.completeMissionTaskUseCase.execute(body.macAddress, body.task);
  }
}
