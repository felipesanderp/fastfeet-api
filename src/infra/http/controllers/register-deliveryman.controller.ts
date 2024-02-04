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
import { RegisterDeliverymanUseCase } from '@/domain/account/application/use-cases/register-deliveryman'
import { AccountAlreadyExistsError } from '@/domain/account/application/use-cases/errors/account-already-exists-error'
import { DeliverymanPresenter } from '../presenters/deliveryman-presenter'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'

const registerDeliverymanBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(registerDeliverymanBodySchema)

type RegisterDeliverymanBodySchema = z.infer<
  typeof registerDeliverymanBodySchema
>

@Controller('/accounts/deliveryman')
@Roles(UserRoles.Admin)
export class RegisterDeliverymanController {
  constructor(private registerDeliveryman: RegisterDeliverymanUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: RegisterDeliverymanBodySchema) {
    const { name, cpf, password } = body

    const result = await this.registerDeliveryman.execute({
      name,
      cpf,
      password,
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

    const { deliveryman } = result.value

    return {
      deliveryman: DeliverymanPresenter.toHTTP(deliveryman),
    }
  }
}
