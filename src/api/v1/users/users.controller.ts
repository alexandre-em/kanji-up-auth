import { Body, Controller, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserUseCase } from 'src/application/use-cases/users/create';
import { EarnCreditsUseCase } from 'src/application/use-cases/users/earnCredits';
import { FindByMacAddressUseCase } from 'src/application/use-cases/users/findByMacAddress';
import { LinkUserToProviderUseCase } from 'src/application/use-cases/users/linkToProvider';
import { UnlockContentUseCase } from 'src/application/use-cases/users/unlockContent';
import { UpdateKanjiProgressionUseCase } from 'src/application/use-cases/users/updateKanjiProgression';

import { CreateUserDto, FindUserResponseDto, LinkUserDto, UnlockContentDto, UpdateKanjiProgressionDto } from '../dto/users';
import { ResponseTransformInterceptor } from '../middlewares/responseValidationInterceptor';

@Controller('users')
export class UsersController {
  constructor(
    private findByMacAddressUseCase: FindByMacAddressUseCase,
    private createUserUseCase: CreateUserUseCase,
    private linkUserToProviderUseCase: LinkUserToProviderUseCase,
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

  @Patch('/link/:macAddress')
  linkToProvider(@Body() body: LinkUserDto, @Param('macAddress') macAddress: string) {
    return this.linkUserToProviderUseCase.execute(macAddress, body);
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
