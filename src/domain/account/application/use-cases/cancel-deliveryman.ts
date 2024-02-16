import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'

interface CancelDeliverymanUseCaseRequest {
  deliverymanId: string
}

type CancelDeliverymanUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class CancelDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    deliverymanId,
  }: CancelDeliverymanUseCaseRequest): Promise<CancelDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    deliveryman.changeStatus(false)

    await this.deliverymanRepository.save(deliveryman)

    return right(null)
  }
}
