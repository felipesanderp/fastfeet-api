import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common'

import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { GetMonthDeliveredOrdersCountUseCase } from '@/domain/order/application/use-cases/get-month-delivered-orders-count'

@Controller('/metrics/month-delivered-orders-count')
@Roles(UserRoles.Admin)
export class GetMonthDeliveredOrdersCountController {
  constructor(
    private getMonthDeliveredOrdersCount: GetMonthDeliveredOrdersCountUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.getMonthDeliveredOrdersCount.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { currentMonthOrdersCount, diffFromLastMonth } = result.value.orders

    return {
      currentMonthOrdersCount,
      diffFromLastMonth: diffFromLastMonth || 0,
    }
  }
}
