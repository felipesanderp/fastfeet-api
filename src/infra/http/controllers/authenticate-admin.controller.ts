import { z } from 'zod'

import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { WrongCredentialsError } from '@/domain/account/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/authentication/public'
import { AuthenticateAdminUseCase } from '@/domain/account/application/use-cases/authenticate-admin'

const authenticateAdminBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(authenticateAdminBodySchema)

type AuthenticateAdminBodySchema = z.infer<typeof authenticateAdminBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateAdminController {
  constructor(private authenticateAdmin: AuthenticateAdminUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: AuthenticateAdminBodySchema) {
    const { cpf, password } = body

    const result = await this.authenticateAdmin.execute({
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
