import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { DeliverymanPresenter } from '../presenters/deliveryman-presenter'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { GetDeliverymanByIdUseCase } from '@/domain/account/application/use-cases/get-deliveryman-by-id'

@Controller('/users/deliveryman/:id')
@Roles(UserRoles.Admin)
export class GetDeliverymanByIdController {
  constructor(private getDeliverymanById: GetDeliverymanByIdUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('id') deliverymanId: string) {
    const result = await this.getDeliverymanById.execute({ deliverymanId })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { deliveryman } = result.value

    return {
      deliveryman: DeliverymanPresenter.toHTTP(deliveryman),
    }
  }
}
