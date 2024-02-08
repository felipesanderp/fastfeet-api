import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { AdminFactory } from 'test/factories/make-admin'
import { JwtService } from '@nestjs/jwt'
import { CPF } from '@/domain/account/enterprise/entities/value-objects/cpf'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Get All Recipients (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[GET] /users/recipients', async () => {
    await Promise.all([
      recipientFactory.makePrismaRecipient({
        cpf: CPF.create('100.354.878-09'),
        name: 'John Doe',
      }),
      recipientFactory.makePrismaRecipient({
        cpf: CPF.create('100.354.878-14'),
        name: 'Doe John',
      }),
    ])

    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = await jwt.signAsync({
      sub: admin.id.toString(),
      role: 'admin',
    })

    const response = await request(app.getHttpServer())
      .get('/users/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipients: expect.arrayContaining([
        expect.objectContaining({
          cpf: '100.354.878-09',
          name: 'John Doe',
        }),
        expect.objectContaining({
          cpf: '100.354.878-14',
          name: 'Doe John',
        }),
      ]),
    })
  })
})
