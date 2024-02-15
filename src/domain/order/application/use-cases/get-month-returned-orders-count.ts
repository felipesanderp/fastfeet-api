import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import {
  GetMonthReturnedOrdersCount,
  OrdersRepository,
} from '../repositories/orders-repository'

// interface GetDayOrdersCountUseCaseRequest {
//   date: Date
// }

type GetMonthReturnedOrdersCountUseCaseResponse = Either<
  null,
  {
    orders: GetMonthReturnedOrdersCount
  }
>

@Injectable()
export class GetMonthReturnedOrdersCountUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(): Promise<GetMonthReturnedOrdersCountUseCaseResponse> {
    const orders = await this.ordersRepository.getMonthReturnedOrdersCount()

    return right({
      orders,
    })
  }
}
