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

import { DeleteOrderController } from './controllers/delete-order.controller'
import { DeleteOrderUseCase } from '@/domain/order/application/use-cases/delete-order'

import { GetOrderController } from './controllers/get-order.controller'
import { GetOrderUseCase } from '@/domain/order/application/use-cases/get-order'

import { CancelRecipientController } from './controllers/cancel-recipient.controller'
import { CancelRecipientUseCase } from '@/domain/account/application/use-cases/cancel-recipient'

import { CancelDeliverymanController } from './controllers/cancel-deliveryman.controller'
import { CancelDeliverymanUseCase } from '@/domain/account/application/use-cases/cancel-deliveryman'

import { PostOrderController } from './controllers/post-order.controller'
import { PostOrderUseCase } from '@/domain/order/application/use-cases/post-order'

import { DeliverOrderController } from './controllers/deliver-order.controller'
import { DeliverOrderUseCase } from '@/domain/order/application/use-cases/deliver-order'

import { ReturnOrderController } from './controllers/return-order.controller'
import { ReturnOrderUseCase } from '@/domain/order/application/use-cases/return-order'

import { WithdrawOrderController } from './controllers/withdrawn-order.controller'
import { WithdrawOrderUseCase } from '@/domain/order/application/use-cases/withdraw-order'

import { DeleteRecipientController } from './controllers/delete-recipient.controller'
import { DeleteRecipientUseCase } from '@/domain/account/application/use-cases/delete-recipient'

import { DeleteDeliverymanController } from './controllers/delete-deliveryman.controller'
import { DeleteDeliverymanUseCase } from '@/domain/account/application/use-cases/delete-deliveryman'

import { UpdateDeliverymanProfileController } from './controllers/update-deliveryman-profile.controller'
import { UpdateDeliverymanProfileUseCase } from '@/domain/account/application/use-cases/update-deliveryman-profile'

import { UpdateRecipientProfileController } from './controllers/update-recipient-profile.controller'
import { UpdateRecipientProfileUseCase } from '@/domain/account/application/use-cases/update-recipient-profile'

import { EditOrderController } from './controllers/edit-order.controller'
import { EditOrderUseCase } from '@/domain/order/application/use-cases/edit-order'

import { UploadImageController } from './controllers/upload-image.controller'
import { UploadAndCreateImageUseCase } from '@/domain/order/application/use-cases/upload-and-create-image'

import { FetchNotificationsController } from './controllers/fetch-notifications.controller'
import { FetchNotificationsUseCase } from '@/domain/notification/application/use-cases/fetch-notifications'

import { ReadNotificationController } from './controllers/read-notification.controller'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'

import { FetchNearbyOrdersController } from './controllers/fetch-nearby-orders.controller'
import { FetchNearbyOrdersUseCase } from '@/domain/order/application/use-cases/fetch-nearby-orders'

import { FetchDeliverymanOrdersController } from './controllers/fetch-deliveryman-orders.controller'
import { FetchDeliverymanOrdersUseCase } from '@/domain/order/application/use-cases/fetch-deliveryman-orders'

import { FetchCustomerOrdersController } from './controllers/fetch-customer-orders.controller'
import { FetchCustomerOrdersUseCase } from '@/domain/order/application/use-cases/fetch-customer-orders'

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
    UpdateDeliverymanProfileController,
    UpdateRecipientProfileController,
    EditOrderController,
    GetAllDeliverymenController,
    GetAllRecipientsController,
    GetDeliverymanByIdController,
    GetRecipientByIdController,
    CancelRecipientController,
    CancelDeliverymanController,
    CreateOrderController,
    DeleteOrderController,
    DeleteRecipientController,
    DeleteDeliverymanController,
    FetchNearbyOrdersController,
    FetchDeliverymanOrdersController,
    FetchCustomerOrdersController,
    GetOrderController,
    GetDayOrdersCountController,
    GetMonthDeliveredOrdersCountController,
    GetPendingOrdersCountController,
    GetMonthReturnedOrdersCountController,
    PostOrderController,
    DeliverOrderController,
    ReturnOrderController,
    WithdrawOrderController,
    UploadImageController,
    FetchNotificationsController,
    ReadNotificationController,
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
    UpdateDeliverymanProfileUseCase,
    UpdateRecipientProfileUseCase,
    EditOrderUseCase,
    GetAllDeliverymenUseCase,
    GetAllRecipientsUseCase,
    GetDeliverymanByIdUseCase,
    GetRecipientByIdUseCase,
    CancelDeliverymanUseCase,
    CancelRecipientUseCase,
    CreateOrderUseCase,
    DeleteOrderUseCase,
    DeleteRecipientUseCase,
    DeleteDeliverymanUseCase,
    FetchNearbyOrdersUseCase,
    FetchDeliverymanOrdersUseCase,
    FetchCustomerOrdersUseCase,
    GetOrderUseCase,
    GetDayDeliveredOrdersCountUseCase,
    GetMonthDeliveredOrdersCountUseCase,
    GetPendingOrdersCountUseCase,
    GetMonthReturnedOrdersCountUseCase,
    PostOrderUseCase,
    DeliverOrderUseCase,
    ReturnOrderUseCase,
    WithdrawOrderUseCase,
    UploadAndCreateImageUseCase,
    FetchNotificationsUseCase,
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
