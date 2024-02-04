import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'

import { AdminsRepository } from '@/domain/account/application/repositories/admins-repository'
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository"

import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository"

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository
    }
  ],
  exports: [PrismaService, AdminsRepository, NotificationsRepository],
})
export class DatabaseModule {}
