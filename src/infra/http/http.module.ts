import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { StorageModule } from '../storage/store.module'
import { ServicesModule } from '../services/services.module'

import { AuthenticateAdminController } from "./controllers/authenticate-admin.controller"
import { AuthenticateAdminUseCase } from "@/domain/account/application/use-cases/authenticate-admin"

import { AuthenticateDeliverymanController } from "./controllers/authenticate-deliveryman.controller"
import { AuthenticateDeliverymanUseCase } from "@/domain/account/application/use-cases/authenticate-deliveryman"

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule, ServicesModule],
  controllers: [
    AuthenticateAdminController,
    AuthenticateDeliverymanController,
  ],
  providers: [
    AuthenticateAdminUseCase,
    AuthenticateDeliverymanUseCase,
  ],
})
export class HttpModule {}
