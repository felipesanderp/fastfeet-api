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

import { RegisterDeliverymanController } from './controllers/register-deliveryman.controller'
import { RegisterDeliverymanUseCase } from '@/domain/account/application/use-cases/register-deliveryman'

import { RegisterRecipientController } from './controllers/register-recipient.controller'
import { RegisterRecipientUseCase } from '@/domain/account/application/use-cases/register-recipient'

import { UpdateRecipientPasswordController } from './controllers/update-recipient-password.controller'
import { UpdateRecipientPasswordUseCase } from '@/domain/account/application/use-cases/update-recipient-password'

import { UpdateDeliverymanPasswordController } from './controllers/update-deliveryman-password.controller'
import { UpdateDeliverymanPasswordUseCase } from '@/domain/account/application/use-cases/update-deliveryman-password'

import { GetAllDeliverymenController } from './controllers/get-all-deliverymen.controller'
import { GetAllDeliverymenUseCase } from '@/domain/account/application/use-cases/get-all-deliverymen'

import { GetAllRecipientsController } from './controllers/get-all-recipients.controller'
import { GetAllRecipientsUseCase } from '@/domain/account/application/use-cases/get-all-recipients'

import { GetDeliverymanByIdController } from './controllers/get-deliveryman-by-id.controller'
import { GetDeliverymanByIdUseCase } from '@/domain/account/application/use-cases/get-deliveryman-by-id'

import { GetRecipientByIdController } from './controllers/get-recipient-by-id.controller'
import { GetRecipientByIdUseCase } from '@/domain/account/application/use-cases/get-recipient-by-id'

import { CreateOrderController } from './controllers/create-order.controller'
import { CreateOrderUseCase } from '@/domain/order/application/use-cases/create-order'

import { GetDayOrdersCountController } from './controllers/get-day-orders-count.controller'
import { GetDayDeliveredOrdersCountUseCase } from '@/domain/order/application/use-cases/get-day-delivered-orders-count'

import { GetMonthDeliveredOrdersCountController } from './controllers/get-month-delivered-orders-count.controller'
import { GetMonthDeliveredOrdersCountUseCase } from '@/domain/order/application/use-cases/get-month-delivered-orders-count'

import { GetPendingOrdersCountController } from './controllers/get-pending-orders-count.controller'
import { GetPendingOrdersCountUseCase } from '@/domain/order/application/use-cases/get-pending-orders-count'

import { GetMonthReturnedOrdersCountController } from './controllers/get-month-returned-orders-count.controller'
import { GetMonthReturnedOrdersCountUseCase } from '@/domain/order/application/use-cases/get-month-returned-orders-count'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule, ServicesModule],
  controllers: [
    AuthenticateAdminController,
    AuthenticateDeliverymanController,
    AuthenticateRecipientController,
    CreateAdminController,
    RegisterDeliverymanController,
    RegisterRecipientController,
    UpdateRecipientPasswordController,
    UpdateDeliverymanPasswordController,
    GetAllDeliverymenController,
    GetAllRecipientsController,
    GetDeliverymanByIdController,
    GetRecipientByIdController,
    CreateOrderController,
    GetDayOrdersCountController,
    GetMonthDeliveredOrdersCountController,
    GetPendingOrdersCountController,
    GetMonthReturnedOrdersCountController,
  ],
  providers: [
    AuthenticateAdminUseCase,
    AuthenticateDeliverymanUseCase,
    AuthenticateRecipientUseCase,
    CreateAdminUseCase,
    RegisterDeliverymanUseCase,
    RegisterRecipientUseCase,
    UpdateRecipientPasswordUseCase,
    UpdateDeliverymanPasswordUseCase,
    GetAllDeliverymenUseCase,
    GetAllRecipientsUseCase,
    GetDeliverymanByIdUseCase,
    GetRecipientByIdUseCase,
    CreateOrderUseCase,
    GetDayDeliveredOrdersCountUseCase,
    GetMonthDeliveredOrdersCountUseCase,
    GetPendingOrdersCountUseCase,
    GetMonthReturnedOrdersCountUseCase,
  ],
})
export class HttpModule {}
