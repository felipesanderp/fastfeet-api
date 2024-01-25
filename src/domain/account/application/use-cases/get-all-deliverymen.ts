import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Deliveryman } from '../../enterprise/entities/deliveryman'

type GetAllDeliverymenUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliverymen: Deliveryman[]
  }
>

export class GetAllDeliverymenUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute(): Promise<GetAllDeliverymenUseCaseResponse> {
    const deliverymen = await this.deliverymanRepository.findAll()

    if (!deliverymen) {
      return left(new ResourceNotFoundError())
    }

    return right({
      deliverymen,
    })
  }
}
