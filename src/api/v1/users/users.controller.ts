import { Body, Controller, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserUseCase } from 'src/application/use-cases/users/create';
import { EarnCreditsUseCase } from 'src/application/use-cases/users/earnCredits';
import { FindByMacAddressUseCase } from 'src/application/use-cases/users/findByMacAddress';
import { RecoverAccountUseCase } from 'src/application/use-cases/users/recoverAccount';
import { UnlockContentUseCase } from 'src/application/use-cases/users/unlockContent';
import { UpdateKanjiProgressionUseCase } from 'src/application/use-cases/users/updateKanjiProgression';

import {
  CreateUserDto,
  FindUserResponseDto,
  RecoverAccountDto,
  RecoverAccountResponseDto,
  UnlockContentDto,
  UpdateKanjiProgressionDto,
} from '../dto/users';
import { ResponseTransformInterceptor } from '../middlewares/responseValidationInterceptor';

@Controller('users')
export class UsersController {
  constructor(
    private findByMacAddressUseCase: FindByMacAddressUseCase,
    private createUserUseCase: CreateUserUseCase,
    private recoverAccountUseCase: RecoverAccountUseCase,
    private earnCreditsUseCase: EarnCreditsUseCase,
    private unlockContentUseCase: UnlockContentUseCase,
    private updateKanjiProgressionUseCase: UpdateKanjiProgressionUseCase,
  ) {}

  @UseInterceptors(new ResponseTransformInterceptor(FindUserResponseDto))
  @Get('/mac-address/:macAddress')
  findByMacAddress(@Param('macAddress') macAddress: string): Promise<FindUserResponseDto> {
    return this.findByMacAddressUseCase.execute(macAddress);
  }

  @Post('')
  create(@Body() body: CreateUserDto) {
    return this.createUserUseCase.execute(body);
  }

  @UseInterceptors(new ResponseTransformInterceptor(RecoverAccountResponseDto))
  @Patch('/:macAddress/recover')
  recoverAccount(@Param('macAddress') macAddress: string, @Body() body: RecoverAccountDto) {
    return this.recoverAccountUseCase.execute({ macAddress, idToken: body.idToken });
  }

  @Patch('/:macAddress/credits/earn')
  earnCredits(@Param('macAddress') macAddress: string) {
    return this.earnCreditsUseCase.execute(macAddress);
  }

  @Patch('/:macAddress/unlock')
  unlockContent(@Param('macAddress') macAddress: string, @Body() body: UnlockContentDto) {
    return this.unlockContentUseCase.execute(macAddress, body);
  }

  @Patch('/:macAddress/kanji-progression')
  updateKanjiProgression(@Param('macAddress') macAddress: string, @Body() body: UpdateKanjiProgressionDto) {
    return this.updateKanjiProgressionUseCase.execute(macAddress, body);
  }
}
