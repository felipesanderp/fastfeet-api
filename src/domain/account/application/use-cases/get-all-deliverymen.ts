import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface GetAllDeliverymenUseCaseRequest {
  page: number
  perPage: number
}

type GetAllDeliverymenUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliverymen: Deliveryman[]
  }
>

@Injectable()
export class GetAllDeliverymenUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    page,
    perPage,
  }: GetAllDeliverymenUseCaseRequest): Promise<GetAllDeliverymenUseCaseResponse> {
    const deliverymen = await this.deliverymanRepository.findAll({
      page,
      perPage,
    })

    if (!deliverymen) {
      return left(new ResourceNotFoundError())
    }

    return right({
      deliverymen,
    })
  }
}
