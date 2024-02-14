import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common'

import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { GetMonthOrdersCountUseCase } from '@/domain/order/application/use-cases/get-month-orders-count'

@Controller('/metrics/month-orders-count')
@Roles(UserRoles.Admin)
export class GetMonthOrdersCountController {
  constructor(private getMonthOrdersCount: GetMonthOrdersCountUseCase) {}

  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.getMonthOrdersCount.execute()

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
