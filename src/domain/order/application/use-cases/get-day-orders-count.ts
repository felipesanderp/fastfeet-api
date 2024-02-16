import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { OrdersRepository } from '../repositories/orders-repository'
import { GetDayDeliveredOrdersCount } from '../repositories/@types/orders'

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
