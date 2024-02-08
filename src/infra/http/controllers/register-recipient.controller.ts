import { z } from 'zod'

import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { RegisterRecipientUseCase } from '@/domain/account/application/use-cases/register-recipient'
import { AccountAlreadyExistsError } from '@/domain/account/application/use-cases/errors/account-already-exists-error'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { RecipientPresenter } from '../presenters/recipient-presenter'

const registerRecipientBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
  street: z.string(),
  number: z.number(),
  neighborhood: z.string(),
  city: z.string(),
  cep: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(registerRecipientBodySchema)

type registerRecipientBodySchema = z.infer<typeof registerRecipientBodySchema>

@Controller('/accounts/recipient')
@Roles(UserRoles.Admin)
export class RegisterRecipientController {
  constructor(private registerRecipient: RegisterRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: registerRecipientBodySchema) {
    const { name, cpf, password, cep, city, neighborhood, number, street } =
      body

    const result = await this.registerRecipient.execute({
      name,
      cpf,
      password,
      street,
      number,
      neighborhood,
      city,
      cep,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AccountAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const { recipient } = result.value

    return {
      recipient: RecipientPresenter.toHTTP(recipient),
    }
  }
}
