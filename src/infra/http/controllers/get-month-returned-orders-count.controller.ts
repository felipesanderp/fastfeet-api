import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common'

import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { GetMonthReturnedOrdersCountUseCase } from '@/domain/order/application/use-cases/get-month-returned-orders-count'

@Controller('/metrics/month-returned-orders-count')
@Roles(UserRoles.Admin)
export class GetMonthReturnedOrdersCountController {
  constructor(
    private getMonthReturnedOrdersCount: GetMonthReturnedOrdersCountUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.getMonthReturnedOrdersCount.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { currentMonthReturnedOrdersCount, diffFromLastMonth } =
      result.value.orders

    return {
      currentMonthReturnedOrdersCount,
      diffFromLastMonth: diffFromLastMonth || 0,
    }
  }
}
