import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'

import { AdminsRepository } from '@/domain/account/application/repositories/admins-repository'
import { DeliverymanRepository } from "@/domain/account/application/repositories/deliveryman-repository"
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository"

import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository"
import { PrismaDeliverymenRepository } from "./prisma/repositories/prisma-deliverymen-repository"

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
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    }
  ],
  exports: [PrismaService, AdminsRepository, DeliverymanRepository, NotificationsRepository],
})
export class DatabaseModule {}
