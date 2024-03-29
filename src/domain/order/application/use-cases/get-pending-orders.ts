import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { OrdersRepository } from '../repositories/orders-repository'
import { OrderDetails } from '../../enterprise/entities/value-objects/order-details'

// interface GetDayOrdersCountUseCaseRequest {
//   date: Date
// }

type GetDayPendingOrdersUseCaseResponse = Either<
  null,
  {
    orders: OrderDetails[]
  }
>

@Injectable()
export class GetPendingOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(): Promise<GetDayPendingOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.getPendingOrdersCount()

    return right({
      orders,
    })
  }
}
