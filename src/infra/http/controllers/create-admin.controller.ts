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
import { CreateAdminUseCase } from '@/domain/account/application/use-cases/create-admin'
import { AccountAlreadyExistsError } from '@/domain/account/application/use-cases/errors/account-already-exists-error'
import { AdminPresenter } from '../presenters/admin-presenter'
import { ApiBearerAuth } from '@nestjs/swagger'

const createAdminBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createAdminBodySchema)

type CreateAdminBodySchema = z.infer<typeof createAdminBodySchema>

@ApiBearerAuth()
@Controller('/accounts/admin')
export class CreateAdminController {
  constructor(private createAdmin: CreateAdminUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateAdminBodySchema) {
    const { name, cpf, password } = body

    const result = await this.createAdmin.execute({
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

    const { admin } = result.value

    return {
      admin: AdminPresenter.toHTTP(admin),
    }
  }
}
