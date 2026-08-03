import { Module } from '@nestjs/common';
import { VerifyPurchaseUseCase } from 'src/application/use-cases/billing/verifyPurchase';
import { GooglePlayRepositoryModule } from 'src/infrastructure/repositories/googlePlay.module';
import { UsersRepositoryModule } from 'src/infrastructure/repositories/users.module';

import { BillingController } from './billing.controller';

@Module({
  imports: [GooglePlayRepositoryModule, UsersRepositoryModule],
  controllers: [BillingController],
  providers: [VerifyPurchaseUseCase],
  exports: [],
})
export class BillingModule {}
