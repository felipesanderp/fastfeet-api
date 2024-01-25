import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface DeleteDeliverymanUseCaseRequest {
  deliverymanId: string
}

type DeleteDeliverymanUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    deliverymanId,
  }: DeleteDeliverymanUseCaseRequest): Promise<DeleteDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    await this.deliverymanRepository.delete(deliveryman)

    return right(null)
  }
}
