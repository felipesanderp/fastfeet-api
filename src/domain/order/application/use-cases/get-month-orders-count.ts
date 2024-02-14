import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import {
  GetMonthDeliveredOrdersCount,
  OrdersRepository,
} from '../repositories/orders-repository'

// interface GetDayOrdersCountUseCaseRequest {
//   date: Date
// }

type GetMonthOrdersCountUseCaseResponse = Either<
  null,
  {
    orders: GetMonthDeliveredOrdersCount
  }
>

@Injectable()
export class GetMonthOrdersCountUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(): Promise<GetMonthOrdersCountUseCaseResponse> {
    const orders = await this.ordersRepository.getMonthDeliveredOrdersCount()

    return right({
      orders,
    })
  }
}
