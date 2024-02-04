import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { hash } from 'bcryptjs'
import { CPF } from '@/domain/account/enterprise/entities/value-objects/cpf'
import { RecipientFactory } from "test/factories/make-recipient"

describe('Authenticate Recipient (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[POST] /sessions/recipient', async () => {
    await recipientFactory.makePrismaRecipient({
      cpf: CPF.create('100.546.365-14'),
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer()).post('/sessions/recipient').send({
      cpf: '100.546.365-14',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
