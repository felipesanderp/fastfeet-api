import { z } from 'zod'

import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UpdateRecipientPasswordUseCase } from '@/domain/account/application/use-cases/update-recipient-password'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { SamePasswordError } from '@/domain/account/application/use-cases/errors/same-password-error'

const updateRecipientPasswordBodySchema = z.object({
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  updateRecipientPasswordBodySchema,
)

type UpdateRecipientPasswordBodySchema = z.infer<
  typeof updateRecipientPasswordBodySchema
>

@Controller('/accounts/recipient/:id')
@Roles(UserRoles.Admin)
export class UpdateRecipientPasswordController {
  constructor(
    private updateRecipientPassword: UpdateRecipientPasswordUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateRecipientPasswordBodySchema,
    @Param('id') recipientId: string,
  ) {
    const { password } = body

    const result = await this.updateRecipientPassword.execute({
      recipientId,
      newPassword: password,
    })

    console.log(result)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case SamePasswordError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
