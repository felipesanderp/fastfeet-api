import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { Injectable } from '@nestjs/common'

interface GetDeliverymanByIdUseCaseRequest {
  deliverymanId: string
}

type GetDeliverymanByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class GetDeliverymanByIdUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    deliverymanId,
  }: GetDeliverymanByIdUseCaseRequest): Promise<GetDeliverymanByIdUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    return right({
      deliveryman,
    })
  }
}
