import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common'

import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { GetDayDeliveredOrdersCountUseCase } from '@/domain/order/application/use-cases/get-day-delivered-orders-count'

@Controller('/metrics/day-delivered-orders-count')
@Roles(UserRoles.Admin)
export class GetDayDeliveredOrdersCountController {
  constructor(private getDayOrdersCount: GetDayDeliveredOrdersCountUseCase) {}

  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.getDayOrdersCount.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { todayOrders, diffFromYesterday } = result.value.orders

    return {
      todayOrders,
      diffFromYesterday: diffFromYesterday || 0,
    }
  }
}
