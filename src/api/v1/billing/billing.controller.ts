import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { VerifyPurchaseUseCase } from 'src/application/use-cases/billing/verifyPurchase';

import { VerifyPurchaseDto, VerifyPurchaseResponseDto } from '../dto/billing';
import { ResponseTransformInterceptor } from '../middlewares/responseValidationInterceptor';

@Controller('billing')
export class BillingController {
  constructor(private verifyPurchaseUseCase: VerifyPurchaseUseCase) {}

  @UseInterceptors(new ResponseTransformInterceptor(VerifyPurchaseResponseDto))
  @Post('verify-purchase')
  verifyPurchase(@Body() body: VerifyPurchaseDto) {
    return this.verifyPurchaseUseCase.execute(body);
  }
}
