import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { OrdersRepository } from '../repositories/orders-repository'
import { GetPendingOrdersCount } from '../repositories/@types/orders'

// interface GetDayOrdersCountUseCaseRequest {
//   date: Date
// }

type GetDayPendingOrdersCountUseCaseResponse = Either<
  null,
  {
    orders: GetPendingOrdersCount
  }
>

@Injectable()
export class GetPendingOrdersCountUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(): Promise<GetDayPendingOrdersCountUseCaseResponse> {
    const orders = await this.ordersRepository.getPendingOrdersCount()

    return right({
      orders,
    })
  }
}
