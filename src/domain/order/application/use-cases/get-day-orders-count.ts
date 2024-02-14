import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import {
  GetDayDeliveredOrdersCount,
  OrdersRepository,
} from '../repositories/orders-repository'

// interface GetDayOrdersCountUseCaseRequest {
//   date: Date
// }

type GetDayOrdersCountUseCaseResponse = Either<
  null,
  {
    orders: GetDayDeliveredOrdersCount
  }
>

@Injectable()
export class GetDayOrdersCountUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(): Promise<GetDayOrdersCountUseCaseResponse> {
    const orders = await this.ordersRepository.getDayDeliveredOrdersCount()

    return right({
      orders,
    })
  }
}
