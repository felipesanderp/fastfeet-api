import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '../../enterprise/entities/order'

interface FetchNearbyOrdersUseCaseRequest {
  deliverymanLatitude: number
  deliverymanLongitude: number
}

type FetchNearbyOrdersUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchNearbyOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    deliverymanLatitude,
    deliverymanLongitude,
  }: FetchNearbyOrdersUseCaseRequest): Promise<FetchNearbyOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyNearby({
      latitude: deliverymanLatitude,
      longitude: deliverymanLongitude,
    })

    return right({
      orders,
    })
  }
}
