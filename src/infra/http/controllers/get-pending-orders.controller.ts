import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common'

import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { GetPendingOrdersUseCase } from '@/domain/order/application/use-cases/get-pending-orders'
import { OrderDetailsPresenter } from '../presenters/order-details-presenter'

@Controller('/metrics/pending-orders')
@Roles(UserRoles.Admin)
export class GetPendingOrdersController {
  constructor(private getPendingOrders: GetPendingOrdersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.getPendingOrders.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { orders } = result.value

    return {
      pendingOrders: orders.map(OrderDetailsPresenter.toHTTP),
    }
  }
}
