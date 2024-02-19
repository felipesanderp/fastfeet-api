import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'

import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CancelDeliverymanUseCase } from '@/domain/account/application/use-cases/cancel-deliveryman'

@Controller('/accounts/deliveryman/cancel/:id')
@Roles(UserRoles.Admin)
export class CancelDeliverymanController {
  constructor(private cancelDeliveryman: CancelDeliverymanUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(@Param('id') deliverymanId: string) {
    const result = await this.cancelDeliveryman.execute({
      deliverymanId,
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
