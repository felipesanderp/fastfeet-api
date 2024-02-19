import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'

import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { CancelRecipientUseCase } from '@/domain/account/application/use-cases/cancel-recipient'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

@Controller('/users/recipients/cancel/:id')
@Roles(UserRoles.Admin)
export class CancelRecipientController {
  constructor(private cancelRecipient: CancelRecipientUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(@Param('id') recipientId: string) {
    const result = await this.cancelRecipient.execute({
      recipientId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
