import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditOrderUseCaseRequest {
  orderId: string
  customerId: string
  description: string
}

type EditOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class EditOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    customerId,
    description,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.customerId = new UniqueEntityID(customerId)
    order.description = description

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
