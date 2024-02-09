import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'

import { AdminsRepository } from '@/domain/account/application/repositories/admins-repository'
import { DeliverymanRepository } from '@/domain/account/application/repositories/deliveryman-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { RecipientsRepository } from '@/domain/account/application/repositories/recipients-repository'
import { RecipientAddressesRepository } from '@/domain/account/application/repositories/recipient-addresses-repository'

import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { PrismaDeliverymenRepository } from './prisma/repositories/prisma-deliverymen-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'
import { PrismaRecipientAddressesRepository } from './prisma/repositories/prisma-recipient-addresses-repository'
import { OrdersRepository } from '@/domain/order/application/repositories/orders-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: DeliverymanRepository,
      useClass: PrismaDeliverymenRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: RecipientAddressesRepository,
      useClass: PrismaRecipientAddressesRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    DeliverymanRepository,
    RecipientsRepository,
    RecipientAddressesRepository,
    NotificationsRepository,
    OrdersRepository,
  ],
})
export class DatabaseModule {}
