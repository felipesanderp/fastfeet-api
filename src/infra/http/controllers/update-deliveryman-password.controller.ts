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
import { UpdateDeliverymanPasswordUseCase } from '@/domain/account/application/use-cases/update-deliveryman-password'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { SamePasswordError } from '@/domain/account/application/use-cases/errors/same-password-error'

const updateDeliverymanPasswordBodySchema = z.object({
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  updateDeliverymanPasswordBodySchema,
)

type UpdateDeliverymanPasswordBodySchema = z.infer<
  typeof updateDeliverymanPasswordBodySchema
>

@Controller('/accounts/deliveryman/:id')
@Roles(UserRoles.Admin)
export class UpdateDeliverymanPasswordController {
  constructor(
    private updateDeliverymanPassword: UpdateDeliverymanPasswordUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateDeliverymanPasswordBodySchema,
    @Param('id') deliverymanId: string,
  ) {
    const { password } = body

    const result = await this.updateDeliverymanPassword.execute({
      deliverymanId,
      newPassword: password,
    })

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
