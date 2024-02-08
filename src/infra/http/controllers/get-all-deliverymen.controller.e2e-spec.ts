import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { AdminFactory } from 'test/factories/make-admin'
import { JwtService } from '@nestjs/jwt'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { CPF } from '@/domain/account/enterprise/entities/value-objects/cpf'

describe('Get All Deliverymen (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
  let deliverymanFactory: DeliverymanFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)

    await app.init()
  })

  test('[GET] /users/deliveryman', async () => {
    await Promise.all([
      deliverymanFactory.makePrismaDeliveryman({
        cpf: CPF.create('100.354.878-10'),
        name: 'John Doe',
      }),
      deliverymanFactory.makePrismaDeliveryman({
        cpf: CPF.create('100.354.878-11'),
        name: 'Doe John',
      }),
    ])

    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = await jwt.signAsync({
      sub: admin.id.toString(),
      role: 'admin',
    })

    const response = await request(app.getHttpServer())
      .get('/users/deliverymen')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliverymen: expect.arrayContaining([
        expect.objectContaining({
          cpf: '100.354.878-10',
          name: 'John Doe',
        }),
        expect.objectContaining({
          cpf: '100.354.878-11',
          name: 'Doe John',
        }),
      ]),
    })
  })
})
