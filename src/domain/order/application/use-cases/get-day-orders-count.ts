import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import {
  GetDayOrdersCount,
  OrdersRepository,
} from '../repositories/orders-repository'

// interface GetDayOrdersCountUseCaseRequest {
//   date: Date
// }

type GetDayOrdersCountUseCaseResponse = Either<
  null,
  {
    orders: GetDayOrdersCount
  }
>

@Injectable()
export class GetDayOrdersCountUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(): Promise<GetDayOrdersCountUseCaseResponse> {
    const orders = await this.ordersRepository.getDayOrdersCount()

    return right({
      orders,
    })
  }
}
