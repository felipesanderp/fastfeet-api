import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { Injectable } from '@nestjs/common'

interface UpdateDeliverymanProfileUseCaseRequest {
  deliverymanId: string
  name: string
  cpf: string
}

type UpdateDeliverymanProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class UpdateDeliverymanProfileUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    deliverymanId,
    name,
    cpf,
  }: UpdateDeliverymanProfileUseCaseRequest): Promise<UpdateDeliverymanProfileUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    deliveryman.name = name
    deliveryman.cpf = CPF.create(cpf)

    await this.deliverymanRepository.save(deliveryman)

    return right({
      deliveryman,
    })
  }
}
