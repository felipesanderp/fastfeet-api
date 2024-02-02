import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '../../enterprise/entities/order'

interface FetchDeliverymanOrdersUseCaseRequest {
  deliverymanId: string
  page: number
  perPage: number
}

type FetchDeliverymanOrdersUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchDeliverymanOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    deliverymanId,
    page,
    perPage,
  }: FetchDeliverymanOrdersUseCaseRequest): Promise<FetchDeliverymanOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyByDeliverymanId(
      deliverymanId,
      { page, perPage },
    )

    return right({
      orders,
    })
  }
}
