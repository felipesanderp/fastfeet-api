import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '../../enterprise/entities/order'
import { OrderNotPostedError } from './errors/order-not-posted'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface WithdrawOrderUseCaseRequest {
  orderId: string
  deliverymanId: string
}

type WithdrawOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class WithdrawOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    deliverymanId,
  }: WithdrawOrderUseCaseRequest): Promise<WithdrawOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const isOrderPosted = order.postedAt

    if (!isOrderPosted) {
      return left(new OrderNotPostedError())
    }

    order.withdraw(new UniqueEntityID(deliverymanId))

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
