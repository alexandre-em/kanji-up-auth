import { Body, Controller, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserUseCase } from 'src/application/use-cases/users/create';
import { EarnCreditsUseCase } from 'src/application/use-cases/users/earnCredits';
import { FindByMacAddressUseCase } from 'src/application/use-cases/users/findByMacAddress';
import { FindByUserIdUseCase } from 'src/application/use-cases/users/findByUserId';
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
    private findByUserIdUseCase: FindByUserIdUseCase,
    private createUserUseCase: CreateUserUseCase,
    private recoverAccountUseCase: RecoverAccountUseCase,
    private earnCreditsUseCase: EarnCreditsUseCase,
    private unlockContentUseCase: UnlockContentUseCase,
    private updateKanjiProgressionUseCase: UpdateKanjiProgressionUseCase,
  ) {}

  // Bootstrap only: the one route a client without a stored userId yet can call, on first launch
  // or after reinstalling. Every other route below takes userId.
  @UseInterceptors(new ResponseTransformInterceptor(FindUserResponseDto))
  @Get('/mac-address/:macAddress')
  findByMacAddress(@Param('macAddress') macAddress: string): Promise<FindUserResponseDto> {
    return this.findByMacAddressUseCase.execute(macAddress);
  }

  @UseInterceptors(new ResponseTransformInterceptor(FindUserResponseDto))
  @Get('/:userId')
  findByUserId(@Param('userId') userId: string): Promise<FindUserResponseDto> {
    return this.findByUserIdUseCase.execute(userId);
  }

  @Post('')
  create(@Body() body: CreateUserDto) {
    return this.createUserUseCase.execute(body);
  }

  @UseInterceptors(new ResponseTransformInterceptor(RecoverAccountResponseDto))
  @Patch('/:userId/recover')
  recoverAccount(@Param('userId') userId: string, @Body() body: RecoverAccountDto) {
    return this.recoverAccountUseCase.execute({ userId, idToken: body.idToken });
  }

  @Patch('/:userId/credits/earn')
  earnCredits(@Param('userId') userId: string) {
    return this.earnCreditsUseCase.execute(userId);
  }

  @Patch('/:userId/unlock')
  unlockContent(@Param('userId') userId: string, @Body() body: UnlockContentDto) {
    return this.unlockContentUseCase.execute(userId, body);
  }

  @Patch('/:userId/kanji-progression')
  updateKanjiProgression(@Param('userId') userId: string, @Body() body: UpdateKanjiProgressionDto) {
    return this.updateKanjiProgressionUseCase.execute(userId, body);
  }
}
