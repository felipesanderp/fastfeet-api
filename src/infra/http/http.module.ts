import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { StorageModule } from '../storage/store.module'
import { ServicesModule } from '../services/services.module'

import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'
import { AuthenticateAdminUseCase } from '@/domain/account/application/use-cases/authenticate-admin'

import { AuthenticateDeliverymanController } from './controllers/authenticate-deliveryman.controller'
import { AuthenticateDeliverymanUseCase } from '@/domain/account/application/use-cases/authenticate-deliveryman'

import { AuthenticateRecipientController } from './controllers/authenticate-recipient.controller'
import { AuthenticateRecipientUseCase } from '@/domain/account/application/use-cases/authenticate-recipient'

import { CreateAdminController } from './controllers/create-admin.controller'
import { CreateAdminUseCase } from '@/domain/account/application/use-cases/create-admin'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule, ServicesModule],
  controllers: [
    AuthenticateAdminController,
    AuthenticateDeliverymanController,
    AuthenticateRecipientController,
    CreateAdminController,
  ],
  providers: [
    AuthenticateAdminUseCase,
    AuthenticateDeliverymanUseCase,
    AuthenticateRecipientUseCase,
    CreateAdminUseCase,
  ],
})
export class HttpModule {}
