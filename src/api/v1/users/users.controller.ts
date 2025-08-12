import { Body, Controller, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserUseCase } from 'src/application/use-cases/users/create';
import { FindByMacAddressUseCase } from 'src/application/use-cases/users/findByMacAddress';
import { LinkUserToProviderUseCase } from 'src/application/use-cases/users/linkToProvider';

import { CreateUserDto, FindUserResponseDto, LinkUserDto } from '../dto/users';
import { ResponseTransformInterceptor } from '../middlewares/responseValidationInterceptor';

@Controller('users')
export class UsersController {
  constructor(
    private findByMacAddressUseCase: FindByMacAddressUseCase,
    private createUserUseCase: CreateUserUseCase,
    private linkUserToProviderUseCase: LinkUserToProviderUseCase,
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
}
