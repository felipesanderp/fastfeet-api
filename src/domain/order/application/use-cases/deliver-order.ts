import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '../../enterprise/entities/order'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { RequiredImageError } from './errors/required-image-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderImage } from '../../enterprise/entities/order-image'

interface DeliverOrderUseCaseRequest {
  deliverymanId: string
  imageId: string
  orderId: string
}

type DeliverOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

@Injectable()
export class DeliverOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    deliverymanId,
    imageId,
  }: DeliverOrderUseCaseRequest): Promise<DeliverOrderUseCaseResponse> {
    if (!imageId) {
      return left(new RequiredImageError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (deliverymanId !== order.deliverymanId?.toString()) {
      return left(new NotAllowedError())
    }

    const orderImage = OrderImage.create({
      imageId: new UniqueEntityID(imageId),
      orderId: new UniqueEntityID(orderId),
    })

    order.image = orderImage
    order.deliver()

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
