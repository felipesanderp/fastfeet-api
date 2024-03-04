import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common'

import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { GetPendingOrdersCountUseCase } from '@/domain/order/application/use-cases/get-pending-orders-count'
import { OrderDetailsPresenter } from '../presenters/order-details-presenter'

@Controller('/metrics/pending-orders-count')
@Roles(UserRoles.Admin)
export class GetPendingOrdersCountController {
  constructor(private getPendingOrdersCount: GetPendingOrdersCountUseCase) {}

  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.getPendingOrdersCount.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { orders } = result.value

    return {
      pendingOrders: orders.map(OrderDetailsPresenter.toHTTP),
    }
  }
}
