import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

import { CPF } from '@/domain/account/enterprise/entities/value-objects/cpf'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Get Recipient By Id (E2E)', () => {
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

  test('[GET] /users/recipient/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const recipient = await recipientFactory.makePrismaRecipient({
      name: 'John Doe',
      cpf: CPF.create('123.123.123-00'),
    })

    const accessToken = await jwt.signAsync({
      sub: admin.id.toString(),
      role: 'admin',
    })

    const recipientId = recipient.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/users/recipient/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipient: expect.objectContaining({
        name: 'John Doe',
        cpf: '123.123.123-00',
      }),
    })
  })
})
