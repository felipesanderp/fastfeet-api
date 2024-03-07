import request from 'supertest'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AdminFactory } from 'test/factories/make-admin'
import { RecipientAddressFactory } from 'test/factories/make-recipient-address'

describe('Get Pending Orders (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let recipientAddressFactory: RecipientAddressFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        RecipientFactory,
        RecipientAddressFactory,
        OrderFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    recipientAddressFactory = moduleRef.get(RecipientAddressFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('[GET] /metrics/pending-orders', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const recipient = await recipientFactory.makePrismaRecipient()

    await recipientAddressFactory.makePrismaRecipientAddress({
      recipientId: recipient.id,
      street: 'Center street',
    })

    const today = new Date()
    const dayWithLastMonth = new Date(
      new Date().setMonth(new Date().getMonth() - 1),
    )

    await Promise.all([
      orderFactory.makePrismaOrder({
        customerId: recipient.id,
        description: 'Package 01',
        postedAt: today,
        withdrawnAt: today,
        deliveredAt: null,
      }),
      orderFactory.makePrismaOrder({
        customerId: recipient.id,
        description: 'Package 02',
        postedAt: null,
        withdrawnAt: null,
        deliveredAt: null,
      }),
      orderFactory.makePrismaOrder({
        customerId: recipient.id,
        description: 'Package 03',
        postedAt: dayWithLastMonth,
        withdrawnAt: dayWithLastMonth,
        deliveredAt: dayWithLastMonth,
      }),
      orderFactory.makePrismaOrder({
        customerId: recipient.id,
        description: 'Package 04',
        postedAt: today,
        withdrawnAt: null,
        deliveredAt: null,
      }),
    ])

    const accessToken = await jwt.signAsync({
      sub: admin.id.toString(),
      role: 'admin',
    })

    const response = await request(app.getHttpServer())
      .get('/metrics/pending-orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      pendingOrders: expect.arrayContaining([
        expect.objectContaining({
          description: 'Package 01',
        }),
        expect.objectContaining({
          description: 'Package 04',
        }),
      ]),
    })
  })
})
