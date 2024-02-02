import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '../../enterprise/entities/order'

interface FetchCustomerOrdersUseCaseRequest {
  customerId: string
  page: number
  perPage: number
}

type FetchCustomerOrdersUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchCustomerOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    customerId,
    page,
    perPage,
  }: FetchCustomerOrdersUseCaseRequest): Promise<FetchCustomerOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyByCustomerId(
      customerId,
      { page, perPage },
    )

    return right({
      orders,
    })
  }
}
