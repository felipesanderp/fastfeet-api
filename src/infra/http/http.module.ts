import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { StorageModule } from '../storage/store.module'
import { ServicesModule } from '../services/services.module'

import { AuthenticateAdminController } from "./controllers/authenticate-admin.controller"
import { AuthenticateAdminUseCase } from "@/domain/account/application/use-cases/authenticate-admin"

import { AuthenticateDeliverymanController } from "./controllers/authenticate-deliveryman.controller"
import { AuthenticateDeliverymanUseCase } from "@/domain/account/application/use-cases/authenticate-deliveryman"

import { AuthenticateRecipientController } from "./controllers/authenticate-recipient.controller"
import { AuthenticateRecipientUseCase } from "@/domain/account/application/use-cases/authenticate-recipient"

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule, ServicesModule],
  controllers: [
    AuthenticateAdminController,
    AuthenticateDeliverymanController,
    AuthenticateRecipientController,
  ],
  providers: [
    AuthenticateAdminUseCase,
    AuthenticateDeliverymanUseCase,
    AuthenticateRecipientUseCase,
  ],
})
export class HttpModule {}
