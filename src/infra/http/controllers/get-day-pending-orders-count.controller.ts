import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common'

import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { GetDayPendingOrdersCountUseCase } from '@/domain/order/application/use-cases/get-day-pending-orders-count'

@Controller('/metrics/day-pending-orders-count')
@Roles(UserRoles.Admin)
export class GetDayPendingOrdersCountController {
  constructor(
    private getDayPendingOrdersCount: GetDayPendingOrdersCountUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.getDayPendingOrdersCount.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { todayPendingOrders, diffFromYesterdayPendingOrders } =
      result.value.orders

    return {
      todayPendingOrders,
      diffFromYesterdayPendingOrders: diffFromYesterdayPendingOrders || 0,
    }
  }
}
