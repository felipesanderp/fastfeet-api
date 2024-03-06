import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { AdminFactory } from 'test/factories/make-admin'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe('Delete Deliveryman (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let deliverymanFactory: DeliverymanFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)

    await app.init()
  })

  test('[DELETE] /accounts/deliveryman/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const accessToken = await jwt.signAsync({
      sub: admin.id.toString(),
      role: 'admin',
    })

    const response = await request(app.getHttpServer())
      .delete(`/accounts/deliveryman/${deliveryman.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findMany({
      where: {
        role: 'DELIVERYMAN',
      },
    })

    expect(userOnDatabase).toHaveLength(0)
  })
})