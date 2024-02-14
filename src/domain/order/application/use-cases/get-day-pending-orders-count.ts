import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import {
  GetDayPendingOrdersCount,
  OrdersRepository,
} from '../repositories/orders-repository'

// interface GetDayOrdersCountUseCaseRequest {
//   date: Date
// }

type GetDayPendingOrdersCountUseCaseResponse = Either<
  null,
  {
    orders: GetDayPendingOrdersCount
  }
>

@Injectable()
export class GetDayPendingOrdersCountUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(): Promise<GetDayPendingOrdersCountUseCaseResponse> {
    const orders = await this.ordersRepository.getDayPendingOrdersCount()

    return right({
      orders,
    })
  }
}
