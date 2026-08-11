import { Module } from '@nestjs/common';
import { VerifyPurchaseUseCase } from '../../../application/use-cases/billing/verifyPurchase';
import { GooglePlayRepositoryModule } from '../../../infrastructure/repositories/googlePlay.module';
import { UsersRepositoryModule } from '../../../infrastructure/repositories/users.module';

import { BillingController } from './billing.controller';

@Module({
  imports: [GooglePlayRepositoryModule, UsersRepositoryModule],
  controllers: [BillingController],
  providers: [VerifyPurchaseUseCase],
  exports: [],
})
export class BillingModule {}
