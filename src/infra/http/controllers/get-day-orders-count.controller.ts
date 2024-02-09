import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common'

import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { GetDayOrdersCountUseCase } from '@/domain/order/application/use-cases/get-day-orders-count'

@Controller('/metrics/day-orders-count')
@Roles(UserRoles.Admin)
export class GetDayOrdersCountController {
  constructor(private getDayOrdersCount: GetDayOrdersCountUseCase) {}

  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.getDayOrdersCount.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { todayOrders, diffFromYesterday } = result.value.orders

    console.log(Number((diffFromYesterday - 100).toFixed(2)))

    return {
      todayOrders,
      diffFromYesterday: diffFromYesterday || 0,
    }
  }
}
