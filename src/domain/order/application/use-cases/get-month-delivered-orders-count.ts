import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { OrdersRepository } from '../repositories/orders-repository'
import { GetMonthDeliveredOrdersCount } from '../repositories/@types/orders'

// interface GetDayOrdersCountUseCaseRequest {
//   date: Date
// }

type GetMonthDeliveredOrdersCountUseCaseResponse = Either<
  null,
  {
    orders: GetMonthDeliveredOrdersCount
  }
>

@Injectable()
export class GetMonthDeliveredOrdersCountUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(): Promise<GetMonthDeliveredOrdersCountUseCaseResponse> {
    const orders = await this.ordersRepository.getMonthDeliveredOrdersCount()

    return right({
      orders,
    })
  }
}
