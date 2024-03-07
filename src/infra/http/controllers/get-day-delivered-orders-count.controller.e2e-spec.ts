import request from 'supertest'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AdminFactory } from 'test/factories/make-admin'

describe('Get Day Delivered Orders Count (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('[GET] /metrics/day-delivered-orders-count', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const recipient = await recipientFactory.makePrismaRecipient()

    const today = new Date()
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))

    await Promise.all([
      orderFactory.makePrismaOrder({
        customerId: recipient.id,
        description: 'Package 01',
        postedAt: today,
        withdrawnAt: today,
        deliveredAt: today,
      }),
      orderFactory.makePrismaOrder({
        customerId: recipient.id,
        description: 'Package 02',
        postedAt: today,
        withdrawnAt: today,
        deliveredAt: today,
      }),
      orderFactory.makePrismaOrder({
        customerId: recipient.id,
        description: 'Package 03',
        postedAt: yesterday,
        withdrawnAt: yesterday,
        deliveredAt: yesterday,
      }),
    ])

    const accessToken = await jwt.signAsync({
      sub: admin.id.toString(),
      role: 'admin',
    })

    const response = await request(app.getHttpServer())
      .get('/metrics/day-delivered-orders-count')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        todayOrders: 2,
        diffFromYesterday: 100,
      }),
    )
  })
})
