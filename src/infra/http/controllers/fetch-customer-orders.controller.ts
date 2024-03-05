import { BadRequestException, Get, HttpCode, Query } from '@nestjs/common'
import { z } from 'zod'

import { CurrentUser } from '@/infra/auth/authentication/current-user-decorator'
import { UserPayload } from '@/infra/auth/authentication/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { OrderPresenter } from '@/infra/http/presenters/order-presenter'

import { FetchCustomerOrdersUseCase } from '@/domain/order/application/use-cases/fetch-customer-orders'

const fetchCustomerOrdersQueryParamsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  perPage: z.coerce.number().min(1).optional().default(20),
})

const queryValidationPipe = new ZodValidationPipe(
  fetchCustomerOrdersQueryParamsSchema,
)

type FetchCustomerOrdersQueryParamsSchema = z.infer<
  typeof fetchCustomerOrdersQueryParamsSchema
>

export class FetchCustomerOrdersController {
  constructor(private fetchCustomerOrders: FetchCustomerOrdersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(queryValidationPipe) queries: FetchCustomerOrdersQueryParamsSchema,
  ) {
    const { page, perPage } = queries
    const customerId = user.sub

    const result = await this.fetchCustomerOrders.execute({
      customerId,
      page,
      perPage,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { orders } = result.value

    return {
      orders: orders.map(OrderPresenter.toHTTP),
    }
  }
}
